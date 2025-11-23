<template>
  <section class="about-hero relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 md:py-28">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml;utf8,<svg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><pattern id=\"grid\" width=\"40\" height=\"40\" patternUnits=\"userSpaceOnUse\"><path d=\"M 40 0 L 0 0 0 40\" fill=\"none\" stroke=\"white\" stroke-width=\"1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grid)\"/></svg>');"></div>
    </div>
    
    <div class="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <div 
          ref="heroContent"
          class="hero-content transition-all"
          :class="{ 'visible': isVisible }"
        >
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Chào mừng đến với TechStore
          </h1>
          <p class="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi là đối tác tin cậy của bạn trong hành trình khám phá công nghệ. 
            Với hơn 10 năm kinh nghiệm, TechStore cam kết mang đến những sản phẩm công nghệ 
            chính hãng, chất lượng cao với giá cả hợp lý nhất.
          </p>
          <router-link
            to="/contact"
            class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300"
            aria-label="Liên hệ với chúng tôi"
          >
            <span>Liên hệ ngay</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
const heroContent = ref(null)
let observer = null

onMounted(() => {
  // Use Intersection Observer for animation
  if (heroContent.value && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisible.value = true
          if (observer) observer.unobserve(heroContent.value)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(heroContent.value)
  } else {
    // Fallback: show immediately
    setTimeout(() => {
      isVisible.value = true
    }, 100)
  }
})

onUnmounted(() => {
  if (observer && heroContent.value) {
    observer.unobserve(heroContent.value)
  }
})
</script>

<style scoped>
.about-hero {
  min-height: 380px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to bottom right, #2563eb, #1e40af, #1e3a8a);
  color: white;
  padding: 3.5rem 1rem;
}

@media (min-width: 768px) {
  .about-hero {
    min-height: 420px;
    padding: 4rem 1.5rem;
  }
}

.about-hero .pattern-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
}

.about-hero .container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 10;
}

.about-hero .hero-content {
  max-width: 56rem;
  margin: 0 auto;
  text-align: center;
}

.about-hero .hero-content.visible {
  opacity: 1;
  transform: translateY(0);
}

.about-hero .hero-content:not(.visible) {
  opacity: 0;
  transform: translateY(2.5rem);
}

.about-hero h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.25;
}

@media (min-width: 768px) {
  .about-hero h1 {
    font-size: 3rem;
  }
}

@media (min-width: 1024px) {
  .about-hero h1 {
    font-size: 3.75rem;
  }
}

.about-hero p {
  font-size: 1.125rem;
  color: #dbeafe;
  margin-bottom: 2rem;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.75;
}

@media (min-width: 768px) {
  .about-hero p {
    font-size: 1.25rem;
  }
}

.about-hero .cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #f97316;
  color: white;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.3s;
}

.about-hero .cta-button:hover {
  background: #ea580c;
  transform: scale(1.05);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.about-hero .cta-button svg {
  width: 1.25rem;
  height: 1.25rem;
}

.transition-all {
  transition-property: all;
  transition-duration: 700ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 640px) {
  .about-hero {
    min-height: 400px;
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  .about-hero h1 {
    font-size: 1.875rem;
  }

  .about-hero p {
    font-size: 1rem;
  }
}
</style>

