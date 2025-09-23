# GoldenLock - Secure Authentication System

A full-stack authentication system built with Django REST Framework and React, featuring role-based access control, secure session management, and comprehensive user management.

## 🚀 Features

- **Secure Authentication**
  - JWT-based authentication with HTTP-only cookies
  - Password hashing and validation
  - Protection against common security vulnerabilities

- **Role-Based Access Control**
  - Admin and User role separation
  - Protected routes and API endpoints
  - Role-specific content and functionality

- **User Management**
  - User registration and login
  - Profile management
  - Password change functionality
  - Admin user management interface

- **Activity Monitoring**
  - Login activity tracking
  - Admin dashboard with statistics
  - User session management

## 🛠 Tech Stack

### Backend
- Django 5.2.6
- Django REST Framework 3.16.1
- SimpleJWT for authentication
- PostgreSQL database
- Custom User model

### Frontend
- React with Vite
- React Router for navigation
- Axios for API communication
- Context API for state management
- Custom toast notifications

## 📋 Prerequisites

- Python 3.12.3 or higher
- Node.js 22.19.0 or higher
- PostgreSQL database
- Virtual environment tool (venv)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Dellen17/GoldenLock.git
cd GoldenLock
```

2. **Backend Setup**
```bash
cd backend
python -m venv ll_gold
source ll_gold/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Environment Configuration**

Create `.env` file in the backend directory:
```env
DEBUG=True
SECRET_KEY=your_secret_key
DATABASE_URL=postgresql://user:password@localhost:5432/goldenlock
```

## 🚀 Running the Application

1. **Start the Backend**
```bash
cd backend
source ll_gold/bin/activate
python manage.py runserver
```

2. **Start the Frontend**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Admin Interface: http://localhost:8000/admin

## 🔒 Security Features

- HTTP-only cookies for JWT storage
- CSRF protection
- Password hashing
- Role-based access control
- Activity logging
- Protected routes
- Secure password validation

## 📱 Features Overview

### User Features
- Registration and login
- Profile management
- Password changes
- Login history viewing
- Role-specific access

### Admin Features
- User management interface
- Activity monitoring
- System statistics
- User role management
- Login history tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

Your Name
- GitHub: [@Dellen17](https://github.com/Dellen17)
- LinkedIn: [Gabriel Katara](https://linkedin.com/in/gabriel-katara)

## 🙏 Acknowledgments

- Django REST Framework documentation
- React documentation
- SimpleJWT documentation
- PostgreSQL documentation

---
⌨️ with ❤️ by [Gabriel Dellen Katara] 😊