# CRM Lead Management System

A full-stack CRM application for managing client leads with React frontend and Node.js/Express backend.

## Features

- ✅ Lead listing (name, email, source, status)
- ✅ Lead status updates (new / contacted / converted / lost)
- ✅ Notes and follow-ups for each lead
- ✅ Secure admin access

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` file and update the values:
   ```
   MONGODB_URI=mongodb://localhost:27017/crm
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

4. Start MongoDB service (if using local MongoDB)

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the root directory:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## Usage

1. Register a new admin account or login with existing credentials
2. Add new leads through the "Add Lead" button
3. Click on any lead card to view details and add notes
4. Update lead status and information
5. Track follow-ups and conversions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Leads
- `GET /api/leads` - Get all leads for user
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/leads/:id/notes` - Get notes for lead
- `POST /api/leads/:id/notes` - Add note to lead
- `DELETE /api/leads/:id/notes/:noteId` - Delete note

## Project Structure

```
CRM-main/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Lead.js
│   │   └── LeadNote.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── leads.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── src/
│   ├── components/
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── LeadCard.tsx
│   │   ├── AddLeadModal.tsx
│   │   └── LeadDetailModal.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   └── api.ts
│   └── ...
├── package.json
├── vite.config.ts
└── README.md
```

## Skills Gained

- CRUD operations implementation
- Backend API development with Express
- Database management with MongoDB
- JWT authentication
- React state management
- Full-stack application architecture
- RESTful API design
