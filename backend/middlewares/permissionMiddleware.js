/**
 * Middleware to check if the user has a specific permission.
 * Super Admins bypass all permission checks.
 * @param {string} permissionSlug The slug of the permission to check
 */
exports.checkPermission = (permissionSlug) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. No role assigned.'
      });
    }

    // Bypass check if user is a super_admin
    if (req.user.role.slug === 'super_admin') {
      return next();
    }

    // Check if user has the specific permission or 'all_access'
    const permissions = req.user.role.permissions || [];
    const hasPermission = permissions.some(
      (p) => p.slug === permissionSlug || p.slug === 'all_access'
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Permission denied: You do not have the '${permissionSlug}' permission.`
      });
    }

    next();
  };
};
