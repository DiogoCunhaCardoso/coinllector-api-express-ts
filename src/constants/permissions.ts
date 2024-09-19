// NOTE: Permissions that are for all *logged Users* use requireUser middleware instead of requirePermission

export const ALL_PERMISSIONS = [
  //Users
  //TODO create route to delete users being an admin.

  // Coins
  "coins:write",
  "coins:read",
  "coins:update",
  "coins:delete",
  "coins:rate-quality",

  // Countries
  "countries:write",
  "countries:read",
  "countries:update",
  "countries:delete",
] as const;

// P E R M I S S I O N _ M A P P I N G
export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, permission) => {
  acc[permission] = permission;
  return acc;
}, {} as Record<(typeof ALL_PERMISSIONS)[number], (typeof ALL_PERMISSIONS)[number]>);

const APPLICATION_USER_PERMISSIONS = [PERMISSIONS["coins:read"]];

// R O L E _ P E R M I S S I O N S

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  APPLICATION_USER: APPLICATION_USER_PERMISSIONS,
  PAID_USER: [
    ...APPLICATION_USER_PERMISSIONS,
    PERMISSIONS["coins:rate-quality"],
  ],
};

export type RoleType = keyof typeof ROLE_PERMISSIONS;
export type PermissionType = (typeof ALL_PERMISSIONS)[number];
//TODO Compare to other types I made
