<template>
  <section class="newsletter-section">
    <div class="newsletter-container">
      <!-- Background Pattern -->
      <div class="background-pattern"></div>
      
      <!-- Content -->
      <div class="newsletter-content">
        <div class="text-content">
          <h3 class="newsletter-title">
            Đăng ký nhận thông tin khuyến mãi
          </h3>
          <p class="newsletter-subtitle">
            Nhận ngay voucher <span class="highlight">500.000₫</span> cho đơn hàng đầu tiên
          </p>
          
          <!-- Benefits List -->
          <ul class="benefits-list">
            <li class="benefit-item">
              <svg class="benefit-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Thông tin khuyến mãi sớm nhất
            </li>
            <li class="benefit-item">
              <svg class="benefit-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Ưu đãi đặc biệt cho thành viên
            </li>
            <li class="benefit-item">
              <svg class="benefit-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Có thể hủy đăng ký bất kỳ lúc nào
            </li>
          </ul>
        </div>
        
        <!-- Subscription Form -->
        <div class="subscription-form">
          <div class="input-group">
            <div class="input-wrapper">
              <svg class="email-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input 
                v-model="email"
                type="email" 
                placeholder="Nhập email của bạn"
                class="email-input"
                @keyup.enter="subscribe"
              />
            </div>
            <button 
              class="subscribe-btn"
              :class="{ loading: isLoading }"
              :disabled="isLoading || !isValidEmail"
              @click="subscribe"
            >
              <span v-if="!isLoading" class="btn-text">Đăng ký ngay</span>
              <span v-else class="loading-text">Đang xử lý...</span>
              <svg v-if="!isLoading" class="arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <!-- Privacy Note -->
          <p class="privacy-note">
            Bằng việc đăng ký, bạn đồng ý với 
            <a href="#" class="privacy-link">Điều khoản & Chính sách bảo mật</a>
          </p>
          
          <!-- Success Message -->
          <div v-if="isSubscribed" class="success-message">
            <svg class="success-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Đăng ký thành công! Voucher đã được gửi đến email của bạn.</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default { 
  name: 'Newsletter',
  data() {
    return {
      email: '',
      isLoading: false,
      isSubscribed: false
    }
  },
  computed: {
    isValidEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(this.email);
    }
  },
  methods: {
    async subscribe() {
      if (!this.isValidEmail) return;
      
      this.isLoading = true;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.isLoading = false;
      this.isSubscribed = true;
      this.email = '';
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        this.isSubscribed = false;
      }, 5000);
    }
  }
}
</script>

<style scoped>
.newsletter-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  position: relative;
  overflow: hidden;
}

.newsletter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 2;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  z-index: 1;
}

.newsletter-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

/* Text Content */
.text-content {
  color: white;
}

.newsletter-title {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #60a5fa 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.newsletter-subtitle {
  font-size: 1.125rem;
  color: #cbd5e1;
  margin-bottom: 24px;
  line-height: 1.6;
}

.highlight {
  color: #fbbf24;
  font-weight: 700;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: #e2e8f0;
  font-size: 15px;
}

.benefit-icon {
  color: #10b981;
  flex-shrink: 0;
}

/* Subscription Form */
.subscription-form {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
}

.input-group {
  margin-bottom: 16px;
}

.input-wrapper {
  position: relative;
  margin-bottom: 12px;
}

.email-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.email-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
}

.email-input::placeholder {
  color: #94a3b8;
}

.email-input:focus {
  outline: none;
  border-color: #60a5fa;
  background: rgba(255, 255, 255, 0.15);
}

.subscribe-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.subscribe-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.subscribe-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.subscribe-btn.loading {
  background: linear-gradient(135deg, #64748b, #475569);
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.subscribe-btn:hover:not(:disabled) .arrow-icon {
  transform: translateX(4px);
}

.privacy-note {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  line-height: 1.5;
}

.privacy-link {
  color: #60a5fa;
  text-decoration: none;
}

.privacy-link:hover {
  text-decoration: underline;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  color: #10b981;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .newsletter-content {
    gap: 40px;
  }
  
  .newsletter-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .newsletter-section {
    padding: 60px 0;
  }
  
  .newsletter-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .newsletter-title {
    font-size: 1.75rem;
  }
  
  .subscription-form {
    padding: 24px;
  }
  
  .benefit-item {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .newsletter-container {
    padding: 0 16px;
  }
  
  .newsletter-title {
    font-size: 1.5rem;
  }
  
  .newsletter-subtitle {
    font-size: 1rem;
  }
  
  .subscription-form {
    padding: 20px;
  }
  
  .email-input,
  .subscribe-btn {
    padding: 14px 16px;
  }
}
</style>