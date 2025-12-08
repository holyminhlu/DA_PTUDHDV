<template>
  <header class="header" :class="{ 'scrolled': isScrolled, 'mobile-menu-open': isMobileMenuOpen }">
    <div class="header-container">
      <!-- Logo Brand -->
      <div class="brand">
        <router-link to="/" class="brand-link">
          <div class="logo">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#logo-gradient)"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-weight="bold" font-size="14">TS</text>
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#3B82F6"/>
                  <stop offset="100%" stop-color="#1D4ED8"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="brand-name">TechStore</span>
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <nav class="desktop-nav">
        <div class="nav-links">
          <router-link 
            v-for="item in navItems" 
            :key="item.name"
            :to="item.path" 
            class="nav-link"
            :class="{ 'active': $route.path === item.path }"
          >
            {{ item.name }}
            <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
          </router-link>
        </div>
      </nav>

      <!-- Search Bar -->
      <div class="search-container">
        <SearchBar />
      </div>

      <!-- Action Buttons: only Cart then User (wishlist removed) -->
      <div class="action-buttons">
        <!-- Shopping Cart -->
        <div class="cart-dropdown">
          <button class="action-btn" @click="toggleCartDropdown" :aria-label="'Giỏ hàng'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.2 16.4H17M17 13V16.4M9 19C9 19.6 8.6 20 8 20C7.4 20 7 19.6 7 19C7 18.4 7.4 18 8 18C8.6 18 9 18.4 9 19ZM17 19C17 19.6 16.6 20 16 20C15.4 20 15 19.6 15 19C15 18.4 15.4 18 16 18C16.6 18 17 18.4 17 19Z" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span v-if="cartCount > 0" class="action-badge">{{ cartCount }}</span>
          </button>
          <div v-if="isCartDropdownOpen" class="dropdown-menu cart-menu">
            <div class="cart-header">
              <h4>Giỏ hàng ({{ cartCount }})</h4>
            </div>
            <div class="cart-items">
              <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <img :src="item.image" :alt="item.name" class="cart-item-image">
                <div class="cart-item-details">
                  <p class="cart-item-name">{{ item.name }}</p>
                  <p class="cart-item-price">{{ formatPrice(item.price) }}</p>
                </div>
                <button class="remove-item-btn" @click="removeFromCart(item.id)">
                  ×
                </button>
              </div>
            </div>
            <div class="cart-footer">
              <div class="cart-total">
                <span>Tổng tiền:</span>
                <span class="total-price">{{ formatPrice(cartTotal) }}</span>
              </div>
              <button class="checkout-btn">Thanh toán</button>
            </div>
          </div>
        </div>

        <!-- User Account -->
        <div class="user-dropdown">
          <button class="action-btn user-btn" @click="toggleUserDropdown" :aria-label="'Tài khoản'">
            <template v-if="isLoggedIn && userInitials">
              <span class="user-avatar">{{ userInitials }}</span>
            </template>
            <template v-else>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" 
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </template>
          </button>
          <div v-if="isUserDropdownOpen" class="dropdown-menu">
            <template v-if="isLoggedIn">
              <router-link to="/profile" class="dropdown-item" @click.native="closeDropdowns">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Tài khoản
              </router-link>
              <a href="#" class="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M16 11C16 13.2091 14.2091 15 12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11Z" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 21C12 21 20 17 20 11C20 5 16 3 12 3C8 3 4 5 4 11C4 17 12 21 12 21Z" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Đơn hàng
              </a>
              <hr class="dropdown-divider">
              <a href="#" class="dropdown-item text-danger" @click="logout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Đăng xuất
              </a>
            </template>
            <template v-else>
              <a href="/dangnhap" class="dropdown-item" @click="openLoginModal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 17L15 12L10 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Đăng nhập
              </a>
              <a href="/dangky" class="dropdown-item" @click="openRegisterModal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20 8V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 11H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Đăng ký
              </a>
            </template>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu" :aria-label="'Menu'">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="isMobileMenuOpen" class="mobile-nav">
      <div class="mobile-nav-content">
        <div class="mobile-search">
          <input type="text" placeholder="Tìm kiếm..." class="mobile-search-input">
        </div>
        <div class="mobile-nav-links">
          <router-link 
            v-for="item in navItems" 
            :key="item.name"
            :to="item.path" 
            class="mobile-nav-link"
            @click="closeMobileMenu"
          >
            {{ item.name }}
            <span v-if="item.badge" class="mobile-nav-badge">{{ item.badge }}</span>
          </router-link>
        </div>
        <div class="mobile-action-buttons">
          <button class="mobile-action-btn" @click="toggleCartDropdown">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.2 16.4H17M17 13V16.4M9 19C9 19.6 8.6 20 8 20C7.4 20 7 19.6 7 19C7 18.4 7.4 18 8 18C8.6 18 9 18.4 9 19ZM17 19C17 19.6 16.6 20 16 20C15.4 20 15 19.6 15 19C15 18.4 15.4 18 16 18C16.6 18 17 18.4 17 19Z" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Giỏ hàng
          </button>
          <button class="mobile-action-btn" @click="openLoginModal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Tài khoản
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import SearchBar from './SearchBar.vue';

export default { 
  name: 'HeaderComponent',
  components: {
    SearchBar
  },
  data() {
    return {
      isScrolled: false,
      isMobileMenuOpen: false,
      isUserDropdownOpen: false,
      isCartDropdownOpen: false,
      isWishlistActive: false,
      isLoggedIn: false,
      user: null,
      navItems: [
        { name: 'Trang chủ', path: '/' },
        { name: 'Sản phẩm', path: '/products', badge: 'Hot' },
        { name: 'Khuyến mãi', path: '/khuyenmai', badge: 'Mới' },
        { name: 'Giới thiệu', path: '/about' },
        { name: 'Liên hệ', path: '/contact' }
      ],
      cartItems: [
        {
          id: 1,
          name: 'iPhone 15 Pro Max 256GB',
          price: 28990000,
          image: '/img/articles/product-1.jpg'
        },
        {
          id: 2,
          name: 'Ốp lưng iPhone',
          price: 490000,
          image: '/img/articles/product-5.jpg'
        }
      ],
      wishlistCount: 3,
      cartCount: 2
    }
  },
  computed: {
    cartTotal() {
      return this.cartItems.reduce((total, item) => total + item.price, 0);
    }
    ,
    userInitials() {
      const name = (this.user && (this.user.name || this.user.fullname || this.user.displayName || this.user.username)) || '';
      if (!name) return null;
      // remove extra spaces
      const parts = name.trim().split(/\s+/);
      let initials = '';
      if (parts.length >= 2) {
        initials = parts[0][0] + parts[1][0];
      } else if (parts.length === 1) {
        initials = parts[0].slice(0, 2);
      }
      // normalize (remove diacritics) and uppercase
      return initials.normalize ? initials.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase() : initials.toUpperCase();
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    // Initialise user state from storage
    try {
      const raw = localStorage.getItem('techstore_user') || sessionStorage.getItem('techstore_user');
      if (raw) {
        this.user = JSON.parse(raw);
        this.isLoggedIn = true;
      }
    } catch (e) {
      console.warn('Failed to parse stored user', e);
    }
    // react to storage changes and custom event so header updates after sign-in
    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener('techstore:user-updated', this.handleUserUpdated);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('techstore:user-updated', this.handleUserUpdated);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 30;
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    toggleUserDropdown() {
      this.isUserDropdownOpen = !this.isUserDropdownOpen;
      this.isCartDropdownOpen = false;
    },
    toggleCartDropdown() {
      this.isCartDropdownOpen = !this.isCartDropdownOpen;
      this.isUserDropdownOpen = false;
    },
    toggleWishlist() {
      this.isWishlistActive = !this.isWishlistActive;
    },
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
    },
    removeFromCart(itemId) {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
      this.cartCount = this.cartItems.length;
    },
    openLoginModal() {
      this.$emit('open-login');
      this.isUserDropdownOpen = false;
      this.closeMobileMenu();
    },
    openRegisterModal() {
      this.$emit('open-register');
      this.isUserDropdownOpen = false;
      this.closeMobileMenu();
    },
    handleStorageChange(e) {
      // reload user from storage when changed in another tab
      try {
        const raw = localStorage.getItem('techstore_user') || sessionStorage.getItem('techstore_user');
        if (raw) {
          this.user = JSON.parse(raw);
          this.isLoggedIn = true;
        } else {
          this.user = null;
          this.isLoggedIn = false;
        }
      } catch (err) {
        console.warn('Failed to parse stored user', err);
      }
    },
    handleUserUpdated() {
      // custom event fired after login in same tab
      try {
        const raw = localStorage.getItem('techstore_user') || sessionStorage.getItem('techstore_user');
        if (raw) {
          this.user = JSON.parse(raw);
          this.isLoggedIn = true;
        }
      } catch (err) {
        console.warn('Failed to parse stored user', err);
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null;
      this.isUserDropdownOpen = false;
      try {
        localStorage.removeItem('techstore_user');
        sessionStorage.removeItem('techstore_user');
        localStorage.removeItem('techstore_token');
        sessionStorage.removeItem('techstore_token');
        // Dispatch event để cập nhật các components khác
        try { window.dispatchEvent(new Event('techstore:user-updated')); } catch (e) {}
      } catch (e) {
        console.warn('Failed to clear storage', e);
      }
    },
    closeDropdowns() {
      this.isUserDropdownOpen = false;
      this.isCartDropdownOpen = false;
    }
  }
}
</script>

<style scoped>
.user-avatar {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}
</style>
<style scoped>
/* Make the user button circular and remove internal padding so avatar displays as a true circle */
.action-btn.user-btn {
  border-radius: 50%;
  padding: 0;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Slightly smaller inner avatar so there's a small spacing */
.action-btn.user-btn .user-avatar {
  width: 34px;
  height: 34px;
  font-size: 13px;
}
</style>
</style>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;

  height: 80px;
  padding: 10px 20px;
  box-sizing: border-box;
}

/* Đảm bảo tất cả SVG và icon trong header hiển thị */
.header svg {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.header .search-icon,
.header .action-btn svg,
.header .logo svg {
  display: block !important;
  visibility: visible !important;
  width: auto !important;
  height: auto !important;
}


.header.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  gap: 20px;
}

/* Brand Logo */
.brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

/* Desktop Navigation */
.desktop-nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  position: relative;
  padding: 10px 14px;
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.nav-link:hover {
  color: #3B82F6;
  background: rgba(59, 130, 246, 0.1);
}

.nav-link.active {
  color: #3B82F6;
  background: rgba(59, 130, 246, 0.1);
}

.nav-badge {
  background: linear-gradient(135deg, #EF4444, #DC2626);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

/* Search Bar */
.search-container {
  flex: 0 1 300px;
}

.search-box {
  position: relative;
  display: block;
  width: 100%;
}

.search-box svg {
  display: block !important;
  visibility: visible !important;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6B7280;
  display: block !important;
  width: 16px !important;
  height: 16px !important;
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 10px 10px 10px 36px;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  font-size: 13px;
  transition: all 0.3s ease;
  background: #F9FAFB;
}

.search-input:focus {
  outline: none;
  border-color: #3B82F6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #9CA3AF;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn {
  position: relative;
  width: 38px;
  height: 38px;
  border: none;
  background: none;
  border-radius: 10px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn svg {
  display: block !important;
  width: 18px !important;
  height: 18px !important;
  flex-shrink: 0;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
}

.action-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #EF4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dropdown Menus */
.user-dropdown,
.cart-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 240px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 12px;
  margin-top: 8px;
  z-index: 1002;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  text-decoration: none;
  color: #374151;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 13px;
  font-weight: 500;
}

.dropdown-item:hover {
  background: #F9FAFB;
  color: #3B82F6;
}

.dropdown-item.text-danger:hover {
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
}

.dropdown-divider {
  border: none;
  border-top: 1px solid #E5E7EB;
  margin: 8px 0;
}

/* Cart Menu */
.cart-menu {
  width: 280px;
}

.cart-header h4 {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
}

.cart-items {
  max-height: 200px;
  overflow-y: auto;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #F3F4F6;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}

.cart-item-details {
  flex: 1;
}

.cart-item-name {
  font-size: 12px;
  font-weight: 500;
  margin: 0 0 4px;
  line-height: 1.3;
}

.cart-item-price {
  font-size: 13px;
  font-weight: 600;
  color: #EF4444;
  margin: 0;
}

.remove-item-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #9CA3AF;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.remove-item-btn:hover {
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
}

.cart-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #E5E7EB;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 14px;
}

.total-price {
  color: #EF4444;
  font-size: 16px;
}

.checkout-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 3px;
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
}

.mobile-menu-btn span {
  width: 18px;
  height: 2px;
  background: #374151;
  transition: all 0.3s ease;
}

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 999;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.header.mobile-menu-open .mobile-nav {
  transform: translateX(0);
}

.mobile-nav-content {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.mobile-search {
  margin-bottom: 20px;
}

.mobile-search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  font-size: 14px;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
}

.mobile-nav-link {
  padding: 14px;
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  font-size: 14px;
  border-radius: 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
}

.mobile-nav-badge {
  background: #EF4444;
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
}

.mobile-action-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mobile-action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: none;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  color: #374151;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-action-btn:hover {
  border-color: #3B82F6;
  color: #3B82F6;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .desktop-nav {
    display: none;
  }
  
  .search-container {
    flex: 1;
    margin: 0 12px;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
    height: 56px;
    gap: 12px;
  }
  
  .brand-name {
    font-size: 1.1rem;
  }
  
  .search-container {
    display: none;
  }
  
  .action-buttons {
    gap: 4px;
  }
  
  .action-btn {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .dropdown-menu {
    width: 220px;
    right: -10px;
  }
  
  .cart-menu {
    width: 260px;
  }
  
  .brand-name {
    font-size: 1rem;
  }
  
  .logo svg {
    width: 24px;
    height: 24px;
  }
}
</style>