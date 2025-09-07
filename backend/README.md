# 🚀 MyApp Backend API

Backend API cho ứng dụng React Native MyApp sử dụng Node.js, Express và MongoDB.

---

## 📋 **MỤC LỤC**

1. [Tính năng](#-tính-năng)
2. [Cấu trúc thư mục chi tiết](#-cấu-trúc-thư-mục-chi-tiết)
3. [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
4. [Hướng dẫn chạy](#-hướng-dẫn-chạy)
5. [API Endpoints](#-api-endpoints)
6. [Database Models](#-database-models)
7. [Middleware System](#-middleware-system)
8. [Utilities](#-utilities)
9. [Technologies](#-technologies)
10. [Troubleshooting](#-troubleshooting)

---

## 🎯 **TÍNH NĂNG**

### **✅ Đã hoàn thành:**
- **🔐 Authentication System**: Đăng ký, đăng nhập, quản lý profile
- **🛡️ Security**: JWT authentication, password hashing, rate limiting
- **📝 Validation**: Input validation với messages tiếng Việt
- **⚡ Error Handling**: Xử lý lỗi toàn cục với logging
- **🔧 Utilities**: Image processing, response helpers, query builders

### **🔄 Tương lai (Placeholder):**
- **📂 Category Management**: CRUD cho danh mục sản phẩm
- **🛍️ Product Management**: CRUD sản phẩm với search/filter
- **🖼️ Image Upload**: Tích hợp Cloudinary
- **🔍 Advanced Search**: Full-text search và filtering

---

## 📁 **CẤU TRÚC THƯ MỤC CHI TIẾT**

```
backend/
├── 📄 server.js                    # Entry point chính của ứng dụng
├── 📄 package.json                 # Dependencies và scripts
├── 📄 package-lock.json            # Lock dependencies versions
├── 📄 .gitignore                   # Git ignore rules
├── 📄 README.md                    # Tài liệu hướng dẫn
├── 📄 .env                         # Biến môi trường (tạo từ .env.example)
│
├── 📁 src/                         # Source code chính
│   │
│   ├── 📁 config/                  # ⚙️ Cấu hình hệ thống
│   │   ├── 📄 database.js          # Cấu hình kết nối MongoDB
│   │   └── 📄 cloudinary.js        # Cấu hình Cloudinary (image storage)
│   │
│   ├── 📁 controllers/             # 🎛️ Logic xử lý business
│   │   ├── 📄 authController.js    # Xử lý đăng ký/đăng nhập/profile
│   │   ├── 📄 categoryController.js # [Placeholder] Quản lý danh mục
│   │   └── 📄 productController.js # [Placeholder] Quản lý sản phẩm
│   │
│   ├── 📁 middleware/              # 🔧 Middleware xử lý request
│   │   ├── 📄 auth.js              # Xác thực JWT token
│   │   ├── 📄 adminAuth.js         # Phân quyền admin
│   │   ├── 📄 validation.js        # Validation input data
│   │   ├── 📄 upload.js            # Xử lý file upload
│   │   └── 📄 errorHandler.js      # Xử lý lỗi toàn cục
│   │
│   ├── 📁 models/                  # 🗄️ Database schemas
│   │   ├── 📄 User.js              # Schema người dùng (hoàn chỉnh)
│   │   ├── 📄 Category.js          # [Placeholder] Schema danh mục
│   │   └── 📄 Product.js           # [Placeholder] Schema sản phẩm
│   │
│   ├── 📁 routes/                  # 🛣️ API routes definition
│   │   ├── 📄 authRoutes.js        # Routes xác thực (/api/auth/*)
│   │   ├── 📄 categoryRoutes.js    # [Placeholder] Routes danh mục
│   │   └── 📄 productRoutes.js     # [Placeholder] Routes sản phẩm
│   │
│   └── 📁 utils/                   # 🛠️ Tiện ích và helpers
│       ├── 📄 imageProcessor.js    # Xử lý ảnh với Sharp
│       ├── 📄 cloudinaryUpload.js  # Upload ảnh lên Cloudinary
│       ├── 📄 queryHelpers.js      # Hỗ trợ truy vấn DB (search, filter, pagination)
│       └── 📄 responseHelper.js    # Chuẩn hóa API responses
│
├── 📁 uploads/                     # 📂 Thư mục lưu file upload tạm thời
└── 📁 node_modules/                # 📦 Dependencies (auto-generated)
```

---

## 🔧 **HƯỚNG DẪN CÀI ĐẶT**

### **Bước 1: Prerequisites**
```bash
# Cài đặt Node.js (version 16+ khuyến nghị)
# Download: https://nodejs.org/

# Kiểm tra version
node --version
npm --version
```

### **Bước 2: Cài đặt MongoDB**

**Option A: MongoDB Local**
```bash
# Windows - Download MongoDB Community Server
# https://www.mongodb.com/try/download/community

# Hoặc dùng Chocolatey
choco install mongodb

# Start MongoDB service
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud - Miễn phí)**
```bash
# 1. Đăng ký tại: https://cloud.mongodb.com
# 2. Tạo cluster miễn phí
# 3. Lấy connection string
```

**Option C: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### **Bước 3: Clone và cài đặt project**
```bash
# Clone project (nếu từ git)
git clone <repository-url>
cd MyApp/backend

# Hoặc nếu đã có code
cd F:\MyApp\backend

# Cài đặt dependencies
npm install
```

### **Bước 4: Cấu hình Environment**
```bash
# Tạo file .env
echo "# Environment Configuration
NODE_ENV=development
PORT=5000

# Database - Thay đổi tên database theo ý muốn
MONGODB_URI=mongodb://localhost:27017/myapp_fresh_2024

# JWT Secret - ĐỔI THÀNH SECRET BẢO MẬT CỦA BẠN
JWT_SECRET=myapp_super_secret_key_2024_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary (for image upload) - Có thể để fake cho development
CLOUDINARY_CLOUD_NAME=test_cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=test_secret

# Upload settings
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp" > .env
```

---

## 🏃‍♂️ **HƯỚNG DẪN CHẠY**

### **1. Khởi động MongoDB**
```bash
# Nếu dùng MongoDB local
net start MongoDB

# Nếu dùng Docker
docker start mongodb

# Nếu dùng Atlas - không cần làm gì
```

### **2. Chạy Development Server**
```bash
# Option 1: Development mode (auto-restart khi code thay đổi)
npm run dev

# Option 2: Production mode
npm start

# Option 3: Chạy trực tiếp
node server.js
```

### **3. Kiểm tra Server đã chạy**
```bash
# Test health endpoint
curl http://localhost:5000/health

# Hoặc mở browser: http://localhost:5000/health
```

**Kết quả mong đợi:**
```json
{
  "status": "OK",
  "message": "Server đang chạy"
}
```

### **4. Kiểm tra Database Connection**
Khi server khởi động thành công, bạn sẽ thấy:
```
🔄 Đang kết nối đến MongoDB...
📍 URI: mongodb://localhost:27017/myapp_fresh_2024
✅ MongoDB kết nối thành công: localhost
📊 Database: myapp_fresh_2024
🔌 Port: 27017
Server running on port 5000
```

---

## 🌐 **API ENDPOINTS**

### **Base URL:** `http://localhost:5000`

### **🔐 Authentication Endpoints (Hoàn chỉnh)**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/register` | Đăng ký người dùng mới | Public |
| `POST` | `/api/auth/login` | Đăng nhập | Public |
| `GET` | `/api/auth/profile` | Lấy thông tin profile | Private |
| `PUT` | `/api/auth/profile` | Cập nhật profile | Private |
| `PUT` | `/api/auth/change-password` | Đổi mật khẩu | Private |
| `POST` | `/api/auth/logout` | Đăng xuất | Private |

### **📂 Category Endpoints (Placeholder)**
- Sẽ được implement trong tương lai
- Routes đã chuẩn bị tại `/api/categories/*`

### **🛍️ Product Endpoints (Placeholder)**
- Sẽ được implement trong tương lai  
- Routes đã chuẩn bị tại `/api/products/*`

### **⚡ System Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/health` | Kiểm tra server status | Public |

---

## 🗄️ **DATABASE MODELS**

### **👤 User Model (Hoàn chỉnh)**
```javascript
{
  _id: ObjectId,
  username: String,      // Unique, 3-30 chars
  email: String,         // Unique, valid email
  password: String,      // Hashed với bcrypt
  firstName: String,     // Họ
  lastName: String,      // Tên
  phoneNumber: String,   // Optional
  avatar: String,        // URL ảnh đại diện
  role: String,          // 'user' | 'admin'
  isActive: Boolean,     // Trạng thái tài khoản
  lastLogin: Date,       // Lần đăng nhập cuối
  createdAt: Date,       // Ngày tạo
  updatedAt: Date        // Ngày cập nhật
}
```

**Features:**
- ✅ Auto hash password trước khi lưu
- ✅ Method `comparePassword()` để xác thực
- ✅ Loại bỏ password khỏi JSON response
- ✅ Validation messages tiếng Việt

### **📂 Category Model (Placeholder)**
```javascript
// Sẽ implement với structure:
{
  _id: ObjectId,
  name: String,
  description: String,
  slug: String,
  image: String,
  parentCategory: ObjectId,  // Hỗ trợ subcategory
  isActive: Boolean,
  sortOrder: Number,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### **🛍️ Product Model (Placeholder)**
```javascript
// Sẽ implement với structure phức tạp:
{
  _id: ObjectId,
  name: String,
  description: String,
  sku: String,
  price: Number,
  category: ObjectId,
  images: [Object],
  stock: Object,
  attributes: [Object],
  tags: [String],
  rating: Object,
  // ... và nhiều fields khác
}
```

---

## 🛡️ **MIDDLEWARE SYSTEM**

### **🔐 Authentication Flow**
```
Request → auth.js → verify JWT → get User → Controller
```

**Files:**
- `auth.js`: Xác thực JWT token
- `adminAuth.js`: Kiểm tra quyền admin (phải chạy sau auth.js)

### **✅ Validation System**
```
Request → validation.js → express-validator → Controller
```

**Features:**
- Validation rules cho register/login
- Messages lỗi bằng tiếng Việt
- Support cho categories/products (tương lai)

### **📁 File Upload System**
```
Request → upload.js → multer → local storage → imageProcessor.js → Cloudinary
```

**Features:**
- Chỉ accept image files
- Size limit 5MB
- Auto rename files
- Error handling

### **🚨 Error Handling**
```
Any Error → errorHandler.js → Standardized Response
```

**Xử lý:**
- Mongoose errors (validation, duplicate, cast)
- JWT errors (invalid, expired)
- Custom application errors
- Generic server errors

---

## 🛠️ **UTILITIES**

### **🖼️ Image Processing (`imageProcessor.js`)**
```javascript
// Functions:
- processImage()           // Resize & optimize
- createResponsiveImages() // Multiple sizes
- deleteFile()            // Cleanup
- getImageMetadata()      // Info extraction
```

### **☁️ Cloudinary Integration (`cloudinaryUpload.js`)**
```javascript
// Functions:
- uploadToCloudinary()         // Single upload
- uploadMultipleToCloudinary() // Batch upload
- deleteFromCloudinary()       // Delete image
- getTransformedUrl()          // Get optimized URLs
```

### **🔍 Query Helpers (`queryHelpers.js`)**
```javascript
// QueryHelper class:
- search()     // Full-text search
- filter()     // Advanced filtering
- sort()       // Multi-field sorting
- paginate()   // Pagination với metadata
- populate()   // Relationship loading
```

### **📤 Response Helpers (`responseHelper.js`)**
```javascript
// Standardized responses:
- success()           // 200 responses
- created()           // 201 responses
- error()             // 4xx errors
- serverError()       // 5xx errors
- validationError()   // Validation failures
// ... và nhiều helpers khác
```

---

## 💻 **TECHNOLOGIES**

### **🏗️ Core Framework**
- **Node.js** `v16+` - JavaScript runtime
- **Express.js** `v4.18+` - Web framework
- **MongoDB** `v5+` - NoSQL database
- **Mongoose** `v7+` - MongoDB ODM

### **🔐 Authentication & Security**
- **jsonwebtoken** - JWT token generation/verification
- **bcryptjs** - Password hashing
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting

### **✅ Validation & Processing**
- **express-validator** - Input validation
- **multer** - File upload handling
- **sharp** - Image processing
- **cloudinary** - Cloud image storage

### **🔧 Development Tools**
- **nodemon** - Auto-restart server
- **dotenv** - Environment variables
- **jest** - Testing framework (sẵn sàng)

---

## 🧪 **TESTING**

### **Test API với cURL**
```bash
# Test đăng ký
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "Test123456",
    "firstName": "Test",
    "lastName": "User"
  }'

# Test đăng nhập
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'

# Test profile (thay YOUR_TOKEN)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Test với Postman/Thunder Client**
1. Import collection từ API documentation
2. Set base URL: `http://localhost:5000`
3. Test từng endpoint theo thứ tự

---

## 🚨 **TROUBLESHOOTING**

### **❌ Lỗi: Cannot find module 'mongoose'**
```bash
npm install
```

### **❌ Lỗi: MONGODB_URI is undefined**
```bash
# Kiểm tra file .env có tồn tại không
ls -la .env

# Tạo file .env nếu chưa có
cp .env.example .env
```

### **❌ Lỗi: ECONNREFUSED 127.0.0.1:27017**
```bash
# Kiểm tra MongoDB đang chạy
net start MongoDB

# Hoặc dùng Docker
docker run -d -p 27017:27017 mongo

# Hoặc dùng MongoDB Atlas
```

### **❌ Lỗi: EADDRINUSE :::5000**
```bash
# Port 5000 đã được sử dụng
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Hoặc đổi port trong .env
PORT=5001
```

### **❌ Lỗi: JWT must be provided**
```bash
# Đảm bảo JWT_SECRET trong .env không trống
JWT_SECRET=your_actual_secret_key_here
```

---

## 📞 **SUPPORT**

Nếu gặp vấn đề:

1. **Kiểm tra Prerequisites**: Node.js, MongoDB
2. **Kiểm tra file .env**: Đảm bảo có đầy đủ variables
3. **Kiểm tra logs**: Server console output
4. **Test từng bước**: Health check → Register → Login
5. **Kiểm tra database**: MongoDB Compass hoặc shell

---

## 🔄 **DEVELOPMENT ROADMAP**

### **Phase 1: Authentication ✅**
- [x] User registration/login
- [x] JWT authentication  
- [x] Profile management
- [x] Security middleware

### **Phase 2: Category Management (Coming)**
- [ ] Category CRUD operations
- [ ] Subcategory support
- [ ] Category image upload

### **Phase 3: Product Management (Coming)**
- [ ] Product CRUD operations
- [ ] Multiple image upload
- [ ] Inventory management
- [ ] Search & filtering

### **Phase 4: Advanced Features (Future)**
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Performance optimization
- [ ] API documentation (Swagger)

---

**🎉 Backend đã sẵn sàng cho React Native frontend integration!**