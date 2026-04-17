const Auth = {
  currentUser: null,

  init() {
    const session = Store.getSession();
    if (session) {
      const users = Store.getUsers();
      const user = users.find(u => u.id === session.userId);
      if (user) {
        this.currentUser = user;
        return true;
      }
    }
    return false;
  },

  isLoggedIn() {
    return this.currentUser !== null;
  },

  getUserId() {
    return this.currentUser ? this.currentUser.id : null;
  },

  getUser() {
    return this.currentUser;
  },

  signup(name, email, password) {
    if (Store.getUserByEmail(email)) {
      return { success: false, error: 'Email already registered' };
    }

    const hashedPassword = Utils.hashPassword(password);
    const user = Store.createUser({
      name,
      email,
      password: hashedPassword
    });

    if (user) {
      Store.setSession(user);
      this.currentUser = user;
      return { success: true, user };
    }

    return { success: false, error: 'Failed to create account' };
  },

  login(email, password) {
    const user = Store.getUserByEmail(email);

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (!Utils.comparePassword(password, user.password)) {
      return { success: false, error: 'Invalid email or password' };
    }

    Store.setSession(user);
    this.currentUser = user;
    return { success: true, user };
  },

  logout() {
    Store.clearSession();
    this.currentUser = null;
    App.navigate('login');
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      this.logout();
      return false;
    }
    return true;
  }
};
