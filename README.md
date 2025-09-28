# TenTwenty Backend - Node.js/Express API

This is the backend API server for the TenTwenty timesheet management system, built with Node.js, Express.js, and modern web technologies.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   # Create .env file
   touch .env
   ```
   
   Add the following to your `.env` file:
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the production server**
   ```bash
   npm start
   ```

The API will be available at `http://localhost:5000`

## 🛠️ Frameworks & Libraries Used

### Core Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js 4.18.2** - Web application framework
- **CORS 2.8.5** - Cross-origin resource sharing middleware

### Authentication & Security
- **jsonwebtoken 9.0.2** - JWT token generation and verification
- **bcryptjs 2.4.3** - Password hashing and comparison
- **express-validator 7.2.1** - Input validation and sanitization

### Database & Data Management
- **Mongoose 7.5.0** - MongoDB object modeling (configured but using JSON files)
- **File System (fs)** - JSON file-based data persistence
- **Path** - File path utilities

### Development Tools
- **nodemon 3.1.10** - Development server with auto-restart
- **dotenv 16.6.1** - Environment variable management

## 📁 Project Structure

```
backend/
├── controllers/           # Route controllers
│   ├── authController.js  # Authentication logic
│   └── timesheetController.js  # Timesheet CRUD operations
├── data/                 # JSON data storage
│   ├── users.json        # User data
│   └── timesheets.json   # Timesheet data
├── middleware/           # Custom middleware
│   └── auth.js           # JWT authentication middleware
├── models/               # Data models
│   └── User.js           # User model (Mongoose)
├── routes/               # API routes
│   ├── auth.js           # Authentication routes
│   ├── timesheets.js     # Timesheet routes
│   └── index.js          # Main route handler
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | User login | No |
| GET | `/profile` | Get user profile | Yes |

### Timesheet Routes (`/api/timesheets`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's timesheets | Yes |
| GET | `/all` | Get all timesheets (Admin only) | Yes |
| GET | `/:id` | Get specific timesheet | Yes |
| POST | `/` | Create new timesheet | Yes |
| PUT | `/:id` | Update timesheet | Yes |
| DELETE | `/:id` | Delete timesheet | Yes |

## 📋 API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "employee"
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Timesheets

#### Get User's Timesheets
```http
GET /api/timesheets
Authorization: Bearer <token>
```

#### Create Timesheet
```http
POST /api/timesheets
Authorization: Bearer <token>
Content-Type: application/json

{
  "weekStarting": "2025-01-06",
  "weekEnding": "2025-01-12",
  "entries": [
    {
      "date": "2025-01-06",
      "hours": 8,
      "description": "Project development",
      "project": "TenTwenty"
    }
  ]
}
```

#### Update Timesheet
```http
PUT /api/timesheets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "weekStarting": "2025-01-06",
  "weekEnding": "2025-01-12",
  "entries": [...]
}
```

#### Delete Timesheet
```http
DELETE /api/timesheets/:id
Authorization: Bearer <token>
```

## 🔐 Authentication & Security

### JWT Token Structure
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "employee",
  "iat": 1640995200,
  "exp": 1641600000
}
```

### Password Security
- Passwords are hashed using bcryptjs with salt rounds
- Default salt rounds: 12
- Passwords are never stored in plain text

### Token Management
- JWT tokens expire after 7 days (configurable)
- Tokens are verified on protected routes
- Invalid/expired tokens return 403 status

## 📊 Data Models

### User Model
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$12$...", // hashed
  "role": "employee" // or "admin"
}
```

### Timesheet Model
```json
{
  "id": 1,
  "userId": 1,
  "weekStarting": "2025-01-06",
  "weekEnding": "2025-01-12",
  "totalHours": 40,
  "entries": [
    {
      "id": 1,
      "date": "2025-01-06",
      "hours": 8,
      "description": "Project development",
      "project": "TenTwenty"
    }
  ]
}
```

## 🚨 Assumptions & Notes

1. **Data Storage**: Currently using JSON files instead of a database
2. **Authentication**: JWT-based authentication with 7-day expiration
3. **Role Management**: Basic role-based access (employee/admin)
4. **Validation**: Server-side validation using express-validator
5. **CORS**: Enabled for all origins in development
6. **Error Handling**: Centralized error handling middleware
7. **Security**: Passwords hashed with bcryptjs, JWT for sessions
8. **File Persistence**: Data is persisted to JSON files on disk
9. **Environment Variables**: Optional, with fallback values
10. **API Responses**: Consistent JSON response format

## ⏱️ Development Time

### Backend Development (6-8 hours total)
- **Project Setup & Configuration**: 1 hour
  - Express server setup
  - Middleware configuration
  - Environment setup
- **API Development**: 3-4 hours
  - Authentication endpoints
  - CRUD operations for timesheets
  - Input validation
  - Error handling
- **Database Integration**: 1-2 hours
  - JSON file structure design
  - Data persistence logic
  - Data loading/saving utilities
- **Testing & Debugging**: 1-2 hours
  - API endpoint testing
  - Error handling verification
  - Security implementation

## 🔧 Available Scripts

### `npm start`
Starts the production server using Node.js

### `npm run dev`
Starts the development server with nodemon for auto-restart

### `npm test`
Runs the test suite (currently not implemented)

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables for Production
```env
PORT=5000
JWT_SECRET=your_production_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
```

### Deployment Options
- **Heroku** - Use the Node.js buildpack
- **Railway** - Connect your GitHub repository
- **DigitalOcean App Platform** - Deploy from Git
- **AWS EC2** - Deploy on virtual server
- **Render** - Connect your GitHub repository

## 🧪 Testing

### Manual API Testing
Use tools like Postman, Insomnia, or curl to test endpoints:

```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Test protected route
curl -X GET http://localhost:5000/api/timesheets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Automated Testing
```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Database Configuration (if using MongoDB)
MONGODB_URI=mongodb://localhost:27017/tentwenty
```

### CORS Configuration
The server is configured to allow all origins in development. For production, update the CORS settings in `server.js`:

```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

## 📱 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request** - Invalid input data
- **401 Unauthorized** - Missing or invalid token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server errors

All errors return a consistent JSON format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Jatin Goel** - Full Stack Developer

---

For the complete project documentation, see the main [README.md](../README.md)
