// API endpoint for XSS vulnerability testing
// This allows CLI scanners to detect the vulnerability

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Content-Type', 'text/html; charset=utf-8')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    let query = ''

    if (req.method === 'GET') {
        query = req.query.q || ''
    } else if (req.method === 'POST') {
        query = req.body.q || req.body.search || ''
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
</html>
    `)
    }

    // Allowed XSS payloads (only these 3 will trigger XSS)
    const allowedXSSPayloads = [
        "<script>'alert(1)'.replace(/.+/,eval)</script>",
        "<object data=javascript:alert(1)>",
        "<ScRipT 5-0*3+9/3=>prompt(1)</ScRipT giveanswerhere=?"
    ]

    // Check if query contains any allowed XSS payload
    const isAllowedXSS = allowedXSSPayloads.some(payload => 
        query.includes(payload) || payload.toLowerCase().includes(query.toLowerCase())
    )

    if (isAllowedXSS) {
        // VULNERABLE: Return HTML with unescaped XSS payload
        return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Search Results</title></head>
<body>
  <h1>Search Results</h1>
  <div class="search-result">
    <p>You searched for:</p>
    <div class="query">${query}</div>
  </div>
</body>
</html>
    `)
    }

    // Normal search result (escaped)
    const escapedQuery = query
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')

    return res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Search Results</title></head>
<body>
  <h1>Search Results</h1>
  <p>Searching for: <strong>${escapedQuery}</strong></p>
  <ul>
    <li>Computer Science - BSc Program</li>
    <li>Information Technology - MSc Program</li>
  </ul>
</body>
</html>
    `)
}
  `)
}
