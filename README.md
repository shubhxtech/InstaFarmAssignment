# 👥 Full Stack User Management App

This project is a **Recruitment Assignment** for a Full Stack Developer role. It implements a user management system with full CRUD functionality, a follower-following system, and a dashboard UI. Built using **React**, **Express.js**, **PostgreSQL (Aiven)**, and **Prisma ORM**.

## 🎥 Demo Video

👉 [Watch on YouTube](https://youtu.be/r5LGnDPCvXM)

## ✨ Features

- Create, read, update, and delete user profiles
- Each user profile includes:
  - Name
  - Email
  - Phone
  - Date of Birth (DOB)
  - Auto-calculated Age
- Users can follow/unfollow each other
- View:
  - Number of followers
  - Number of users followed
- Dashboard page shows all user profiles and relationship info
- Edit user details and follow list from the dashboard
- Create new users through a dedicated form

## 🧱 Tech Stack

- **Frontend:** React
- **Backend:** Express.js (Node.js)
- **Database:** PostgreSQL (hosted on Aiven)
- **ORM:** Prisma
- **Authentication:** JWT
- **Other Dependencies:** dotenv, bcryptjs, cors

## 📁 Project Structure

backend/
├── controllers/
│ ├── authController.js
│ └── userController.js
├── middleware/
│ ├── auth.js
│ └── validation.js
├── prisma/
│ ├── schema.prisma
│ └── migrations/
├── routes/
│ ├── authRoutes.js
│ ├── index.js
│ └── userRoutes.js
├── .env
├── index.js
├── package.json
└── package-lock.json

frontend/
└── ... (React App)


## ⚙️ Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install

2. **Create .env File**
PORT=5000
DATABASE_URL=your_aiven_postgresql_connection_string
JWT_SECRET=your_jwt_secret

3. **Prisma Setup**
npx prisma generate
npx prisma migrate dev --name init

4. Run

Feel free to reach out if you have any questions or need additional info.


