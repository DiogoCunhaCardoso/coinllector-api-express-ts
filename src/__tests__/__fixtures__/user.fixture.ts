export const mockAdminUser = {
  _id: "66eb15553dfa03b2c5c8cfb3", // Use a realistic mock user ID
  email: "admin-test@test.com",
  role: "SUPER_ADMIN",
  emailVerified: true, // Ensure this matches the expected field value
  toJSON: () => ({
    _id: "66eb15553dfa03b2c5c8cfb3",
    email: "admin-test@test.com",
    role: "SUPER_ADMIN",
    emailVerified: true, // Ensure this is set correctly
  }),
};

export const adminCredsPayload = {
  email: "admin-test@test.com",
  password: "admin-test-password",
};
