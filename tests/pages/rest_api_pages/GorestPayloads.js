class UserPayloads {
   
    static createUser(userData) {
      return {
        name: userData.name || `Test User_${Date.now()}`,
        gender: userData.gender || 'male',
        email: userData.email || `user_${Date.now()}@example.com`,
        status: userData.status || 'active',
      };
    }
  
    static updateUser(updatedData) {
      return {
        name: updatedData.name || `Updated User_${Date.now()}`,
        email: updatedData.email || `updated_user_${Date.now()}@example.com`,
        status: updatedData.status || 'active',
      };
    }
  
    static deleteUser(userId) {
      return {
        id: userId,
      };
    }
  }
  
  module.exports = { UserPayloads };
  