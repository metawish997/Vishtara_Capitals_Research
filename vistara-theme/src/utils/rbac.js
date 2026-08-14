// ==========================================
// ACCESS CONTROL LOGIC (Kaun kya access kar sakta hai)
// ==========================================
// 1. Roles: 'super admin' aur 'admin' ko by default sab kuch access hai (e.g. Master settings, Designations, all leads).
// 2. Roles: 'employee' ko by default sirf apna basic access (like unke khud ke leads) milta hai.
// 3. Designation Override: Agar user ka role 'employee' hai, lekin unki designation 'Admin' ya 'Super Admin' hai, 
//    toh unhe bhi system 'admin' manta hai aur sab kuch show karta hai (including Master settings and other employees' leads).
// 4. requiredLevel = 'all': Ye sirf un routes/menus ke liye hai jo har koi dekh sakta hai (e.g. CRM Dashboard, Profile).
// ==========================================

export const ROLES = {
    SUPER_ADMIN: 'super admin',
    ADMIN: 'admin',
    EMPLOYEE: 'employee'
};

/**
 * Normalizes a role string for consistent comparison
 * @param {string} role - The role string from the backend
 * @returns {string} - Normalized role string
 */
export const normalizeRole = (role) => {
    if (!role) return '';
    return role.toLowerCase().replace(/[-_]/g, ' ').trim();
};

/**
 * Checks if a user has admin level access
 * Yahan check hota hai ki user admin hai ya nahi (role ya designation ke hisaab se)
 * @param {object} user - The user object from AuthContext
 * @returns {boolean}
 */
export const isAdminUser = (user) => {
    if (!user) return false;
    const role = normalizeRole(user.role);
    const designation = normalizeRole(user.designation?.name || user.designationId?.name);
    
    // Agar role admin/super admin hai YA designation admin/super admin hai, toh true (sab access milega)
    return role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN || designation === ROLES.SUPER_ADMIN || designation === ROLES.ADMIN;
};

/**
 * Checks if a menu or route should be accessible based on the user's role
 * @param {object} user - The user object
 * @param {string} requiredLevel - 'admin' or 'all'
 * @returns {boolean}
 */
export const canAccess = (user, requiredLevel = 'admin') => {
    if (!user) return false;

    // Super Admins and Admins have access to everything (pura dashboard show hoga)
    if (isAdminUser(user)) {
        return true;
    }

    // If the route only requires 'all' access, let the employee through (sirf basic menu dikhega)
    if (requiredLevel === 'all') {
        const role = normalizeRole(user.role);
        // Only return true if the user is an employee. Normal users will be blocked.
        return role === ROLES.EMPLOYEE;
    }

    // Default deny (agar koi aur koshish kare admin page dekhne ki, toh rok dega)
    return false;
};

/**
 * Checks if a user has a specific permission by slug
 * @param {object} user - The user object
 * @param {string} permissionSlug - The permission slug to check
 * @returns {boolean}
 */
export const hasPermission = (user, permissionSlug) => {
    if (!user) return false;
    
    // Admins and Super Admins bypass permission checks
    if (isAdminUser(user)) {
        return true;
    }

    // Check if user has populated permissions array in roleData
    const permissions = user.roleData?.permissions || (typeof user.role === 'object' ? user.role?.permissions : null);
    if (permissions && Array.isArray(permissions)) {
        return permissions.some(p => p.slug === permissionSlug);
    }
    
    return false;
};
