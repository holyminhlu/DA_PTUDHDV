# Hướng dẫn sử dụng trang Giới thiệu và Liên hệ

## Tổng quan

Dự án đã được tích hợp hai trang mới:
- **Trang Giới thiệu (About.vue)** - `/about`
- **Trang Liên hệ (Contact.vue)** - `/contact`

Các trang này sử dụng Vue 2.7 với Composition API (`<script setup>`) và được thiết kế responsive với Tailwind CSS classes (có fallback styles nếu Tailwind chưa được cấu hình).

## Cấu trúc Component

### Trang Giới thiệu (About.vue)

**Location:** `src/views/About.vue`

**Components:**
- `AboutHero.vue` - Hero banner với tiêu đề, mô tả và button điều hướng tới Contact
- `AboutValues.vue` - Hiển thị 3 giá trị cốt lõi của cửa hàng
- `TeamGrid.vue` - Grid hiển thị 4 thành viên team

**Các section:**
1. Hero Section - Banner giới thiệu chính
2. Mission Section - Sứ mệnh của cửa hàng
3. Values Section - 3 giá trị cốt lõi
4. Team Section - Đội ngũ nhân viên
5. Story Section - Câu chuyện phát triển
6. CTA Section - Call-to-action điều hướng tới Contact

### Trang Liên hệ (Contact.vue)

**Location:** `src/views/Contact.vue`

**Components:**
- `ContactInfo.vue` - Hiển thị thông tin liên hệ (địa chỉ, email, điện thoại, giờ làm việc)
- `ContactForm.vue` - Form liên hệ với validation đầy đủ

**Các section:**
1. Page Header - Tiêu đề và mô tả trang
2. Contact Info - Thông tin liên hệ với icons
3. Social Links - Liên kết mạng xã hội (Facebook, Instagram)
4. Contact Form - Form gửi tin nhắn
5. Map Section - Placeholder cho bản đồ

## Router Configuration

Router đã được cập nhật tại `src/routes/index.js`:

```javascript
{ path: '/about', name: 'about', component: About },
{ path: '/contact', name: 'contact', component: Contact }
```

## Truy cập các trang

### Phát triển (Development)
```bash
npm run serve
```

Sau đó truy cập:
- Trang Giới thiệu: `http://localhost:8080/about`
- Trang Liên hệ: `http://localhost:8080/contact`

### Trong ứng dụng

Các link điều hướng có sẵn trong Header navigation:
- Menu "Giới thiệu" → `/about`
- Menu "Liên hệ" → `/contact`

Hoặc sử dụng Vue Router programmatically:
```javascript
this.$router.push('/about')
this.$router.push('/contact')
```

## Form Validation (ContactForm)

Form liên hệ có các validation sau:

### Required Fields:
- **Họ và tên** - Bắt buộc nhập
- **Email** - Bắt buộc, phải đúng định dạng email
- **Chủ đề** - Bắt buộc nhập
- **Tin nhắn** - Bắt buộc, tối thiểu 20 ký tự

### Optional Fields:
- **Số điện thoại** - Không bắt buộc

### Validation Rules:
- Email: Kiểm tra định dạng email hợp lệ
- Message: Tối thiểu 20 ký tự
- Hiển thị lỗi ngay khi người dùng nhập sai

### Submit Flow:
1. Validate tất cả các trường
2. Hiển thị trạng thái "Đang gửi..." (1.5 giây)
3. Nếu thành công:
   - Hiển thị message thành công
   - Reset form
   - Clear message sau 5 giây
4. Nếu lỗi: Hiển thị message lỗi

**Lưu ý:** Form hiện tại giả lập submit (không có backend thật). Khi có backend, cần cập nhật logic trong `handleSubmit()` của `ContactForm.vue`.

## Responsive Design

Tất cả các component đã được thiết kế responsive:

- **Mobile (≤640px)**: Layout 1 cột, padding giảm, font size nhỏ hơn
- **Tablet (768px - 1024px)**: Layout 2 cột cho grid
- **Desktop (>1024px)**: Layout đầy đủ, 3-4 cột cho grid

## Accessibility (ARIA)

Các component đã được tích hợp ARIA labels:

- Form inputs có `label` và `aria-label`
- Buttons có `aria-label` mô tả hành động
- Error messages có `aria-describedby`
- Success/Error alerts có `role="alert"` và `aria-live="polite"`

## Thông tin liên hệ mặc định

Thông tin liên hệ hiện tại (trong `ContactInfo.vue`):

- **Tên cửa hàng:** TechStore
- **Địa chỉ:** 123 Nguyễn Văn A, Quận 1, TP. Hồ Chí Minh
- **Email:** contact@techstore.example
- **Điện thoại:** +84 912 345 678
- **Giờ làm việc:** T2–T7: 9:00 – 18:00
- **Facebook:** facebook.com/techstore.fake
- **Instagram:** @techstore_official

## Tích hợp Backend (khi có)

Khi có backend thật, cần cập nhật:

### 1. ContactForm.vue - handleSubmit()

Thay thế logic giả lập bằng API call thật:

```javascript
const handleSubmit = async () => {
  if (!validate()) return
  
  isSubmitting.value = true
  
  try {
    const response = await axios.post('/api/contact', {
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message
    })
    
    if (response.data.success) {
      successMessage.value = 'Cảm ơn bạn đã liên hệ!'
      resetForm()
    }
  } catch (error) {
    errorMessage.value = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
  } finally {
    isSubmitting.value = false
  }
}
```

### 2. Cập nhật thông tin liên hệ

Có thể lấy thông tin liên hệ từ API thay vì hardcode:

```javascript
// Trong ContactInfo.vue
import { ref, onMounted } from 'vue'
import axios from 'axios'

const contactInfo = ref([])

onMounted(async () => {
  const response = await axios.get('/api/contact-info')
  contactInfo.value = response.data
})
```

## Animations

Các component sử dụng Intersection Observer để kích hoạt animations khi scroll vào view:

- **AboutHero**: Fade in từ dưới lên
- **AboutValues**: Fade in tuần tự với delay
- **TeamGrid**: Fade in tuần tự với delay

Nếu trình duyệt không hỗ trợ Intersection Observer, components sẽ fallback về animation đơn giản khi mount.

## Tailwind CSS

Các component sử dụng Tailwind CSS classes. Nếu Tailwind chưa được cấu hình trong project:

1. **Cài đặt Tailwind CSS:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. **Cấu hình Tailwind** (`tailwind.config.js`):
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. **Thêm vào CSS chính:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Lưu ý:** Các component đã có fallback CSS inline trong `<style scoped>` để hoạt động ngay cả khi chưa có Tailwind.

## Troubleshooting

### Component không hiển thị
- Kiểm tra router đã import đúng component
- Kiểm tra đường dẫn import trong các component

### Form validation không hoạt động
- Kiểm tra console để xem có lỗi JavaScript
- Đảm bảo Vue 2.7 đã được cài đặt đúng

### Animations không chạy
- Đảm bảo Intersection Observer được hỗ trợ (hầu hết trình duyệt hiện đại đều hỗ trợ)
- Kiểm tra CSS transitions đã được định nghĩa

### Styles không áp dụng
- Nếu dùng Tailwind: Đảm bảo Tailwind đã được cấu hình và compile
- Nếu không dùng Tailwind: Các fallback styles trong `<style scoped>` sẽ được sử dụng

## Cấu trúc File

```
src/
├── views/
│   ├── About.vue          # Trang giới thiệu chính
│   └── Contact.vue        # Trang liên hệ chính
├── components/
│   ├── about/
│   │   ├── AboutHero.vue  # Hero banner
│   │   ├── AboutValues.vue # Giá trị cốt lõi
│   │   └── TeamGrid.vue    # Grid đội ngũ
│   └── contact/
│       ├── ContactInfo.vue # Thông tin liên hệ
│       └── ContactForm.vue # Form liên hệ
└── routes/
    └── index.js           # Router config (đã cập nhật)
```

## Notes

- Tất cả components sử dụng Vue 2.7 với Composition API (`<script setup>`)
- Icons sử dụng inline SVG để không phụ thuộc thư viện bên ngoài
- Form submission hiện tại là giả lập, cần tích hợp backend khi có
- Các thông tin liên hệ có thể được chuyển sang API khi có backend

