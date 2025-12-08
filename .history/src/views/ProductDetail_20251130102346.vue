<template>
  <div class="product-detail-page">
    <HeaderComponent />

    <main class="container detail-container">
      <div v-if="loading" class="loading">Đang tải thông tin sản phẩm...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else-if="product" class="detail-card">
        <div class="left-col">
          <div class="image-col">
            <img :src="product.image || '/img/articles/product-1.jpg'" :alt="product.title" />
          </div>
          
          <div class="specs" v-if="product.specs && Object.keys(product.specs).length">
            <h3>Thông số kỹ thuật</h3>
            <ul>
              <li v-for="(value, key) in product.specs" :key="key">
                <strong>{{ formatSpecKey(key) }}:</strong> {{ value }}
              </li>
            </ul>
          </div>
        </div>

        <div class="info-col">
          <h1 class="title">{{ product.title }}</h1>
          <div class="category">{{ product.category || 'Thiết bị' }}</div>
          <div class="price">{{ formatPrice(product.price) }}</div>
          <div v-if="product.oldPrice" class="old-price">{{ formatPrice(product.oldPrice) }}</div>
          <div class="rating">
            <div class="stars" aria-hidden="true">
              <span v-for="(s,i) in ratingArray" :key="i" :class="{ filled: s }">★</span>
              <span class="rating-number">{{ product.rating || '0.0' }}</span>
            </div>
            <div class="reviews">({{ product.reviews || 0 }} đánh giá)</div>
          </div>

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
    formatSpecKey(key) {
      const map = {
        screen: 'Màn hình',
        cpu: 'CPU',
        ram: 'RAM',
        storage: 'Bộ nhớ',
        camera: 'Camera',
        battery: 'Pin',
        os: 'Hệ điều hành',
        connectivity: 'Kết nối',
        weight: 'Trọng lượng'
      };
      if (map[key]) return map[key];
      // fallback: split camelCase or kebab and capitalize
      const parts = key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').split(' ');
      return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
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

          // If phoneinfo exists but lacks UI fields (title/price/rating/image), try to fetch base product and merge
          try {
            const respBase = await axios.get(`${base}/api/products/${id}`);
            const baseProd = respBase.data || {};
            // merge common display fields if missing on phoneinfo
            const displayFields = ['title', 'price', 'oldPrice', 'image', 'rating', 'reviews', 'category'];
            displayFields.forEach(f => {
              if ((this.product[f] === undefined || this.product[f] === null || this.product[f] === '') && baseProd[f] !== undefined) {
                this.product[f] = baseProd[f];
              }
            });
          } catch (mergeErr) {
            // ignore merge errors (base product might not exist) — we still show phoneinfo fields
            // console.debug('no base product to merge', mergeErr?.message || mergeErr);
          }

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
  computed: {
    ratingArray() {
      const rating = Number(this.product?.rating) || 0;
      // Round down to nearest integer for filled stars
      const filled = Math.round(rating);
      return Array.from({ length: 5 }, (_, i) => i < filled);
    }
  },
  mounted() {
    this.fetchProduct();
  }
};
</script>

<style scoped>
/* Modern Product Detail Page Styling */
.product-detail-page {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

.detail-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 120px 32px 60px;
}

/* Loading & Error States */
.loading,
.error,
.not-found {
  text-align: center;
  padding: 80px 24px;
  font-size: 18px;
  color: #64748b;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.error {
  color: #ef4444;
  border-left: 4px solid #ef4444;
}

/* Main Product Card */
.detail-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  background: white;
  padding: 48px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.detail-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
}

/* Left Column - Image + Specs */
.left-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Image Column */
.image-col {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 20px;
  padding: 32px;
  position: relative;
  overflow: hidden;
}

.image-col::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.image-col img {
  width: 100%;
  max-height: 520px;
  object-fit: contain;
  border-radius: 16px;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 1;
}

.image-col:hover img {
  transform: scale(1.05);
}

/* Info Column */
.info-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Title & Category */
.title {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.02em;
}

.category {
  display: inline-block;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 6px 16px;
  border-radius: 20px;
  align-self: flex-start;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Pricing */
.price {
  font-size: 36px;
  font-weight: 900;
  background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 8px 0;
  letter-spacing: -0.02em;
}

.old-price {
  font-size: 20px;
  color: #94a3b8;
  text-decoration: line-through;
  font-weight: 600;
}

/* Rating Section */
.rating {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-top: 2px solid #f1f5f9;
  border-bottom: 2px solid #f1f5f9;
}

.stars {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stars span {
  font-size: 24px;
  color: #e2e8f0;
  transition: all 0.2s ease;
}

.stars span.filled {
  color: #fbbf24;
  text-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
}

.rating-number {
  margin-left: 8px;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.reviews {
  font-size: 15px;
  color: #64748b;
  font-weight: 500;
}

/* Description & Info Sections */
.description,
.warranty,
.colors {
  background: #f8fafc;
  padding: 20px 24px;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}

.description h3,
.warranty h3,
.colors h3,
.specs h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.description h3::before {
  content: '📝';
  font-size: 20px;
}

.warranty h3::before {
  content: '🛡️';
  font-size: 20px;
}

.colors h3::before {
  content: '🎨';
  font-size: 20px;
}

.specs h3::before {
  content: '⚙️';
  font-size: 20px;
}

.description p,
.warranty p,
.colors p {
  margin: 0;
  color: #475569;
  line-height: 1.7;
  font-size: 15px;
}

/* Specs Section */
.specs {
  background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
  padding: 24px;
  border-radius: 16px;
  border: 2px solid #fde047;
}

.specs ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.specs li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: white;
  border-radius: 10px;
  border: 1px solid #fde68a;
  transition: all 0.3s ease;
  font-size: 15px;
}

.specs li:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(234, 179, 8, 0.2);
  border-color: #fbbf24;
}

.specs li strong {
  color: #92400e;
  font-weight: 700;
  min-width: 140px;
}

.specs li:last-child {
  border-bottom: none;
}

/* Action Buttons */
.actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #f1f5f9;
}

.add-btn,
.back-btn {
  flex: 1;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  position: relative;
  overflow: hidden;
}

.add-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}

.add-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.add-btn:hover::before {
  left: 100%;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.5);
}

.add-btn:active {
  transform: translateY(0);
}

.back-btn {
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.back-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .detail-card {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 32px;
  }

  .left-col {
    gap: 20px;
  }

  .image-col img {
    max-height: 400px;
  }

  .title {
    font-size: 28px;
  }

  .price {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .detail-container {
    padding: 100px 16px 40px;
  }

  .detail-card {
    padding: 24px;
    gap: 24px;
    border-radius: 16px;
  }

  .image-col {
    padding: 20px;
  }

  .image-col img {
    max-height: 320px;
  }

  .title {
    font-size: 24px;
  }

  .price {
    font-size: 28px;
  }

  .actions {
    flex-direction: column;
  }

  .specs li {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .specs li strong {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .detail-card::before {
    height: 3px;
  }

  .category {
    font-size: 11px;
    padding: 5px 12px;
  }

  .stars span {
    font-size: 20px;
  }

  .rating-number {
    font-size: 16px;
  }

  .add-btn,
  .back-btn {
    padding: 14px 24px;
    font-size: 15px;
  }
}
</style>
