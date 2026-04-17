const API_BASE = '/api';

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

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
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

  normalizeInquiry(inquiry) {
    if (!inquiry) return inquiry;
    if (typeof inquiry.location_ids === 'string') {
      try {
        inquiry.location_ids = JSON.parse(inquiry.location_ids);
      } catch (e) {
        inquiry.location_ids = null;
      }
    }
    if (!Array.isArray(inquiry.location_ids)) {
      inquiry.location_ids = null;
    }
    return inquiry;
  },

  async getInquiries() {
    const result = await this.request('/inquiries');
    return result?.map ? result.map(i => this.normalizeInquiry(i)) : result;
  },

  async addInquiry(inquiry) {
    return await this.request('/inquiries', {
      method: 'POST',
      body: inquiry
    });
  },

  async updateInquiry(id, updates) {
    return await this.request(`/inquiries/${id}`, {
      method: 'PUT',
      body: updates
    });
  },

  async deleteInquiry(id) {
    await this.request(`/inquiries/${id}`, { method: 'DELETE' });
  },

  async getInquiryById(id) {
    const result = await this.request(`/inquiries/${id}`);
    return this.normalizeInquiry(result);
  },

  async getProperties() {
    return await this.request('/properties');
  },

  async addProperty(property) {
    return await this.request('/properties', {
      method: 'POST',
      body: property
    });
  },

  async updateProperty(id, updates) {
    return await this.request(`/properties/${id}`, {
      method: 'PUT',
      body: updates
    });
  },

  async deleteProperty(id) {
    await this.request(`/properties/${id}`, { method: 'DELETE' });
  },

  async getPropertyById(id) {
    return await this.request(`/properties/${id}`);
  },

  async getLandlords() {
    return await this.request('/landlords');
  },

  async addLandlord(landlord) {
    return await this.request('/landlords', {
      method: 'POST',
      body: landlord
    });
  },

  async updateLandlord(id, updates) {
    return await this.request(`/landlords/${id}`, {
      method: 'PUT',
      body: updates
    });
  },

  async deleteLandlord(id) {
    await this.request(`/landlords/${id}`, { method: 'DELETE' });
  },

  async getLandlordById(id) {
    return await this.request(`/landlords/${id}`);
  },

  async getLocations() {
    return await this.request('/locations');
  },

  async addLocation(location) {
    return await this.request('/locations', {
      method: 'POST',
      body: location
    });
  },

  async updateLocation(id, updates) {
    return await this.request(`/locations/${id}`, {
      method: 'PUT',
      body: updates
    });
  },

  async deleteLocation(id) {
    await this.request(`/locations/${id}`, { method: 'DELETE' });
  },

  async getLocationById(id) {
    return await this.request(`/locations/${id}`);
  },

  async getLocationsWithStats() {
    return await this.request('/locations/stats');
  },

  async getReminders() {
    return await this.request('/reminders');
  },

  async addReminder(reminder) {
    return await this.request('/reminders', {
      method: 'POST',
      body: reminder
    });
  },

  async updateReminder(id, updates) {
    return await this.request(`/reminders/${id}`, {
      method: 'PUT',
      body: updates
    });
  },

  async deleteReminder(id) {
    await this.request(`/reminders/${id}`, { method: 'DELETE' });
  },

  async getComments(inquiryId = null) {
    const endpoint = inquiryId ? `/comments?inquiryId=${inquiryId}` : '/comments';
    return await this.request(endpoint);
  },

  async addComment(comment) {
    return await this.request('/comments', {
      method: 'POST',
      body: comment
    });
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
  },

  async login(email, password) {
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
