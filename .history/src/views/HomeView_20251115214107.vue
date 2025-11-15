
<template>
  <div>
    <HeaderComponent />
    <HeroBanner image="/img/articles/hero-sample.jpg" />

    <div v-if="loading" class="loading">Đang tải sản phẩm...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <ProductGrid
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
    }
  },
  async mounted() {
    this.loading = true;
    this.error = null;
    try {
      const base = process.env.VUE_APP_API_URL || 'http://localhost:3000';
      const { data } = await axios.get(`${base}/api/products`);
      this.products = Array.isArray(data) ? data.map(p => ({ ...p, id: p._id || p.id })) : [];
    } catch (e) {
      this.error = e.response?.data?.error || e.message || 'Lỗi khi tải sản phẩm';
      console.error('HomeView fetch error', e);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.loading { text-align:center; padding:16px; color:#374151; }
.error { text-align:center; padding:16px; color:#dc2626; }
</style>



