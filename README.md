# 🛒 TechStore - Hệ thống Bán Hàng Điện Thoại

Dự án đồ án phát triển ứng dụng di động - Hệ thống bán lẻ công nghệ với Vue.js frontend và Node.js microservices backend.

## 📋 Tổng quan

- **Frontend:** Vue.js 3 + Vue Router
- **Backend:** Node.js + Express (Microservices)
- **Database:** MongoDB
- **API Testing:** Swagger/OpenAPI
- **Authentication:** JWT

## 🚀 Quick Start

### Frontend
```bash
cd DA_PTUDHDV
npm install
npm run serve
```

### Backend + API Testing
```bash
# Xem hướng dẫn chi tiết test API với Swagger:
📖 HOW_TO_TEST_API.md
```

## 🧪 Test API với Swagger

**👉 Swagger UI:** http://localhost:3000/api-docs

### Cài đặt & Chạy Backend

**Windows:**
```bash
# Double-click để cài đặt:
install-swagger.bat
```

**Manual:**
```bash
# Terminal 1 - Auth Service
cd server\auth-service
npm start

# Terminal 2 - Product Service
cd server\product-service
npm start

# Terminal 3 - API Gateway (có Swagger)
cd server\api-gateway
npm start
```

### 📚 Tài liệu API

- **Quick Start:** [HOW_TO_TEST_API.md](./HOW_TO_TEST_API.md) ← Bắt đầu tại đây!
- **Chi tiết:** [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)
- **Backend:** [server/README.md](./server/README.md)

## 🗂️ Cấu trúc dự án

```
DA_PTUDHDV/
├── src/                          # Frontend Vue.js
│   ├── components/              # Vue components
│   ├── views/                   # Pages/Views
│   ├── routes/                  # Vue Router
│   └── main.js                  # Entry point
│
├── server/                      # Backend services
│   ├── api-gateway/            # API Gateway + Swagger
│   ├── auth-service/           # Authentication
│   └── product-service/        # Product management
│
├── HOW_TO_TEST_API.md          # 🔥 Hướng dẫn test API
├── SWAGGER_GUIDE.md            # Swagger chi tiết
└── install-swagger.bat         # Script cài đặt
```

## 🎯 Features

### Frontend
- ✅ Homepage với hero banner
- ✅ Product listing & detail
- ✅ User authentication (Login/Register)
- ✅ User profile management
- ✅ Contact page với Google Maps
- ✅ About page
- ✅ Responsive design

### Backend APIs
- ✅ User registration & login
- ✅ JWT authentication
- ✅ Profile management
- ✅ Product listing & detail
- ✅ API Gateway pattern
- ✅ Swagger documentation

## 📦 Tech Stack

### Frontend
- Vue.js 3
- Vue Router
- Axios
- CSS3 (Custom styles)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt (password hashing)
- Swagger UI Express

## 🔐 API Endpoints

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/products` | ❌ | Danh sách sản phẩm |
| GET | `/api/products/:id` | ❌ | Chi tiết sản phẩm |
| POST | `/api/auth/register` | ❌ | Đăng ký |
| POST | `/api/auth/login` | ❌ | Đăng nhập |
| GET | `/api/auth/profile` | ✅ | Xem profile |
| PUT | `/api/auth/profile` | ✅ | Cập nhật profile |

**👉 Test trực tiếp:** http://localhost:3000/api-docs

## 🛠️ Development

### Prerequisites
- Node.js 16+
- MongoDB
- npm hoặc yarn

### Environment Setup

Tạo file `.env` trong mỗi service:

**api-gateway/.env:**
```env
PORT=3000
PRODUCT_SERVICE_URL=http://localhost:3001
AUTH_SERVICE_URL=http://localhost:3002
```

**auth-service/.env:**
```env
PORT=3002
MONGO_URI=mongodb://localhost:27017/TechStore_User
JWT_SECRET=your-secret-key
```

**product-service/.env:**
```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/TechStore
```

## 📖 Documentation

- [HOW_TO_TEST_API.md](./HOW_TO_TEST_API.md) - Hướng dẫn test API nhanh
- [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) - Swagger guide đầy đủ
- [SWAGGER_QUICKSTART.md](./SWAGGER_QUICKSTART.md) - Quick start guide
- [server/README.md](./server/README.md) - Backend architecture
- [README_ABOUT_CONTACT.md](./README_ABOUT_CONTACT.md) - About & Contact pages

## 👥 Team

TechStore Development Team - HPHK2 2425

## 📄 License

ISC
