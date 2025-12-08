# 🛒 Cart API - Hướng dẫn sử dụng

## 📋 Tổng quan

Cart APIs cho phép quản lý giỏ hàng của người dùng bao gồm: thêm sản phẩm, xem giỏ hàng, cập nhật số lượng, và xóa sản phẩm.

## 🚀 Cài đặt

### Bước 1: Cài đặt axios cho auth-service

```bash
cd DA_PTUDHDV/server/auth-service
npm install
```

### Bước 2: Khởi động các services

**Terminal 1 - Auth Service (port 3002):**
```bash
cd DA_PTUDHDV/server/auth-service
npm start
```

**Terminal 2 - Product Service (port 3001):**
```bash
cd DA_PTUDHDV/server/product-service
npm start
```

**Terminal 3 - API Gateway (port 3000):**
```bash
cd DA_PTUDHDV/server/api-gateway
npm start
```

## 📖 API Endpoints

### 1. POST /api/cart/add - Thêm sản phẩm vào giỏ hàng

**Endpoint:** `POST http://localhost:3000/api/cart/add`

**Request Body:**
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "product_id": "6936297a701665210edbd101",
  "quantity": 2
}
```

**✅ Response Success (200):**
```json
{
  "status": "success",
  "message": "Đã thêm vào giỏ hàng",
  "cart_item": {
    "product_id": "6936297a701665210edbd101",
    "productId": 1,
    "product_name": "iPhone 15 Pro Max 256GB",
    "quantity": 2
  }
}
```

**❌ Error Responses:**

**Sản phẩm hết hàng (400):**
```json
{
  "status": "error",
  "message": "Sản phẩm hết hàng",
  "available_stock": 0,
  "requested": 2
}
```

**Người dùng không tồn tại (404):**
```json
{
  "status": "error",
  "message": "Người dùng không tồn tại"
}
```

**Sản phẩm không tồn tại (404):**
```json
{
  "status": "error",
  "message": "Sản phẩm không tồn tại"
}
```

---

### 2. GET /api/cart/:user_id - Xem giỏ hàng

**Endpoint:** `GET http://localhost:3000/api/cart/507f1f77bcf86cd799439011`

**✅ Response Success - Có sản phẩm (200):**
```json
{
  "status": "success",
  "user_id": "507f1f77bcf86cd799439011",
  "items": [
    {
      "product_id": 1,
      "product_name": "iPhone 15 Pro Max 256GB",
      "price": 29990000,
      "quantity": 1,
      "total": 29990000,
      "image": "/img/articles/product-1.jpg"
    },
    {
      "product_id": 2,
      "product_name": "Samsung Galaxy S24 Ultra 512GB",
      "price": 27990000,
      "quantity": 2,
      "total": 55980000,
      "image": "/img/articles/product-2.jpg"
    }
  ],
  "cart_total": 85970000
}
```

**✅ Response Success - Giỏ rỗng (200):**
```json
{
  "status": "success",
  "message": "Giỏ hàng trống",
  "user_id": "507f1f77bcf86cd799439011",
  "items": [],
  "cart_total": 0
}
```

**❌ Error - Người dùng không tồn tại (404):**
```json
{
  "status": "error",
  "message": "Không tìm thấy người dùng"
}
```

---

### 3. PUT /api/cart/update - Cập nhật số lượng

**Endpoint:** `PUT http://localhost:3000/api/cart/update`

**Request Body:**
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "product_id": "6936297a701665210edbd101",
  "quantity": 3
}
```

**✅ Response Success (200):**
```json
{
  "status": "success",
  "message": "Đã cập nhật số lượng",
  "product_id": "6936297a701665210edbd101",
  "quantity": 3
}
```

**❌ Error Responses:**

**Sản phẩm không có trong giỏ (404):**
```json
{
  "status": "error",
  "message": "Sản phẩm không có trong giỏ hàng"
}
```

**Không đủ hàng trong kho (400):**
```json
{
  "status": "error",
  "message": "Không đủ hàng trong kho",
  "available_stock": 1,
  "requested": 3
}
```

**💡 Tip:** Đặt `quantity: 0` để xóa sản phẩm khỏi giỏ.

---

### 4. DELETE /api/cart/delete - Xóa sản phẩm

**Endpoint:** `DELETE http://localhost:3000/api/cart/delete`

**Request Body:**
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "product_id": "6936297a701665210edbd101"
}
```

**✅ Response Success (200):**
```json
{
  "status": "success",
  "message": "Đã xóa sản phẩm khỏi giỏ"
}
```

**❌ Error Responses:**

**Sản phẩm không có trong giỏ (404):**
```json
{
  "status": "error",
  "message": "Không tìm thấy sản phẩm trong giỏ hàng"
}
```

**Người dùng không tồn tại (404):**
```json
{
  "status": "error",
  "message": "Người dùng không tồn tại"
}
```

---

## 🧪 Test với Swagger UI

1. Mở Swagger UI: **http://localhost:3000/api-docs**
2. Tìm section **Cart** 
3. Test các endpoints:

### Test Flow:

1. **Đăng nhập để lấy user_id:**
   - POST `/api/auth/login`
   - Lưu lại user_id từ response

2. **Thêm sản phẩm vào giỏ:**
   - POST `/api/cart/add`
   - Body: user_id, product_id (lấy từ `/api/products`), quantity

3. **Xem giỏ hàng:**
   - GET `/api/cart/{user_id}`

4. **Cập nhật số lượng:**
   - PUT `/api/cart/update`

5. **Xóa sản phẩm:**
   - DELETE `/api/cart/delete`

---

## 📊 Database Schema

### Collection: `carts`

```javascript
{
  "_id": ObjectId,
  "user_id": ObjectId, // Tham chiếu đến User
  "items": [
    {
      "product_id": ObjectId, // Tham chiếu đến Phone
      "productId": Number,     // ID số của product
      "product_name": String,
      "price": Number,
      "quantity": Number,
      "image": String
    }
  ],
  "updated_at": Date,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 🔄 Business Logic

### Thêm sản phẩm vào giỏ:

1. ✅ Validate input (user_id, product_id, quantity)
2. ✅ Kiểm tra user có tồn tại không
3. ✅ Lấy thông tin sản phẩm từ product-service
4. ✅ Kiểm tra tồn kho
5. ✅ Tìm hoặc tạo giỏ hàng cho user
6. ✅ Nếu sản phẩm đã có → cộng thêm quantity
7. ✅ Nếu sản phẩm chưa có → thêm mới
8. ✅ Lưu vào database

### Cập nhật số lượng:

1. ✅ Validate input
2. ✅ Kiểm tra user và giỏ hàng tồn tại
3. ✅ Tìm sản phẩm trong giỏ
4. ✅ Kiểm tra tồn kho
5. ✅ Nếu quantity = 0 → xóa sản phẩm
6. ✅ Nếu quantity > 0 → cập nhật
7. ✅ Lưu vào database

### Xóa sản phẩm:

1. ✅ Validate input
2. ✅ Kiểm tra user và giỏ hàng tồn tại
3. ✅ Tìm sản phẩm trong giỏ
4. ✅ Xóa sản phẩm khỏi mảng items
5. ✅ Lưu vào database

---

## 💡 Tips & Best Practices

### 1. Validate User ID

Luôn kiểm tra user_id hợp lệ trước khi thao tác với giỏ hàng.

### 2. Check Stock Availability

Kiểm tra tồn kho từ product-service trước khi thêm/cập nhật.

### 3. Handle Edge Cases

- Giỏ hàng rỗng
- Sản phẩm không tồn tại
- Số lượng = 0
- Tồn kho không đủ

### 4. Use Transactions (Optional)

Với production, nên dùng MongoDB transactions để đảm bảo consistency.

### 5. Cache Product Info

Lưu thông tin sản phẩm (name, price, image) trong cart để giảm calls đến product-service.

---

## 🐛 Troubleshooting

### Lỗi: "Người dùng không tồn tại"

**Nguyên nhân:** user_id không đúng hoặc user chưa đăng ký

**Fix:** 
- Đăng ký/đăng nhập để lấy user_id hợp lệ
- Kiểm tra user_id có đúng format MongoDB ObjectId

### Lỗi: "Sản phẩm không tồn tại"

**Nguyên nhân:** product_id không tồn tại trong database

**Fix:**
- Lấy product_id từ `/api/products`
- Chạy seed data: `cd server/product-service && npm run seed`

### Lỗi: "Không đủ hàng trong kho"

**Nguyên nhân:** Số lượng yêu cầu > số lượng tồn kho

**Fix:**
- Giảm số lượng yêu cầu
- Kiểm tra available_stock trong response

### Lỗi: "Bad gateway"

**Nguyên nhân:** Auth-service hoặc Product-service không chạy

**Fix:**
- Khởi động lại auth-service và product-service
- Kiểm tra: 
  - `curl http://localhost:3002/health`
  - `curl http://localhost:3001/health`

---

## 📚 Related APIs

- [Authentication APIs](./HOW_TO_TEST_API.md#authentication-apis)
- [Product APIs](./HOW_TO_TEST_API.md#product-apis)
- [Swagger Documentation](http://localhost:3000/api-docs)

---

## ✨ Tổng kết

Bạn đã có đầy đủ Cart APIs với:

- ✅ **4 endpoints** đầy đủ chức năng
- ✅ **Validation** đầu vào
- ✅ **Error handling** chi tiết
- ✅ **Stock checking** từ product-service
- ✅ **Swagger documentation** tự động
- ✅ **Business logic** hoàn chỉnh

**🚀 Happy Coding!**

