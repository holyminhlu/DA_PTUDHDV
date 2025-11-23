<template>
  <section class="about-values py-12 md:py-14 bg-gray-50">
    <div class="container mx-auto px-4 md:px-6 lg:px-8">
      <div class="text-center mb-12 md:mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Giá trị cốt lõi của chúng tôi
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Những nguyên tắc định hướng mọi hoạt động và quyết định của TechStore
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        <div
          v-for="(value, index) in values"
          :key="index"
          :ref="el => { if (el) cardRefs[index] = el }"
          class="value-card bg-white rounded-xl shadow-md p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
          :class="{ 'opacity-100 translate-y-0': visibleCards[index], 'opacity-0 translate-y-8': !visibleCards[index] }"
        >
          <div class="icon-wrapper mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600">
            <component :is="value.icon" class="w-8 h-8" />
          </div>
          <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            {{ value.title }}
          </h3>
          <p class="text-gray-600 leading-relaxed">
            {{ value.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visibleCards = ref([false, false, false])
const cardRefs = ref([])
let observers = []

const setupObservers = () => {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all cards after delay
    setTimeout(() => {
      visibleCards.value = [true, true, true]
    }, 200)
    return
  }

  cardRefs.value.forEach((el, index) => {
    if (el) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setTimeout(() => {
              visibleCards.value[index] = true
            }, index * 150)
            observer.unobserve(el)
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(el)
      observers.push(observer)
    }
  })
}

// Icon components (inline SVG)
const TrustIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  `
}

const QualityIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  `
}

const ServiceIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  `
}

const values = [
  {
    title: 'Uy tín & Tin cậy',
    description: 'Chúng tôi cam kết bán hàng minh bạch, chính hãng 100%. Mọi sản phẩm đều được bảo hành chính thức và hỗ trợ đổi trả theo chính sách.',
    icon: TrustIcon
  },
  {
    title: 'Chất lượng cao',
    description: 'Chỉ kinh doanh những sản phẩm đã qua kiểm định chất lượng. Đội ngũ kỹ thuật viên giàu kinh nghiệm luôn sẵn sàng hỗ trợ khách hàng.',
    icon: QualityIcon
  },
  {
    title: 'Dịch vụ tận tâm',
    description: 'Đội ngũ nhân viên chuyên nghiệp, tư vấn nhiệt tình giúp khách hàng chọn được sản phẩm phù hợp nhất với nhu cầu và ngân sách.',
    icon: ServiceIcon
  }
]

onMounted(() => {
  // Wait for DOM to be ready
  setTimeout(() => {
    setupObservers()
  }, 100)
})

onUnmounted(() => {
  observers.forEach(observer => {
    if (observer) observer.disconnect()
  })
  observers = []
})
</script>

<style scoped>
.value-card {
  transition-delay: 0s;
}

/* Fallback styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.grid {
  display: grid;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-white {
  background-color: white;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

@media (min-width: 768px) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>

