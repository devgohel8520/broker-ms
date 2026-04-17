const Utils = {
  formatCurrency(amount) {
    if (!amount) return '₹0';
    return '₹' + Number(amount).toLocaleString('en-IN');
  },

  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  },

  formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatRelativeTime(date) {
    if (!date) return '';
    const now = new Date();
    const d = new Date(date);
    const diff = now - d;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return this.formatDate(date);
  },

  formatPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12) {
      return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  },

  isToday(date) {
    if (!date) return false;
    const today = new Date();
    const d = new Date(date);
    return d.toDateString() === today.toDateString();
  },

  isPast(date) {
    if (!date) return false;
    const now = new Date();
    const d = new Date(date);
    return d < now;
  },

  isFuture(date) {
    if (!date) return false;
    const now = new Date();
    const d = new Date(date);
    return d > now;
  },

  getToday() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  },

  getInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  getStatusLabel(status) {
    const labels = {
      'new': 'New',
      'follow-up': 'Follow-up',
      'hot-lead': 'Hot Lead',
      'deal-closed': 'Deal Closed',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return labels[status] || status;
  },

  getPropertyTypeLabel(type) {
    const labels = {
      'flat': 'Flat',
      'land': 'Land',
      'office': 'Office',
      'shop': 'Shop',
      'warehouse': 'Warehouse',
      'villa': 'Villa',
      'residential': 'Residential',
      'commercial': 'Commercial'
    };
    return labels[type] || type;
  },

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  truncate(text, length = 50) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  },

  getPropertyTypeOptions() {
    return [
      { value: 'flat', label: 'Flat' },
      { value: 'land', label: 'Land' },
      { value: 'office', label: 'Office' },
      { value: 'shop', label: 'Shop' },
      { value: 'warehouse', label: 'Warehouse' },
      { value: 'villa', label: 'Villa' }
    ];
  },

  getPropertyCategoryOptions() {
    return [
      { value: 'residential', label: 'Residential' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'land', label: 'Land' }
    ];
  },

  getInquiryTypeOptions() {
    return [
      { value: 'buy', label: 'Buy' },
      { value: 'sell', label: 'Sell' },
      { value: 'rent', label: 'Rent' }
    ];
  },

  getStatusOptions() {
    return [
      { value: 'new', label: 'New' },
      { value: 'follow-up', label: 'Follow-up' },
      { value: 'hot-lead', label: 'Hot Lead' },
      { value: 'deal-closed', label: 'Deal Closed' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ];
  },

  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'hashed_' + Math.abs(hash).toString(16);
  },

  comparePassword(password, hash) {
    return this.hashPassword(password) === hash;
  }
};
