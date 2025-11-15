<template>
  <section class="hero-banner">
    <div class="hero-container">
      <!-- Content Section -->
      <div class="content-section">
        <div class="eyebrow">
          <span class="eyebrow-text">Khuyến mãi đặc biệt</span>
          <div class="badge">-5 TRIỆU</div>
        </div>
        
        <h1 class="hero-title">
          <span class="title-main">iPhone 15 Pro Max</span>
          <span class="title-sub">Titanium. Mạnh mẽ. Nhẹ. Pro.</span>
        </h1>
        
        <p class="hero-description">
          Trải nghiệm công nghệ đỉnh cao với chip A17 Pro, camera 48MP 
          và thiết kế Titanium sang trọng. Ưu đãi đặc biệt trong tháng này.
        </p>
        
        <div class="cta-section">
          <button class="cta-button primary">
            <span class="cta-text">Mua ngay</span>
            <svg class="cta-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <button class="cta-button secondary">
            <svg class="play-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
            </svg>
            <span>Xem video</span>
          </button>
        </div>
        
        <div class="features">
          <div class="feature-item">
            <div class="feature-icon">✓</div>
            <span>Giao hàng miễn phí</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">✓</div>
            <span>Bảo hành 24 tháng</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">✓</div>
            <span>Trả góp 0%</span>
          </div>
        </div>
      </div>
      
      <!-- Image Section -->
      <div class="image-section">
        <div class="image-container">
          <img 
            :src="image" 
            alt="iPhone 15 Pro Max" 
            class="hero-image"
            loading="eager"
          />
          <div class="floating-badge">
            <div class="badge-content">
              <span class="badge-title">Mới</span>
              <span class="badge-subtitle">2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroBanner',
  props: {
    image: { 
      type: String, 
      default: '/images/iphone-15-pro-max.png' 
    }
  }
}
</script>

<style scoped>
.hero-banner {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 80px 0;
  position: relative;
  overflow: hidden;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

/* Content Section */
.content-section {
  position: relative;
  z-index: 2;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.eyebrow-text {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.hero-title {
  margin-bottom: 20px;
}

.title-main {
  display: block;
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: #1e293b;
  margin-bottom: 8px;
}

.title-sub {
  display: block;
  font-size: 1.25rem;
  color: #64748b;
  font-weight: 500;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 32px;
  max-width: 500px;
}

/* CTA Section */
.cta-section {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.cta-button.primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.cta-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
}

.cta-button.secondary {
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.cta-button.secondary:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.cta-icon, .play-icon {
  transition: transform 0.3s ease;
}

.cta-button:hover .cta-icon {
  transform: translateX(4px);
}

/* Features */
.features {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
}

.feature-icon {
  background: #10b981;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* Image Section */
.image-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container {
  position: relative;
  display: inline-block;
}

.hero-image {
  width: 100%;
  max-width: 500px;
  height: auto;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.1));
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  transition: transform 0.5s ease;
}

.hero-image:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

.floating-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  padding: 12px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.badge-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.badge-title {
  font-size: 12px;
  font-weight: 700;
  color: #ef4444;
  text-transform: uppercase;
}

.badge-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-container {
    gap: 40px;
  }
  
  .title-main {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .hero-banner {
    padding: 60px 0;
  }
  
  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .title-main {
    font-size: 2.5rem;
  }
  
  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }
  
  .cta-section {
    justify-content: center;
  }
  
  .features {
    justify-content: center;
  }
  
  .hero-image {
    max-width: 400px;
    transform: none;
  }
}

@media (max-width: 480px) {
  .hero-container {
    padding: 0 16px;
  }
  
  .title-main {
    font-size: 2rem;
  }
  
  .cta-button {
    padding: 14px 24px;
    font-size: 14px;
  }
  
  .features {
    flex-direction: column;
    gap: 16px;
  }
}
</style>