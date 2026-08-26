// Mock authentication service
class AuthService {
  constructor() {
    // Mock database - in real app, this would be an API
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    this.adminUsers = ['admin', 'root']; // Admin usernames
  }

  // Register new user
  register(username, password, email) {
    const existingUser = this.users.find(user => user.username === username);
    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }

    const newUser = {
      id: Date.now(),
      username,
      password, // In real app, this should be hashed
      email,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    return { success: true, message: 'Registration successful' };
  }

  // Login user
  login(username, password) {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  }

  // Logout user
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is admin
  isAdmin() {
    return this.currentUser && this.adminUsers.includes(this.currentUser.username);
  }

  // Check if user is logged in
  isAuthenticated() {
    return this.currentUser !== null;
  }
}

export default new AuthService();