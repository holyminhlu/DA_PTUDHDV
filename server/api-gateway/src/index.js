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
 *     summary: Lấy chi tiết một sản phẩm
 *     description: Trả về thông tin chi tiết của một sản phẩm dựa trên ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId của sản phẩm
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Lấy thông tin sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

app.listen(PORT, () => {
    console.log(`api-gateway listening on port ${PORT}, product-service -> ${PRODUCT_SERVICE_URL}`);
});