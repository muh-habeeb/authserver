# 🔐 Auth Server

A modern, full-stack authentication system built with Node.js, Express, React, and MongoDB. Features secure user registration, email verification, password reset functionality, and professional email integration with Gmail.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen)
![React](https://img.shields.io/badge/react-%5E19.1.1-blue)

## ✨ Features

### 🔑 Authentication
- **User Registration** - Secure account creation with email verification
- **Email Verification** - 6-digit verification codes with expiration
- **User Login** - JWT-based authentication with HTTP-only cookies
- **Password Reset** - Secure password reset via email links
- **Protected Routes** - Middleware-based route protection

### 📧 Email System
- **Gmail Integration** - Professional email sending via Nodemailer
- **Responsive Templates** - Beautiful HTML email templates
- **Multiple Email Types**:
  - Welcome emails
  - Verification codes
  - Password reset links
  - Reset confirmation

### 🎨 Frontend
- **React 19** - Modern React with hooks and context
- **Tailwind CSS** - Beautiful, responsive design
- **Framer Motion** - Smooth animations and transitions
- **React Hot Toast** - User-friendly notifications
- **Axios** - HTTP client for API communication

### 🛡️ Security
- **bcryptjs** - Password hashing
- **JWT Tokens** - Secure authentication tokens
- **HTTP-Only Cookies** - XSS protection
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Express validator integration
- **Token Expiration** - Automatic token and code expiry

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Gmail account with App Password

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/muh-habeeb/authserver.git
   cd authserver
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   npm install --prefix frontend
   ```

3. **Environment Setup**

   
   Create a `.env` file in the root directory:
   - Refer .env.example
   ```env
   # Database
   MONGO_URL=mongodb://localhost:27017/auth
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key
   
   # Client
   CLIENT_URL=http://localhost:5000
   
   # Gmail Configuration
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   GMAIL_SENDER_NAME=Auth Service
   ```

4. **Gmail Setup**
   - Enable 2-Factor Authentication on your Gmail account
   - Generate an App Password:
     - Go to Google Account → Security → 2-Step Verification → App passwords
     - Select "Mail" and generate password
     -or search for app password and create one with your desired name
     - Use the 16-character password (no spaces)

5. **Start the application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev
   
     
   # Start Backend only
   npm run backend

    # Start frontend only
   npm run frontend

   # Production mode
   npm run start
   ```

## 📁 Project Structure

```
authserver/
├── backend/
│   ├── controllers/
│   │   └── auth.controller.js      # Authentication logic
│   ├── db/
│   │   └── connectDb.js            # Database connection
│   ├── mailtrap/
│   │   ├── gmail.config.js         # Gmail configuration
│   │   ├── gmail.emails.js         # Email functions
│   │   └── emailTemplate.js        # HTML email templates
│   ├── middleware/
│   │   └── verifyToken.js          # JWT verification
│   ├── model/
│   │   └── user.model.js           # User schema
│   ├── routes/
│   │   └── auth.route.js           # Authentication routes
│   ├── util/
│   │   └── genJwtAndSetCookie.js   # JWT utilities
│   ├── index.js                    # Server entry point
│   └── testGmail.js               # Email testing utility
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── store/                 # State management
│   │   ├── utils/                 # Utility functions
│   │   └── App.jsx                # Main app component
│   │   └── Main.jsx               # Main app
│   ├── public/                   # Static assets
│   └── package.json             # Frontend dependencies
├── package.json                 # Backend dependencies
├── .env                        # Environment variables
└── README.md                   # This file
```

## 🚀 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/signup` | Register new user |
| `POST` | `/verify-account` | Verify email with code |
| `POST` | `/signin` | User login |
| `POST` | `/signout` | User logout |
| `POST` | `/forgot-password` | Request password reset |
| `POST` | `/reset-password/:token` | Reset password |
| `GET` | `/check-auth` | Check authentication status |

### Request Examples

**User Registration**
```javascript
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Email Verification**
```javascript
POST /api/auth/verify-account
{
  "code": "123456"
}
```

**User Login**
```javascript
POST /api/auth/signin
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

## 🧪 Testing

### Test Gmail Configuration
```bash
node backend/testGmail.js
```

This will:
- Verify Gmail connection
- Send a test email to your configured Gmail account
- Display connection status and any errors

### Manual Testing
1. Start the application
2. Navigate to `http://localhost:5000`  
3. Test the registration flow:
   - Sign up with your email
   - Check your Gmail for verification code
   - Verify your account
   - Check for welcome email

##  Available Scripts

### Backend
- `npm run dev` - Start backend in development mode with nodemon
- `npm run start` - Start backend in production mode
- `npm test` - Run tests (to be implemented)

### Frontend
- `npm run frontend` - Start frontend development server
- `npm run build` - Build frontend for production

### Full Stack
- `npm run build && npm run start`  - Build entire application for production

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **HTTP-Only Cookies**: Protection against XSS attacks
- **Input Validation**: Server-side validation with express-validator
- **CORS Configuration**: Controlled cross-origin requests
- **Token Expiration**: Automatic cleanup of expired tokens
- **Email Verification**: Prevent fake account creation

## 🌐 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URL=your_production_mongodb_url
CLIENT_URL=your_production_client_url
```

### Build for Production
```bash
npm run build
npm run start
```

This will:
1. Install all dependencies
2. Build the React frontend
2. Start the server
3. Prepare for production deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💳 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**muh-habeeb**
- GitHub: [@muh-habeeb](https://github.com/muh-habeeb)

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/muh-habeeb/authserver/issues) page
2. Run the Gmail test: `node backend/testGmail.js`
3. Check your environment variables
4. Verify MongoDB connection
5. Create a new issue with detailed error information

##  Future Enhancements


- [ ] API documentation with Swagger

---

⭐ **Star this repository if you found it helpful!**
│   │   └── 📄 auth.controller.js
│   ├── 📁 db/
│   │   └── 📄 connectDb.js
│   ├── 📁 mailtrap/
│   │   ├── 📄 emailTemplate.js
│   │   ├── 📄 emails.js
│   │   └── 📄 mailtrap.config.js
│   ├── 📁 middleware/
│   │   └── 📄 verifyToken.js
│   ├── 📁 model/
│   │   └── 📄 user.model.js
│   ├── 📁 routes/
│   │   └── 📄 auth.route.js
│   ├── 📁 util/
│   │   └── 📄 genJwtAndSetCookie.js
│   └── 📄 index.js
├── 📁 frontend/
│   ├── 📁 node_modules/ 🚫 (auto-hidden)
│   ├── 📁 public/
│   │   └── 🖼️ vite.svg
│   ├── 📁 src/
│   │   ├── 📁 assets/
│   │   │   └── 🖼️ react.svg
│   │   ├── 📁 components/
│   │   │   ├── 📄 FloatingShape.jsx
│   │   │   ├── 📄 Input.jsx
│   │   │   └── 📄 PasswordStrengthMeter.jsx
│   │   ├── 📁 pages/
│   │   │   ├── 📄 SignIn.jsx
│   │   │   └── 📄 SignUp.jsx
│   │   ├── 📄 App.jsx
│   │   ├── 🎨 index.css
│   │   └── 📄 main.jsx
│   ├── 🚫 .gitignore
│   ├── 📖 README.md
│   ├── 📄 eslint.config.js
│   ├── 🌐 index.html
│   ├── 📄 package-lock.json
│   ├── 📄 package.json
│   └── 📄 vite.config.js
├── 📁 node_modules/ 🚫 (auto-hidden)
├── 🔒 .env 🚫 (auto-hidden)
├── 🚫 .gitignore
├── 📖 ReadMe.md
├── 📄 package-lock.json
├── 📄 package.json
└── 📝 todo.md
```

---
*Generated by FileTree Pro Extension*
