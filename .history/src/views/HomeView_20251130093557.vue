
<template>
  <div>
    <HeaderComponent />
    <HeroBanner image="/img/articles/hero-sample.jpg" />

    <div v-if="loading" class="loading">Đang tải sản phẩm...</div>
    <div v-if="error" class="error-container">
      <p class="error">{{ error }}</p>
      <button class="retry-btn" @click="fetchProducts">Thử lại</button>
    </div>

    <ProductGrid
      v-if="!loading && !error"
      :products="products"
      @product-click="openProduct"
    />

    <FeatureSection />
    <Newsletter />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';
import HeroBanner from '../components/HeroBanner.vue';
import ProductGrid from '../components/ProductGrid.vue';
import FeatureSection from '../components/FeatureSection.vue';
import Newsletter from '../components/Newsletter.vue';
import sampleProducts from '../data/sample-products.json';

import axios from 'axios';

export default {
  components: { HeaderComponent, FooterComponent, HeroBanner, ProductGrid, FeatureSection, Newsletter },
  data() {
    return {
      products: [],
      loading: false,
      error: null
    };
  },
  methods: {
    openProduct(product) {
      // ví dụ: chuyển tới trang chi tiết (bạn có thể điều chỉnh route)
      const id = product.id || product._id;
      if (id) this.$router.push({ name: 'ProductDetail', params: { id } });
    },
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        const base = process.env.VUE_APP_API_URL || 'http://localhost:3000';
        const { data } = await axios.get(`${base}/api/products`);
        // Prefer existing `id` field (e.g., numeric ids from sample data) over Mongo `_id`.
        this.products = Array.isArray(data) ? data.map(p => ({ ...p, id: (p.id !== undefined && p.id !== null) ? p.id : (p._id || null) })) : [];
        // Fallback to sample data when backend returns no products (useful for local dev)
        if (!this.products.length) {
          this.products = sampleProducts.map(p => ({ ...p, id: p.id }));
        }
      } catch (e) {
        this.error = e.response?.data?.error || e.message || 'Lỗi khi tải sản phẩm';
        console.error('HomeView fetch error', e);
      } finally {
        this.loading = false;
      }
    }
  },
  async mounted() {
    await this.fetchProducts();
  }
};
</script>

<style scoped>
.loading { text-align:center; padding:16px; color:#374151; }
.error-container { text-align:center; padding:32px; }
.error { color:#dc2626; margin-bottom:16px; }
.retry-btn { 
  padding:10px 20px; 
  background:#3b82f6; 
  color:white; 
  border:none; 
  border-radius:8px; 
  cursor:pointer; 
  font-weight:600;
  transition: all 0.3s ease;
}
.retry-btn:hover { background:#1d4ed8; transform:translateY(-1px); }
</style>



