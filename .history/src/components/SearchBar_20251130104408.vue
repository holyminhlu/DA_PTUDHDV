<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <input
        type="text"
        v-model="searchQuery"
        @input="onInput"
        @keyup.enter="performSearch"
        placeholder="Tìm kiếm sản phẩm..."
        class="search-input"
      />
      <button @click="performSearch" class="search-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>
      
      <!-- Autocomplete Dropdown -->
      <div v-if="showSuggestions && suggestions.length" class="suggestions-dropdown">
        <div
          v-for="item in suggestions"
          :key="item.id"
          @click="selectSuggestion(item)"
          class="suggestion-item"
        >
          <img :src="item.image || '/img/articles/product-1.jpg'" :alt="item.title" class="suggestion-img" />
          <div class="suggestion-info">
            <div class="suggestion-title">{{ item.title }}</div>
            <div class="suggestion-price">{{ formatPrice(item.price) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SearchBar',
  data() {
    return {
      searchQuery: '',
      suggestions: [],
      showSuggestions: false,
      debounceTimer: null
    };
  },
  methods: {
    formatPrice(v) {
      if (!v) return '';
      return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
    },
    onInput() {
      // Debounce autocomplete API calls
      clearTimeout(this.debounceTimer);
      if (this.searchQuery.trim().length < 2) {
        this.suggestions = [];
        this.showSuggestions = false;
        return;
      }
      
      this.debounceTimer = setTimeout(() => {
        this.fetchSuggestions();
      }, 300);
    },
    async fetchSuggestions() {
      try {
        const base = process.env.VUE_APP_API_URL || 'http://localhost:3000';
        const { data } = await axios.get(`${base}/api/products/search`, {
          params: { q: this.searchQuery, limit: 5 }
        });
        this.suggestions = data.results || [];
        this.showSuggestions = this.suggestions.length > 0;
      } catch (err) {
        console.error('Failed to fetch suggestions', err);
        this.suggestions = [];
        this.showSuggestions = false;
      }
    },
    selectSuggestion(item) {
      this.showSuggestions = false;
      this.$router.push(`/product/${item.id}`);
      this.searchQuery = '';
    },
    performSearch() {
      console.log('performSearch called with query:', this.searchQuery);
      if (!this.searchQuery.trim()) return;
      this.showSuggestions = false;
      
      this.$router.push({
        path: '/search',
        query: { q: this.searchQuery }
      }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('Navigation error:', err);
        }
      });
    }
  },
  mounted() {
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showSuggestions = false;
      }
    });
  }
};
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 12px 50px 12px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-btn {
  position: absolute;
  right: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.search-btn svg {
  color: white;
}

.search-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Suggestions Dropdown */
.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: #f8fafc;
}

.suggestion-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.suggestion-info {
  flex: 1;
  overflow: hidden;
}

.suggestion-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-price {
  font-size: 13px;
  color: #ef4444;
  font-weight: 700;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .search-input {
    padding: 10px 45px 10px 16px;
    font-size: 14px;
  }
}
</style>
