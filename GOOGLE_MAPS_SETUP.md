# Hướng dẫn cấu hình Google Maps API

## Bước 1: Lấy Google Maps API Key

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo một project mới hoặc chọn project hiện có
3. Vào **APIs & Services** > **Library**
4. Tìm và bật các API sau:
   - **Maps JavaScript API**
   - **Geocoding API** (nếu cần geocode địa chỉ)
   - **Places API** (nếu cần tìm kiếm địa chỉ)

5. Vào **APIs & Services** > **Credentials**
6. Click **Create Credentials** > **API Key**
7. Copy API key được tạo

## Bước 2: Cấu hình API Key trong project

Mở file `src/views/Contact.vue` và tìm dòng:

```javascript
const googleMapsApiKey = ref('YOUR_GOOGLE_MAPS_API_KEY')
```

Thay `YOUR_GOOGLE_MAPS_API_KEY` bằng API key thật của bạn:

```javascript
const googleMapsApiKey = ref('AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
```

## Bước 3: (Tùy chọn) Bảo mật API Key

Để bảo mật hơn, bạn có thể:

1. Tạo file `.env` trong thư mục gốc project:
```env
VUE_APP_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

2. Cập nhật `Contact.vue`:
```javascript
const googleMapsApiKey = ref(process.env.VUE_APP_GOOGLE_MAPS_API_KEY || '')
```

3. Thêm `.env` vào `.gitignore` để không commit API key lên git

## Bước 4: Giới hạn API Key (Khuyến nghị)

1. Vào **APIs & Services** > **Credentials**
2. Click vào API key của bạn
3. Trong phần **Application restrictions**, chọn **HTTP referrers**
4. Thêm domain của bạn (ví dụ: `localhost:8080/*`, `yourdomain.com/*`)
5. Lưu lại

## Cấu hình tọa độ địa chỉ

Để chỉnh sửa tọa độ hoặc địa chỉ hiển thị trên bản đồ, cập nhật trong `Contact.vue`:

```javascript
// Địa chỉ cửa hàng
const mapAddress = ref('123 Nguyễn Văn A, Quận 1, TP. Hồ Chí Minh, Việt Nam')

// Tọa độ (Latitude, Longitude)
const mapLat = ref(10.762622) // Latitude
const mapLng = ref(106.660172) // Longitude
const mapZoom = ref(15) // Mức zoom (1-20)
```

Để lấy tọa độ chính xác:
1. Mở [Google Maps](https://www.google.com/maps)
2. Tìm địa chỉ của bạn
3. Click chuột phải vào vị trí > Chọn tọa độ
4. Copy latitude và longitude

## Lưu ý

- Google Maps API có hạn mức sử dụng miễn phí. Nếu vượt quá sẽ tính phí.
- Kiểm tra billing trong Google Cloud Console để tránh chi phí ngoài ý muốn.
- Nếu không có API key, component sẽ hiển thị thông báo lỗi nhưng không crash ứng dụng.

## Xử lý lỗi

Nếu bản đồ không hiển thị:
1. Kiểm tra API key đã đúng chưa
2. Kiểm tra các API đã được bật chưa
3. Kiểm tra console browser để xem lỗi cụ thể
4. Kiểm tra billing account đã được kích hoạt chưa

