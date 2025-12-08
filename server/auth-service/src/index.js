require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const User = require('./models/User');
const Cart = require('./models/Cart');

// JWT Secret (trong production nên lưu trong .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/TechStore_User';

app.use(cors());
app.use(express.json());

// Middleware xác thực JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // Trường hợp 1: Không gửi token
    if (!token) {
      return res.status(401).json({
        status: 401,
        error: 'TOKEN_MISSING',
        message: 'Bạn phải đăng nhập để thực hiện thao tác này.'
      });
    }

    // Xác thực token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        // Trường hợp 3: Token hết hạn
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            status: 401,
            error: 'TOKEN_EXPIRED',
            message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
          });
        }
        
        // Trường hợp 2: Token không hợp lệ (sai, giả mạo)
        return res.status(401).json({
          status: 401,
          error: 'INVALID_TOKEN',
          message: 'Token không hợp lệ hoặc đã bị thay đổi.'
        });
      }

      // Kiểm tra người dùng có tồn tại không
      const user = await User.findById(decoded.userId);
      
      // Trường hợp 4: Người dùng không tồn tại nữa
      if (!user) {
        return res.status(404).json({
          status: 404,
          error: 'USER_NOT_FOUND',
          message: 'Tài khoản không còn tồn tại.'
        });
      }

      // Lưu thông tin user vào request
      req.user = {
        userId: user._id,
        email: user.email,
        name: user.name
      };
      next();
    });
  } catch (err) {
    console.error('Auth middleware error:', err);
    // Trường hợp 5: Lỗi server
    return res.status(500).json({
      status: 500,
      error: 'SERVER_ERROR',
      message: 'Không thể xác thực người dùng lúc này.'
    });
  }
};

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('auth-service: connected to MongoDB'))
  .catch(err => {
    console.error('auth-service: MongoDB connection error', err);
    process.exit(1);
  });

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }

    // field-level validation
    const fieldErrors = {};
    try {
      // name should contain only letters and spaces (allow unicode letters)
      const invalidName = /[^\p{L}\s]/u.test(name.trim());
      if (invalidName) fieldErrors.name = 'Chứa ký tự đặc biệt';
    } catch (e) {
      // fallback: basic ascii check if unicode property escapes are not supported
      if (/[^A-Za-z\s]/.test(name.trim())) fieldErrors.name = 'Chứa ký tự đặc biệt';
    }

    if (!password || password.length < 8) {
      fieldErrors.password = 'Mật khẩu phải tối thiểu 8 ký tự';
    }

    if (Object.keys(fieldErrors).length) {
      return res.status(400).json({ errors: fieldErrors });
    }

    // simple email format check
    const emailRe = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    if (!emailRe.test(email)) return res.status(400).json({ error: 'Invalid email' });

    // check existing
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ name: name.trim(), email: email.toLowerCase().trim(), password: hash });
    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login với JWT
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: 'Email đăng nhập không hợp lệ' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Mật khẩu không hợp lệ' });

    // Tạo JWT token (hết hạn sau 24 giờ)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({ 
      message: 'Login success', 
      token,
      user: { 
        id: user._id, 
        fullName: user.name, 
        email: user.email 
      } 
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// API lấy thông tin người dùng
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    // Lấy thông tin user từ database
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'USER_NOT_FOUND',
        message: 'Tài khoản không còn tồn tại.'
      });
    }

    // Trả về thông tin user
    return res.json({
      id: user._id.toString(),
      fullName: user.name,
      email: user.email
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({
      status: 500,
      error: 'SERVER_ERROR',
      message: 'Không thể lấy thông tin người dùng lúc này.'
    });
  }
});

// API cập nhật thông tin người dùng
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName } = req.body;

    // Validation
    const validationErrors = {};

    // Kiểm tra fullName
    if (!fullName || typeof fullName !== 'string') {
      validationErrors.fullName = 'Tên không được để trống';
    } else {
      const trimmedName = fullName.trim();
      
      // Kiểm tra tên rỗng sau khi trim
      if (trimmedName.length === 0) {
        validationErrors.fullName = 'Tên không được để trống';
      }
      // Kiểm tra tên quá ngắn
      else if (trimmedName.length < 2) {
        validationErrors.fullName = 'Tên phải có ít nhất 2 ký tự';
      }
      // Kiểm tra tên quá dài
      else if (trimmedName.length > 100) {
        validationErrors.fullName = 'Tên không được vượt quá 100 ký tự';
      }
      // Kiểm tra ký tự đặc biệt (cho phép chữ cái, số, khoảng trắng và dấu tiếng Việt)
      else {
        try {
          // Pattern cho phép: chữ cái (bao gồm Unicode/tiếng Việt), số, khoảng trắng
          const invalidChars = /[^\p{L}\p{N}\s]/u.test(trimmedName);
          if (invalidChars) {
            validationErrors.fullName = 'Tên chứa ký tự đặc biệt không hợp lệ';
          }
        } catch (e) {
          // Fallback nếu regex Unicode không được hỗ trợ
          const invalidChars = /[^a-zA-Z0-9\s\u00C0-\u1EF9]/g.test(trimmedName);
          if (invalidChars) {
            validationErrors.fullName = 'Tên chứa ký tự đặc biệt không hợp lệ';
          }
        }
      }
    }

    // Trường hợp 3: Validation error
    if (Object.keys(validationErrors).length > 0) {
      return res.status(422).json({
        status: 422,
        error: 'VALIDATION_ERROR',
        message: 'Dữ liệu cập nhật không hợp lệ.',
        details: validationErrors
      });
    }

    // Tìm user trong database
    const user = await User.findById(req.user.userId);

    // Trường hợp 4: User không tồn tại
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'USER_NOT_FOUND',
        message: 'Không tìm thấy tài khoản để cập nhật.'
      });
    }

    // Cập nhật thông tin
    user.name = fullName.trim();
    await user.save();

    // Trả về thông tin đã cập nhật
    return res.json({
      message: 'Cập nhật thành công',
      updatedUser: {
        fullName: user.name
      }
    });

  } catch (err) {
    console.error('Update profile error:', err);
    // Trường hợp 5: Lỗi server
    return res.status(500).json({
      status: 500,
      error: 'SERVER_ERROR',
      message: 'Không thể cập nhật thông tin lúc này.'
    });
  }
});

// ========================================
// CART APIs
// ========================================

// POST /api/cart/add - Thêm sản phẩm vào giỏ hàng
app.post('/api/cart/add', async (req, res) => {
  try {
    const { user_id, product_id, quantity = 1 } = req.body;

    // Validate input
    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'Thiếu thông tin: user_id, product_id, quantity là bắt buộc'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Số lượng phải lớn hơn 0'
      });
    }

    // 1. Kiểm tra user có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Người dùng không tồn tại'
      });
    }

    // 2. Lấy thông tin sản phẩm từ product-service
    let product;
    try {
      const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/phones/${product_id}`);
      product = productResponse.data;
    } catch (err) {
      return res.status(404).json({
        status: 'error',
        message: 'Sản phẩm không tồn tại'
      });
    }

    // 3. Kiểm tra tồn kho
    const productStock = product.stock || product.specs?.stock || 100; // Default 100 nếu không có
    if (productStock < quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'Sản phẩm hết hàng',
        available_stock: productStock,
        requested: quantity
      });
    }

    // 4. Tìm hoặc tạo giỏ hàng của user
    let cart = await Cart.findOne({ user_id });
    
    if (!cart) {
      cart = new Cart({
        user_id,
        items: []
      });
    }

    // 5. Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItemIndex = cart.items.findIndex(item => 
      item.product_id.toString() === product_id || 
      item.productId === (product.phoneId || product.id)
    );

    if (existingItemIndex > -1) {
      // Sản phẩm đã có -> cập nhật số lượng
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      // Kiểm tra tồn kho với số lượng mới
      if (productStock < newQuantity) {
        return res.status(400).json({
          status: 'error',
          message: 'Không đủ hàng trong kho',
          available_stock: productStock,
          requested: newQuantity,
          current_in_cart: cart.items[existingItemIndex].quantity
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Thêm sản phẩm mới vào giỏ
      cart.items.push({
        product_id,
        productId: product.phoneId || product.id || 0,
        product_name: product.title || product.name,
        price: product.price,
        quantity,
        image: product.image
      });
    }

    cart.updated_at = Date.now();
    await cart.save();

    return res.status(200).json({
      status: 'success',
      message: 'Đã thêm vào giỏ hàng',
      cart_item: {
        product_id,
        productId: product.phoneId || product.id,
        product_name: product.title || product.name,
        quantity: existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : quantity
      }
    });

  } catch (err) {
    console.error('Error adding to cart:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi thêm vào giỏ hàng'
    });
  }
});

// GET /api/cart/:user_id - Xem giỏ hàng của người dùng
app.get('/api/cart/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    // 1. Kiểm tra user có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy người dùng'
      });
    }

    // 2. Lấy giỏ hàng của user
    const cart = await Cart.findOne({ user_id });

    // 3. Nếu giỏ hàng rỗng hoặc không tồn tại
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Giỏ hàng trống',
        user_id,
        items: [],
        cart_total: 0
      });
    }

    // 4. Format dữ liệu và tính tổng
    const items = cart.items.map(item => ({
      product_id: item.productId || item.product_id,
      product_name: item.product_name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
      image: item.image
    }));

    const cart_total = cart.calculateTotal();

    return res.status(200).json({
      status: 'success',
      user_id,
      items,
      cart_total
    });

  } catch (err) {
    console.error('Error getting cart:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi lấy giỏ hàng'
    });
  }
});

// PUT /api/cart/update - Cập nhật số lượng sản phẩm trong giỏ
app.put('/api/cart/update', async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    // 1. Validate input
    if (!user_id || !product_id || quantity === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Thiếu thông tin: user_id, product_id, quantity là bắt buộc'
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Số lượng không hợp lệ'
      });
    }

    // 2. Kiểm tra user có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Người dùng không tồn tại'
      });
    }

    // 3. Lấy giỏ hàng của user
    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Giỏ hàng không tồn tại'
      });
    }

    // 4. Tìm sản phẩm trong giỏ
    const itemIndex = cart.items.findIndex(item => 
      item.product_id.toString() === product_id || 
      item.productId.toString() === product_id
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Sản phẩm không có trong giỏ hàng'
      });
    }

    // 5. Kiểm tra tồn kho từ product-service
    try {
      const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/phones/${cart.items[itemIndex].product_id}`);
      const product = productResponse.data;
      const availableStock = product.stock || product.specs?.stock || 100;

      if (quantity > availableStock) {
        return res.status(400).json({
          status: 'error',
          message: 'Không đủ hàng trong kho',
          available_stock: availableStock,
          requested: quantity
        });
      }
    } catch (err) {
      // Nếu không lấy được thông tin sản phẩm, vẫn cho phép cập nhật
      console.warn('Could not verify stock for product:', product_id);
    }

    // 6. Nếu quantity = 0, xóa sản phẩm khỏi giỏ
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
      cart.updated_at = Date.now();
      await cart.save();

      return res.status(200).json({
        status: 'success',
        message: 'Đã xóa sản phẩm khỏi giỏ hàng'
      });
    }

    // 7. Cập nhật số lượng
    cart.items[itemIndex].quantity = quantity;
    cart.updated_at = Date.now();
    await cart.save();

    return res.status(200).json({
      status: 'success',
      message: 'Đã cập nhật số lượng',
      product_id,
      quantity
    });

  } catch (err) {
    console.error('Error updating cart:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi cập nhật giỏ hàng'
    });
  }
});

// DELETE /api/cart/delete - Xóa sản phẩm khỏi giỏ
app.delete('/api/cart/delete', async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    // 1. Validate input
    if (!user_id || !product_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Thiếu thông tin: user_id và product_id là bắt buộc'
      });
    }

    // 2. Kiểm tra user có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Người dùng không tồn tại'
      });
    }

    // 3. Lấy giỏ hàng của user
    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Giỏ hàng không tồn tại'
      });
    }

    // 4. Tìm sản phẩm trong giỏ
    const itemIndex = cart.items.findIndex(item => 
      item.product_id.toString() === product_id || 
      item.productId.toString() === product_id
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy sản phẩm trong giỏ hàng'
      });
    }

    // 5. Xóa sản phẩm khỏi giỏ
    cart.items.splice(itemIndex, 1);
    cart.updated_at = Date.now();
    await cart.save();

    return res.status(200).json({
      status: 'success',
      message: 'Đã xóa sản phẩm khỏi giỏ'
    });

  } catch (err) {
    console.error('Error deleting from cart:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi xóa sản phẩm khỏi giỏ hàng'
    });
  }
});

app.listen(PORT, () => {
  console.log(`auth-service listening on port ${PORT}`);
});
