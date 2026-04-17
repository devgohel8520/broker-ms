const API_BASE = '';

const Store = {
  useLocal: false,
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  async request(endpoint, options = {}) {
    const userId = localStorage.getItem('borker_user_id');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(userId && { 'X-User-Id': userId }),
        ...options.headers
      },
      ...options
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.warn('API unavailable, using localStorage:', error.message);
      this.useLocal = true;
      return { local: true };
    }
  },

  localRequest(endpoint, options = {}) {
    this.useLocal = true;
    return { local: true };
  },

  getSession() {
    const userId = localStorage.getItem('borker_user_id');
    const userName = localStorage.getItem('borker_user_name');
    const userEmail = localStorage.getItem('borker_user_email');
    
    if (userId) {
      return { userId, name: userName, email: userEmail };
    }
    return null;
  },

  setSession(user) {
    localStorage.setItem('borker_user_id', user.id);
    localStorage.setItem('borker_user_name', user.name);
    localStorage.setItem('borker_user_email', user.email);
  },

  clearSession() {
    localStorage.removeItem('borker_user_id');
    localStorage.removeItem('borker_user_name');
    localStorage.removeItem('borker_user_email');
  },

  getUserId() {
    return localStorage.getItem('borker_user_id');
  },

  lsGet(key) {
    const data = localStorage.getItem(`borker_${key}`);
    return data ? JSON.parse(data) : [];
  },

  lsSet(key, data) {
    localStorage.setItem(`borker_${key}`, JSON.stringify(data));
  },

  async getInquiries() {
    const result = await this.request('/inquiries');
    if (result?.local) return this.lsGet('inquiries');
    return result;
  },

  async addInquiry(inquiry) {
    const result = await this.request('/inquiries', {
      method: 'POST',
      body: inquiry
    });
    if (result?.local) {
      const inquiries = this.lsGet('inquiries');
      const newItem = { ...inquiry, id: this.generateId(), created_at: new Date().toISOString() };
      inquiries.unshift(newItem);
      this.lsSet('inquiries', inquiries);
      return newItem;
    }
    return result;
  },

  async updateInquiry(id, updates) {
    const result = await this.request(`/inquiries/${id}`, {
      method: 'PUT',
      body: updates
    });
    if (result?.local) {
      const inquiries = this.lsGet('inquiries');
      const index = inquiries.findIndex(i => i.id == id);
      if (index !== -1) {
        inquiries[index] = { ...inquiries[index], ...updates, updated_at: new Date().toISOString() };
        this.lsSet('inquiries', inquiries);
        return inquiries[index];
      }
    }
    return result;
  },

  async deleteInquiry(id) {
    await this.request(`/inquiries/${id}`, { method: 'DELETE' });
    if (this.useLocal) {
      const inquiries = this.lsGet('inquiries').filter(i => i.id != id);
      this.lsSet('inquiries', inquiries);
    }
  },

  async getInquiryById(id) {
    const result = await this.request(`/inquiries/${id}`);
    if (result?.local) {
      const inquiries = this.lsGet('inquiries');
      return inquiries.find(i => i.id == id) || null;
    }
    return result;
  },

  async getProperties() {
    const result = await this.request('/properties');
    if (result?.local) return this.lsGet('properties');
    return result;
  },

  async addProperty(property) {
    const result = await this.request('/properties', {
      method: 'POST',
      body: property
    });
    if (result?.local) {
      const properties = this.lsGet('properties');
      const newItem = { ...property, id: this.generateId(), created_at: new Date().toISOString() };
      properties.unshift(newItem);
      this.lsSet('properties', properties);
      return newItem;
    }
    return result;
  },

  async updateProperty(id, updates) {
    const result = await this.request(`/properties/${id}`, {
      method: 'PUT',
      body: updates
    });
    if (result?.local) {
      const properties = this.lsGet('properties');
      const index = properties.findIndex(p => p.id == id);
      if (index !== -1) {
        properties[index] = { ...properties[index], ...updates, updated_at: new Date().toISOString() };
        this.lsSet('properties', properties);
        return properties[index];
      }
    }
    return result;
  },

  async deleteProperty(id) {
    await this.request(`/properties/${id}`, { method: 'DELETE' });
    if (this.useLocal) {
      const properties = this.lsGet('properties').filter(p => p.id != id);
      this.lsSet('properties', properties);
    }
  },

  async getPropertyById(id) {
    const result = await this.request(`/properties/${id}`);
    if (result?.local) {
      const properties = this.lsGet('properties');
      return properties.find(p => p.id == id) || null;
    }
    return result;
  },

  async getLandlords() {
    const result = await this.request('/landlords');
    if (result?.local) return this.lsGet('landlords');
    return result;
  },

  async addLandlord(landlord) {
    const result = await this.request('/landlords', {
      method: 'POST',
      body: landlord
    });
    if (result?.local) {
      const landlords = this.lsGet('landlords');
      const newItem = { ...landlord, id: this.generateId(), created_at: new Date().toISOString() };
      landlords.unshift(newItem);
      this.lsSet('landlords', landlords);
      return newItem;
    }
    return result;
  },

  async updateLandlord(id, updates) {
    const result = await this.request(`/landlords/${id}`, {
      method: 'PUT',
      body: updates
    });
    if (result?.local) {
      const landlords = this.lsGet('landlords');
      const index = landlords.findIndex(l => l.id == id);
      if (index !== -1) {
        landlords[index] = { ...landlords[index], ...updates };
        this.lsSet('landlords', landlords);
        return landlords[index];
      }
    }
    return result;
  },

  async deleteLandlord(id) {
    await this.request(`/landlords/${id}`, { method: 'DELETE' });
    if (this.useLocal) {
      const landlords = this.lsGet('landlords').filter(l => l.id != id);
      this.lsSet('landlords', landlords);
    }
  },

  async getLandlordById(id) {
    const result = await this.request(`/landlords/${id}`);
    if (result?.local) {
      const landlords = this.lsGet('landlords');
      return landlords.find(l => l.id == id) || null;
    }
    return result;
  },

  async getReminders() {
    const result = await this.request('/reminders');
    if (result?.local) return this.lsGet('reminders');
    return result;
  },

  async addReminder(reminder) {
    const result = await this.request('/reminders', {
      method: 'POST',
      body: reminder
    });
    if (result?.local) {
      const reminders = this.lsGet('reminders');
      const newItem = { ...reminder, id: this.generateId(), completed: false, created_at: new Date().toISOString() };
      reminders.push(newItem);
      this.lsSet('reminders', reminders);
      return newItem;
    }
    return result;
  },

  async updateReminder(id, updates) {
    const result = await this.request(`/reminders/${id}`, {
      method: 'PUT',
      body: updates
    });
    if (result?.local) {
      const reminders = this.lsGet('reminders');
      const index = reminders.findIndex(r => r.id == id);
      if (index !== -1) {
        reminders[index] = { ...reminders[index], ...updates };
        this.lsSet('reminders', reminders);
        return reminders[index];
      }
    }
    return result;
  },

  async deleteReminder(id) {
    await this.request(`/reminders/${id}`, { method: 'DELETE' });
    if (this.useLocal) {
      const reminders = this.lsGet('reminders').filter(r => r.id != id);
      this.lsSet('reminders', reminders);
    }
  },

  async getComments(inquiryId = null) {
    const endpoint = inquiryId ? `/comments?inquiryId=${inquiryId}` : '/comments';
    const result = await this.request(endpoint);
    if (result?.local) {
      let comments = this.lsGet('comments');
      if (inquiryId) {
        comments = comments.filter(c => c.inquiry_id == inquiryId);
      }
      return comments;
    }
    return result;
  },

  async addComment(comment) {
    const result = await this.request('/comments', {
      method: 'POST',
      body: comment
    });
    if (result?.local) {
      const comments = this.lsGet('comments');
      const newItem = { ...comment, id: this.generateId(), created_at: new Date().toISOString() };
      comments.unshift(newItem);
      this.lsSet('comments', comments);
      return newItem;
    }
    return result;
  },

  async deleteComment(id) {
    await this.request(`/comments/${id}`, { method: 'DELETE' });
    if (this.useLocal) {
      const comments = this.lsGet('comments').filter(c => c.id != id);
      this.lsSet('comments', comments);
    }
  }
};

const Auth = {
  currentUser: null,

  init() {
    const session = Store.getSession();
    if (session) {
      this.currentUser = session;
      return true;
    }
    return false;
  },

  isLoggedIn() {
    return this.currentUser !== null;
  },

  getUserId() {
    return this.currentUser ? this.currentUser.userId : null;
  },

  getUser() {
    return this.currentUser;
  },

  async signup(name, email, password) {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error };
      }

      Store.setSession(data.user);
      this.currentUser = data.user;
      return { success: true, user: data.user };
    } catch (error) {
      const users = JSON.parse(localStorage.getItem('borker_local_users') || '[]');
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return { success: false, error: 'Email already registered' };
      }
      const hashedPassword = btoa(password);
      const newUser = { id: Store.generateId(), name, email, password: hashedPassword };
      users.push(newUser);
      localStorage.setItem('borker_local_users', JSON.stringify(users));
      Store.setSession(newUser);
      this.currentUser = newUser;
      return { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } };
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error };
      }

      Store.setSession(data.user);
      this.currentUser = data.user;
      return { success: true, user: data.user };
    } catch (error) {
      const users = JSON.parse(localStorage.getItem('borker_local_users') || '[]');
      const user = users.find(u => u.email === email);
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }
      if (atob(user.password) !== password) {
        return { success: false, error: 'Invalid email or password' };
      }
      Store.setSession(user);
      this.currentUser = user;
      return { success: true, user: { id: user.id, name: user.name, email: user.email } };
    }
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

window.Store = Store;
window.Auth = Auth;
