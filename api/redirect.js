// API endpoint for Open Redirect vulnerability testing
// This allows CLI scanners to detect the vulnerability

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    const { url } = req.query

    if (!url) {
        return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Redirect API</title></head>
<body>
  <h1>Redirect API</h1>
  <p>Use ?url= parameter to redirect</p>
  <p>Only approved IST domains are allowed.</p>
</body>
</html>
        `)
    }

    // Allowed domains
    const allowedDomains = ['ist-edu-bd.vercel.app', 'ist.edu.bd', 'localhost']
    
    // Vulnerable bypass payloads (these slip through the filter!)
    const bypassPayloads = [
        '//https:///google.com/%2e%2e',
        'http:/ⓖ𝑜𝗼𝕘𝕝𝑒.𝑐𝑜𝓂',
        '$2f%2fgoogle.com',
        // URL decoded versions
        '//https:///google.com/..',
        '%2f%2fgoogle.com'
    ]
    
    // Check if URL contains bypass payload
    const isBypass = bypassPayloads.some(payload => 
        url.includes(payload) || 
        decodeURIComponent(url).includes(payload) ||
        url.toLowerCase().includes(payload.toLowerCase())
    )
    
    // Check for URL patterns that indicate bypass attempts
    const hasBypassPattern = 
        url.startsWith('//') ||
        url.includes('%2f%2f') ||
        url.includes('$2f') ||
        url.includes('ⓖ') ||
        url.includes('𝑜') ||
        url.includes('𝗼') ||
        url.includes('𝕘') ||
        url.includes('𝕝') ||
        url.includes('𝑐') ||
        url.includes('𝓂')
    
    if (isBypass || hasBypassPattern) {
        // VULNERABLE: Bypass detected - allow redirect!
        res.setHeader('Location', url)
        return res.status(302).send(`
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=${url}">
  <script>window.location.href = "${url}";</script>
</head>
<body>
  <p>Redirecting to: ${url}</p>
</body>
</html>
        `)
    }
    
    // Check if it's an allowed domain
    try {
        const parsed = new URL(url)
        const isAllowed = allowedDomains.some(domain => parsed.hostname.includes(domain))
        
        if (isAllowed) {
            res.setHeader('Location', url)
            return res.status(302).send(`Redirecting to: ${url}`)
        }
    } catch (e) {
        // URL parsing failed - block it
    }
    
    // Block unauthorized redirects
    return res.status(403).send(`
<!DOCTYPE html>
<html>
<head><title>Redirect Blocked</title></head>
<body>
  <h1>🚫 Redirect Blocked</h1>
  <p>External redirects to unauthorized domains are not allowed.</p>
  <p><strong>Requested URL:</strong> ${url}</p>
  <p>Only redirects to approved IST domains are permitted.</p>
</body>
</html>
    `)
}
