# 🚀 MyApp Backend API

Backend API cho ứng dụng React Native MyApp sử dụng Node.js, Express và MongoDB.

---

## 📋 **MỤC LỤC**

1. [Tổng quan dự án](#-tổng-quan-dự-án)
2. [Cấu trúc SCRUM Tasks](#-cấu-trúc-scrum-tasks)
3. [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
4. [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
5. [Hướng dẫn chạy](#-hướng-dẫn-chạy)
6. [API Endpoints](#-api-endpoints)
7. [Database Models](#-database-models)
8. [Development Workflow](#-development-workflow)
9. [Technologies](#-technologies)
10. [Troubleshooting](#-troubleshooting)

---

## 🎯 **TỔNG QUAN DỰ ÁN**

### **✅ Đã hoàn thành:**
- **🔐 Authentication System**: Đăng ký, đăng nhập, quản lý profile
- **🛡️ Security**: JWT authentication, password hashing, rate limiting
- **📝 Validation**: Input validation với messages tiếng Việt
- **⚡ Error Handling**: Xử lý lỗi toàn cục với logging
- **🔧 Utilities**: Image processing, response helpers, query builders
- **📁 Modular Structure**: Chia thành 4 controller riêng biệt theo SCRUM tasks

### **🔄 Đang phát triển (Theo SCRUM Tasks):**
- **📂 SCRUM-7**: Quản lý danh mục sản phẩm (NN)
- **🛍️ SCRUM-8**: Quản lý sản phẩm CRUD (SD)
- **🖼️ SCRUM-9**: Upload ảnh sản phẩm (LC)
- **🔍 SCRUM-10**: Tìm kiếm và lọc sản phẩm (PT)

---

## 📊 **CẤU TRÚC SCRUM TASKS**

### **🎯 TASK 7 - NN: Quản lý danh mục sản phẩm**
**File:** `src/controllers/categoryManagementController.js`
- **Mục tiêu:** Để phân loại sản phẩm
- **Functions:** 8 functions (getAllCategories, createCategory, updateCategory, etc.)
- **Priority:** Must (2 điểm)

### **🎯 TASK 8 - SD: Quản lý sản phẩm (CRUD)**
**File:** `src/controllers/productManagementController.js`
- **Mục tiêu:** Để cập nhật kho hàng
- **Functions:** 10 functions (getAllProducts, createProduct, updateStock, etc.)
- **Priority:** Must (2 điểm)

### **🎯 TASK 9 - LC: Upload ảnh sản phẩm**
**File:** `src/controllers/productImageController.js`
- **Mục tiêu:** Để minh họa catalogue
- **Functions:** 9 functions (uploadImages, optimizeImages, setMainImage, etc.)
- **Priority:** Must (2 điểm)

### **🎯 TASK 10 - PT: Tìm kiếm & lọc sản phẩm**
**File:** `src/controllers/productSearchController.js`
- **Mục tiêu:** Để dàng chọn sản phẩm
- **Functions:** 9 functions (searchProducts, filterProducts, analytics, etc.)
- **Priority:** Must (2 điểm)

---

## 📁 **CẤU TRÚC THƯ MỤC**

```
backend/
├── 📄 server.js                    # Entry point chính
├── 📄 package.json                 # Dependencies và scripts
├── 📄 .gitignore                   # Git ignore rules
├── 📄 README.md                    # Tài liệu này
├── 📄 .env                         # Environment variables (tạo từ env.example)
│
├── 📁 src/                         # Source code chính
│   │
│   ├── 📁 config/                  # ⚙️ Cấu hình hệ thống
│   │   ├── 📄 database.js          # Cấu hình MongoDB
│   │   └── 📄 cloudinary.js        # Cấu hình Cloudinary
│   │
│   ├── 📁 controllers/             # 🎛️ Business logic controllers
│   │   ├── 📄 authController.js           # ✅ Authentication (Hoàn chỉnh)
│   │   ├── 📄 productController.js        # 🔗 Main controller (Tổng hợp)
│   │   ├── 📄 categoryManagementController.js  # 🎯 TASK 7 - NN
│   │   ├── 📄 productManagementController.js   # 🎯 TASK 8 - SD
│   │   ├── 📄 productImageController.js        # 🎯 TASK 9 - LC
│   │   └── 📄 productSearchController.js       # 🎯 TASK 10 - PT
│   │
│   ├── 📁 middleware/              # 🔧 Request processing
│   │   ├── 📄 auth.js              # ✅ JWT authentication
│   │   ├── 📄 adminAuth.js         # ✅ Admin authorization
│   │   ├── 📄 validation.js        # ✅ Input validation
│   │   ├── 📄 upload.js            # ✅ File upload handling
│   │   └── 📄 errorHandler.js      # ✅ Global error handling
│   │
│   ├── 📁 models/                  # 🗄️ Database schemas
│   │   ├── 📄 User.js              # ✅ User model (Hoàn chỉnh)
│   │   ├── 📄 Category.js          # 🔄 Category model (Placeholder)
│   │   └── 📄 Product.js           # 🔄 Product model (Placeholder)
│   │
│   ├── 📁 routes/                  # 🛣️ API routes
│   │   ├── 📄 authRoutes.js        # ✅ Authentication routes
│   │   ├── 📄 categoryRoutes.js    # 🔄 Category routes (Placeholder)
│   │   └── 📄 productRoutes.js     # 🔄 Product routes (Placeholder)
│   │
│   └── 📁 utils/                   # 🛠️ Utilities
│       ├── 📄 responseHelper.js    # ✅ API response standardization
│       ├── 📄 queryHelpers.js      # ✅ Database query helpers
│       ├── 📄 imageProcessor.js    # ✅ Image processing with Sharp
│       └── 📄 cloudinaryUpload.js  # ✅ Cloudinary integration
│
├── 📁 uploads/                     # 📂 Temporary file storage
└── 📁 node_modules/                # 📦 Dependencies
```

---

## 🔧 **HƯỚNG DẪN CÀI ĐẶT**

### **Bước 1: Prerequisites**
```bash
# Node.js version 16+ khuyến nghị
node --version
npm --version

# MongoDB (chọn 1 trong 3 options)
```

### **Bước 2: Cài đặt MongoDB**

**Option A: MongoDB Local**
```bash
# Windows - Download MongoDB Community Server
# https://www.mongodb.com/try/download/community
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud - Miễn phí)**
```bash
# Đăng ký tại: https://cloud.mongodb.com
# Tạo cluster và lấy connection string
```

**Option C: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### **Bước 3: Setup Project**
```bash
# Di chuyển vào thư mục backend
cd MyApp/backend

# Cài đặt dependencies
npm install

# Tạo file .env
echo "NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myapp_fresh_2024
JWT_SECRET=myapp_super_secret_key_2024_change_this
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=test_cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=test_secret
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp" > .env
```

---

## 🏃‍♂️ **HƯỚNG DẪN CHẠY**

### **1. Development Mode**
```bash
# Auto-restart khi code thay đổi
npm run dev
```

### **2. Production Mode**
```bash
npm start
```

### **3. Test Server**
```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected response:
# {"status": "OK", "message": "Server đang chạy"}
```

### **4. Logs mong đợi:**
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

### **🔐 Authentication (Hoàn chỉnh)**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/register` | Đăng ký người dùng | Public |
| `POST` | `/api/auth/login` | Đăng nhập | Public |
| `GET` | `/api/auth/profile` | Lấy profile | Private |
| `PUT` | `/api/auth/profile` | Cập nhật profile | Private |
| `PUT` | `/api/auth/change-password` | Đổi mật khẩu | Private |
| `POST` | `/api/auth/logout` | Đăng xuất | Private |

### **📂 Category Management (TASK 7 - NN)**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `GET` | `/api/categories` | Lấy tất cả danh mục | 🔄 TODO |
| `GET` | `/api/categories/:id` | Lấy danh mục theo ID | 🔄 TODO |
| `POST` | `/api/categories` | Tạo danh mục mới | 🔄 TODO |
| `PUT` | `/api/categories/:id` | Cập nhật danh mục | 🔄 TODO |
| `DELETE` | `/api/categories/:id` | Xóa danh mục | 🔄 TODO |
| `GET` | `/api/categories/:id/subcategories` | Lấy danh mục con | 🔄 TODO |
| `PUT` | `/api/categories/reorder` | Sắp xếp thứ tự | 🔄 TODO |
| `PUT` | `/api/categories/:id/toggle-status` | Bật/tắt danh mục | 🔄 TODO |

### **🛍️ Product Management (TASK 8 - SD)**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `GET` | `/api/products` | Lấy tất cả sản phẩm | 🔄 TODO |
| `GET` | `/api/products/:id` | Lấy sản phẩm theo ID | 🔄 TODO |
| `POST` | `/api/products` | Tạo sản phẩm mới | 🔄 TODO |
| `PUT` | `/api/products/:id` | Cập nhật sản phẩm | 🔄 TODO |
| `DELETE` | `/api/products/:id` | Xóa sản phẩm | 🔄 TODO |
| `PUT` | `/api/products/:id/stock` | Cập nhật kho hàng | 🔄 TODO |
| `GET` | `/api/products/featured` | Sản phẩm nổi bật | 🔄 TODO |
| `GET` | `/api/products/category/:id` | Sản phẩm theo danh mục | 🔄 TODO |
| `POST` | `/api/products/:id/duplicate` | Nhân bản sản phẩm | 🔄 TODO |

### **🖼️ Image Management (TASK 9 - LC)**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `POST` | `/api/products/:id/images` | Upload ảnh sản phẩm | 🔄 TODO |
| `GET` | `/api/products/:id/images` | Lấy danh sách ảnh | 🔄 TODO |
| `DELETE` | `/api/products/:id/images/:imageId` | Xóa ảnh | 🔄 TODO |
| `PUT` | `/api/products/:id/images/:imageId` | Cập nhật ảnh | 🔄 TODO |
| `PUT` | `/api/products/:id/images/reorder` | Sắp xếp ảnh | 🔄 TODO |
| `PUT` | `/api/products/:id/images/:imageId/set-main` | Đặt ảnh chính | 🔄 TODO |
| `POST` | `/api/products/:id/images/bulk-upload` | Upload từ URLs | 🔄 TODO |
| `POST` | `/api/products/:id/images/optimize` | Optimize ảnh | 🔄 TODO |

### **🔍 Search & Filter (TASK 10 - PT)**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `GET` | `/api/products/search` | Tìm kiếm sản phẩm | 🔄 TODO |
| `POST` | `/api/products/filter` | Lọc sản phẩm | 🔄 TODO |
| `GET` | `/api/products/search/suggestions` | Gợi ý tìm kiếm | 🔄 TODO |
| `GET` | `/api/products/:id/similar` | Sản phẩm tương tự | 🔄 TODO |
| `GET` | `/api/products/trending` | Sản phẩm trending | 🔄 TODO |
| `GET` | `/api/products/search/analytics` | Analytics tìm kiếm | 🔄 TODO |
| `POST` | `/api/products/search/track` | Tracking search | 🔄 TODO |
| `POST` | `/api/products/faceted-search` | Faceted search | 🔄 TODO |

### **⚡ System**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `GET` | `/health` | Health check | ✅ Ready |

---

## 🗄️ **DATABASE MODELS**

### **👤 User Model (Hoàn chỉnh)**
```javascript
{
  _id: ObjectId,
  username: String,      // Unique, 3-30 chars
  email: String,         // Unique, valid email
  password: String,      // Hashed với bcryptjs
  firstName: String,     // Họ
  lastName: String,      // Tên
  phoneNumber: String,   // Optional
  avatar: String,        // URL ảnh đại diện
  role: String,          // 'user' | 'admin'
  isActive: Boolean,     // Trạng thái tài khoản
  lastLogin: Date,       // Lần đăng nhập cuối
  createdAt: Date,       // Auto timestamps
  updatedAt: Date        // Auto timestamps
}
```

### **📂 Category Model (TODO - TASK 7)**
```javascript
// Sẽ được implement bởi NN
{
  _id: ObjectId,
  name: String,           // Tên danh mục
  description: String,    // Mô tả
  slug: String,          // URL slug
  image: String,         // URL ảnh danh mục
  parentCategory: ObjectId, // Danh mục cha (cho subcategory)
  isActive: Boolean,     // Trạng thái
  sortOrder: Number,     // Thứ tự sắp xếp
  createdBy: ObjectId,   // Người tạo
  createdAt: Date,
  updatedAt: Date
}
```

### **🛍️ Product Model (TODO - TASK 8)**
```javascript
// Sẽ được implement bởi SD
{
  _id: ObjectId,
  name: String,          // Tên sản phẩm
  description: String,   // Mô tả chi tiết
  sku: String,          // Mã sản phẩm (unique)
  price: Number,        // Giá bán
  category: ObjectId,   // Danh mục chính
  subcategory: ObjectId, // Danh mục con
  images: [Object],     // Mảng ảnh sản phẩm
  stock: {              // Quản lý kho
    quantity: Number,
    lowStockThreshold: Number,
    trackStock: Boolean
  },
  attributes: [Object], // Thuộc tính (size, color, etc.)
  tags: [String],       // Tags cho search
  isActive: Boolean,    // Trạng thái
  isFeatured: Boolean,  // Sản phẩm nổi bật
  rating: {             // Đánh giá
    average: Number,
    count: Number
  },
  views: Number,        // Lượt xem
  sales: Number,        // Lượt bán
  createdBy: ObjectId,  // Người tạo
  createdAt: Date,
  updatedAt: Date
}
```

---

## 👥 **DEVELOPMENT WORKFLOW**

### **🎯 Phân công theo SCRUM Tasks**

#### **NN - TASK 7 (Category Management)**
```bash
# Branch: feature/task-7-category-management
File: src/controllers/categoryManagementController.js
Focus: Database schema design, hierarchical data
Estimate: 3-5 days
```

#### **SD - TASK 8 (Product Management)**
```bash
# Branch: feature/task-8-product-management  
File: src/controllers/productManagementController.js
Focus: Complex business logic, CRUD operations
Estimate: 5-7 days
```

#### **LC - TASK 9 (Image Management)**
```bash
# Branch: feature/task-9-image-upload
File: src/controllers/productImageController.js
Focus: File processing, Cloudinary integration
Estimate: 4-6 days
```

#### **PT - TASK 10 (Search & Filter)**
```bash
# Branch: feature/task-10-search-filter
File: src/controllers/productSearchController.js
Focus: Search algorithms, MongoDB aggregation
Estimate: 6-8 days
```

### **📋 Development Process**

1. **Setup Branch**
   ```bash
   git checkout -b feature/task-X-name
   ```

2. **Implement Functions**
   - Mỗi developer làm riêng file controller của mình
   - Follow TODO comments trong file
   - Implement business logic

3. **Testing**
   ```bash
   # Test riêng functions của mình
   npm test -- --grep "TASK-X"
   ```

4. **Integration**
   - Tất cả functions tự động available trong `productController.js`
   - Main controller import từ các controller con
   - No conflict giữa các tasks

5. **Merge Strategy**
   ```bash
   # Merge từng task khi hoàn thành
   git checkout main
   git merge feature/task-X-name
   ```

---

## 💻 **TECHNOLOGIES**

### **🏗️ Core Framework**
- **Node.js** `v16+` - JavaScript runtime
- **Express.js** `v4.18+` - Web framework
- **MongoDB** `v5+` - NoSQL database
- **Mongoose** `v7+` - MongoDB ODM

### **🔐 Authentication & Security**
- **jsonwebtoken** - JWT token handling
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
- **jest** - Testing framework (ready)

---

## 🧪 **TESTING**

### **Test Authentication**
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
```

### **Test Health Check**
```bash
curl http://localhost:5000/health
# Response: {"status": "OK", "message": "Server đang chạy"}
```

---

## 🚨 **TROUBLESHOOTING**

### **❌ Lỗi: Cannot find module**
```bash
npm install
```

### **❌ Lỗi: MONGODB_URI is undefined**
```bash
# Tạo file .env với MONGODB_URI
echo "MONGODB_URI=mongodb://localhost:27017/myapp_fresh_2024" >> .env
```

### **❌ Lỗi: ECONNREFUSED MongoDB**
```bash
# Khởi động MongoDB
net start MongoDB

# Hoặc dùng Docker
docker run -d -p 27017:27017 mongo
```

### **❌ Lỗi: Port 5000 đã sử dụng**
```bash
# Tìm và kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Hoặc đổi port
echo "PORT=5001" >> .env
```

### **❌ Lỗi: JWT Secret**
```bash
# Đảm bảo JWT_SECRET không trống
echo "JWT_SECRET=your_actual_secret_key" >> .env
```

---

## 📞 **SUPPORT & NEXT STEPS**

### **🔄 Current Status:**
- ✅ Authentication system hoàn chỉnh
- ✅ Modular structure sẵn sàng
- ✅ 4 controller files với function signatures
- 🔄 Đang chờ implementation từ team

### **📋 Next Milestones:**
1. **Week 1**: NN hoàn thành Category Management
2. **Week 1-2**: SD hoàn thành Product Management  
3. **Week 2**: LC hoàn thành Image Upload
4. **Week 2-3**: PT hoàn thành Search & Filter
5. **Week 3**: Integration testing & deployment

### **📚 Documentation:**
- Mỗi developer đọc file controller tương ứng
- Follow TODO comments để implement
- Test API với Postman/cURL

---

**🎉 Backend structure sẵn sàng cho parallel development!**

**👥 Team có thể bắt đầu implement ngay từ bây giờ!**