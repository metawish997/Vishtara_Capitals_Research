const Permission = require('../models/Permission');

/**
 * Automatically generates permissions based on registered Express routes.
 * @param {import('express').Application} app The Express application instance
 */
const generatePermissions = async (app) => {
  try {
    const routes = [];

    /**
     * Helper to extract path from middleware regex
     */
    function split(thing) {
      if (typeof thing === 'string') {
        return thing;
      } else if (thing.fast_slash) {
        return '';
      } else {
        const match = thing.toString()
          .replace('\\/?', '')
          .replace('(?=\\/|$)', '$')
          .match(/^\/\^\\\/([^\$]*)\\\/\?\$\//);
        return match ? match[1].replace(/\\/g, '') : '';
      }
    }

    /**
     * Recursively find all routes in the app's router stack
     */
    function getRoutes(stack, prefix = '') {
      stack.forEach((middleware) => {
        if (middleware.route) {
          // Route registered directly on the router
          const path = prefix + middleware.route.path;
          routes.push(path);
        } else if (middleware.name === 'router') {
          // Router middleware
          const routerPrefix = split(middleware.regexp);
          getRoutes(middleware.handle.stack, prefix + routerPrefix);
        }
      });
    }

    if (app._router && app._router.stack) {
      getRoutes(app._router.stack);
    }

    // Extract unique resources from routes
    const allResources = new Set();
    routes.forEach(route => {
      const parts = route.split('/').filter(p =>
        p && p !== 'api' && p !== 'v1' && p !== 'angel' && !p.startsWith(':')
      );
      if (parts.length > 0) allResources.add(parts[0]);
    });

    // We generate permissions for all admin modules to enforce granular RBAC
    const coreResources = [
      'users', 'roles', 'blogs', 'customers', 'news', 'notifications',
      'media', 'kyc', 'banks', 'faqs', 'services', 'tips', 'leads', 'lead-imports',
      'popups', 'marquees', 'coupons', 'complaints', 'inquiries', 'reviews',
      'certificates', 'refunds', 'tickets', 'designations', 'policies', 'agreements'
    ];

    const actions = ['View', 'Create', 'Update', 'Delete', 'Manage'];
    const permissions = [];

    coreResources.forEach(resource => {
      const displayName = resource.charAt(0).toUpperCase() + resource.slice(1);
      actions.forEach(action => {
        permissions.push({
          name: `${displayName} ${action}`,
          slug: `${action.toLowerCase()}_${resource}`,
          description: `Can ${action.toLowerCase()} ${resource}`
        });
      });
    });

    // Special "All Access" permission
    permissions.push({
      name: 'All Access',
      slug: 'all_access',
      description: 'Full system access'
    });

    // Special Settings permissions
    permissions.push({
      name: 'View Settings',
      slug: 'view_settings',
      description: 'Can view administrative settings'
    });
    permissions.push({
      name: 'Manage Settings',
      slug: 'manage_settings',
      description: 'Can modify administrative settings'
    });

    // Special Dashboard permission
    permissions.push({
      name: 'Admin Dashboard View',
      slug: 'view_admin_dashboard',
      description: 'Can view the main administrative dashboard'
    });

    // Bulk upsert
    let createdCount = 0;
    for (const perm of permissions) {
      await Permission.findOneAndUpdate(
        { slug: perm.slug },
        perm,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      createdCount++;
    }

    // CLEANUP: Ensure Super Admin role has NO permissions in DB (it bypasses in code)
    // This fixes the UI clutter for the Super Admin role specifically
    const Role = require('../models/Role');
    await Role.findOneAndUpdate(
      { slug: 'super_admin' },
      { permissions: [] } // Clear permissions to keep UI clean
    );

    console.log(`[PermissionGenerator] Synchronized ${createdCount} core permissions. Super Admin role cleaned for UI.`.cyan.bold);
  } catch (error) {
    console.error(`[PermissionGenerator] Error generating permissions: ${error.message}`.red);
  }
};

module.exports = generatePermissions;
