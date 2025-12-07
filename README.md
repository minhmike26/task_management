# 📋 Task Management System

**English** | [Tiếng Việt](#tiếng-việt)

A full-stack task management application built with React and Node.js. The system allows users to register, login, and manage personal tasks with features such as priority classification, progress tracking, and statistics.

---

## 🇻🇳 Tiếng Việt

Ứng dụng quản lý công việc (Task Management) full-stack được xây dựng với React và Node.js. Hệ thống cho phép người dùng đăng ký, đăng nhập và quản lý các công việc cá nhân với các tính năng như phân loại theo độ ưu tiên, theo dõi tiến độ, và thống kê.

## 🚀 Main Features / Tính năng chính

**English:**

- ✅ **Authentication**: User registration and login with JWT
- ✅ **CRUD Tasks**: Create, read, update, and delete tasks
- ✅ **Priority Management**: Classify tasks by priority (Low, Medium, High)
- ✅ **Due Date Tracking**: Track task deadlines
- ✅ **Task Filtering**: Filter tasks by status, priority, and time
- ✅ **Statistics Dashboard**: Overview statistics of tasks
- ✅ **Profile Management**: Manage personal information and change password
- ✅ **Responsive Design**: User-friendly interface, compatible with all devices

**Tiếng Việt:**

- ✅ **Authentication**: Đăng ký và đăng nhập với JWT
- ✅ **CRUD Tasks**: Tạo, xem, cập nhật và xóa công việc
- ✅ **Priority Management**: Phân loại công việc theo độ ưu tiên (Low, Medium, High)
- ✅ **Due Date Tracking**: Theo dõi ngày hết hạn của công việc
- ✅ **Task Filtering**: Lọc công việc theo trạng thái, độ ưu tiên, và thời gian
- ✅ **Statistics Dashboard**: Thống kê tổng quan về công việc
- ✅ **Profile Management**: Quản lý thông tin cá nhân và đổi mật khẩu
- ✅ **Responsive Design**: Giao diện thân thiện, tương thích với mọi thiết bị

## 🛠️ Công nghệ sử dụng

### Frontend

- **React 19** - UI Framework
- **React Router** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **React Toastify** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 System Requirements / Yêu cầu hệ thống

**English:**

- **Node.js**: >= 16.x
- **npm** or **yarn**
- **MongoDB**: >= 4.4 (can use MongoDB Atlas or local)

**Tiếng Việt:**

- **Node.js**: >= 16.x
- **npm** hoặc **yarn**
- **MongoDB**: >= 4.4 (có thể sử dụng MongoDB Atlas hoặc local)

## 🔧 Installation / Cài đặt

### Step 1: Clone repository / Bước 1: Clone repository

```bash
git clone https://github.com/minhmike26/task_management.git
cd task_management
```

### Step 2: Install Backend / Bước 2: Cài đặt Backend

```bash
cd backend
npm install
```

### Step 3: Install Frontend / Bước 3: Cài đặt Frontend

```bash
cd ../frontend
npm install
```

### Step 4: Configure Environment Variables / Bước 4: Cấu hình Environment Variables

#### Backend (.env)

**English:** Create a `.env` file in the `backend/` directory with the following content:

**Tiếng Việt:** Tạo file `.env` trong thư mục `backend/` với nội dung:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task_management
JWT_SECRET=your_secret_key_here
TOKEN_EXPIRY=7d
```

**English Notes:**

- Replace `your_secret_key_here` with a random secret string
- If using MongoDB Atlas, replace `MONGO_URI` with the connection string from Atlas
- MongoDB Atlas example: `mongodb+srv://username:password@cluster.mongodb.net/task_management`

**Lưu ý:**

- Thay `your_secret_key_here` bằng một chuỗi bí mật ngẫu nhiên
- Nếu sử dụng MongoDB Atlas, thay `MONGO_URI` bằng connection string từ Atlas
- Ví dụ MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/task_management`

#### Frontend

**English:** The frontend uses the default API endpoint `http://localhost:5000`. If you change the backend port, you need to update it in the component files.

**Tiếng Việt:** Frontend sử dụng API endpoint mặc định là `http://localhost:5000`. Nếu bạn thay đổi port backend, cần cập nhật trong các file component.

## 🚀 Running the Application / Chạy ứng dụng

### Run Backend / Chạy Backend

**English:** Open a terminal and run:

**Tiếng Việt:** Mở terminal và chạy:

```bash
cd backend
npm start
```

**English:** Backend will run at: `http://localhost:5000`

**Tiếng Việt:** Backend sẽ chạy tại: `http://localhost:5000`

### Run Frontend / Chạy Frontend

**English:** Open a new terminal and run:

**Tiếng Việt:** Mở terminal mới và chạy:

```bash
cd frontend
npm run dev
```

**English:** Frontend will run at: `http://localhost:5173` (or another port if 5173 is already in use)

**Tiếng Việt:** Frontend sẽ chạy tại: `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng)

### Access the Application / Truy cập ứng dụng

**English:** Open your browser and navigate to: `http://localhost:5173`

**Tiếng Việt:** Mở trình duyệt và truy cập: `http://localhost:5173`

## 📁 Cấu trúc thư mục

```
task_management/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── taskController.js  # Task business logic
│   │   └── userController.js  # User business logic
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── taskModel.js       # Task schema
│   │   └── userModel.js       # User schema
│   ├── routes/
│   │   ├── taskRoute.js       # Task routes
│   │   └── userRoute.js       # User routes
│   ├── server.js              # Entry point
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   │   └── dummy.jsx       # Constants and utilities
    │   ├── components/
    │   │   ├── Layout.jsx      # Main layout
    │   │   ├── Login.jsx      # Login component
    │   │   ├── Signup.jsx     # Signup component
    │   │   ├── Navbar.jsx     # Navigation bar
    │   │   ├── Sidebar.jsx    # Sidebar navigation
    │   │   ├── Profile.jsx    # User profile
    │   │   ├── TaskItem.jsx   # Task item component
    │   │   └── TaskModal.jsx  # Task create/edit modal
    │   ├── pages/
    │   │   ├── Dashboard.jsx  # Main dashboard
    │   │   ├── PendingPage.jsx # Pending tasks page
    │   │   └── CompletePage.jsx # Completed tasks page
    │   ├── App.jsx            # Main app component
    │   ├── main.jsx           # Entry point
    │   └── index.css          # Global styles
    ├── package.json
    └── vite.config.js
```

## 🔌 API Endpoints

### Authentication

**English:**

- `POST /api/user/register` - Register new account
- `POST /api/user/login` - Login
- `GET /api/user/me` - Get current user information (Protected)
- `PUT /api/user/profile` - Update profile information (Protected)
- `PUT /api/user/password` - Change password (Protected)

**Tiếng Việt:**

- `POST /api/user/register` - Đăng ký tài khoản mới
- `POST /api/user/login` - Đăng nhập
- `GET /api/user/me` - Lấy thông tin user hiện tại (Protected)
- `PUT /api/user/profile` - Cập nhật thông tin profile (Protected)
- `PUT /api/user/password` - Đổi mật khẩu (Protected)

### Tasks

**English:**

- `GET /api/task/gp` - Get all user tasks (Protected)
- `POST /api/task/gp` - Create new task (Protected)
- `GET /api/task/:id/gp` - Get task by ID (Protected)
- `PUT /api/task/:id/gp` - Update task (Protected)
- `DELETE /api/task/:id/gp` - Delete task (Protected)

**Tiếng Việt:**

- `GET /api/task/gp` - Lấy tất cả tasks của user (Protected)
- `POST /api/task/gp` - Tạo task mới (Protected)
- `GET /api/task/:id/gp` - Lấy task theo ID (Protected)
- `PUT /api/task/:id/gp` - Cập nhật task (Protected)
- `DELETE /api/task/:id/gp` - Xóa task (Protected)

**English Note:** All task endpoints require JWT token in header:

**Lưu ý:** Tất cả các endpoint task đều yêu cầu JWT token trong header:

```
Authorization: Bearer <your_token>
```

## 📝 API Usage Examples / Ví dụ sử dụng API

### Register / Đăng ký

```bash
POST http://localhost:5000/api/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login / Đăng nhập

```bash
POST http://localhost:5000/api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Task / Tạo Task

```bash
POST http://localhost:5000/api/task/gp
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management project",
  "priority": "High",
  "dueDate": "2024-12-31",
  "completed": "No"
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error / Lỗi kết nối MongoDB

**English:**

- Check if MongoDB is installed and running
- Verify `MONGO_URI` in `.env` file is correct
- If using MongoDB Atlas, check IP whitelist

**Tiếng Việt:**

- Kiểm tra MongoDB đã được cài đặt và đang chạy
- Kiểm tra `MONGO_URI` trong file `.env` có đúng không
- Nếu dùng MongoDB Atlas, kiểm tra IP whitelist

### CORS Error / Lỗi CORS

**English:**

- Ensure backend has CORS configured correctly
- Check if frontend is calling the correct API endpoint

**Tiếng Việt:**

- Đảm bảo backend đã cấu hình CORS đúng cách
- Kiểm tra frontend đang gọi đúng API endpoint

### JWT Error / Lỗi JWT

**English:**

- Check if token is stored in localStorage
- Check if token has expired
- Verify `JWT_SECRET` in `.env` file

**Tiếng Việt:**

- Kiểm tra token có được lưu trong localStorage không
- Kiểm tra token có hết hạn không
- Kiểm tra `JWT_SECRET` trong file `.env`

### Port Already in Use / Port đã được sử dụng

**English:**

- Change port in `.env` file (backend) or `vite.config.js` (frontend)
- Or stop the process using that port

**Tiếng Việt:**

- Thay đổi port trong file `.env` (backend) hoặc `vite.config.js` (frontend)
- Hoặc dừng process đang sử dụng port đó

## 📦 Production Build / Build cho Production

### Build Frontend

```bash
cd frontend
npm run build
```

**English:** Files will be built into the `frontend/dist/` directory

**Tiếng Việt:** Files sẽ được build vào thư mục `frontend/dist/`

### Preview Production Build

```bash
cd frontend
npm run preview
```

## 👤 Author / Tác giả

- **Xuan Minh** - [GitHub Repository](https://github.com/minhmike26/task_management.git)

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- React Team
- Express.js Community
- MongoDB Team
- Tailwind CSS Team