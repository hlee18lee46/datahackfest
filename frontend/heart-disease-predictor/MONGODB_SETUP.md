# MongoDB Setup for CardioAssess

## Prerequisites

1. Install MongoDB locally or use MongoDB Atlas (cloud service)
2. Node.js and npm installed

## Local MongoDB Setup

### 1. Install MongoDB Community Edition
- Download from: https://www.mongodb.com/try/download/community
- Follow installation instructions for your OS

### 2. Start MongoDB Service
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 3. Create Database
Connect to MongoDB and create the database:
```bash
mongosh
use cardioassess
```

## MongoDB Atlas Setup (Recommended for Production)

### 1. Create Atlas Account
- Go to https://www.mongodb.com/atlas
- Create a free account

### 2. Create Cluster
- Create a new cluster (free tier available)
- Choose your preferred region

### 3. Get Connection String
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string

## Environment Configuration

Create a `.env.local` file in the project root with:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/cardioassess
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cardioassess?retryWrites=true&w=majority

# Other environment variables
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Database Schema

The application will automatically create the following collections:

### assessments
```json
{
  "_id": "ObjectId",
  "patientData": {
    "Age": "string",
    "Sex": "string", 
    "ChestPainType": "string",
    "RestingBP": "string",
    "Cholesterol": "string",
    "FastingBS": "string",
    "RestingECG": "string",
    "MaxHR": "string",
    "ExerciseAngina": "string",
    "Oldpeak": "string",
    "ST_Slope": "string"
  },
  "heartDiseaseStatus": "string",
  "doctorNotes": "string",
  "timestamp": "Date",
  "doctorId": "string",
  "status": "string"
}
```

## Testing the Connection

1. Start the development server:
```bash
npm run dev
```

2. Navigate to http://localhost:3000
3. Login with demo credentials (doctor/password)
4. Create a new assessment
5. Check that data is saved to MongoDB

## Troubleshooting

### Connection Issues
- Ensure MongoDB service is running
- Check connection string format
- Verify network access (for Atlas)

### Database Access
- Ensure database user has read/write permissions
- Check IP whitelist for Atlas connections

### Application Errors
- Check browser console for errors
- Verify environment variables are loaded
- Ensure MongoDB driver is installed 