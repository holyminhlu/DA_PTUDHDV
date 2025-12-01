<template>
  <div class="search-results">
    <HeaderComponent />
    
    <div class="search-container">
      <div class="search-header">
        <h1 class="search-title">Kết quả tìm kiếm</h1>
        <p v-if="searchQuery" class="search-query">
          Tìm kiếm cho: <strong>"{{ searchQuery }}"</strong>
        </p>
        <p class="search-count">{{ totalResults }} sản phẩm</p>
      </div>

      <div class="results-layout">
        <!-- Results Grid -->
        <div class="results-main">
          <div class="results-controls">
            <div class="sort-control">
              <label>Sắp xếp:</label>
              <select v-model="sortOption" @change="applyFilters" class="sort-select">
                <option value="">Mặc định</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="name">Tên A-Z</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>

          <div v-if="loading" class="loading-state">
            <p>Đang tải...</p>
          </div>

          <div v-else-if="error" class="empty-state">
            <p class="error-text">{{ error }}</p>
            <button @click="fetchResults" class="retry-btn">Thử lại</button>
          </div>

          <div v-else-if="!searchQuery && !selectedCategory && !minPrice && !maxPrice" class="empty-state">
            <p>Vui lòng nhập từ khóa tìm kiếm hoặc chọn bộ lọc</p>
          </div>

          <div v-else-if="products.length === 0" class="empty-state">
            <p>Không tìm thấy sản phẩm nào phù hợp với "{{ searchQuery }}"</p>
          </div>

          <ProductGrid v-else :products="products" />
        </div>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import axios from 'axios';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import ProductGrid from '@/components/ProductGrid.vue';

export default {
  name: 'SearchResults',
  components: {
    HeaderComponent,
    FooterComponent,
    ProductGrid
  },
  data() {
    return {
      products: [],
      searchQuery: '',
      totalResults: 0,
      loading: false,
      error: null,
      selectedCategory: '',
      minPrice: null,
      maxPrice: null,
      sortOption: '',
      categories: [
        { value: '', label: 'Tất cả' },
        { value: 'smartphone', label: 'Smartphone' },
        { value: 'tablet', label: 'Tablet' },
        { value: 'laptop', label: 'Laptop' },
        { value: 'accessory', label: 'Phụ kiện' }
      ]
    };
  },
  methods: {
    async fetchResults() {
      // Nếu không có tham số tìm kiếm nào, không gọi API
      if (!this.searchQuery && !this.selectedCategory && !this.minPrice && !this.maxPrice) {
        this.products = [];
        this.totalResults = 0;
        return;
      }
      
      this.loading = true;
      try {
        const base = process.env.VUE_APP_API_URL || 'http://localhost:3000';
        const params = {
          q: this.searchQuery,
          category: this.selectedCategory,
          minPrice: this.minPrice,
          maxPrice: this.maxPrice,
          sort: this.sortOption
        };
        
        // Remove empty params
        Object.keys(params).forEach(key => {
          if (!params[key] && params[key] !== 0) delete params[key];
        });

        console.log('Searching with params:', params);
        const { data } = await axios.get(`${base}/api/products/search`, { params });
        console.log('Search results:', data);
        
        // Normalize id preference
        this.products = (data.results || []).map(p => ({
          ...p,
          id: p.id || p.phoneId || p._id
        }));
        this.totalResults = data.count || this.products.length;
        console.log('Mapped products:', this.products);
      } catch (err) {
        console.error('Failed to fetch search results', err);
        this.products = [];
        this.totalResults = 0;
      } finally {
        this.loading = false;
      }
    },
    applyFilters() {
      // Update URL query params
      this.$router.push({
        path: '/search',
        query: {
          q: this.searchQuery,
          category: this.selectedCategory || undefined,
          minPrice: this.minPrice || undefined,
          maxPrice: this.maxPrice || undefined,
          sort: this.sortOption || undefined
        }
      });
      this.fetchResults();
    },
    resetFilters() {
      this.selectedCategory = '';
      this.minPrice = null;
      this.maxPrice = null;
      this.sortOption = '';
      this.applyFilters();
    },
    initFromQuery() {
      const q = this.$route.query;
      this.searchQuery = q.q || '';
      this.selectedCategory = q.category || '';
      this.minPrice = q.minPrice ? parseInt(q.minPrice) : null;
      this.maxPrice = q.maxPrice ? parseInt(q.maxPrice) : null;
      this.sortOption = q.sort || '';
    }
  },
  watch: {
    '$route.query': {
      handler() {
        this.initFromQuery();
        this.fetchResults();
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.search-results {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.search-container {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
}

.search-header {
  text-align: center;
  margin-bottom: 40px;
}

.search-title {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.search-query {
  font-size: 18px;
  color: #64748b;
  margin-bottom: 8px;
}

.search-query strong {
  color: #1e293b;
}

.search-count {
  font-size: 14px;
  color: #94a3b8;
}

.results-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
}

/* Filters Sidebar */
.filters-sidebar {
  background: white;
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 20px;
}

.filter-section {
  margin-bottom: 30px;
}

.filter-section:last-of-type {
  margin-bottom: 20px;
}

.filter-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #475569;
  transition: color 0.2s ease;
}

.filter-option:hover {
  color: #3b82f6;
}

.filter-option input[type="radio"] {
  cursor: pointer;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.price-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.price-separator {
  color: #94a3b8;
  font-weight: 600;
}

.reset-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* Results Main */
.results-main {
  min-height: 400px;
}

.results-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.sort-control label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.sort-select {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.sort-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.loading-state p,
.empty-state p {
  font-size: 18px;
  color: #64748b;
  font-weight: 600;
}

@media (max-width: 992px) {
  .results-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .search-title {
    font-size: 28px;
  }

  .search-container {
    padding: 24px 16px;
  }
}
</style>
