<template>
  <section class="product-grid-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-content">
          <h2 class="section-title">Sản phẩm nổi bật</h2>
          <p class="section-subtitle">Khám phá những sản phẩm công nghệ mới nhất với ưu đãi đặc biệt</p>
        </div>
        
        <!-- Navigation Tabs -->
        <div class="category-tabs">
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['tab-button', { active: activeCategory === category.id }]"
            @click="activeCategory = category.id"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="filteredProducts && filteredProducts.length" class="products-grid">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product"
          class="product-card-item"
          @product-click="handleProductClick"
        />
      </div>
      <div v-else class="no-products">Không có sản phẩm phù hợp.</div>

      <!-- Load More -->
      <div class="load-more-section">
        <button class="load-more-button" @click="handleViewAll">
          <span class="button-text">Xem tất cả sản phẩm</span>
          <svg class="button-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import ProductCard from './ProductCard.vue';

export default {
  name: 'ProductGrid',
  components: { ProductCard },
  props: ['products'],
  data() {
    return {
      activeCategory: 'all',
      categories: [
        { id: 'all', name: 'Tất cả' },
        { id: 'iphone', name: 'iPhone' },
        { id: 'samsung', name: 'Samsung' },
        { id: 'xiaomi', name: 'Xiaomi' },
        { id: 'oppo', name: 'Oppo' }
      ]
    }
  },
  computed: {
    filteredProducts() {
      if (this.activeCategory === 'all') {
        return this.products;
      }
      return this.products.filter(product => 
        product.category === this.activeCategory
      );
    }
  },
  methods: {
    handleViewAll() {
      this.$emit('view-all');
    }
    ,handleProductClick(product) {
      this.$emit('product-click', product);
    }
  }
}
</script>

<style scoped>
.product-grid-section {
  padding: 80px 0;
  background: linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.header-content {
  margin-bottom: 40px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 12px;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Category Tabs */
.category-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-button {
  padding: 12px 24px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.tab-button.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.no-products {
  text-align: center;
  color: #64748b;
  padding: 40px 0;
  font-weight: 600;
}

.product-card-item {
  transition: transform 0.3s ease;
}

.product-card-item:hover {
  transform: translateY(-4px);
}

/* Load More Section */
.load-more-section {
  text-align: center;
  margin-top: 40px;
}

.load-more-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-button:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.button-icon {
  transition: transform 0.3s ease;
}

.load-more-button:hover .button-icon {
  transform: translateX(4px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .product-grid-section {
    padding: 60px 0;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .category-tabs {
    gap: 6px;
  }
  
  .tab-button {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .load-more-button {
    padding: 14px 24px;
    font-size: 14px;
  }
}
</style>