<template>
  <div class="google-map-container">
    <!-- Sử dụng Google Maps Embed (iframe) - không cần API key -->
    <div v-if="useEmbedMap" class="map-embed-wrapper">
      <iframe
        :src="embedMapUrlSimple"
        class="map-embed"
        frameborder="0"
        style="border:0"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="Vị trí TechStore"
      ></iframe>
    </div>
    
    <!-- Sử dụng JavaScript API (cần API key) -->
    <template v-else>
      <div ref="mapContainer" class="map-container"></div>
      <div v-if="!isLoaded && !error" class="map-loading">
        <div class="loading-spinner"></div>
        <p>Đang tải bản đồ...</p>
      </div>
      <div v-if="error && !isLoaded" class="map-error">
        <div class="error-content">
          <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="error-title">Không thể tải bản đồ</p>
          <p class="error-message">
            <span v-if="!props.apiKey || props.apiKey === 'YOUR_GOOGLE_MAPS_API_KEY' || props.apiKey.trim() === ''">
              Vui lòng cấu hình Google Maps API key trong file <code>Contact.vue</code>
            </span>
            <span v-else>
              Vui lòng kiểm tra API key hoặc thử lại sau.
            </span>
          </p>
          <p class="error-address">
            <strong>Địa chỉ:</strong> {{ address }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  address: {
    type: String,
    default: '123 Nguyễn Văn A, Quận 1, TP. Hồ Chí Minh, Việt Nam'
  },
  lat: {
    type: Number,
    default: 10.762622
  },
  lng: {
    type: Number,
    default: 106.660172
  },
  zoom: {
    type: Number,
    default: 15
  },
  apiKey: {
    type: String,
    default: '' // Cần thay bằng Google Maps API key thật
  },
  useEmbed: {
    type: Boolean,
    default: true // Mặc định sử dụng embed map (không cần API key)
  }
})

const mapContainer = ref(null)
const isLoaded = ref(false)
const error = ref(false)
let map = null
let marker = null
let geocoder = null

// Kiểm tra xem có nên dùng embed map hay không
const useEmbedMap = computed(() => {
  // Nếu có API key và không muốn dùng embed, dùng JavaScript API
  const hasValidApiKey = props.apiKey && 
    props.apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' && 
    props.apiKey.trim() !== ''
  
  // Nếu không có API key hoặc muốn dùng embed, dùng embed map
  return props.useEmbed || !hasValidApiKey
})

// Tạo URL cho Google Maps Embed (iframe) - Cách đơn giản nhất, không cần API key
const embedMapUrl = computed(() => {
  // Sử dụng tọa độ trực tiếp - đơn giản và chính xác nhất
  // Format: lat,lng
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1223666111444!2d${props.lng}!3d${props.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${Math.floor(props.lat)}%C2%B0${Math.floor((props.lat % 1) * 60)}\'N!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s&z=${props.zoom}`
})

// Hoặc dùng cách đơn giản hơn với địa chỉ
const embedMapUrlSimple = computed(() => {
  const encodedAddress = encodeURIComponent(props.address)
  return `https://www.google.com/maps?q=${encodedAddress}&output=embed`
})

const initMap = () => {
  if (!window.google || !window.google.maps) {
    error.value = true
    return
  }

  try {
    // Khởi tạo map
    map = new window.google.maps.Map(mapContainer.value, {
      center: { lat: props.lat, lng: props.lng },
      zoom: props.zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    })

    // Tạo marker
    marker = new window.google.maps.Marker({
      position: { lat: props.lat, lng: props.lng },
      map: map,
      title: props.address,
      animation: window.google.maps.Animation.DROP
    })

    // Tạo info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 10px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">TechStore</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">${props.address}</p>
        </div>
      `
    })

    marker.addListener('click', () => {
      infoWindow.open(map, marker)
    })

    // Mở info window mặc định
    infoWindow.open(map, marker)

    // Khởi tạo geocoder để có thể tìm kiếm địa chỉ
    geocoder = new window.google.maps.Geocoder()

    isLoaded.value = true
    error.value = false
  } catch (err) {
    console.error('Error initializing map:', err)
    error.value = true
  }
}

const loadGoogleMapsScript = () => {
  // Nếu dùng embed map, không cần load JavaScript API
  if (useEmbedMap.value) {
    isLoaded.value = true
    return
  }

  // Kiểm tra xem script đã được load chưa
  if (window.google && window.google.maps) {
    initMap()
    return
  }

  // Kiểm tra xem script tag đã tồn tại chưa
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
  if (existingScript) {
    existingScript.addEventListener('load', initMap)
    // Nếu script đã load xong, gọi initMap ngay
    if (window.google && window.google.maps) {
      initMap()
    }
    return
  }

  // Kiểm tra API key
  const currentApiKey = props.apiKey && props.apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' && props.apiKey.trim() !== ''
    ? props.apiKey 
    : null

  if (!currentApiKey) {
    // Nếu không có API key, hiển thị thông báo
    setTimeout(() => {
      error.value = true
      isLoaded.value = false
      console.warn('Google Maps API key chưa được cấu hình. Vui lòng thêm API key vào Contact.vue')
    }, 500)
    return
  }

  // Tạo script tag mới
  const script = document.createElement('script')
  
  script.src = `https://maps.googleapis.com/maps/api/js?key=${currentApiKey}&libraries=places&callback=initGoogleMap`
  script.async = true
  script.defer = true
  script.onerror = () => {
    error.value = true
    isLoaded.value = false
    console.error('Failed to load Google Maps script. Vui lòng kiểm tra API key.')
  }

  // Tạo callback function global
  window.initGoogleMap = () => {
    try {
      initMap()
    } catch (err) {
      error.value = true
      isLoaded.value = false
      console.error('Error initializing Google Maps:', err)
    }
    delete window.initGoogleMap
  }

  document.head.appendChild(script)
}

onMounted(() => {
  loadGoogleMapsScript()
})

onUnmounted(() => {
  if (map) {
    map = null
  }
  if (marker) {
    marker = null
  }
  if (geocoder) {
    geocoder = null
  }
})
</script>

<style scoped>
.google-map-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 0.75rem;
  overflow: hidden;
  position: relative;
  background-color: #e5e7eb;
}

/* Đảm bảo map container hiển thị */
.map-container:empty {
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-container:empty::after {
  content: 'Đang tải bản đồ...';
  color: #6b7280;
  font-size: 0.875rem;
}

/* Google Maps Embed (iframe) - Không cần API key */
.map-embed-wrapper {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 0.75rem;
  overflow: hidden;
  position: relative;
}

.map-embed {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: none;
  display: block;
}

@media (min-width: 768px) {
  .map-embed-wrapper,
  .map-embed {
    min-height: 500px;
  }
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  border-radius: 0.75rem;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.map-loading p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.map-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  z-index: 10;
  padding: 1rem;
}

.map-error {
  background-color: #fef3f2;
  border: 2px dashed #fca5a5;
}

.error-content {
  text-align: center;
  padding: 2rem 1rem;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #ef4444;
  margin: 0 auto 1rem;
  display: block;
}

.error-title {
  color: #dc2626;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.error-message {
  color: #7f1d1d;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.error-message code {
  background-color: #fee2e2;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.75rem;
  color: #991b1b;
}

.error-address {
  color: #4b5563;
  font-size: 0.875rem;
  margin: 1rem 0 0 0;
}

.error-address strong {
  color: #111827;
  font-weight: 600;
}

@media (min-width: 768px) {
  .google-map-container,
  .map-container {
    min-height: 500px;
  }
}
</style>

