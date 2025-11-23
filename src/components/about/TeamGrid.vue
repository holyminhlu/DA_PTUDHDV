<template>
  <section class="team-grid py-12 md:py-14 bg-white">
    <div class="container mx-auto px-4 md:px-6 lg:px-8">
      <div class="text-center mb-12 md:mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Đội ngũ của chúng tôi
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Những con người tài năng đang làm việc cùng nhau để mang lại trải nghiệm tốt nhất cho khách hàng
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        <div
          v-for="(member, index) in teamMembers"
          :key="index"
          :ref="el => { if (el) cardRefs[index] = el }"
          class="team-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
          :class="{ 'opacity-100 translate-y-0': visibleCards[index], 'opacity-0 translate-y-8': !visibleCards[index] }"
        >
          <div class="avatar-wrapper relative h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                {{ member.avatar }}
              </div>
            </div>
          </div>
          <div class="p-6 text-center">
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ member.name }}
            </h3>
            <p class="text-blue-600 font-semibold mb-3">
              {{ member.role }}
            </p>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ member.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visibleCards = ref([false, false, false, false])
const cardRefs = ref([])
let observers = []

const setupObservers = () => {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all cards after delay
    setTimeout(() => {
      visibleCards.value = [true, true, true, true]
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
            }, index * 100)
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

const teamMembers = [
  {
    name: 'Nguyễn Văn An',
    role: 'Giám đốc điều hành',
    avatar: 'NA',
    description: 'Với hơn 15 năm kinh nghiệm trong ngành công nghệ, anh An đã dẫn dắt TechStore trở thành một trong những cửa hàng điện tử hàng đầu.'
  },
  {
    name: 'Trần Thị Bình',
    role: 'Trưởng phòng Kinh doanh',
    avatar: 'TB',
    description: 'Chuyên gia về sản phẩm công nghệ và quan hệ khách hàng, chị Bình luôn đảm bảo khách hàng nhận được sản phẩm tốt nhất.'
  },
  {
    name: 'Lê Minh Cường',
    role: 'Kỹ thuật viên trưởng',
    avatar: 'LC',
    description: 'Với kiến thức sâu rộng về công nghệ, anh Cường đảm bảo mọi sản phẩm đều được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.'
  },
  {
    name: 'Phạm Thị Dung',
    role: 'Trưởng phòng Chăm sóc khách hàng',
    avatar: 'PD',
    description: 'Luôn tận tâm với khách hàng, chị Dung đảm bảo mọi thắc mắc và yêu cầu của khách hàng đều được giải quyết nhanh chóng.'
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
/* Fallback styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.grid {
  display: grid;
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

.bg-gradient-to-br {
  background: linear-gradient(to bottom right, #dbeafe, #bfdbfe);
}

@media (min-width: 640px) {
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>

