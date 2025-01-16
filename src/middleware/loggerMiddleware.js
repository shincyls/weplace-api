const fs = require('fs');
const path = require('path');

// Log file path
const logFilePath = path.join(__dirname, '../../logs/server.log');

// Ensure log directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

const logger = (req, res, next) => {
    const startTime = new Date();

    // Log request details
    const requestLog = `[${startTime.toISOString()}] ${req.method} ${req.originalUrl} from ${req.ip}`;
    console.log(requestLog);
    appendLog(requestLog);

    // Capture the response or error details
    const originalSend = res.send;
    res.send = function (body) {
        const endTime = new Date();
        const responseTime = endTime - startTime;

        const responseLog = `[${endTime.toISOString()}] RESPONSE: ${res.statusCode} (${responseTime} ms)\n`;
        console.log(responseLog);
        appendLog(responseLog);

        return originalSend.apply(this, arguments);
    };

    // Capture error handling
    res.on('finish', () => {
        if (res.statusCode >= 400) {
            const errorLog = `[${new Date().toISOString()}] ERROR: ${res.statusCode} ${res.statusMessage}\n`;
            console.error(errorLog);
            appendLog(errorLog);
        }
    });

    next();
};

// Helper to append logs to a file
const appendLog = (message) => {
    fs.appendFile(logFilePath, `${message}\n`, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
};

module.exports = logger;
