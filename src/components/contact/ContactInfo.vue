<template>
  <section class="contact-info py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div
          v-for="(info, index) in contactInfo"
          :key="index"
          class="info-card bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="icon-wrapper mb-4">
            <div class="icon-circle">
              <img 
                :src="info.image" 
                :alt="info.title"
                class="contact-image"
                :class="{ 'hidden': imageErrors[info.imageKey] }"
                @error="handleImageError($event, info.imageKey)"
                @load="imageErrors[info.imageKey] = false"
              />
              <!-- Fallback icon nếu ảnh không load được -->
              <component 
                v-if="imageErrors[info.imageKey]"
                :is="info.icon" 
                class="fallback-icon"
              />
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ info.title }}
          </h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{ info.content }}
          </p>
          <a
            v-if="info.link"
            :href="info.link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2 inline-flex items-center gap-1"
          >
            {{ info.linkText }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Icon components (inline SVG)
const LocationIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `
}

const EmailIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  `
}

const PhoneIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  `
}

const ClockIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

import { ref } from 'vue'

// Tạo reactive state cho image loading
const imageErrors = ref({})

const contactInfo = [
  {
    title: 'Địa chỉ',
    content: '123 Nguyễn Văn A, Quận 1, TP. Hồ Chí Minh',
    icon: LocationIcon,
    image: '/img/articles/Contact/diachi.jpg',
    imageKey: 'diachi'
  },
  {
    title: 'Email',
    content: 'contact@techstore.example',
    icon: EmailIcon,
    image: '/img/articles/Contact/email.jpg',
    imageKey: 'email',
    link: 'mailto:contact@techstore.example',
    linkText: 'Gửi email'
  },
  {
    title: 'Điện thoại',
    content: '+84 912 345 678',
    icon: PhoneIcon,
    image: '/img/articles/Contact/phone.png',
    imageKey: 'phone',
    link: 'tel:+84912345678',
    linkText: 'Gọi ngay'
  },
  {
    title: 'Giờ làm việc',
    content: 'T2–T7: 9:00 – 18:00',
    icon: ClockIcon,
    image: '/img/articles/Contact/timework.png',
    imageKey: 'timework'
  }
]

// Xử lý lỗi khi load ảnh
const handleImageError = (event, imageKey) => {
  imageErrors.value[imageKey] = true
  event.target.style.display = 'none'
}
</script>

<style scoped>
.contact-info {
  padding: 3rem 1rem;
  background-color: #f9fafb;
}

@media (min-width: 768px) {
  .contact-info {
    padding: 4rem 1.5rem;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.info-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  text-align: center;
}

.info-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-4px);
}

/* Icon Circle - Hiển thị icon trong hình tròn đẹp hơn */
.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 3px solid white;
}

.info-card:hover .icon-circle {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.icon-circle {
  overflow: hidden;
}

.contact-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
  border-radius: 50%;
}

.contact-image.hidden {
  display: none;
}

.info-card:hover .contact-image:not(.hidden) {
  transform: scale(1.1);
}

/* Fallback icon nếu ảnh không load được */
.fallback-icon {
  width: 28px;
  height: 28px;
  color: white;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.icon-circle svg {
  width: 28px;
  height: 28px;
  color: white;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.info-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.info-card p {
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 0;
}

.info-card a {
  color: #2563eb;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  transition: color 0.2s;
}

.info-card a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.info-card a svg {
  width: 1rem;
  height: 1rem;
}
</style>

