<template>
  <div class="product-card" @click="handleCardClick">
    <!-- Card Header - Image & Badges -->
    <div class="card-header">
      <div class="image-container">
        <img 
          :src="product.image" 
          :alt="product.title"
          class="product-image"
          loading="lazy"
          @error="onImageError"
        />
        
        <!-- Discount Badge -->
        <div v-if="product.discount" class="discount-badge">
          -{{ product.discount }}%
        </div>
        
        <!-- New Badge -->
        <div v-if="product.isNew" class="new-badge">
          Mới
        </div>
        
        <!-- Quick Actions -->
        <div class="quick-actions">
          <button class="action-btn wishlist-btn" @click.stop="toggleWishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" 
                :fill="product.isWishlisted ? '#ef4444' : 'none'" 
                :stroke="product.isWishlisted ? '#ef4444' : 'currentColor'" 
                stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Card Body - Content -->
    <div class="card-body">
      <!-- Category -->
      <div class="product-category">{{ product.category }}</div>
      
      <!-- Title -->
      <h3 class="product-title">{{ product.title }}</h3>
      
      <!-- Rating -->
      <div class="rating-section">
        <div class="stars">
          <span 
            v-for="star in 5" 
            :key="star"
            class="star"
            :class="{ filled: star <= Math.floor(product.rating) }"
          >
            ★
          </span>
        </div>
        <span class="rating-text">{{ product.rating }} ({{ product.reviews }} đánh giá)</span>
      </div>
      
      <!-- Features -->
      <div v-if="product.features" class="product-features">
        <span 
          v-for="feature in product.features.slice(0, 2)" 
          :key="feature"
          class="feature-tag"
        >
          {{ feature }}
        </span>
      </div>
    </div>

    <!-- Card Footer - Price & CTA -->
    <div class="card-footer">
      <!-- Price -->
      <div class="price-section">
        <span class="current-price">{{ formatPrice(product.price) }}</span>
        <span v-if="product.oldPrice" class="original-price">
          {{ formatPrice(product.oldPrice) }}
        </span>
      </div>
      
      <!-- Installment -->
      <div v-if="product.installment" class="installment">
        Trả góp {{ product.installment }}
      </div>
      
      <!-- CTA Button -->
      <button class="add-to-cart-btn" @click.stop="addToCart">
        <svg class="cart-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.2 16.4H17M17 13V16.4M9 19C9 19.6 8.6 20 8 20C7.4 20 7 19.6 7 19C7 18.4 7.4 18 8 18C8.6 18 9 18.4 9 19ZM17 19C17 19.6 16.6 20 16 20C15.4 20 15 19.6 15 19C15 18.4 15.4 18 16 18C16.6 18 17 18.4 17 19Z" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="btn-text">Thêm vào giỏ</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: ['product'],
  methods: {
    formatPrice(v) {
      if (!v) return '';
      return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
    },
    
    onImageError(event) {
      // Show placeholder when image fails to load
      event.target.style.backgroundColor = '#f3f4f6';
      event.target.style.opacity = '0.7';
      event.target.setAttribute('alt', 'Ảnh không khả dụng');
    },
    
    handleCardClick() {
      this.$emit('product-click', this.product);
    },
    
    toggleWishlist() {
      this.$emit('wishlist-toggle', this.product);
    },
    
    addToCart() {
      this.$emit('add-to-cart', this.product);
    }
  }
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

/* Card Header */
.card-header {
  position: relative;
  margin-bottom: 16px;
}

.image-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* Badges */
.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  z-index: 2;
}

.new-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #10b981;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  z-index: 2;
}

/* Quick Actions */
.quick-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .quick-actions {
  opacity: 1;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
}

.action-btn:hover {
  background: #3b82f6;
  color: white;
  transform: scale(1.1);
}

/* Card Body */
.card-body {
  flex: 1;
  margin-bottom: 16px;
}

.product-category {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 14px;
  color: #e2e8f0;
}

.star.filled {
  color: #f59e0b;
}

.rating-text {
  font-size: 12px;
  color: #64748b;
}

.product-features {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.feature-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
}

/* Card Footer */
.card-footer {
  margin-top: auto;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #ef4444;
}

.original-price {
  font-size: 14px;
  color: #94a3b8;
  text-decoration: line-through;
}

.installment {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
  margin-bottom: 12px;
}

.add-to-cart-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.cart-icon {
  transition: transform 0.3s ease;
}

.add-to-cart-btn:hover .cart-icon {
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 768px) {
  .product-card {
    padding: 12px;
  }
  
  .quick-actions {
    opacity: 1;
  }
  
  .product-title {
    font-size: 15px;
  }
  
  .current-price {
    font-size: 16px;
  }
  
  .add-to-cart-btn {
    padding: 10px 14px;
    font-size: 14px;
  }
}
</style>