const App = {
  currentRoute: '',

  init() {
    Auth.init();
    this.setupRouting();
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());
  },

  setupRouting() {
    this.routes = {
      '': () => this.redirectToDashboard(),
      'login': () => this.renderLogin(),
      'signup': () => this.renderSignup(),
      'dashboard': () => {
        if (!Auth.requireAuth()) return;
        Dashboard.render();
      },
      'inquiries': () => {
        if (!Auth.requireAuth()) return;
        Inquiries.render();
      },
      'inquiries/:id': (id) => {
        if (!Auth.requireAuth()) return;
        Inquiries.renderDetail(id);
      },
      'properties': () => {
        if (!Auth.requireAuth()) return;
        Properties.render();
      },
      'properties/:id': (id) => {
        if (!Auth.requireAuth()) return;
        Properties.renderDetail(id);
      },
      'landlords': () => {
        if (!Auth.requireAuth()) return;
        Landlords.render();
      },
      'landlords/:id': (id) => {
        if (!Auth.requireAuth()) return;
        Landlords.renderDetail(id);
      }
    };
  },

  handleRoute() {
    const hash = window.location.hash.slice(1) || '';
    const [path, ...params] = hash.split('/');
    const routeKey = params.length > 0 ? `${path}/:id` : path;

    if (this.routes[routeKey]) {
      this.currentRoute = routeKey;
      this.routes[routeKey](params[0]);
      this.updateActiveNav();
    } else if (this.routes[path]) {
      this.currentRoute = path;
      this.routes[path]();
      this.updateActiveNav();
    } else {
      this.navigate('dashboard');
    }
  },

  navigate(route) {
    window.location.hash = route;
  },

  redirectToDashboard() {
    if (Auth.isLoggedIn()) {
      this.navigate('dashboard');
    } else {
      this.navigate('login');
    }
  },

  renderLogin() {
    if (Auth.isLoggedIn()) {
      this.navigate('dashboard');
      return;
    }

    const content = `
      <div class="auth-logo">
        <div class="auth-logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
        </div>
        <span class="auth-logo-text">Borker</span>
      </div>
      <h2 class="auth-title">Welcome back</h2>
      <p class="auth-subtitle">Sign in to manage your properties</p>
      <form class="auth-form" id="login-form">
        <div id="login-error" style="display: none;" class="auth-error"></div>
        <div class="input-group">
          <label class="required">Email</label>
          <input type="email" class="input" name="email" placeholder="you@example.com" required>
        </div>
        <div class="input-group">
          <label class="required">Password</label>
          <input type="password" class="input" name="password" placeholder="Enter your password" required>
        </div>
        <button type="submit" class="btn btn-primary btn-lg">Sign In</button>
      </form>
      <div class="auth-footer">
        Don't have an account? <a href="#signup">Sign up</a>
      </div>
    `;

    document.getElementById('app').innerHTML = this.renderAuthLayout(content);

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const password = formData.get('password');

      const result = await Auth.login(email, password);

      if (result.success) {
        UI.showToast(`Welcome back, ${result.user.name}!`, 'success');
        this.navigate('dashboard');
      } else {
        const errorEl = document.getElementById('login-error');
        errorEl.textContent = result.error;
        errorEl.style.display = 'block';
        document.querySelector('.auth-form').classList.add('shake');
        setTimeout(() => {
          document.querySelector('.auth-form').classList.remove('shake');
        }, 400);
      }
    });
  },

  renderSignup() {
    if (Auth.isLoggedIn()) {
      this.navigate('dashboard');
      return;
    }

    const content = `
      <div class="auth-logo">
        <div class="auth-logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
        </div>
        <span class="auth-logo-text">Borker</span>
      </div>
      <h2 class="auth-title">Create account</h2>
      <p class="auth-subtitle">Start managing your properties today</p>
      <form class="auth-form" id="signup-form">
        <div id="signup-error" style="display: none;" class="auth-error"></div>
        <div class="input-group">
          <label class="required">Full Name</label>
          <input type="text" class="input" name="name" placeholder="John Doe" required>
        </div>
        <div class="input-group">
          <label class="required">Email</label>
          <input type="email" class="input" name="email" placeholder="you@example.com" required>
        </div>
        <div class="input-group">
          <label class="required">Password</label>
          <input type="password" class="input" name="password" placeholder="Min 8 characters" minlength="8" required>
        </div>
        <div class="input-group">
          <label class="required">Confirm Password</label>
          <input type="password" class="input" name="confirmPassword" placeholder="Re-enter your password" required>
        </div>
        <button type="submit" class="btn btn-primary btn-lg">Create Account</button>
      </form>
      <div class="auth-footer">
        Already have an account? <a href="#login">Sign in</a>
      </div>
    `;

    document.getElementById('app').innerHTML = this.renderAuthLayout(content);

    document.getElementById('signup-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const name = formData.get('name');
      const email = formData.get('email');
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');

      const errorEl = document.getElementById('signup-error');

      if (password !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match';
        errorEl.style.display = 'block';
        return;
      }

      if (password.length < 8) {
        errorEl.textContent = 'Password must be at least 8 characters';
        errorEl.style.display = 'block';
        return;
      }

      const result = await Auth.signup(name, email, password);

      if (result.success) {
        UI.showToast('Account created successfully!', 'success');
        this.navigate('dashboard');
      } else {
        errorEl.textContent = result.error;
        errorEl.style.display = 'block';
      }
    });
  },

  updateActiveNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href').slice(1);
      if (href === this.currentRoute || (this.currentRoute.includes('/') && href + '/:id' === this.currentRoute)) {
        item.classList.add('active');
      }
    });
  },

  renderAuthLayout(content) {
    return `
      <div class="auth-container">
        <div class="auth-card">
          ${content}
        </div>
      </div>
    `;
  },

  renderMainLayout(content, title = '', subtitle = '') {
    const user = Auth.getUser();
    const reminderCount = this.getPendingReminderCount();

    return `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <div class="sidebar-logo-icon">${UI.icons.building}</div>
            <span class="sidebar-logo-text">Borker</span>
          </div>
        </div>
        <nav class="sidebar-nav">
          <a href="#dashboard" class="nav-item ${this.currentRoute === 'dashboard' ? 'active' : ''}">
            ${UI.icons.home}
            <span>Dashboard</span>
          </a>
          <a href="#inquiries" class="nav-item ${this.currentRoute.startsWith('inquiries') ? 'active' : ''}">
            ${UI.icons.users}
            <span>Inquiries</span>
          </a>
          <a href="#properties" class="nav-item ${this.currentRoute.startsWith('properties') ? 'active' : ''}">
            ${UI.icons.building}
            <span>Properties</span>
          </a>
          <a href="#landlords" class="nav-item ${this.currentRoute.startsWith('landlords') ? 'active' : ''}">
            ${UI.icons.user}
            <span>Landlords</span>
          </a>
          <div class="sidebar-nav-section">
            <div class="sidebar-nav-section-title">Quick Access</div>
            <a href="#dashboard" class="nav-item" onclick="Dashboard.scrollToReminders()">
              ${UI.icons.bell}
              <span>Reminders</span>
              ${reminderCount > 0 ? `<span class="nav-item-badge">${reminderCount}</span>` : ''}
            </a>
          </div>
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-user" onclick="Auth.logout()">
            ${UI.renderAvatar(user?.name)}
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${user?.name || 'User'}</div>
              <div class="sidebar-user-email">${user?.email || ''}</div>
            </div>
            ${UI.icons.logOut}
          </div>
        </div>
      </aside>
      <div class="main-content">
        <div class="mobile-nav">
          <div class="mobile-nav-items">
            <a href="#dashboard" class="mobile-nav-item ${this.currentRoute === 'dashboard' ? 'active' : ''}">
              ${UI.icons.home}
              <span class="mobile-nav-item-label">Home</span>
            </a>
            <a href="#inquiries" class="mobile-nav-item ${this.currentRoute.startsWith('inquiries') ? 'active' : ''}">
              ${UI.icons.users}
              <span class="mobile-nav-item-label">Inquiries</span>
            </a>
            <a href="#properties" class="mobile-nav-item ${this.currentRoute.startsWith('properties') ? 'active' : ''}">
              ${UI.icons.building}
              <span class="mobile-nav-item-label">Properties</span>
            </a>
            <a href="#landlords" class="mobile-nav-item ${this.currentRoute.startsWith('landlords') ? 'active' : ''}">
              ${UI.icons.user}
              <span class="mobile-nav-item-label">Landlords</span>
            </a>
          </div>
        </div>
        <main class="page" id="page-content">
          ${content}
        </main>
      </div>
    `;
  },

  getPendingReminderCount() {
    return 0;
  }
};

const Dashboard = {
  scrollTarget: null,

  async render() {
    const loading = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Loading...</p>
        </div>
      </div>
      <div class="empty-state">
        <div class="empty-state-icon">${UI.icons.activity}</div>
        <div class="empty-state-title">Loading...</div>
      </div>
    `;
    document.getElementById('app').innerHTML = App.renderMainLayout(loading);

    try {
      const [inquiries, properties, reminders, comments] = await Promise.all([
        Store.getInquiries(),
        Store.getProperties(),
        Store.getReminders(),
        Store.getComments()
      ]);

      const stats = {
        totalInquiries: inquiries.length,
        hotLeads: inquiries.filter(i => i.status === 'hot-lead').length,
        totalProperties: properties.length,
        pendingReminders: reminders.filter(r => !r.completed).length
      };

      const today = Utils.getToday();
      const todayReminders = reminders.filter(r => !r.completed && r.date === today);
      const upcomingReminders = reminders.filter(r => !r.completed && r.date > today);
      const overdueReminders = reminders.filter(r => !r.completed && r.date < today);

      const statusBreakdown = [
        { status: 'new', count: inquiries.filter(i => i.status === 'new').length, color: 'var(--info)' },
        { status: 'follow-up', count: inquiries.filter(i => i.status === 'follow-up').length, color: 'var(--warning)' },
        { status: 'hot-lead', count: inquiries.filter(i => i.status === 'hot-lead').length, color: 'var(--hot-lead)' },
        { status: 'deal-closed', count: inquiries.filter(i => i.status === 'deal-closed').length, color: 'var(--success)' }
      ];

      const recentProperties = properties.slice(0, 4);
      const activityItems = Dashboard.buildActivityFeed(inquiries, comments, properties);

      const content = `
        <div class="page-header">
          <div>
            <h1 class="page-title">Dashboard</h1>
            <p class="page-subtitle">Welcome back! Here's your overview.</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" onclick="Inquiries.showAddModal()">
              ${UI.icons.plus}
              New Inquiry
            </button>
          </div>
        </div>

        <div class="dashboard-stats">
          <div class="card stat-card" onclick="App.navigate('inquiries')">
            <div class="stat-card-header">
              <div class="stat-card-icon" style="background: var(--info-bg); color: var(--info);">
                ${UI.icons.users}
              </div>
            </div>
            <div class="stat-card-value">${stats.totalInquiries}</div>
            <div class="stat-card-label">Total Inquiries</div>
          </div>
          <div class="card stat-card" onclick="App.navigate('inquiries')">
            <div class="stat-card-header">
              <div class="stat-card-icon" style="background: var(--hot-lead-bg); color: var(--hot-lead);">
                ${UI.icons.trendingUp}
              </div>
            </div>
            <div class="stat-card-value">${stats.hotLeads}</div>
            <div class="stat-card-label">Hot Leads</div>
          </div>
          <div class="card stat-card" onclick="App.navigate('properties')">
            <div class="stat-card-header">
              <div class="stat-card-icon" style="background: var(--success-bg); color: var(--success);">
                ${UI.icons.building}
              </div>
            </div>
            <div class="stat-card-value">${stats.totalProperties}</div>
            <div class="stat-card-label">Properties</div>
          </div>
          <div class="card stat-card" onclick="Dashboard.scrollToReminders()">
            <div class="stat-card-header">
              <div class="stat-card-icon" style="background: var(--warning-bg); color: var(--warning);">
                ${UI.icons.bell}
              </div>
            </div>
            <div class="stat-card-value">${stats.pendingReminders}</div>
            <div class="stat-card-label">Reminders</div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="dashboard-main">
            <div class="card" id="reminders-section">
              <div class="detail-section">
                <div class="detail-section-title" style="display: flex; align-items: center; justify-content: space-between;">
                  <span>Reminders</span>
                  <button class="btn btn-sm btn-secondary" onclick="Reminders.showAddModal()">
                    ${UI.icons.plus} Add
                  </button>
                </div>
                ${Dashboard.renderReminders(overdueReminders, todayReminders, upcomingReminders, inquiries)}
              </div>
            </div>

            <div class="card">
              <div class="detail-section">
                <div class="detail-section-title">Inquiry Status</div>
                <div class="status-breakdown">
                  ${statusBreakdown.map(item => `
                    <div class="status-breakdown-item" onclick="App.navigate('inquiries')">
                      <span class="status-breakdown-label">${Utils.getStatusLabel(item.status)}</span>
                      <span class="status-breakdown-count" style="color: ${item.color}">${item.count}</span>
                      <div class="status-breakdown-bar">
                        <div class="status-breakdown-fill" style="width: ${stats.totalInquiries ? (item.count / stats.totalInquiries * 100) : 0}%; background: ${item.color}"></div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <div class="card">
              <div class="detail-section">
                <div class="detail-section-title">Recent Properties</div>
                ${recentProperties.length ? `
                  <div class="grid grid-4" style="gap: 12px;">
                    ${recentProperties.map(p => `
                      <div class="card card-clickable" onclick="App.navigate('properties/${p.id}')">
                        <div class="property-card-image">
                          ${p.images && p.images[0] ? `<img src="${p.images[0]}" alt="${p.title}">` : `<div class="property-card-placeholder">${UI.icons.image}</div>`}
                        </div>
                        <div class="property-card-title">${Utils.escapeHtml(p.title)}</div>
                        <div class="property-card-price">${Utils.formatCurrency(p.price)}</div>
                      </div>
                    `).join('')}
                  </div>
                ` : `
                  <div class="empty-state">
                    <div class="empty-state-icon">${UI.icons.building}</div>
                    <div class="empty-state-title">No properties yet</div>
                    <button class="btn btn-primary btn-sm" onclick="Properties.showAddModal()">Add Property</button>
                  </div>
                `}
              </div>
            </div>
          </div>

          <div class="dashboard-sidebar">
            <div class="card">
              <div class="detail-section">
                <div class="detail-section-title">Quick Actions</div>
                <div class="quick-actions">
                  <div class="quick-action" onclick="Inquiries.showAddModal()">
                    <div class="quick-action-icon">${UI.icons.plus}</div>
                    <span class="quick-action-label">New Inquiry</span>
                  </div>
                  <div class="quick-action" onclick="Properties.showAddModal()">
                    <div class="quick-action-icon">${UI.icons.building}</div>
                    <span class="quick-action-label">Add Property</span>
                  </div>
                  <div class="quick-action" onclick="Landlords.showAddModal()">
                    <div class="quick-action-icon">${UI.icons.user}</div>
                    <span class="quick-action-label">Add Landlord</span>
                  </div>
                  <div class="quick-action" onclick="Reminders.showAddModal()">
                    <div class="quick-action-icon">${UI.icons.bell}</div>
                    <span class="quick-action-label">Set Reminder</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card activity-card">
              <div class="detail-section">
                <div class="detail-section-title">Activity</div>
                ${activityItems.length ? `
                  <div class="activity-list">
                    ${activityItems.map(item => `
                      <div class="activity-item" onclick="${item.action}">
                        <div class="activity-icon">${item.icon}</div>
                        <div class="activity-content">
                          <div class="activity-text">${item.text}</div>
                          <div class="activity-time">${item.time}</div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                ` : `
                  <div class="empty-state" style="padding: 24px 0;">
                    <div class="empty-state-icon">${UI.icons.activity}</div>
                    <div class="empty-state-title">No activity yet</div>
                  </div>
                `}
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('app').innerHTML = App.renderMainLayout(content);
    } catch (error) {
      UI.showToast('Failed to load dashboard data', 'error');
      console.error('Dashboard error:', error);
    }
  },

  buildActivityFeed(inquiries, comments, properties) {
    const items = [];

    inquiries.slice(0, 5).forEach(i => {
      items.push({
        type: 'inquiry',
        text: `<strong>${Utils.escapeHtml(i.name)}</strong> - New ${i.inquiry_type} inquiry`,
        time: Utils.formatRelativeTime(i.created_at),
        icon: UI.icons.users,
        action: `App.navigate('inquiries/${i.id}')`
      });
    });

    comments.slice(0, 5).forEach(c => {
      const inquiry = inquiries.find(i => i.id === c.inquiry_id);
      if (inquiry) {
        items.push({
          type: 'comment',
          text: `Comment on <strong>${Utils.escapeHtml(inquiry.name)}</strong>`,
          time: Utils.formatRelativeTime(c.created_at),
          icon: UI.icons.messageCircle,
          action: `App.navigate('inquiries/${c.inquiry_id}')`
        });
      }
    });

    properties.slice(0, 3).forEach(p => {
      items.push({
        type: 'property',
        text: `<strong>${Utils.escapeHtml(p.title)}</strong> - Property added`,
        time: Utils.formatRelativeTime(p.created_at),
        icon: UI.icons.building,
        action: `App.navigate('properties/${p.id}')`
      });
    });

    return items.sort((a, b) => {
      const aTime = a.time.includes('m') ? 1 : a.time.includes('h') ? 2 : a.time.includes('d') ? 3 : 4;
      const bTime = b.time.includes('m') ? 1 : b.time.includes('h') ? 2 : b.time.includes('d') ? 3 : 4;
      return aTime - bTime;
    }).slice(0, 8);
  },

  renderReminders(overdue, today, upcoming, inquiries) {
    const allReminders = [
      ...overdue.map(r => ({ ...r, type: 'overdue' })),
      ...today.map(r => ({ ...r, type: 'today' })),
      ...upcoming.slice(0, 3).map(r => ({ ...r, type: 'upcoming' }))
    ];

    if (allReminders.length === 0) {
      return `
        <div class="empty-state" style="padding: 24px 0;">
          <div class="empty-state-icon">${UI.icons.bell}</div>
          <div class="empty-state-title">No reminders</div>
          <button class="btn btn-primary btn-sm" onclick="Reminders.showAddModal()">Set Reminder</button>
        </div>
      `;
    }

    return allReminders.map(r => {
      const inquiry = inquiries.find(i => i.id === r.inquiry_id);
      return `
        <div class="reminder-item ${r.type}">
          <div class="reminder-checkbox ${r.completed ? 'checked' : ''}" onclick="Reminders.toggleComplete('${r.id}')">
            ${r.completed ? UI.icons.check : ''}
          </div>
          <div class="reminder-info" onclick="App.navigate('inquiries/${r.inquiry_id}')">
            <div class="reminder-title ${r.completed ? 'checked' : ''}">${Utils.escapeHtml(inquiry?.name || 'Unknown')}</div>
            <div class="reminder-meta">${Utils.formatDate(r.date)} at ${r.time}${r.note ? ` - ${Utils.escapeHtml(r.note)}` : ''}</div>
          </div>
          <div class="reminder-actions">
            <button class="btn btn-ghost btn-icon btn-sm" onclick="event.stopPropagation(); Reminders.showEditModal('${r.id}')">
              ${UI.icons.edit}
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  scrollToReminders() {
    document.getElementById('reminders-section')?.scrollIntoView({ behavior: 'smooth' });
  }
};

const Inquiries = {
  currentFilter: 'all',
  searchQuery: '',
  inquiries: [],

  async render() {
    const loading = `<div class="page-header"><h1 class="page-title">Inquiries</h1></div><div class="empty-state"><div class="empty-state-title">Loading...</div></div>`;
    document.getElementById('app').innerHTML = App.renderMainLayout(loading);

    try {
      this.inquiries = await Store.getInquiries();
      this.renderList();
    } catch (error) {
      UI.showToast('Failed to load inquiries', 'error');
    }
  },

  renderList() {
    const filteredInquiries = this.filterInquiries(this.inquiries);

    const statusCounts = {
      all: this.inquiries.length,
      new: this.inquiries.filter(i => i.status === 'new').length,
      'follow-up': this.inquiries.filter(i => i.status === 'follow-up').length,
      'hot-lead': this.inquiries.filter(i => i.status === 'hot-lead').length,
      'deal-closed': this.inquiries.filter(i => i.status === 'deal-closed').length,
      completed: this.inquiries.filter(i => i.status === 'completed').length,
      cancelled: this.inquiries.filter(i => i.status === 'cancelled').length
    };

    const content = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Inquiries</h1>
          <p class="page-subtitle">Manage your buyer and seller inquiries</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="Inquiries.showAddModal()">
            ${UI.icons.plus}
            New Inquiry
          </button>
        </div>
      </div>

      <div class="filter-bar">
        <div class="filter-bar-left">
          <div class="search-box">
            <span class="search-box-icon">${UI.icons.search}</span>
            <input type="text" class="input" placeholder="Search inquiries..." value="${Utils.escapeHtml(this.searchQuery)}" oninput="Inquiries.handleSearch(this.value)">
          </div>
          <div class="status-filter-tabs">
            ${Object.entries(statusCounts).map(([status, count]) => `
              <button class="status-filter-tab ${this.currentFilter === status ? 'active' : ''}" onclick="Inquiries.setFilter('${status}')">
                ${status === 'all' ? 'All' : Utils.getStatusLabel(status)} <span class="count">${count}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="grid grid-auto" id="inquiries-list">
        ${filteredInquiries.length ? filteredInquiries.map(i => Inquiries.renderInquiryCard(i)).join('') : `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">${UI.icons.users}</div>
            <div class="empty-state-title">No inquiries found</div>
            <div class="empty-state-text">Create your first inquiry to get started</div>
            <button class="btn btn-primary" onclick="Inquiries.showAddModal()">
              ${UI.icons.plus}
              New Inquiry
            </button>
          </div>
        `}
      </div>
    `;

    document.getElementById('app').innerHTML = App.renderMainLayout(content);
  },

  filterInquiries(inquiries) {
    let filtered = [...inquiries];

    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(i => i.status === this.currentFilter);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.contact.includes(query) ||
        i.location.toLowerCase().includes(query)
      );
    }

    return filtered;
  },

  setFilter(filter) {
    this.currentFilter = filter;
    this.renderList();
  },

  handleSearch: Utils.debounce(function(query) {
    Inquiries.searchQuery = query;
    Inquiries.renderList();
  }, 300),

  renderInquiryCard(inquiry) {
    return `
      <div class="card inquiry-card card-clickable" onclick="App.navigate('inquiries/${inquiry.id}')">
        <div class="inquiry-card-header">
          <div>
            <div class="inquiry-card-name">${Utils.escapeHtml(inquiry.name)}</div>
            <div class="inquiry-card-contact">${Utils.formatPhone(inquiry.contact)}</div>
          </div>
          ${UI.getStatusBadge(inquiry.status)}
        </div>
        <div class="inquiry-card-details">
          <div class="inquiry-card-detail">
            ${UI.icons.building}
            ${Utils.getPropertyTypeLabel(inquiry.property_type)}
          </div>
          <div class="inquiry-card-detail">
            ${UI.icons.mapPin}
            ${Utils.escapeHtml(Utils.truncate(inquiry.location, 20))}
          </div>
        </div>
        <div class="inquiry-card-footer">
          <span class="inquiry-card-type ${inquiry.inquiry_type}">${inquiry.inquiry_type === 'buy' ? 'Looking to Buy' : 'Looking to Sell'}</span>
          <span style="font-size: 14px; color: var(--accent-primary);">${Utils.formatCurrency(inquiry.budget)}</span>
        </div>
      </div>
    `;
  },

  showAddModal(inquiry = null) {
    const isEdit = !!inquiry;
    const modal = UI.showModal(`
      <form id="inquiry-form" class="auth-form">
        <div class="form-row">
          <div class="input-group">
            <label class="required">Name</label>
            <input type="text" class="input" name="name" value="${inquiry?.name || ''}" required>
          </div>
          <div class="input-group">
            <label class="required">Contact Number</label>
            <input type="tel" class="input" name="contact" value="${inquiry?.contact || ''}" placeholder="+91 XXXXX XXXXX" required>
          </div>
        </div>
        <div class="form-row">
          <div class="input-group">
            <label class="required">Property Type</label>
            <select class="input" name="propertyType" required>
              <option value="">Select type</option>
              ${Utils.getPropertyTypeOptions().map(o => `
                <option value="${o.value}" ${inquiry?.property_type === o.value ? 'selected' : ''}>${o.label}</option>
              `).join('')}
            </select>
          </div>
          <div class="input-group">
            <label class="required">Budget</label>
            <input type="number" class="input" name="budget" value="${inquiry?.budget || ''}" placeholder="e.g., 5000000" required>
          </div>
        </div>
        <div class="input-group">
          <label class="required">Location Preference</label>
          <input type="text" class="input" name="location" value="${inquiry?.location || ''}" placeholder="e.g., Whitefield, Bangalore" required>
        </div>
        <div class="form-row">
          <div class="input-group">
            <label class="required">Inquiry Type</label>
            <select class="input" name="inquiryType" required>
              ${Utils.getInquiryTypeOptions().map(o => `
                <option value="${o.value}" ${inquiry?.inquiry_type === o.value ? 'selected' : ''}>${o.label}</option>
              `).join('')}
            </select>
          </div>
          <div class="input-group">
            <label>Status</label>
            <select class="input" name="status">
              ${Utils.getStatusOptions().map(o => `
                <option value="${o.value}" ${inquiry?.status === o.value ? 'selected' : ''}>${o.label}</option>
              `).join('')}
            </select>
          </div>
        </div>
        <div class="input-group">
          <label>Notes</label>
          <textarea class="input" name="notes" placeholder="Additional notes...">${inquiry?.notes || ''}</textarea>
        </div>
        <div class="form-row" style="margin-top: 16px; justify-content: flex-end;">
          ${isEdit ? `
            <button type="button" class="btn btn-danger" onclick="Inquiries.confirmDelete('${inquiry.id}')">
              ${UI.icons.trash}
              Delete
            </button>
          ` : ''}
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">
            ${UI.icons.check}
            ${isEdit ? 'Save Changes' : 'Create Inquiry'}
          </button>
        </div>
      </form>
    `, {
      title: isEdit ? 'Edit Inquiry' : 'New Inquiry',
      maxWidth: '560px'
    });

    document.getElementById('inquiry-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        name: formData.get('name'),
        contact: formData.get('contact'),
        propertyType: formData.get('propertyType'),
        budget: parseInt(formData.get('budget')),
        location: formData.get('location'),
        inquiryType: formData.get('inquiryType'),
        status: formData.get('status') || 'new',
        notes: formData.get('notes') || ''
      };

      try {
        if (isEdit) {
          await Store.updateInquiry(inquiry.id, data);
          UI.showToast('Inquiry updated successfully', 'success');
        } else {
          await Store.addInquiry(data);
          UI.showToast('Inquiry created successfully', 'success');
        }

        UI.closeModal();
        if (isEdit) {
          Inquiries.renderDetail(inquiry.id);
        } else {
          this.render();
        }
      } catch (error) {
        UI.showToast('Failed to save inquiry', 'error');
      }
    });
  },

  async confirmDelete(id) {
    const confirmed = await UI.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.');
    if (confirmed) {
      try {
        await Store.deleteInquiry(id);
        UI.closeModal();
        UI.showToast('Inquiry deleted', 'success');
        this.render();
      } catch (error) {
        UI.showToast('Failed to delete inquiry', 'error');
      }
    }
  },

  async renderDetail(id) {
    const loading = `<div class="page-header"><h1 class="page-title">Loading...</h1></div>`;
    document.getElementById('app').innerHTML = App.renderMainLayout(loading);

    try {
      const inquiry = await Store.getInquiryById(id);
      if (!inquiry) {
        UI.showToast('Inquiry not found', 'error');
        this.render();
        return;
      }

      const [reminders, comments, properties] = await Promise.all([
        Store.getReminders(),
        Store.getComments(id),
        Store.getProperties()
      ]);

      const inquiryReminders = reminders.filter(r => r.inquiry_id == id);
      const linkedProperty = inquiry.linked_property_id ? properties.find(p => p.id === inquiry.linked_property_id) : null;

      const content = `
        <div class="page-header">
          <div style="display: flex; align-items: center; gap: 16px;">
            <button class="btn btn-ghost btn-icon" onclick="App.navigate('inquiries')">
              ${UI.icons.arrowLeft}
            </button>
            <div>
              <h1 class="page-title">${Utils.escapeHtml(inquiry.name)}</h1>
              <p class="page-subtitle">${Utils.formatDate(inquiry.created_at)}</p>
            </div>
          </div>
          <div class="page-actions">
            <button class="btn btn-secondary" onclick="Inquiries.showAddModal(Store.getInquiryById('${id}'))">
              ${UI.icons.edit}
              Edit
            </button>
          </div>
        </div>

        <div class="detail-header">
          <div class="detail-header-content">
            ${UI.getStatusBadge(inquiry.status)}
          </div>
          <div class="detail-header-actions">
            <select class="input" style="width: 160px;" onchange="Inquiries.updateStatus('${id}', this.value)">
              ${Utils.getStatusOptions().map(o => `
                <option value="${o.value}" ${inquiry.status === o.value ? 'selected' : ''}>${o.label}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="grid grid-2" style="gap: 24px;">
          <div>
            <div class="card">
              <div class="detail-section">
                <div class="detail-section-title">Contact Information</div>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-item-label">Name</span>
                    <span class="detail-item-value">${Utils.escapeHtml(inquiry.name)}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Contact</span>
                    <span class="detail-item-value">${Utils.formatPhone(inquiry.contact)}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Inquiry Type</span>
                    <span class="detail-item-value" style="text-transform: capitalize;">${inquiry.inquiry_type}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Budget</span>
                    <span class="detail-item-value" style="color: var(--accent-primary);">${Utils.formatCurrency(inquiry.budget)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="detail-section">
                <div class="detail-section-title">Property Details</div>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-item-label">Property Type</span>
                    <span class="detail-item-value">${Utils.getPropertyTypeLabel(inquiry.property_type)}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Location</span>
                    <span class="detail-item-value">${Utils.escapeHtml(inquiry.location)}</span>
                  </div>
                </div>
                ${inquiry.notes ? `
                  <div style="margin-top: 16px;">
                    <span class="detail-item-label">Notes</span>
                    <p style="margin-top: 4px; color: var(--text-secondary);">${Utils.escapeHtml(inquiry.notes)}</p>
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="card">
              <div class="detail-section">
                <div class="detail-section-title">Linked Property</div>
                ${linkedProperty ? `
                  <div class="linked-property" onclick="App.navigate('properties/${linkedProperty.id}')">
                    <div class="linked-property-image">
                      ${linkedProperty.images && linkedProperty.images[0] ? `<img src="${linkedProperty.images[0]}">` : UI.icons.image}
                    </div>
                    <div class="linked-property-info">
                      <div class="linked-property-title">${Utils.escapeHtml(linkedProperty.title)}</div>
                      <div class="linked-property-meta">${Utils.formatCurrency(linkedProperty.price)}</div>
                    </div>
                    <button class="btn btn-ghost btn-icon btn-sm" onclick="event.stopPropagation(); Inquiries.unlinkProperty('${id}')">
                      ${UI.icons.x}
                    </button>
                  </div>
                ` : `
                  <div style="margin-bottom: 12px;">
                    <button class="btn btn-secondary btn-sm" onclick="Inquiries.showLinkPropertyModal('${id}')">
                      ${UI.icons.link}
                      Link Property
                    </button>
                  </div>
                `}
              </div>
            </div>
          </div>

          <div>
            <div class="card">
              <div class="detail-section">
                <div class="detail-section-title" style="display: flex; align-items: center; justify-content: space-between;">
                  <span>Reminders</span>
                  <button class="btn btn-sm btn-secondary" onclick="Reminders.showAddModal('${id}')">
                    ${UI.icons.plus} Add
                  </button>
                </div>
                ${inquiryReminders.length ? inquiryReminders.map(r => Inquiries.renderReminder(r)).join('') : `
                  <div class="empty-state" style="padding: 16px 0;">
                    <p class="text-muted">No reminders set</p>
                  </div>
                `}
              </div>
            </div>

            <div class="card">
              <div class="detail-section">
                <div class="detail-section-title">Comments</div>
                <div class="comment-form">
                  <input type="text" class="input" id="comment-input" placeholder="Add a comment...">
                  <button class="btn btn-primary" onclick="Inquiries.addComment('${id}')">
                    ${UI.icons.messageCircle}
                  </button>
                </div>
                <div class="comments-list">
                  ${comments.length ? comments.map(c => `
                    <div class="comment">
                      ${UI.renderAvatar(Auth.getUser()?.name, 'avatar-sm')}
                      <div class="comment-content">
                        <div class="comment-header">
                          <span class="comment-author">${Utils.escapeHtml(Auth.getUser()?.name)}</span>
                          <span class="comment-time">${Utils.formatRelativeTime(c.created_at)}</span>
                          <button class="btn btn-ghost btn-icon btn-sm" onclick="Inquiries.deleteComment('${id}', '${c.id}')" style="margin-left: auto;">
                            ${UI.icons.trash}
                          </button>
                        </div>
                        <div class="comment-text">${Utils.escapeHtml(c.text)}</div>
                      </div>
                    </div>
                  `).join('') : `
                    <div class="empty-state" style="padding: 16px 0;">
                      <p class="text-muted">No comments yet</p>
                    </div>
                  `}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('app').innerHTML = App.renderMainLayout(content);

      document.getElementById('comment-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addComment(id);
        }
      });
    } catch (error) {
      UI.showToast('Failed to load inquiry', 'error');
      this.render();
    }
  },

  renderReminder(reminder) {
    return `
      <div class="reminder-item ${reminder.completed ? '' : (reminder.date < Utils.getToday() ? 'overdue' : reminder.date === Utils.getToday() ? 'today' : 'upcoming')}">
        <div class="reminder-checkbox ${reminder.completed ? 'checked' : ''}" onclick="Reminders.toggleComplete('${reminder.id}')">
          ${reminder.completed ? UI.icons.check : ''}
        </div>
        <div class="reminder-info">
          <div class="reminder-title ${reminder.completed ? 'checked' : ''}">${Utils.formatDate(reminder.date)} at ${reminder.time}</div>
          ${reminder.note ? `<div class="reminder-meta">${Utils.escapeHtml(reminder.note)}</div>` : ''}
        </div>
      </div>
    `;
  },

  async updateStatus(id, status) {
    try {
      await Store.updateInquiry(id, { status });
      UI.showToast('Status updated', 'success');
      this.renderDetail(id);
    } catch (error) {
      UI.showToast('Failed to update status', 'error');
    }
  },

  async addComment(inquiryId) {
    const input = document.getElementById('comment-input');
    const text = input.value.trim();

    if (!text) return;

    try {
      await Store.addComment({ inquiryId: parseInt(inquiryId), text });
      input.value = '';
      UI.showToast('Comment added', 'success');
      this.renderDetail(inquiryId);
    } catch (error) {
      UI.showToast('Failed to add comment', 'error');
    }
  },

  async deleteComment(inquiryId, commentId) {
    try {
      await Store.deleteComment(commentId);
      UI.showToast('Comment deleted', 'success');
      this.renderDetail(inquiryId);
    } catch (error) {
      UI.showToast('Failed to delete comment', 'error');
    }
  },

  async showLinkPropertyModal(inquiryId) {
    const properties = await Store.getProperties();

    const modal = UI.showModal(`
      ${properties.length ? `
        <div class="list-view">
          ${properties.map(p => `
            <div class="list-item" onclick="Inquiries.linkProperty('${inquiryId}', '${p.id}')">
              <div class="list-item-content">
                <div class="list-item-title">${Utils.escapeHtml(p.title)}</div>
                <div class="list-item-meta">${Utils.formatCurrency(p.price)} - ${Utils.getPropertyTypeLabel(p.type)}</div>
              </div>
              ${UI.icons.link}
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">${UI.icons.building}</div>
          <div class="empty-state-title">No properties</div>
          <div class="empty-state-text">Create a property first to link it</div>
          <button class="btn btn-primary" onclick="UI.closeModal(); Properties.showAddModal()">Add Property</button>
        </div>
      `}
    `, {
      title: 'Link Property',
      maxWidth: '480px'
    });
  },

  async linkProperty(inquiryId, propertyId) {
    try {
      await Store.updateInquiry(inquiryId, { linkedPropertyId: parseInt(propertyId) });
      UI.closeModal();
      UI.showToast('Property linked', 'success');
      this.renderDetail(inquiryId);
    } catch (error) {
      UI.showToast('Failed to link property', 'error');
    }
  },

  async unlinkProperty(inquiryId) {
    try {
      await Store.updateInquiry(inquiryId, { linkedPropertyId: null });
      UI.showToast('Property unlinked', 'success');
      this.renderDetail(inquiryId);
    } catch (error) {
      UI.showToast('Failed to unlink property', 'error');
    }
  }
};

const Properties = {
  currentFilter: 'all',
  searchQuery: '',
  properties: [],

  async render() {
    const loading = `<div class="page-header"><h1 class="page-title">Properties</h1></div><div class="empty-state"><div class="empty-state-title">Loading...</div></div>`;
    document.getElementById('app').innerHTML = App.renderMainLayout(loading);

    try {
      this.properties = await Store.getProperties();
      this.renderList();
    } catch (error) {
      UI.showToast('Failed to load properties', 'error');
    }
  },

  renderList() {
    const filteredProperties = this.filterProperties(this.properties);

    const content = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Properties</h1>
          <p class="page-subtitle">Manage your property listings</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="Properties.showAddModal()">
            ${UI.icons.plus}
            Add Property
          </button>
        </div>
      </div>

      <div class="filter-bar">
        <div class="filter-bar-left">
          <div class="search-box">
            <span class="search-box-icon">${UI.icons.search}</span>
            <input type="text" class="input" placeholder="Search properties..." value="${Utils.escapeHtml(this.searchQuery)}" oninput="Properties.handleSearch(this.value)">
          </div>
          <div class="status-filter-tabs">
            <button class="status-filter-tab ${this.currentFilter === 'all' ? 'active' : ''}" onclick="Properties.setFilter('all')">
              All <span class="count">${this.properties.length}</span>
            </button>
            ${Utils.getPropertyCategoryOptions().map(o => `
              <button class="status-filter-tab ${this.currentFilter === o.value ? 'active' : ''}" onclick="Properties.setFilter('${o.value}')">
                ${o.label} <span class="count">${this.properties.filter(p => p.type === o.value).length}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="grid grid-auto" id="properties-list">
        ${filteredProperties.length ? filteredProperties.map(p => Properties.renderPropertyCard(p)).join('') : `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">${UI.icons.building}</div>
            <div class="empty-state-title">No properties found</div>
            <div class="empty-state-text">Add your first property listing</div>
            <button class="btn btn-primary" onclick="Properties.showAddModal()">
              ${UI.icons.plus}
              Add Property
            </button>
          </div>
        `}
      </div>
    `;

    document.getElementById('app').innerHTML = App.renderMainLayout(content);
  },

  filterProperties(properties) {
    let filtered = [...properties];

    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(p => p.type === this.currentFilter);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  },

  setFilter(filter) {
    this.currentFilter = filter;
    this.renderList();
  },

  handleSearch: Utils.debounce(function(query) {
    Properties.searchQuery = query;
    Properties.renderList();
  }, 300),

  renderPropertyCard(property) {
    const linkedInquiries = window.inquiries?.filter(i => i.linked_property_id === property.id) || [];
    const landlord = property.owner_id ? Store.getLandlordById(property.owner_id) : null;

    return `
      <div class="card property-card card-clickable" onclick="App.navigate('properties/${property.id}')">
        <div class="property-card-image">
          ${property.images && property.images[0] ? `<img src="${property.images[0]}" alt="${property.title}">` : `<div class="property-card-placeholder">${UI.icons.image}</div>`}
        </div>
        <div class="property-card-title">${Utils.escapeHtml(property.title)}</div>
        <div class="property-card-meta">
          ${UI.getPropertyTypeBadge(property.type)}
          <span class="property-card-meta-item">
            ${UI.icons.mapPin}
            ${Utils.escapeHtml(Utils.truncate(property.location, 20))}
          </span>
        </div>
        <div class="property-card-price">${Utils.formatCurrency(property.price)}</div>
        <div class="property-card-footer">
          <span class="text-muted" style="font-size: 12px;">${linkedInquiries.length} linked inquiry${linkedInquiries.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    `;
  },

  async showAddModal(property = null) {
    const isEdit = !!property;
    const landlords = await Store.getLandlords();

    const modal = UI.showModal(`
      <form id="property-form" class="auth-form">
        <div class="input-group">
          <label class="required">Property Title</label>
          <input type="text" class="input" name="title" value="${property?.title || ''}" placeholder="e.g., 3BHK Apartment in Whitefield" required>
        </div>
        <div class="form-row">
          <div class="input-group">
            <label class="required">Type</label>
            <select class="input" name="type" required>
              <option value="">Select type</option>
              ${Utils.getPropertyCategoryOptions().map(o => `
                <option value="${o.value}" ${property?.type === o.value ? 'selected' : ''}>${o.label}</option>
              `).join('')}
            </select>
          </div>
          <div class="input-group">
            <label class="required">Price</label>
            <input type="number" class="input" name="price" value="${property?.price || ''}" placeholder="e.g., 5000000" required>
          </div>
        </div>
        <div class="input-group">
          <label class="required">Location</label>
          <input type="text" class="input" name="location" value="${property?.location || ''}" placeholder="e.g., Whitefield, Bangalore" required>
        </div>
        <div class="input-group">
          <label>Owner</label>
          <select class="input" name="ownerId">
            <option value="">Select landlord (optional)</option>
            ${landlords.map(l => `
              <option value="${l.id}" ${property?.owner_id === l.id ? 'selected' : ''}>${Utils.escapeHtml(l.name)}</option>
            `).join('')}
          </select>
        </div>
        <div class="input-group">
          <label>Description</label>
          <textarea class="input" name="description" placeholder="Property description...">${property?.description || ''}</textarea>
        </div>
        <div class="input-group">
          <label>Image URLs (comma separated)</label>
          <input type="text" class="input" name="images" value="${property?.images?.join(', ') || ''}" placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg">
        </div>
        <div class="input-group">
          <label>Video URL (optional)</label>
          <input type="url" class="input" name="videoUrl" value="${property?.video_url || ''}" placeholder="https://youtube.com/watch?v=...">
        </div>
        <div class="form-row" style="margin-top: 16px; justify-content: flex-end;">
          ${isEdit ? `
            <button type="button" class="btn btn-danger" onclick="Properties.confirmDelete('${property.id}')">
              ${UI.icons.trash}
              Delete
            </button>
          ` : ''}
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">
            ${UI.icons.check}
            ${isEdit ? 'Save Changes' : 'Add Property'}
          </button>
        </div>
      </form>
    `, {
      title: isEdit ? 'Edit Property' : 'Add Property',
      maxWidth: '560px'
    });

    document.getElementById('property-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const images = formData.get('images')
        ? formData.get('images').split(',').map(url => url.trim()).filter(url => url)
        : [];

      const data = {
        title: formData.get('title'),
        type: formData.get('type'),
        price: parseInt(formData.get('price')),
        location: formData.get('location'),
        ownerId: formData.get('ownerId') ? parseInt(formData.get('ownerId')) : null,
        description: formData.get('description') || '',
        images,
        videoUrl: formData.get('videoUrl') || null
      };

      try {
        if (isEdit) {
          await Store.updateProperty(property.id, data);
          UI.showToast('Property updated', 'success');
        } else {
          await Store.addProperty(data);
          UI.showToast('Property added', 'success');
        }

        UI.closeModal();
        if (isEdit) {
          this.renderDetail(property.id);
        } else {
          this.render();
        }
      } catch (error) {
        UI.showToast('Failed to save property', 'error');
      }
    });
  },

  async confirmDelete(id) {
    const confirmed = await UI.confirm('Are you sure you want to delete this property? This action cannot be undone.');
    if (confirmed) {
      try {
        await Store.deleteProperty(id);
        UI.closeModal();
        UI.showToast('Property deleted', 'success');
        this.render();
      } catch (error) {
        UI.showToast('Failed to delete property', 'error');
      }
    }
  },

  async renderDetail(id) {
    const loading = `<div class="page-header"><h1 class="page-title">Loading...</h1></div>`;
    document.getElementById('app').innerHTML = App.renderMainLayout(loading);

    try {
      const property = await Store.getPropertyById(id);
      if (!property) {
        UI.showToast('Property not found', 'error');
        this.render();
        return;
      }

      const [landlord, inquiries] = await Promise.all([
        property.owner_id ? Store.getLandlordById(property.owner_id) : null,
        Store.getInquiries()
      ]);

      const linkedInquiries = inquiries.filter(i => i.linked_property_id == id);

      const content = `
        <div class="page-header">
          <div style="display: flex; align-items: center; gap: 16px;">
            <button class="btn btn-ghost btn-icon" onclick="App.navigate('properties')">
              ${UI.icons.arrowLeft}
            </button>
            <div>
              <h1 class="page-title">${Utils.escapeHtml(property.title)}</h1>
              <p class="page-subtitle">${Utils.getPropertyTypeLabel(property.type)} - ${Utils.escapeHtml(property.location)}</p>
            </div>
          </div>
          <div class="page-actions">
            <button class="btn btn-secondary" onclick="Properties.showAddModal(property)">
              ${UI.icons.edit}
              Edit
            </button>
          </div>
        </div>

        ${property.images && property.images.length ? `
          <div class="card mb-6">
            <div class="image-gallery">
              ${property.images.map(img => `
                <div class="image-gallery-item" onclick="window.open('${img}', '_blank')">
                  <img src="${img}" alt="Property image">
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="grid grid-2" style="gap: 24px;">
          <div>
            <div class="card">
              <div class="detail-section">
                <div class="detail-section-title">Property Details</div>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-item-label">Price</span>
                    <span class="detail-item-value" style="font-size: 18px; color: var(--accent-primary);">${Utils.formatCurrency(property.price)}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Type</span>
                    <span class="detail-item-value">${UI.getPropertyTypeBadge(property.type)}</span>
                  </div>
                  <div class="detail-item" style="grid-column: 1 / -1;">
                    <span class="detail-item-label">Location</span>
                    <span class="detail-item-value">${Utils.escapeHtml(property.location)}</span>
                  </div>
                </div>
                ${property.description ? `
                  <div style="margin-top: 16px;">
                    <span class="detail-item-label">Description</span>
                    <p style="margin-top: 4px; color: var(--text-secondary);">${Utils.escapeHtml(property.description)}</p>
                  </div>
                ` : ''}
                ${property.video_url ? `
                  <div style="margin-top: 16px;">
                    <a href="${property.video_url}" target="_blank" class="btn btn-secondary btn-sm">
                      ${UI.icons.video}
                      Watch Video
                    </a>
                  </div>
                ` : ''}
              </div>
            </div>

            ${landlord ? `
              <div class="card">
                <div class="detail-section">
                  <div class="detail-section-title">Owner</div>
                  <div class="card card-clickable" onclick="App.navigate('landlords/${landlord.id}')" style="display: flex; align-items: center; gap: 16px;">
                    ${UI.renderAvatar(landlord.name, 'avatar-lg')}
                    <div>
                      <div class="landlord-card-name">${Utils.escapeHtml(landlord.name)}</div>
                      <div class="landlord-card-contact">${Utils.formatPhone(landlord.contact)}</div>
                    </div>
                    ${UI.icons.chevronRight}
                  </div>
                </div>
              </div>
            ` : ''}
          </div>

          <div>
            <div class="card">
              <div class="detail-section">
                <div class="detail-section-title">Linked Inquiries (${linkedInquiries.length})</div>
                ${linkedInquiries.length ? linkedInquiries.map(inquiry => `
                  <div class="list-item" onclick="App.navigate('inquiries/${inquiry.id}')">
                    <div class="list-item-content">
                      <div class="list-item-title">${Utils.escapeHtml(inquiry.name)}</div>
                      <div class="list-item-meta">${UI.getStatusBadge(inquiry.status)} ${inquiry.inquiry_type === 'buy' ? 'Looking to Buy' : 'Looking to Sell'}</div>
                    </div>
                    ${UI.icons.chevronRight}
                  </div>
                `).join('') : `
                  <div class="empty-state" style="padding: 16px 0;">
                    <p class="text-muted">No linked inquiries</p>
                  </div>
                `}
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('app').innerHTML = App.renderMainLayout(content);
    } catch (error) {
      UI.showToast('Failed to load property', 'error');
      this.render();
    }
  }
};

const Landlords = {
  async render() {
    const loading = `<div class="page-header"><h1 class="page-title">Landlords</h1></div><div class="empty-state"><div class="empty-state-title">Loading...</div></div>`;
    document.getElementById('app').innerHTML = App.renderMainLayout(loading);

    try {
      const [landlords, properties] = await Promise.all([
        Store.getLandlords(),
        Store.getProperties()
      ]);

      const content = `
        <div class="page-header">
          <div>
            <h1 class="page-title">Landlords</h1>
            <p class="page-subtitle">Manage property owners</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" onclick="Landlords.showAddModal()">
              ${UI.icons.plus}
              Add Landlord
            </button>
          </div>
        </div>

        <div class="card">
          ${landlords.length ? `
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Properties</th>
                  <th>Added</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${landlords.map(l => {
                  const landlordProperties = properties.filter(p => p.owner_id === l.id);
                  return `
                    <tr class="clickable" onclick="App.navigate('landlords/${l.id}')">
                      <td>
                        <div style="display: flex; align-items: center; gap: 12px;">
                          ${UI.renderAvatar(l.name)}
                          <span>${Utils.escapeHtml(l.name)}</span>
                        </div>
                      </td>
                      <td>${Utils.formatPhone(l.contact)}</td>
                      <td>${landlordProperties.length}</td>
                      <td>${Utils.formatDate(l.created_at)}</td>
                      <td>
                        <button class="btn btn-ghost btn-icon btn-sm" onclick="event.stopPropagation(); Landlords.showAddModal(Store.getLandlordById('${l.id}'))">
                          ${UI.icons.edit}
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          ` : `
            <div class="empty-state">
              <div class="empty-state-icon">${UI.icons.user}</div>
              <div class="empty-state-title">No landlords yet</div>
              <div class="empty-state-text">Add property owners to manage their listings</div>
              <button class="btn btn-primary" onclick="Landlords.showAddModal()">
                ${UI.icons.plus}
                Add Landlord
              </button>
            </div>
          `}
        </div>
      `;

      document.getElementById('app').innerHTML = App.renderMainLayout(content);
    } catch (error) {
      UI.showToast('Failed to load landlords', 'error');
    }
  },

  async showAddModal(landlord = null) {
    const isEdit = !!landlord;

    const modal = UI.showModal(`
      <form id="landlord-form" class="auth-form">
        <div class="input-group">
          <label class="required">Name</label>
          <input type="text" class="input" name="name" value="${landlord?.name || ''}" required>
        </div>
        <div class="input-group">
          <label class="required">Contact Number</label>
          <input type="tel" class="input" name="contact" value="${landlord?.contact || ''}" placeholder="+91 XXXXX XXXXX" required>
        </div>
        <div class="input-group">
          <label>Address</label>
          <textarea class="input" name="address" placeholder="Full address...">${landlord?.address || ''}</textarea>
        </div>
        <div class="form-row" style="margin-top: 16px; justify-content: flex-end;">
          ${isEdit ? `
            <button type="button" class="btn btn-danger" onclick="Landlords.confirmDelete('${landlord.id}')">
              ${UI.icons.trash}
              Delete
            </button>
          ` : ''}
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">
            ${UI.icons.check}
            ${isEdit ? 'Save Changes' : 'Add Landlord'}
          </button>
        </div>
      </form>
    `, {
      title: isEdit ? 'Edit Landlord' : 'Add Landlord',
      maxWidth: '480px'
    });

    document.getElementById('landlord-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        name: formData.get('name'),
        contact: formData.get('contact'),
        address: formData.get('address') || ''
      };

      try {
        if (isEdit) {
          await Store.updateLandlord(landlord.id, data);
          UI.showToast('Landlord updated', 'success');
        } else {
          await Store.addLandlord(data);
          UI.showToast('Landlord added', 'success');
        }

        UI.closeModal();
        if (isEdit) {
          this.renderDetail(landlord.id);
        } else {
          this.render();
        }
      } catch (error) {
        UI.showToast('Failed to save landlord', 'error');
      }
    });
  },

  async confirmDelete(id) {
    const confirmed = await UI.confirm('Are you sure you want to delete this landlord? Properties owned by this landlord will not be deleted.');
    if (confirmed) {
      try {
        await Store.deleteLandlord(id);
        UI.closeModal();
        UI.showToast('Landlord deleted', 'success');
        this.render();
      } catch (error) {
        UI.showToast('Failed to delete landlord', 'error');
      }
    }
  },

  async renderDetail(id) {
    const loading = `<div class="page-header"><h1 class="page-title">Loading...</h1></div>`;
    document.getElementById('app').innerHTML = App.renderMainLayout(loading);

    try {
      const landlord = await Store.getLandlordById(id);
      if (!landlord) {
        UI.showToast('Landlord not found', 'error');
        this.render();
        return;
      }

      const properties = await Store.getProperties();
      const landlordProperties = properties.filter(p => p.owner_id == id);

      const content = `
        <div class="page-header">
          <div style="display: flex; align-items: center; gap: 16px;">
            <button class="btn btn-ghost btn-icon" onclick="App.navigate('landlords')">
              ${UI.icons.arrowLeft}
            </button>
            <div>
              <h1 class="page-title">${Utils.escapeHtml(landlord.name)}</h1>
              <p class="page-subtitle">Landlord since ${Utils.formatDate(landlord.created_at)}</p>
            </div>
          </div>
          <div class="page-actions">
            <button class="btn btn-secondary" onclick="Landlords.showAddModal(Store.getLandlordById('${id}'))">
              ${UI.icons.edit}
              Edit
            </button>
          </div>
        </div>

        <div class="grid grid-2" style="gap: 24px;">
          <div>
            <div class="card">
              <div class="detail-section">
                <div class="detail-section-title">Contact Information</div>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-item-label">Name</span>
                    <span class="detail-item-value">${Utils.escapeHtml(landlord.name)}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Contact</span>
                    <span class="detail-item-value">${Utils.formatPhone(landlord.contact)}</span>
                  </div>
                  ${landlord.address ? `
                    <div class="detail-item" style="grid-column: 1 / -1;">
                      <span class="detail-item-label">Address</span>
                      <span class="detail-item-value">${Utils.escapeHtml(landlord.address)}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="card">
              <div class="detail-section">
                <div class="detail-section-title">Properties (${landlordProperties.length})</div>
                ${landlordProperties.length ? landlordProperties.map(p => `
                  <div class="list-item" onclick="App.navigate('properties/${p.id}')">
                    <div class="property-card-image" style="width: 48px; height: 48px;">
                      ${p.images && p.images[0] ? `<img src="${p.images[0]}" alt="${p.title}">` : `<div class="property-card-placeholder">${UI.icons.image}</div>`}
                    </div>
                    <div class="list-item-content">
                      <div class="list-item-title">${Utils.escapeHtml(p.title)}</div>
                      <div class="list-item-meta">${Utils.formatCurrency(p.price)} - ${Utils.getPropertyTypeLabel(p.type)}</div>
                    </div>
                    ${UI.icons.chevronRight}
                  </div>
                `).join('') : `
                  <div class="empty-state" style="padding: 16px 0;">
                    <p class="text-muted">No properties linked</p>
                  </div>
                `}
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('app').innerHTML = App.renderMainLayout(content);
    } catch (error) {
      UI.showToast('Failed to load landlord', 'error');
      this.render();
    }
  }
};

const Reminders = {
  async showAddModal(inquiryId = null) {
    const inquiries = await Store.getInquiries();
    const today = Utils.getToday();

    const modal = UI.showModal(`
      <form id="reminder-form" class="auth-form">
        <div class="input-group">
          <label class="required">Inquiry</label>
          <select class="input" name="inquiryId" required ${inquiryId ? 'disabled' : ''}>
            <option value="">Select inquiry</option>
            ${inquiries.map(i => `
              <option value="${i.id}" ${inquiryId == i.id ? 'selected' : ''}>${Utils.escapeHtml(i.name)} - ${i.contact}</option>
            `).join('')}
          </select>
          ${inquiryId ? `<input type="hidden" name="inquiryId" value="${inquiryId}">` : ''}
        </div>
        <div class="form-row">
          <div class="input-group">
            <label class="required">Date</label>
            <input type="date" class="input" name="date" value="${today}" required>
          </div>
          <div class="input-group">
            <label class="required">Time</label>
            <input type="time" class="input" name="time" value="09:00" required>
          </div>
        </div>
        <div class="input-group">
          <label>Note (optional)</label>
          <input type="text" class="input" name="note" placeholder="Reminder note...">
        </div>
        <div class="form-row" style="margin-top: 16px; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">
            ${UI.icons.check}
            Set Reminder
          </button>
        </div>
      </form>
    `, {
      title: 'Set Reminder',
      maxWidth: '480px'
    });

    document.getElementById('reminder-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        inquiryId: parseInt(formData.get('inquiryId')),
        date: formData.get('date'),
        time: formData.get('time'),
        note: formData.get('note') || ''
      };

      try {
        await Store.addReminder(data);
        UI.closeModal();
        UI.showToast('Reminder set', 'success');

        if (window.location.hash.includes('dashboard')) {
          Dashboard.render();
        } else if (window.location.hash.includes('inquiries')) {
          const hashParts = window.location.hash.split('/');
          if (hashParts.length > 1) {
            Inquiries.renderDetail(hashParts[1]);
          } else {
            Inquiries.render();
          }
        }
      } catch (error) {
        UI.showToast('Failed to set reminder', 'error');
      }
    });
  },

  async showEditModal(reminderId) {
    const reminders = await Store.getReminders();
    const reminder = reminders.find(r => r.id == reminderId);

    if (!reminder) return;

    const modal = UI.showModal(`
      <form id="reminder-edit-form" class="auth-form">
        <div class="form-row">
          <div class="input-group">
            <label class="required">Date</label>
            <input type="date" class="input" name="date" value="${reminder.date}" required>
          </div>
          <div class="input-group">
            <label class="required">Time</label>
            <input type="time" class="input" name="time" value="${reminder.time}" required>
          </div>
        </div>
        <div class="input-group">
          <label>Note</label>
          <input type="text" class="input" name="note" value="${Utils.escapeHtml(reminder.note || '')}">
        </div>
        <div class="form-row" style="margin-top: 16px; justify-content: flex-end;">
          <button type="button" class="btn btn-danger" onclick="Reminders.confirmDelete('${reminder.id}')">
            ${UI.icons.trash}
            Delete
          </button>
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">
            ${UI.icons.check}
            Save
          </button>
        </div>
      </form>
    `, {
      title: 'Edit Reminder',
      maxWidth: '480px'
    });

    document.getElementById('reminder-edit-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      try {
        await Store.updateReminder(reminder.id, {
          date: formData.get('date'),
          time: formData.get('time'),
          note: formData.get('note') || ''
        });
        UI.closeModal();
        UI.showToast('Reminder updated', 'success');
        Dashboard.render();
      } catch (error) {
        UI.showToast('Failed to update reminder', 'error');
      }
    });
  },

  async confirmDelete(reminderId) {
    const confirmed = await UI.confirm('Delete this reminder?');
    if (confirmed) {
      try {
        await Store.deleteReminder(reminderId);
        UI.closeModal();
        UI.showToast('Reminder deleted', 'success');
        Dashboard.render();
      } catch (error) {
        UI.showToast('Failed to delete reminder', 'error');
      }
    }
  },

  async toggleComplete(reminderId) {
    const reminders = await Store.getReminders();
    const reminder = reminders.find(r => r.id == reminderId);

    if (reminder) {
      try {
        await Store.updateReminder(reminderId, { completed: !reminder.completed });
        
        if (window.location.hash.includes('dashboard')) {
          Dashboard.render();
        } else {
          const hashParts = window.location.hash.split('/');
          if (hashParts.length > 1) {
            Inquiries.renderDetail(hashParts[1]);
          }
        }
      } catch (error) {
        UI.showToast('Failed to update reminder', 'error');
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
