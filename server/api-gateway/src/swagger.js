const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechStore API Documentation',
      version: '1.0.0',
      description: 'API Documentation cho đồ án TechStore - Hệ thống bán hàng điện thoại',
      contact: {
        name: 'TechStore Team',
        email: 'support@techstore.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server (API Gateway)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập JWT token lấy từ endpoint /api/auth/login. Format: Bearer <token>'
        }
      },
      schemas: {
        // Auth schemas
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'Họ tên người dùng (chỉ chứa chữ cái và khoảng trắng)',
              example: 'Nguyễn Văn A'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email của người dùng',
              example: 'test@example.com'
            },
            password: {
              type: 'string',
              minLength: 8,
              description: 'Mật khẩu (tối thiểu 8 ký tự)',
              example: 'password123'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email đăng nhập',
              example: 'test@example.com'
            },
            password: {
              type: 'string',
              description: 'Mật khẩu',
              example: 'password123'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login success'
            },
            token: {
              type: 'string',
              description: 'JWT token (hiệu lực 24 giờ)',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '507f1f77bcf86cd799439011'
                },
                fullName: {
                  type: 'string',
                  example: 'Nguyễn Văn A'
                },
                email: {
                  type: 'string',
                  example: 'test@example.com'
                }
              }
            }
          }
        },
        UserProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            fullName: {
              type: 'string',
              example: 'Nguyễn Văn A'
            },
            email: {
              type: 'string',
              example: 'test@example.com'
            }
          }
        },
        UpdateProfileRequest: {
          type: 'object',
          required: ['fullName'],
          properties: {
            fullName: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Tên mới (2-100 ký tự, không chứa ký tự đặc biệt)',
              example: 'Nguyễn Văn B - Updated'
            }
          }
        },
        // Product schemas
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              example: 'iPhone 15 Pro Max'
            },
            price: {
              type: 'number',
              example: 29990000
            },
            description: {
              type: 'string',
              example: 'Điện thoại iPhone 15 Pro Max 256GB'
            },
            image: {
              type: 'string',
              example: '/img/products/iphone-15-pro-max.jpg'
            },
            category: {
              type: 'string',
              example: 'iPhone'
            },
            stock: {
              type: 'number',
              example: 50
            }
          }
        },
        // Error schemas
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mã lỗi hoặc thông báo lỗi'
            },
            message: {
              type: 'string',
              description: 'Thông báo lỗi chi tiết'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            status: {
              type: 'number',
              example: 422
            },
            error: {
              type: 'string',
              example: 'VALIDATION_ERROR'
            },
            message: {
              type: 'string',
              example: 'Dữ liệu cập nhật không hợp lệ.'
            },
            details: {
              type: 'object',
              properties: {
                fullName: {
                  type: 'string',
                  example: 'Tên phải có ít nhất 2 ký tự'
                }
              }
            }
          }
        },
        UnauthorizedError: {
          type: 'object',
          properties: {
            status: {
              type: 'number',
              example: 401
            },
            error: {
              type: 'string',
              example: 'TOKEN_EXPIRED',
              enum: ['TOKEN_MISSING', 'INVALID_TOKEN', 'TOKEN_EXPIRED']
            },
            message: {
              type: 'string',
              example: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'API quản lý xác thực và người dùng'
      },
      {
        name: 'Products',
        description: 'API quản lý sản phẩm'
      },
      {
        name: 'Health',
        description: 'Health check endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/index.js'] // Đường dẫn tới các file chứa route definitions
};

const specs = swaggerJsdoc(options);

module.exports = specs;

