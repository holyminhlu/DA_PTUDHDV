const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { randomUUID } = require('crypto');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';

const app = express();
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TechStore API Docs'
}));

// Middleware: add request ID to all requests
app.use((req, res, next) => {
  req.id = req.get('x-request-id') || randomUUID().slice(0, 8);
  res.setHeader('x-request-id', req.id);
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.id}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Kiểm tra trạng thái API Gateway
 *     description: Endpoint để kiểm tra xem API Gateway có hoạt động không
 *     responses:
 *       200:
 *         description: Gateway đang hoạt động bình thường
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: gateway ok
 */
app.get('/health', (req, res) => res.json({ status: 'gateway ok' }));

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     tags: [Products]
 *     summary: Lấy danh sách sản phẩm nổi bật
 *     description: Trả về các sản phẩm nổi bật (rating cao >= 4.5, discount >= 10%, hoặc được đánh dấu featured)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Số lượng sản phẩm trả về (mặc định 6)
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 count:
 *                   type: integer
 *                 type:
 *                   type: string
 *                   example: featured
 *       502:
 *         description: Lỗi kết nối đến Product Service
 */
app.get('/api/products/featured', async (req, res) => {
    try {
        const resp = await axios.get(`${PRODUCT_SERVICE_URL}/phones/featured`, {
            params: req.query,
            timeout: 5000,
            headers: { 'x-request-id': req.id }
        });
        res.json(resp.data);
    } catch (err) {
        console.error(`[${req.id}] gateway error /api/products/featured:`, err.message || err);
        const status = err.response?.status || 502;
        res.status(status).json({ error: 'Bad gateway', requestId: req.id });
    }
});

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     tags: [Products]
 *     summary: Tìm kiếm sản phẩm theo tên
 *     description: Tìm kiếm điện thoại theo từ khóa, category, khoảng giá
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm (tên, mô tả, brand, category)
 *         example: iPhone
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo danh mục
 *         example: iPhone
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu
 *         example: 10000000
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *         example: 30000000
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [relevance, price-asc, price-desc, name, rating]
 *         description: Sắp xếp kết quả
 *         example: price-asc
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Số lượng kết quả tối đa
 *     responses:
 *       200:
 *         description: Tìm kiếm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 count:
 *                   type: integer
 *                 query:
 *                   type: object
 *       502:
 *         description: Lỗi kết nối đến Product Service
 */
app.get('/api/products/search', async (req, res) => {
    try {
        const resp = await axios.get(`${PRODUCT_SERVICE_URL}/phones/search`, {
            params: req.query,
            timeout: 5000,
            headers: { 'x-request-id': req.id }
        });
        res.json(resp.data);
    } catch (err) {
        console.error(`[${req.id}] gateway error /api/products/search:`, err.message || err);
        const status = err.response?.status || 502;
        res.status(status).json({ error: 'Bad gateway', requestId: req.id });
    }
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Lấy danh sách tất cả sản phẩm
 *     description: Trả về danh sách tất cả điện thoại có trong hệ thống (tối đa 100 sản phẩm)
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       502:
 *         description: Lỗi kết nối đến Product Service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Forward GET /api/products -> product-service /phones
app.get('/api/products', async (req, res) => {
    try {
        const resp = await axios.get(`${PRODUCT_SERVICE_URL}/phones`, { 
            params: req.query, 
            timeout: 5000,
            headers: { 'x-request-id': req.id }
        });
        res.json(resp.data);
    } catch (err) {
        console.error(`[${req.id}] gateway error /api/products:`, err.message || err);
        const status = err.response?.status || 502;
        res.status(status).json({ error: 'Bad gateway', requestId: req.id });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Lấy thông tin chi tiết của sản phẩm
 *     description: |
 *       Trả về thông tin chi tiết đầy đủ của một sản phẩm bao gồm:
 *       - Mô tả chi tiết
 *       - Thông tin bảo hành
 *       - Màu sắc có sẵn
 *       - Thông số kỹ thuật (screen, CPU, RAM, camera, battery, etc.)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId của sản phẩm (24 ký tự hex)
 *         example: 6923b627bd4162406bf43205
 *     responses:
 *       200:
 *         description: Lấy thông tin sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDetail'
 *       400:
 *         description: ID không hợp lệ (không phải MongoDB ObjectId)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid id format
 *                 message:
 *                   type: string
 *                   example: ID phải là MongoDB ObjectId hợp lệ
 *                 requestId:
 *                   type: string
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Not found
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy sản phẩm
 *                 requestId:
 *                   type: string
 *       502:
 *         description: Lỗi kết nối đến Product Service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Forward GET /api/products/:id -> product-service /phones/:id
app.get('/api/products/:id', async (req, res) => {
    try {
        const resp = await axios.get(`${PRODUCT_SERVICE_URL}/phones/${req.params.id}`, { 
            timeout: 5000,
            headers: { 'x-request-id': req.id }
        });
        res.json(resp.data);
    } catch (err) {
        console.error(`[${req.id}] gateway error /api/products/:id:`, err.message || err);
        const status = err.response?.status || 502;
        res.status(status).json({ error: 'Bad gateway', requestId: req.id });
    }
});

/**
 * @swagger
 * /api/productinfo/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Lấy thông tin chi tiết sản phẩm
 *     description: Endpoint thay thế để lấy thông tin sản phẩm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Thành công
 *       502:
 *         description: Lỗi gateway
 */
// Forward GET /api/productinfo/:id -> product-service /phoneinfo/:id
app.get('/api/productinfo/:id', async (req, res) => {
    try {
        const resp = await axios.get(`${PRODUCT_SERVICE_URL}/phoneinfo/${req.params.id}`, { 
            timeout: 5000,
            headers: { 'x-request-id': req.id }
        });
        res.json(resp.data);
    } catch (err) {
        console.error(`[${req.id}] gateway error /api/productinfo/:id:`, err.message || err);
        const status = err.response?.status || 502;
        res.status(status).json({ error: 'Bad gateway', requestId: req.id });
    }
});

/**
 * @swagger
 * /api/phoneinfo/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Lấy thông tin phone
 *     description: Endpoint để lấy thông tin điện thoại
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       502:
 *         description: Lỗi gateway
 */
// Forward GET /api/phoneinfo/:id -> product-service /phoneinfo/:id
app.get('/api/phoneinfo/:id', async (req, res) => {
    try {
        const resp = await axios.get(`${PRODUCT_SERVICE_URL}/phoneinfo/${req.params.id}`, {
            timeout: 5000,
            headers: { 'x-request-id': req.id }
        });
        res.json(resp.data);
    } catch (err) {
        console.error(`[${req.id}] gateway error /api/phoneinfo/:id:`, err.message || err);
        const status = err.response?.status || 502;
        res.status(status).json({ error: 'Bad gateway', requestId: req.id });
    }
});

/**
 * @swagger
 * /api/phones/by-id/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Lấy phone theo ID
 *     description: Lấy thông tin điện thoại theo ID cụ thể
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy
 *       502:
 *         description: Lỗi gateway
 */
// Forward GET /api/phones/by-id/:id -> product-service /phones/by-id/:id
app.get('/api/phones/by-id/:id', async (req, res) => {
    try {
        const target = `${PRODUCT_SERVICE_URL}/phones/by-id/${req.params.id}`;
        console.log(`[${req.id}] gateway forward ${req.path} -> ${target}`);
        const resp = await axios.get(target, {
            timeout: 5000,
            headers: { 'x-request-id': req.id }
        });
        res.json(resp.data);
    } catch (err) {
        console.error(`[${req.id}] gateway error /api/phones/by-id/:id:`, err.message || err);
        const status = err.response?.status || 502;
        // forward 404 from product-service as-is
        if (err.response && err.response.status === 404) return res.status(404).json(err.response.data);
        res.status(status).json({ error: 'Bad gateway', requestId: req.id });
    }
});

/**
 * @swagger
 * /api/phonesby-id/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Lấy phone theo ID (compact route)
 *     description: Alternative route cho phones/by-id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy
 */
// Accept a common typo/compact route `/api/phonesby-id/:id` for convenience
app.get('/api/phonesby-id/:id', async (req, res) => {
    try {
        const target = `${PRODUCT_SERVICE_URL}/phones/by-id/${req.params.id}`;
        console.log(`[${req.id}] gateway forward ${req.path} -> ${target}`);
        const resp = await axios.get(target, {
            timeout: 5000,
            headers: { 'x-request-id': req.id }
        });
        res.json(resp.data);
    } catch (err) {
        console.error(`[${req.id}] gateway error /api/phonesby-id/:id:`, err.message || err);
        const status = err.response?.status || 502;
        if (err.response && err.response.status === 404) return res.status(404).json(err.response.data);
        res.status(status).json({ error: 'Bad gateway', requestId: req.id });
    }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Đăng ký tài khoản mới
 *     description: Tạo tài khoản người dùng mới trong hệ thống
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc thiếu thông tin bắt buộc
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Error'
 *                 - type: object
 *                   properties:
 *                     errors:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: Chứa ký tự đặc biệt
 *                         password:
 *                           type: string
 *                           example: Mật khẩu phải tối thiểu 8 ký tự
 *       409:
 *         description: Email đã được đăng ký
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email already registered
 *       502:
 *         description: Lỗi kết nối đến Auth Service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Forward auth register/login to auth-service
app.post('/api/auth/register', async (req, res) => {
    try {
        const resp = await axios.post(`${AUTH_SERVICE_URL}/api/auth/register`, req.body, { timeout: 5000 });
        return res.status(resp.status).json(resp.data);
    } catch (err) {
        console.error('gateway error /api/auth/register', err.message || err);
        const status = err.response?.status || 502;
        return res.status(status).json(err.response?.data || { error: 'Bad gateway' });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Đăng nhập vào hệ thống
 *     description: Xác thực người dùng và trả về JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Thiếu email hoặc password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email và mật khẩu là bắt buộc
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email đăng nhập không hợp lệ
 *       502:
 *         description: Lỗi kết nối đến Auth Service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        const resp = await axios.post(`${AUTH_SERVICE_URL}/api/auth/login`, req.body, { timeout: 5000 });
        return res.status(resp.status).json(resp.data);
    } catch (err) {
        console.error('gateway error /api/auth/login', err.message || err);
        const status = err.response?.status || 502;
        return res.status(status).json(err.response?.data || { error: 'Bad gateway' });
    }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags: [Authentication]
 *     summary: Lấy thông tin người dùng hiện tại
 *     description: Trả về thông tin chi tiết của người dùng đang đăng nhập (yêu cầu JWT token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Chưa xác thực hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       502:
 *         description: Lỗi kết nối đến Auth Service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Forward GET /api/auth/profile to auth-service
app.get('/api/auth/profile', async (req, res) => {
    try {
        // Forward the Authorization header
        const headers = {};
        if (req.headers.authorization) {
            headers.authorization = req.headers.authorization;
        }
        headers['x-request-id'] = req.id;

        const resp = await axios.get(`${AUTH_SERVICE_URL}/api/auth/profile`, { 
            headers,
            timeout: 5000 
        });
        return res.status(resp.status).json(resp.data);
    } catch (err) {
        console.error('gateway error /api/auth/profile', err.message || err);
        const status = err.response?.status || 502;
        return res.status(status).json(err.response?.data || { error: 'Bad gateway' });
    }
});

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     tags: [Authentication]
 *     summary: Cập nhật thông tin người dùng
 *     description: Cập nhật tên của người dùng đang đăng nhập (yêu cầu JWT token)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cập nhật thành công
 *                 updatedUser:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                       example: Nguyễn Văn B - Updated
 *       401:
 *         description: Chưa xác thực hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: USER_NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy tài khoản để cập nhật.
 *       422:
 *         description: Dữ liệu validation không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       502:
 *         description: Lỗi kết nối đến Auth Service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Forward PUT /api/auth/profile to auth-service
app.put('/api/auth/profile', async (req, res) => {
    try {
        // Forward the Authorization header
        const headers = { 'Content-Type': 'application/json' };
        if (req.headers.authorization) {
            headers.authorization = req.headers.authorization;
        }
        headers['x-request-id'] = req.id;

        const resp = await axios.put(`${AUTH_SERVICE_URL}/api/auth/profile`, req.body, { 
            headers,
            timeout: 5000 
        });
        return res.status(resp.status).json(resp.data);
    } catch (err) {
        console.error('gateway error PUT /api/auth/profile', err.message || err);
        const status = err.response?.status || 502;
        return res.status(status).json(err.response?.data || { error: 'Bad gateway' });
    }
});

// ========================================
// CART APIs - Forward to Auth Service
// ========================================

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     tags: [Cart]
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     description: Thêm một sản phẩm vào giỏ hàng của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - product_id
 *               - quantity
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID của người dùng
 *                 example: "507f1f77bcf86cd799439011"
 *               product_id:
 *                 type: string
 *                 description: ID của sản phẩm
 *                 example: "6936297a701665210edbd101"
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Số lượng sản phẩm
 *                 example: 2
 *     responses:
 *       200:
 *         description: Thêm vào giỏ hàng thành công
 *       400:
 *         description: Sản phẩm hết hàng hoặc dữ liệu không hợp lệ
 *       404:
 *         description: Người dùng hoặc sản phẩm không tồn tại
 */
app.post('/api/cart/add', async (req, res) => {
    try {
        const resp = await axios.post(`${AUTH_SERVICE_URL}/api/cart/add`, req.body, { timeout: 5000 });
        return res.status(resp.status).json(resp.data);
    } catch (err) {
        console.error('gateway error /api/cart/add', err.message || err);
        const status = err.response?.status || 502;
        return res.status(status).json(err.response?.data || { error: 'Bad gateway' });
    }
});

/**
 * @swagger
 * /api/cart/{user_id}:
 *   get:
 *     tags: [Cart]
 *     summary: Xem giỏ hàng của người dùng
 *     description: Lấy danh sách tất cả sản phẩm trong giỏ hàng của một người dùng
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Lấy giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 user_id:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: string
 *                       product_name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       quantity:
 *                         type: integer
 *                       total:
 *                         type: number
 *                 cart_total:
 *                   type: number
 *       404:
 *         description: Người dùng không tồn tại
 */
app.get('/api/cart/:user_id', async (req, res) => {
    try {
        const resp = await axios.get(`${AUTH_SERVICE_URL}/api/cart/${req.params.user_id}`, { timeout: 5000 });
        return res.status(resp.status).json(resp.data);
    } catch (err) {
        console.error('gateway error /api/cart/:user_id', err.message || err);
        const status = err.response?.status || 502;
        return res.status(status).json(err.response?.data || { error: 'Bad gateway' });
    }
});

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     tags: [Cart]
 *     summary: Cập nhật số lượng sản phẩm trong giỏ
 *     description: Cập nhật số lượng của một sản phẩm có trong giỏ hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - product_id
 *               - quantity
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID của người dùng
 *                 example: "507f1f77bcf86cd799439011"
 *               product_id:
 *                 type: string
 *                 description: ID của sản phẩm
 *                 example: "6936297a701665210edbd101"
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 description: Số lượng mới (0 để xóa sản phẩm)
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Không đủ hàng trong kho
 *       404:
 *         description: Sản phẩm không có trong giỏ hàng
 */
app.put('/api/cart/update', async (req, res) => {
    try {
        const resp = await axios.put(`${AUTH_SERVICE_URL}/api/cart/update`, req.body, { timeout: 5000 });
        return res.status(resp.status).json(resp.data);
    } catch (err) {
        console.error('gateway error /api/cart/update', err.message || err);
        const status = err.response?.status || 502;
        return res.status(status).json(err.response?.data || { error: 'Bad gateway' });
    }
});

/**
 * @swagger
 * /api/cart/delete:
 *   delete:
 *     tags: [Cart]
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     description: Xóa một sản phẩm khỏi giỏ hàng của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - product_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID của người dùng
 *                 example: "507f1f77bcf86cd799439011"
 *               product_id:
 *                 type: string
 *                 description: ID của sản phẩm cần xóa
 *                 example: "6936297a701665210edbd101"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy sản phẩm trong giỏ hàng
 */
app.delete('/api/cart/delete', async (req, res) => {
    try {
        const resp = await axios.delete(`${AUTH_SERVICE_URL}/api/cart/delete`, { 
            data: req.body,
            timeout: 5000 
        });
        return res.status(resp.status).json(resp.data);
    } catch (err) {
        console.error('gateway error /api/cart/delete', err.message || err);
        const status = err.response?.status || 502;
        return res.status(status).json(err.response?.data || { error: 'Bad gateway' });
    }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

app.listen(PORT, () => {
    console.log(`api-gateway listening on port ${PORT}, product-service -> ${PRODUCT_SERVICE_URL}`);
});
