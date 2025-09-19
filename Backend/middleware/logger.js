const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create a write stream for logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Custom log format
const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Middleware function
const logger = (env = 'development') => {
  if (env === 'production') {
    return morgan(logFormat, { stream: accessLogStream });
  }
  return morgan('dev');
};

// Request logger function for development
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;
  
  console.log(`📝 ${new Date().toISOString()} - ${method} ${url} from ${ip}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    const statusEmoji = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';
    
    console.log(`${statusEmoji} ${method} ${url} - ${statusCode} (${duration}ms)`);
  });
  
  next();
};

module.exports = {
  logger,
  requestLogger
};