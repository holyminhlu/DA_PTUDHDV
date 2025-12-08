<template>
  <div class="product-detail-page">
    <HeaderComponent />

    <main class="container detail-container">
      <div v-if="loading" class="loading">Đang tải thông tin sản phẩm...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else-if="product" class="detail-card">
        <div class="image-col">
          <img :src="product.image || '/img/articles/product-1.jpg'" :alt="product.title" />
        </div>
        <div class="info-col">
          <h1 class="title">{{ product.title }}</h1>
          <div class="category">{{ product.category || 'Thiết bị' }}</div>
          <div class="price">{{ formatPrice(product.price) }}</div>
          <div v-if="product.oldPrice" class="old-price">{{ formatPrice(product.oldPrice) }}</div>
          <div class="rating">{{ product.rating || '0.0' }} ({{ product.reviews || 0 }} đánh giá)</div>

          <div class="description" v-if="product.description">
            <h3>Mô tả</h3>
            <p>{{ product.description }}</p>
          </div>

          <div class="warranty" v-if="product.warranty">
            <h3>Bảo hành</h3>
            <p>{{ product.warranty }}</p>
          </div>

          <div class="colors" v-if="product.colors">
            <h3>Màu sắc</h3>
            <p>{{ product.colors }}</p>
          </div>

          <div class="specs" v-if="product.specs && Object.keys(product.specs).length">
            <h3>Thông số kỹ thuật</h3>
            <ul>
              <li v-for="(value, key) in product.specs" :key="key">
                <strong>{{ formatSpecKey(key) }}:</strong> {{ value }}
              </li>
            </ul>
          </div>

          <div class="actions">
            <button class="add-btn" @click="addToCart">Thêm vào giỏ</button>
            <button class="back-btn" @click="$router.back()">Quay lại</button>
          </div>
        </div>
      </div>
      <div v-else class="not-found">Không tìm thấy sản phẩm.</div>
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import axios from 'axios';

export default {
  name: 'ProductDetail',
  components: { HeaderComponent, FooterComponent },
  data() {
    return {
      product: null,
      // Start in loading state to avoid initial render using `product` before fetch
      loading: true,
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
        const id = this.$route.params.id;
        const base = process.env.VUE_APP_API_URL || 'http://localhost:3000';
        // First try phoneinfo (detailed collection PhoneInfo) via gateway
        try {
          const { data } = await axios.get(`${base}/api/phoneinfo/${id}`);
          this.product = data || null;
          return;
        } catch (err) {
          // If not found (404) or other error, try fallback to products endpoint
          if (err.response && err.response.status === 404) {
            // fallback: try /api/products/:id
            try {
              const resp = await axios.get(`${base}/api/products/${id}`);
              this.product = resp.data || null;
              return;
            } catch (err2) {
              // continue to outer catch
              throw err2;
            }
          }
          throw err;
        }
      } catch (e) {
        this.error = e.response?.data?.error || e.message || 'Lỗi khi tải chi tiết sản phẩm';
        console.error('ProductDetail fetch error', e);
      } finally {
        this.loading = false;
      }
    },
    addToCart() {
      this.$emit('add-to-cart', this.product);
    }
  },
  mounted() {
    this.fetchProduct();
  }
};
</script>

<style scoped>
.detail-container { max-width: 1200px; margin: 100px auto; padding: 0 24px; }
.detail-card { display:flex; gap:24px; background:white; padding:24px; border-radius:12px; box-shadow:0 6px 20px rgba(2,6,23,0.06); }
.image-col { flex:1; display:flex; align-items:center; justify-content:center; }
.image-col img { width:100%; height:420px; object-fit:cover; border-radius:8px; }
.info-col { flex:1; display:flex; flex-direction:column; }
.title { font-size:24px; margin-bottom:8px; }
.category { color:#64748b; font-weight:600; margin-bottom:12px; }
.price { color:#ef4444; font-weight:800; font-size:20px; margin-bottom:6px; }
.old-price { color:#94a3b8; text-decoration:line-through; margin-bottom:12px; }
.rating { color:#64748b; margin-bottom:16px; }
.description h3 { margin-bottom:8px; }
.actions { margin-top:auto; display:flex; gap:12px; }
.add-btn { background:#3b82f6; color:white; border:none; padding:12px 18px; border-radius:8px; cursor:pointer; }
.back-btn { background:transparent; border:1px solid #e2e8f0; padding:12px 18px; border-radius:8px; cursor:pointer; }
@media (max-width:800px) { .detail-card { flex-direction:column; } .image-col img { height:320px; } }
</style>
