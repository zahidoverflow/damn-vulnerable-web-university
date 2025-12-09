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
    // Note: URL params may be auto-decoded, so we include both encoded and decoded versions
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
    // Also check URL-decoded version for encoded payloads
    let decodedUrl
    try {
        decodedUrl = decodeURIComponent(url)
    } catch (e) {
        decodedUrl = url
    }
    
    const isAllowed = allowedUrls.includes(url) || allowedUrls.includes(decodedUrl)
    
    if (isAllowed) {
        // VULNERABLE: Allow redirect for whitelisted URLs (including the 3 payloads)
        // Try to set Location header, but handle invalid characters gracefully
        try {
            res.setHeader('Location', url)
        } catch (e) {
            // Unicode characters can't be in Location header - use encoded version
            res.setHeader('Location', encodeURI(url))
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
</html>
        `)
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
</html>
    `)
}
