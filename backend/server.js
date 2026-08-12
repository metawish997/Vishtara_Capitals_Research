const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const cacheHeadersMiddleware = require('./middlewares/cacheHeadersMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
  // Auto-update Angel One scrip master data in background
  const ScripMasterService = require('./services/angel/ScripMasterService');
  ScripMasterService.checkAndUpdateIfNeeded().catch(err => console.error('ScripMasterService Error:', err));
});

const app = express();

// ── Compression — Gzip all API responses (Brotli handled by Nginx for statics) ──
// Must be applied BEFORE routes, AFTER express setup
let compressionMiddleware = null;
try {
  const compression = require('compression');
  compressionMiddleware = compression({
    // Only compress responses larger than 1kb
    threshold: 1024,
    // Compress: JSON, HTML, CSS, JS, SVG, plain text
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    },
    level: 6, // Balanced speed/ratio (1=fastest, 9=best compression)
  });
  app.use(compressionMiddleware);
} catch (e) {
  console.warn('[server] compression package not installed — run: npm install compression'.yellow);
}

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static folders — served with long-term cache headers (1 year, immutable)
// Vite builds use content-hashed filenames so this is safe
const path = require('path');
const uploadsPath = path.resolve(__dirname, 'uploads');
const publicUploadsPath = path.resolve(__dirname, 'public', 'uploads');

const staticCacheOptions = {
  maxAge: '1y',          // 1 year browser cache
  immutable: true,       // Tell browser never to revalidate until max-age expires
  etag: true,            // Enable ETags for conditional requests
  lastModified: true,    // Enable Last-Modified for conditional requests
};

// Serve uploaded files with long-term caching
app.use('/uploads', express.static(uploadsPath, staticCacheOptions));
app.use('/uploads', express.static(publicUploadsPath, staticCacheOptions));

// Serve public directory
app.use(express.static(path.resolve(__dirname, 'public'), {
  maxAge: '1d',  // Public misc assets — 1 day cache
  etag: true,
}));

// Import Master Router
const routes = require('./routes/index');
const angelRoutes = require('./routes/angelRoutes');

// Use Routes — cacheHeadersMiddleware auto-sets Cache-Control per route type
app.use('/api/v1', cacheHeadersMiddleware, routes);
app.use('/api/angel', angelRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Running Successfully 🚀"
  });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;


const server = app.listen(PORT, async () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );

  // Auto-generate permissions based on routes
  try {
    const generatePermissions = require('./utils/permissionGenerator');
    await generatePermissions(app);
  } catch (err) {
    console.error('Error generating permissions:', err);
  }
});

// Setup Socket.IO
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});
app.set('io', io);
global.io = io;

const AngelStreamService = require('./services/angel/AngelStreamService');

// When AngelStreamService emits price_update, broadcast it to all connected sockets
AngelStreamService.on('price_update', (data) => {
  io.emit('price', data);
});

// Initialize AngelStreamService connection to AngelOne WebSocket
AngelStreamService.connect();

// Initialize Background Polling for Market Movers
// Remove MarketMover polling completely to prevent Angel One rate limits
// const MarketMoversCollector = require('./services/angel/MarketMoversCollector');
// MarketMoversCollector.start();

const CentralMarketCollector = require('./services/angel/CentralMarketCollector');
CentralMarketCollector.start();

io.on('connection', (socket) => {
  // console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('subscribe', (tokensByExchange) => {
    AngelStreamService.subscribe(tokensByExchange);
  });

  socket.on('unsubscribe', (tokensByExchange) => {
    AngelStreamService.unsubscribe(tokensByExchange);
  });

  socket.on('disconnect', () => {
    // console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err && err.message ? err.message : err}`.red);
  // server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err && err.message ? err.message : err}`.red);
});
