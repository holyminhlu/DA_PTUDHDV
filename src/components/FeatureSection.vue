<template>
  <section class="features">
    <div class="feature">
      <div class="feature-icon">🔒</div>
      <h4>Hàng chính hãng</h4>
      <p>100% sản phẩm chính hãng, có tem bảo hành</p>
    </div>
    <div class="feature">
      <div class="feature-icon">🚚</div>
      <h4>Giao hàng nhanh</h4>
      <p>Giao hàng miễn phí trong 2 giờ tại TP.HCM</p>
    </div>
    <div class="feature">
      <div class="feature-icon">🔧</div>
      <h4>Bảo hành uy tín</h4>
      <p>Bảo hành 12 tháng, đổi trả trong 30 ngày</p>
    </div>
  </section>
</template>

<script>
export default { name: 'FeatureSection' }
</script>

<style scoped>
.features {
  padding: 80px 24px;
  background: #f8fafc;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature {
  text-align: center;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.feature:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 16px;
  display: inline-block;
}

.feature h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 12px 0 8px;
}

.feature p {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .features {
    padding: 60px 16px;
    gap: 30px;
  }
  
  .feature {
    padding: 20px;
  }
  
  .feature-icon {
    font-size: 28px;
  }
  
  .feature h4 {
    font-size: 1rem;
  }
}
</style>
