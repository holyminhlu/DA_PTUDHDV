<template>
  <div>
    <HeaderComponent />

    <div class="container detail-container">
      <div v-if="loading" class="loading">Đang tải chi tiết sản phẩm...</div>
      <div v-if="error" class="error-container">
        <p class="error">{{ error }}</p>
        <button class="retry-btn" @click="fetchProduct">Thử lại</button>
      </div>

      <div v-if="product && !loading" class="product-detail">
        <div class="left">
          <img :src="product.image" :alt="product.title" class="detail-image" />
        </div>
        <div class="right">
          <h1 class="title">{{ product.title }}</h1>
          <p class="price">{{ formatPrice(product.price) }}</p>
          <p class="old-price" v-if="product.oldPrice">Giá cũ: {{ formatPrice(product.oldPrice) }}</p>
          <p class="rating">Đánh giá: {{ product.rating || 'N/A' }} ({{ product.reviews || 0 }} đánh giá)</p>
          <div v-if="product.description" class="description" v-html="product.description"></div>

          <div class="actions">
            <button class="add-to-cart">Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';
import axios from 'axios';

export default {
  name: 'ProductDetail',
  components: { HeaderComponent, FooterComponent },
  data() {
    return {
      product: null,
      loading: false,
      error: null
    };
  },
  methods: {
    formatPrice(v) {
      if (!v) return '';
      return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
    },
    async fetchProduct() {
      this.loading = true;
      this.error = null;
      try {
        const base = process.env.VUE_APP_API_URL || 'http://localhost:3000';
        const { id } = this.$route.params;
        const { data } = await axios.get(`${base}/api/products/${id}`);
        this.product = data;
      } catch (e) {
        this.error = e.response?.data?.error || e.message || 'Lỗi khi tải chi tiết';
        console.error('ProductDetail fetch error', e);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchProduct();
  }
};
</script>

<style scoped>
.container { max-width: 1100px; margin: 24px auto; padding: 0 24px; }
.detail-container { padding: 40px 0; }
.product-detail { display:flex; gap:32px; align-items:flex-start; }
.left { flex:1; }
.right { flex:1; }
.detail-image { width:100%; border-radius:12px; object-fit:contain; background:#f8fafc; }
.title { font-size:24px; margin-bottom:12px; }
.price { color:#ef4444; font-weight:800; font-size:22px; margin-bottom:8px; }
.old-price { text-decoration:line-through; color:#94a3b8; margin-bottom:8px; }
.rating { color:#64748b; margin-bottom:12px; }
.actions { margin-top:16px; }
.add-to-cart { background:#3b82f6; color:white; padding:12px 20px; border-radius:10px; border:none; cursor:pointer; }
.loading { text-align:center; padding:16px; }
.error { color:#dc2626; }
.retry-btn { padding:10px 18px; background:#3b82f6; color:white; border:none; border-radius:8px; cursor:pointer; }
</style>
