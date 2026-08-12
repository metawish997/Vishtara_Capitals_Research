# Stock Market Backend

A scalable Node.js/Express backend for a Stock Market application.

## Folder Structure
- `config/`: Configuration files (Database, etc.)
- `controllers/`: Business logic for each route
- `middlewares/`: Custom Express middlewares (Error handling, Auth, etc.)
- `models/`: Mongoose schemas for MongoDB
- `routes/`: API endpoint definitions
- `utils/`: Helper functions and utility classes
- `server.js`: Entry point of the application

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (optional, can use mock data)

### Installation
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
Update the `.env` file with your credentials:
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: Your MongoDB connection string
- `FINNHUB_API_KEY`: API key from finnhub.io (optional)

### Running the Server
- Development mode: `npm run dev`
- Production mode: `npm start`

## API Endpoints

### Stocks
- `GET /api/v1/stocks`: Get all stocks
- `GET /api/v1/stocks/:symbol`: Get stock details by symbol
- `GET /api/v1/stocks/quote/:symbol`: Get real-time stock quote
