<template>
  <div>
    <HeaderComponent />

    <section class="promo-hero">
      <div class="promo-inner container">
        <div class="promo-text">
          <h1>Khuyến mãi HOT</h1>
          <p>Những ưu đãi tốt nhất trong tháng — giảm giá sâu, quà tặng và nhiều chương trình hấp dẫn.</p>
          <button class="cta" @click="viewAll">Xem tất cả khuyến mãi</button>
        </div>
        <div class="promo-image" aria-hidden>
          <img src="/img/articles/hero-sample.jpg" alt="Khuyến mãi" />
        </div>
      </div>
    </section>

    <main class="container page-content">
      <div class="section-head">
        <h2>Sản phẩm khuyến mãi</h2>
        <p class="subtitle">Chọn lọc các điện thoại đang giảm giá mạnh</p>
      </div>

      <div v-if="loading" class="loading">Đang tải sản phẩm khuyến mãi...</div>
      <div v-if="error" class="error">{{ error }}</div>

      <ProductGrid
        v-if="!loading && promotions.length"
        :products="promotions"
        @product-click="openProduct"
      />

      <div v-if="!loading && !promotions.length" class="empty">Hiện không có chương trình khuyến mãi nào.</div>
    </main>

    <FeatureSection />
    <Newsletter />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';
import ProductGrid from '../components/ProductGrid.vue';
import FeatureSection from '../components/FeatureSection.vue';
import Newsletter from '../components/Newsletter.vue';
import axios from 'axios';

export default {
  name: 'KhuyenMaiView',
  components: { HeaderComponent, FooterComponent, ProductGrid, FeatureSection, Newsletter },
  data() {
    return {
      products: [],
      loading: false,
      error: null
    };
  },
  computed: {
    promotions() {
      // consider discount > 0 or explicit isPromotion flag
      return this.products.filter(p => {
        const discount = p.discount || p.salePercent || 0;
        const isProm = p.isPromotion || p.promo || false;
        return (Number(discount) > 0) || Boolean(isProm);
      }).map(p => ({ ...p, id: p._id || p.id }));
    }
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        const base = process.env.VUE_APP_API_URL || 'http://localhost:3000';
        const { data } = await axios.get(`${base}/api/products`);
        this.products = Array.isArray(data) ? data : [];
      } catch (e) {
        this.error = e.response?.data?.error || e.message || 'Lỗi khi tải danh sách sản phẩm';
        console.error('KhuyenMai fetch error', e);
      } finally {
        this.loading = false;
      }
    },
    openProduct(product) {
      const id = product.id || product._id;
      if (id) this.$router.push({ name: 'ProductDetail', params: { id } });
    },
    viewAll() {
      // route to a (hypothetical) products listing page or /promotions
      if (this.$router) this.$router.push({ name: 'Products' }).catch(()=>{});
    }
  },
  mounted() {
    this.fetchProducts();
  }
};
</script>

<style scoped>
.promo-hero { background: linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%); color: white; padding: 48px 0; }
.promo-inner { display: flex; align-items: center; gap: 24px; }
.promo-text { flex: 1; }
.promo-text h1 { font-size: 2.25rem; margin: 0 0 8px; font-weight: 800; }
.promo-text p { margin: 0 0 16px; color: rgba(255,255,255,0.9); }
.cta { background: white; color: #0f172a; padding: 10px 18px; border-radius: 10px; font-weight:700; border: none; cursor: pointer; }
.promo-image img { width: 320px; max-width: 40vw; border-radius: 12px; box-shadow: 0 12px 30px rgba(0,0,0,0.2); }

.page-content { padding: 48px 24px; }
.section-head { text-align: center; margin-bottom: 28px; }
.section-head h2 { font-size: 1.75rem; margin: 0 0 6px; }
.section-head .subtitle { color: #6b7280; }

.loading, .error, .empty { text-align: center; padding: 24px; color: #374151; }
.error { color: #dc2626; }

@media (max-width: 768px) {
  .promo-inner { flex-direction: column-reverse; text-align: center; }
  .promo-image img { max-width: 80%; }
}

</style>
