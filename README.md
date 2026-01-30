# HealthPulse Backend API

Complete Node.js/Express backend for the HealthPulse healthcare monitoring application.

## Features

- **Authentication**: JWT-based authentication for patients and providers
- **Patient Management**: CRUD operations, vitals tracking, medical history
- **Provider Management**: Professional profiles, patient assignments
- **Database**: MongoDB with Mongoose ODM
- **Security**: Password hashing with bcrypt, protected routes

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── Patient.js            # Patient schema
│   └── Provider.js           # Provider schema
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── patientController.js  # Patient operations
│   └── providerController.js # Provider operations
├── middleware/
│   └── auth.js               # JWT authentication
├── routes/
│   ├── auth.js               # Auth endpoints
│   ├── patients.js           # Patient endpoints
│   └── providers.js          # Provider endpoints
├── .env                      # Environment variables
├── .gitignore
├── package.json
└── server.js                 # Main server file
```

## Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**:
   - Update `.env` file with your MongoDB URI
   - Change JWT_SECRET to a secure random string

3. **Start MongoDB**:
   - Ensure MongoDB is running locally on port 27017
   - Or use MongoDB Atlas cloud database

4. **Run the server**:
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthcare
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register/patient` - Register new patient
- `POST /api/auth/register/provider` - Register new provider
- `POST /api/auth/login` - Login (patient or provider)
- `GET /api/auth/me` - Get current user (protected)

### Patients (`/api/patients`)

- `GET /api/patients` - Get all patients (protected)
- `GET /api/patients/:id` - Get patient by ID (protected)
- `PUT /api/patients/:id` - Update patient profile (protected)
- `PUT /api/patients/:id/vitals` - Update patient vitals (protected)
- `POST /api/patients/:id/medical-history` - Add medical history (protected)

### Providers (`/api/providers`)

- `GET /api/providers/:id` - Get provider by ID (protected)
- `PUT /api/providers/:id/profile` - Complete provider profile (protected)
- `GET /api/providers/:id/patients` - Get assigned patients (protected)
- `POST /api/providers/:id/patients/:patientId` - Assign patient (protected)

## Usage Examples

### Register Patient

```bash
POST http://localhost:5000/api/auth/register/patient
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "phone": "+1234567890",
  "address": "123 Main St, City, State"
}
```

### Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "userType": "patient"
}
```

### Update Provider Profile

```bash
PUT http://localhost:5000/api/providers/:id/profile
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "specialization": "Cardiology",
  "licenseNumber": "MD123456",
  "yearsOfExperience": 10,
  "hospitalAffiliation": "City General Hospital",
  "bio": "Experienced cardiologist..."
}
```

## Database Models

### Patient Schema
- Personal info (name, email, DOB, gender, phone, address)
- Hashed password
- Vitals (heart rate, blood pressure, temperature, oxygen level)
- Medical history array
- Timestamps

### Provider Schema
- Personal info (name, email)
- Hashed password
- Professional info (specialization, license, experience, affiliation, bio)
- Assigned patients array
- Timestamps

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for stateless authentication
- Protected routes with auth middleware
- Password field excluded from queries by default
- CORS enabled for frontend communication

## Development

- Uses nodemon for auto-restart during development
- Error handling and logging
- Input validation
- MongoDB connection retry logic

## License

ISC
