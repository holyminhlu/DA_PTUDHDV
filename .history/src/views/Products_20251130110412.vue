<template>
  <div class="products-page">
    <HeaderComponent />
    
    <div class="products-container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Sản phẩm</h1>
        <p class="page-subtitle">Khám phá những sản phẩm công nghệ mới nhất với ưu đãi đặc biệt</p>
      </div>

      <!-- Category Filters -->
      <div class="category-filters">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          :class="['category-btn', { active: selectedCategory === cat.id }]"
          @click="selectedCategory = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Sort & Filter Controls -->
      <div class="controls-bar">
        <div class="results-info">
          <span class="product-count">{{ filteredProducts.length }} sản phẩm</span>
        </div>
        
        <div class="sort-control">
          <label>Sắp xếp:</label>
          <select v-model="sortOption" class="sort-select">
            <option value="">Mặc định</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="name">Tên A-Z</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchProducts" class="retry-btn">Thử lại</button>
      </div>

      <!-- Products Grid -->
      <div v-else-if="sortedProducts.length > 0" class="products-grid">
        <ProductCard 
          v-for="product in sortedProducts" 
          :key="product.id" 
          :product="product"
          @click="goToProductDetail(product.id)"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <p>Không có sản phẩm nào trong danh mục này</p>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import axios from 'axios';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import ProductCard from '@/components/ProductCard.vue';

export default {
  name: 'Products',
  components: {
    HeaderComponent,
    FooterComponent,
    ProductCard
  },
  data() {
    return {
      products: [],
      loading: false,
      error: null,
      selectedCategory: 'all',
      sortOption: '',
      categories: [
        { id: 'all', name: 'Tất cả' },
        { id: 'iphone', name: 'iPhone' },
        { id: 'samsung', name: 'Samsung' },
        { id: 'xiaomi', name: 'Xiaomi' },
        { id: 'oppo', name: 'Oppo' }
      ]
    };
  },
  computed: {
    filteredProducts() {
      if (this.selectedCategory === 'all') {
        return this.products;
      }
      
      return this.products.filter(p => {
        const title = (p.title || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const description = (p.description || '').toLowerCase();
        const selectedCat = this.selectedCategory.toLowerCase();
        
        // Tìm kiếm theo tên, category, brand hoặc description có chứa từ khóa
        return title.includes(selectedCat) || 
               category.includes(selectedCat) || 
               brand.includes(selectedCat) ||
               description.includes(selectedCat);
      });
    },
    sortedProducts() {
      const products = [...this.filteredProducts];
      
      switch (this.sortOption) {
        case 'price-asc':
          return products.sort((a, b) => (a.price || 0) - (b.price || 0));
        case 'price-desc':
          return products.sort((a, b) => (b.price || 0) - (a.price || 0));
        case 'name':
          return products.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        case 'rating':
          return products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        default:
          return products;
      }
    }
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const base = process.env.VUE_APP_API_URL || 'http://localhost:3000';
        const { data } = await axios.get(`${base}/api/products`);
        
        // Normalize id preference
        this.products = (data || []).map(p => ({
          ...p,
          id: p.id || p.phoneId || p._id
        }));
      } catch (err) {
        console.error('Failed to fetch products:', err);
        this.error = 'Không thể tải danh sách sản phẩm. Vui lòng thử lại.';
        this.products = [];
      } finally {
        this.loading = false;
      }
    },
    goToProductDetail(id) {
      this.$router.push(`/product/${id}`);
    }
  },
  mounted() {
    this.fetchProducts();
  }
};
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.products-container {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  width: 100%;
}

/* Page Header */
.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
}

.page-subtitle {
  font-size: 18px;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

/* Category Filters */
.category-filters {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.category-btn {
  padding: 12px 28px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 50px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.category-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
}

.category-btn.active {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* Controls Bar */
.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 24px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
}

.results-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-count {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-control label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.sort-select {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s ease;
  background: white;
}

.sort-select:focus {
  outline: none;
  border-color: #3b82f6;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f4f6;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 16px;
  color: #64748b;
  font-weight: 600;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.error-state p {
  font-size: 18px;
  color: #ef4444;
  font-weight: 600;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.empty-state p {
  font-size: 18px;
  color: #64748b;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .products-container {
    padding: 24px 16px 60px;
  }

  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .category-filters {
    gap: 8px;
  }

  .category-btn {
    padding: 10px 20px;
    font-size: 14px;
  }

  .controls-bar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .sort-control {
    justify-content: space-between;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
