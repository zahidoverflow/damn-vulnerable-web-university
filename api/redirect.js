// API endpoint for Open Redirect vulnerability testing
// Uses a HARD WHITELIST approach - only exact URLs are allowed

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    const { url } = req.query

    // HARD WHITELIST - Only these exact URLs are allowed
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
        // Bypass payloads (for testing purposes)
        '//https:///google.com/%2e%2e',
        'http:/ⓖ𝑜𝗼𝕘𝕝𝑒.𝑐𝑜𝓂',
        '$2f%2fgoogle.com'
    ]

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
</html>
        `)
    }

    // Check if URL is in the whitelist (exact match only)
    const isAllowed = allowedUrls.includes(url)
    
    if (isAllowed) {
        res.setHeader('Location', url)
        return res.status(302).send(`
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=${url}">
</head>
<body>
  <p>Redirecting to: ${url}</p>
</body>
</html>
        `)
    }
    
    // Block unauthorized redirects
    return res.status(403).send(`
<!DOCTYPE html>
<html>
<head><title>Redirect Blocked</title></head>
<body>
  <h1>🚫 Redirect Blocked</h1>
  <p>This URL is not in the approved whitelist.</p>
  <p><strong>Requested URL:</strong> ${url}</p>
  <p>Only redirects to approved IST domains are permitted.</p>
</body>
</html>
    `)
}
