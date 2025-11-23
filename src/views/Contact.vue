<template>
  <div class="contact-page">
    <HeaderComponent />
    
    <!-- Page Header -->
    <section class="page-header">
      <div class="container mx-auto px-4 md:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p class="text-lg md:text-xl leading-relaxed">
            Chúng tôi rất vui được lắng nghe ý kiến, câu hỏi hoặc đề xuất của bạn. 
            Hãy điền form bên dưới hoặc liên hệ trực tiếp với chúng tôi qua thông tin bên dưới.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Info -->
    <ContactInfo />

    <!-- Social Links Section -->
    <section class="social-section">
      <div class="container mx-auto px-4 md:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            Kết nối với chúng tôi trên mạng xã hội
          </h3>
          <div class="social-links">
            <a
              href="https://facebook.com/techstore.fake"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="Facebook của TechStore"
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com/techstore_official"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link instagram"
              aria-label="Instagram của TechStore"
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
          <p class="text-gray-600 mt-4 text-sm">
            Facebook: <a href="https://facebook.com/techstore.fake" target="_blank">facebook.com/techstore.fake</a>
          </p>
          <p class="text-gray-600 text-sm">
            Instagram: <a href="https://instagram.com/techstore_official" target="_blank">@techstore_official</a>
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Form -->
    <ContactForm />

    <!-- Map Section -->
    <section class="map-section">
      <div class="container mx-auto px-4 md:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Vị trí cửa hàng
          </h3>
          <div class="map-wrapper">
            <GoogleMap 
              :address="mapAddress"
              :lat="mapLat"
              :lng="mapLng"
              :zoom="mapZoom"
              :api-key="googleMapsApiKey"
            />
          </div>
          <div class="map-info mt-4">
            <p class="text-gray-600 text-center">
              <strong>Địa chỉ:</strong> {{ mapAddress }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeaderComponent from '../components/HeaderComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import ContactInfo from '../components/contact/ContactInfo.vue'
import ContactForm from '../components/contact/ContactForm.vue'
import GoogleMap from '../components/contact/GoogleMap.vue'

// Google Maps configuration
// LƯU Ý: Thay YOUR_GOOGLE_MAPS_API_KEY bằng API key thật của bạn
// Để lấy API key: https://console.cloud.google.com/google/maps-apis
const googleMapsApiKey = ref('YOUR_GOOGLE_MAPS_API_KEY')

// Địa chỉ cửa hàng
const mapAddress = ref('123 Nguyễn Văn A, Quận 1, TP. Hồ Chí Minh, Việt Nam')

// Tọa độ (Latitude, Longitude) - có thể lấy từ Google Maps
// Hoặc để component tự geocode từ địa chỉ
const mapLat = ref(10.762622) // Ví dụ: Quận 1, HCM
const mapLng = ref(106.660172)
const mapZoom = ref(15)
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  padding-top: 80px;
  background-color: #ffffff;
}

.page-header {
  background: linear-gradient(to right, #2563eb, #1e40af);
  color: white;
  padding: 4rem 1rem;
  text-align: center;
}

@media (min-width: 768px) {
  .page-header {
    padding: 5rem 1.5rem;
  }
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .page-header h1 {
    font-size: 3rem;
  }
}

.page-header p {
  font-size: 1.125rem;
  color: #dbeafe;
  line-height: 1.75;
  max-width: 48rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .page-header p {
    font-size: 1.25rem;
  }
}

.social-section {
  padding: 3rem 1rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
}

.social-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .social-section h3 {
    font-size: 1.875rem;
  }
}

.social-section .social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.social-section .social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #2563eb;
  color: white;
  text-decoration: none;
  transition: all 0.3s;
}

.social-section .social-link:hover {
  transform: scale(1.1);
  background-color: #1d4ed8;
}

.social-section .social-link.instagram {
  background: linear-gradient(to right, #a855f7, #ec4899);
}

.social-section .social-link.instagram:hover {
  background: linear-gradient(to right, #9333ea, #db2777);
}

.social-section .social-link svg {
  width: 1.5rem;
  height: 1.5rem;
}

.social-section p {
  color: #4b5563;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.social-section a {
  color: #2563eb;
  text-decoration: none;
}

.social-section a:hover {
  text-decoration: underline;
}

.map-section {
  padding: 3rem 1rem;
  background-color: #f9fafb;
}

.map-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  text-align: center;
}

@media (min-width: 768px) {
  .map-section h3 {
    font-size: 1.875rem;
  }
}

.map-section .map-wrapper {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 400px;
}

@media (min-width: 768px) {
  .map-section .map-wrapper {
    height: 500px;
  }
}

.map-section .map-info {
  margin-top: 1rem;
}

.map-section .map-info p {
  text-align: center;
  color: #4b7280;
  font-size: 0.875rem;
}

.map-section .map-info strong {
  font-weight: 600;
  color: #111827;
}

@media (max-width: 640px) {
  .contact-page {
    padding-top: 60px;
  }

  .page-header h1 {
    font-size: 1.75rem;
  }

  .page-header,
  .social-section,
  .map-section {
    padding: 2rem 1rem;
  }
}
</style>

