const API_BASE = import.meta.env?.VITE_API_URL || '/api';

const Store = {
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
      console.error('API Error:', error);
      throw error;
    }
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

  async getInquiries() {
    const data = await this.request('/inquiries');
    return data;
  },

  async addInquiry(inquiry) {
    const data = await this.request('/inquiries', {
      method: 'POST',
      body: inquiry
    });
    return data;
  },

  async updateInquiry(id, updates) {
    const data = await this.request(`/inquiries/${id}`, {
      method: 'PUT',
      body: updates
    });
    return data;
  },

  async deleteInquiry(id) {
    await this.request(`/inquiries/${id}`, { method: 'DELETE' });
  },

  async getInquiryById(id) {
    const data = await this.request(`/inquiries/${id}`);
    return data;
  },

  async getProperties() {
    const data = await this.request('/properties');
    return data;
  },

  async addProperty(property) {
    const data = await this.request('/properties', {
      method: 'POST',
      body: property
    });
    return data;
  },

  async updateProperty(id, updates) {
    const data = await this.request(`/properties/${id}`, {
      method: 'PUT',
      body: updates
    });
    return data;
  },

  async deleteProperty(id) {
    await this.request(`/properties/${id}`, { method: 'DELETE' });
  },

  async getPropertyById(id) {
    const data = await this.request(`/properties/${id}`);
    return data;
  },

  async getLandlords() {
    const data = await this.request('/landlords');
    return data;
  },

  async addLandlord(landlord) {
    const data = await this.request('/landlords', {
      method: 'POST',
      body: landlord
    });
    return data;
  },

  async updateLandlord(id, updates) {
    const data = await this.request(`/landlords/${id}`, {
      method: 'PUT',
      body: updates
    });
    return data;
  },

  async deleteLandlord(id) {
    await this.request(`/landlords/${id}`, { method: 'DELETE' });
  },

  async getLandlordById(id) {
    const data = await this.request(`/landlords/${id}`);
    return data;
  },

  async getReminders() {
    const data = await this.request('/reminders');
    return data;
  },

  async addReminder(reminder) {
    const data = await this.request('/reminders', {
      method: 'POST',
      body: reminder
    });
    return data;
  },

  async updateReminder(id, updates) {
    const data = await this.request(`/reminders/${id}`, {
      method: 'PUT',
      body: updates
    });
    return data;
  },

  async deleteReminder(id) {
    await this.request(`/reminders/${id}`, { method: 'DELETE' });
  },

  async getComments(inquiryId = null) {
    const endpoint = inquiryId ? `/comments?inquiryId=${inquiryId}` : '/comments';
    const data = await this.request(endpoint);
    return data;
  },

  async addComment(comment) {
    const data = await this.request('/comments', {
      method: 'POST',
      body: comment
    });
    return data;
  },

  async deleteComment(id) {
    await this.request(`/comments/${id}`, { method: 'DELETE' });
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
      return { success: false, error: error.message };
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
      return { success: false, error: error.message };
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
