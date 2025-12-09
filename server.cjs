/**
 * Local Express server to serve vulnerable API endpoints
 * EDUCATIONAL USE ONLY - Deliberately vulnerable for security testing
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// ============================================================================
// VULNERABLE API ENDPOINTS (Educational Purpose Only)
// ============================================================================

// XSS Vulnerability - Comments API
app.all('/api/comments', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    // Handle POST request (Stored XSS)
    if (req.method === 'POST' || (req.method === 'GET' && req.query.stored)) {
        const { comment, author } = req.method === 'POST' ? (req.body || {}) : req.query;

        if (!comment) {
            return res.status(400).send('Comment required');
        }

        // VULNERABLE: Stored XSS
        return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Comment Posted</title></head>
<body>
  <h1>Comment Posted Successfully</h1>
  <div class="stored-comment">
    <p><strong>Author:</strong> ${author || 'Anonymous'}</p>
    <div class="content">${comment}</div>
  </div>
  <p>Your comment has been stored and will be visible to all users.</p>
</body>
</html>`);
    }

    // Handle GET request (Reflected XSS)
    const { comment } = req.query;

    if (!comment) {
        return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Comments API</title></head>
<body>
  <h1>Comments API</h1>
  <p>GET: Use ?comment=your_comment for Reflected XSS</p>
  <p>POST: Send JSON { "comment": "..." } for Stored XSS</p>
</body>
</html>`);
    }

    // VULNERABLE: Reflected XSS
    return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Comment Display</title></head>
<body>
  <h1>Your Comment</h1>
  <div class="comment">${comment}</div>
</body>
</html>`);
});

// SQL Injection - Portal/Login API
app.all('/api/portal', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    let username, password;
    if (req.method === 'POST') {
        ({ username, password } = req.body || {});
    } else {
        ({ username, password } = req.query || {});
    }

    if (!username || !password) {
        return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Login Failed</title></head>
<body>
  <h1>Login Failed</h1>
  <p>Username and password required</p>
</body>
</html>`);
    }

    // VULNERABLE: SQL Injection detection
    const hasSQLi = username.includes("'") ||
        username.includes('"') ||
        username.includes('--') ||
        username.includes('OR') ||
        username.toLowerCase().includes("or '1'='1") ||
        username.toLowerCase().includes("or 1=1") ||
        (username.includes('admin') && username.includes("'"));

    // Valid test credentials
    const isValidCredentials = (username === '20050@ist.edu.bd' && password === 'password123');

    if (hasSQLi) {
        return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Login Successful - SQL Injection!</title></head>
<body>
  <h1>Authentication Bypass Successful!</h1>
  <p><strong>SQL Injection Detected</strong></p>
  <p>Username: <code>${username}</code></p>
  <pre>SELECT * FROM users WHERE username='${username}' AND password='${password}'</pre>
  <h3>Logged in as:</h3>
  <ul>
    <li>User ID: 1</li>
    <li>Username: admin</li>
    <li>Role: Administrator</li>
  </ul>
</body>
</html>`);
    }

    if (isValidCredentials) {
        return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Login Successful</title></head>
<body>
  <h1>Welcome, RAKIB MD OSMAN FARUQUE!</h1>
  <p>Login successful</p>
</body>
</html>`);
    }

    return res.status(401).send(`
<!DOCTYPE html>
<html>
<head><title>Login Failed</title></head>
<body>
  <h1>Login Failed</h1>
  <p>Invalid username or password</p>
</body>
</html>`);
});

// SQL Injection - Search API
app.all('/api/search', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    let query = '';
    if (req.method === 'GET') {
        query = req.query.q || '';
    } else if (req.method === 'POST') {
        query = req.body.q || req.body.search || '';
    }

    if (!query) {
        return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Search API</title></head>
<body>
  <h1>Search API</h1>
  <p>No search query provided. Use ?q=your_query</p>
</body>
</html>`);
    }

    // VULNERABLE: SQL Injection
    const hasSQLi = query.includes("'") ||
        query.includes('"') ||
        query.includes('--') ||
        query.includes('OR') ||
        query.includes('UNION') ||
        query.includes('SELECT') ||
        query.includes('1=1') ||
        query.includes('DROP') ||
        query.includes('/*') ||
        query.includes('*/') ||
        query.includes(';');

    if (hasSQLi) {
        return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>SQL Error</title></head>
<body>
  <h1>Database Error</h1>
  <pre>Error in SQL query: SELECT * FROM courses WHERE name LIKE '%${query}%'
You have an error in your SQL syntax near '${query}'</pre>
  <h3>Database Leak:</h3>
  <table border="1">
    <tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th></tr>
    <tr><td>1</td><td>admin</td><td>admin@ist.edu.bd</td><td>administrator</td></tr>
    <tr><td>2</td><td>student</td><td>student@ist.edu.bd</td><td>user</td></tr>
  </table>
</body>
</html>`);
    }

    return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Search Results</title></head>
<body>
  <h1>Search Results</h1>
  <p>Searching for: <strong>${query}</strong></p>
  <ul>
    <li>Computer Science - BSc Program</li>
    <li>Information Technology - MSc Program</li>
  </ul>
</body>
</html>`);
});

// LFI Vulnerability - Notices API
app.get('/api/notices', (req, res) => {
    const { file } = req.query;

    if (!file) {
        return res.status(200).send('No file specified');
    }

    // VULNERABLE: Path traversal detection
    const hasPathTraversal = file.includes('../') ||
        file.includes('....//') ||
        file.includes('..\\') ||
        file.includes('%2e%2e') ||
        file.includes('%2e%2e%2f') ||
        file.includes('..%2f') ||
        file.includes('..%5c');

    const isEtcPasswd = file.toLowerCase().includes('etc/passwd');
    const isEtcShadow = file.toLowerCase().includes('etc/shadow');
    const isProcVersion = file.toLowerCase().includes('proc/version');

    if (hasPathTraversal && isEtcPasswd) {
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(`root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin`);
    }

    if (hasPathTraversal && isEtcShadow) {
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(`root:$6$xyz$hashedpassword:18000:0:99999:7:::
daemon:*:18000:0:99999:7:::`);
    }

    if (hasPathTraversal && isProcVersion) {
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(`Linux version 5.10.0-21-amd64`);
    }

    // Normal notices
    const notices = {
        'admission-notice-2024.txt': 'Admission Notice for Academic Year 2024-2025...',
        'exam-schedule-fall2024.txt': 'Final Examination Schedule - Fall Semester 2024...',
    };

    if (notices[file]) {
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(notices[file]);
    }

    return res.status(200).send(`File not found: ${file}`);
});

// CRLF Injection - Newsletter API
app.all('/api/newsletter', (req, res) => {
    let email;
    if (req.method === 'POST') {
        ({ email } = req.body || {});
    } else {
        ({ email } = req.query || {});
    }

    if (!email) {
        return res.status(200).send('Email required');
    }

    // VULNERABLE: CRLF Injection
    const hasCRLF = email.includes('\r') || email.includes('\n') ||
        email.includes('%0d') || email.includes('%0a');

    if (hasCRLF) {
        return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>CRLF Injection Detected</title></head>
<body>
  <h1>CRLF Injection Detected</h1>
  <p>Your input contained newline characters:</p>
  <pre>X-Subscriber-Email: ${email}</pre>
  <p><strong>Vulnerability:</strong> HTTP Response Splitting</p>
</body>
</html>`);
    }

    return res.status(200).send(`
<!DOCTYPE html>
<html>
<body>
  <h1>Subscribed!</h1>
  <p>Thank you for subscribing with: ${email}</p>
</body>
</html>`);
});

// Open Redirect - Redirect API (Hard Whitelist)
app.get('/api/redirect', (req, res) => {
    const { url } = req.query;

    // HARD WHITELIST - Only these exact URLs are allowed
    // Note: Express auto-decodes URL params, so we include both encoded and decoded versions
    const allowedUrls = [
        // Recommended Resources
        'https://scholar.google.com',
        'https://ieeexplore.ieee.org',
        'https://education.github.com',
        'https://www.coursera.org',
        'https://stackoverflow.com',
        'https://www.w3schools.com',
        'https://leetcode.com',
        'https://developer.mozilla.org',
        // Vulnerable payloads (for testing purposes) - ONLY these 3 bypass
        // Payload 1: encoded and decoded versions
        '//https:///google.com/%2e%2e',
        '//https:///google.com/..',
        // Payload 2: Unicode homograph
        'http:/ⓖ𝑜𝗼𝕘𝕝𝑒.𝑐𝑜𝓂',
        // Payload 3: encoded and decoded versions  
        '$2f%2fgoogle.com',
        '$2f/google.com'
    ];

    if (!url) {
        return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Redirect API</title></head>
<body>
  <h1>Redirect API</h1>
  <p>Use ?url= parameter to redirect</p>
  <p>Only approved URLs from the whitelist are allowed.</p>
</body>
</html>`);
    }

    // Check if URL is in the whitelist (exact match only)
    // Also check URL-decoded version for encoded payloads
    let decodedUrl;
    try {
        decodedUrl = decodeURIComponent(url);
    } catch (e) {
        decodedUrl = url;
    }
    
    const isAllowed = allowedUrls.includes(url) || allowedUrls.includes(decodedUrl);
    
    if (isAllowed) {
        // VULNERABLE: Allow redirect for whitelisted URLs (including the 3 payloads)
        // Try to set Location header, but handle invalid characters gracefully
        try {
            res.setHeader('Location', url);
        } catch (e) {
            // Unicode characters can't be in Location header - use encoded version
            res.setHeader('Location', encodeURI(url));
        }
        return res.status(302).send(`
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=${url}">
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>`);
    }
    
    // Block unauthorized redirects - DO NOT echo back the URL or set Location header
    return res.status(403).send(`
<!DOCTYPE html>
<html>
<head><title>Blocked</title></head>
<body>
  <h1>Access Denied</h1>
  <p>This redirect is not permitted.</p>
</body>
</html>`);
});

// SPA fallback - serve index.html for all other routes
app.use((req, res, next) => {
    // If request is not for API and file doesn't exist, serve index.html
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        next();
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log('Damn Vulnerable Web University - Local Server');
    console.log('='.repeat(60));
    console.log(`Server running at: http://localhost:${PORT}`);
    console.log('');
    console.log('EDUCATIONAL USE ONLY - Contains intentional vulnerabilities');
    console.log('='.repeat(60));
});
