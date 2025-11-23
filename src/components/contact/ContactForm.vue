<template>
  <section class="contact-form py-12 md:py-16 bg-gray-50">
    <div class="container mx-auto px-4 md:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-8 md:p-10">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Gửi tin nhắn cho chúng tôi
          </h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Name Field -->
            <div>
              <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                Họ và tên <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all',
                  errors.name ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300 focus:border-blue-500'
                ]"
                placeholder="Nhập họ và tên của bạn"
                aria-label="Họ và tên"
                aria-invalid="true"
                aria-describedby="name-error"
              />
              <p v-if="errors.name" id="name-error" class="mt-1 text-sm text-red-600">
                {{ errors.name }}
              </p>
            </div>

            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all',
                  errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300 focus:border-blue-500'
                ]"
                placeholder="example@email.com"
                aria-label="Địa chỉ email"
                aria-invalid="true"
                aria-describedby="email-error"
              />
              <p v-if="errors.email" id="email-error" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>

            <!-- Phone Field (Optional) -->
            <div>
              <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                placeholder="+84 912 345 678"
                aria-label="Số điện thoại (tùy chọn)"
              />
            </div>

            <!-- Subject Field -->
            <div>
              <label for="subject" class="block text-sm font-semibold text-gray-700 mb-2">
                Chủ đề <span class="text-red-500">*</span>
              </label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all',
                  errors.subject ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300 focus:border-blue-500'
                ]"
                placeholder="Tiêu đề tin nhắn"
                aria-label="Chủ đề tin nhắn"
                aria-invalid="true"
                aria-describedby="subject-error"
              />
              <p v-if="errors.subject" id="subject-error" class="mt-1 text-sm text-red-600">
                {{ errors.subject }}
              </p>
            </div>

            <!-- Message Field -->
            <div>
              <label for="message" class="block text-sm font-semibold text-gray-700 mb-2">
                Tin nhắn <span class="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="6"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none',
                  errors.message ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300 focus:border-blue-500'
                ]"
                placeholder="Nhập tin nhắn của bạn (tối thiểu 20 ký tự)"
                aria-label="Nội dung tin nhắn"
                aria-invalid="true"
                aria-describedby="message-error"
              ></textarea>
              <p v-if="errors.message" id="message-error" class="mt-1 text-sm text-red-600">
                {{ errors.message }}
              </p>
              <p class="mt-1 text-xs text-gray-500">
                Đã nhập: {{ form.message.length }} ký tự
              </p>
            </div>

            <!-- Success Message -->
            <div
              v-if="successMessage"
              class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2"
              role="alert"
              aria-live="polite"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ successMessage }}</span>
            </div>

            <!-- Error Message -->
            <div
              v-if="errorMessage"
              class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2"
              role="alert"
              aria-live="polite"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              aria-label="Gửi tin nhắn"
            >
              <span v-if="!isSubmitting">Gửi tin nhắn</span>
              <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang gửi...
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validate = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  // Validate name
  if (!form.name.trim()) {
    errors.name = 'Vui lòng nhập họ và tên'
    isValid = false
  }
  
  // Validate email
  if (!form.email.trim()) {
    errors.email = 'Vui lòng nhập địa chỉ email'
    isValid = false
  } else if (!validateEmail(form.email)) {
    errors.email = 'Địa chỉ email không hợp lệ'
    isValid = false
  }
  
  // Validate subject
  if (!form.subject.trim()) {
    errors.subject = 'Vui lòng nhập chủ đề'
    isValid = false
  }
  
  // Validate message
  if (!form.message.trim()) {
    errors.message = 'Vui lòng nhập tin nhắn'
    isValid = false
  } else if (form.message.trim().length < 20) {
    errors.message = 'Tin nhắn phải có ít nhất 20 ký tự'
    isValid = false
  }
  
  return isValid
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.subject = ''
  form.message = ''
  successMessage.value = ''
  errorMessage.value = ''
}

const handleSubmit = async () => {
  // Clear previous messages
  successMessage.value = ''
  errorMessage.value = ''
  
  // Validate form
  if (!validate()) {
    return
  }
  
  // Set submitting state
  isSubmitting.value = true
  
  try {
    // Simulate API call with setTimeout
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate success/error (90% success rate for demo)
    const isSuccess = Math.random() > 0.1
    
    if (isSuccess) {
      successMessage.value = 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'
      resetForm()
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    } else {
      errorMessage.value = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
    }
  } catch (error) {
    errorMessage.value = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Fallback styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
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

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

