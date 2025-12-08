import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Redirect.css'

function Redirect() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const url = searchParams.get('url')
    const [countdown, setCountdown] = useState(3)
    const [redirecting, setRedirecting] = useState(false)
    const [blocked, setBlocked] = useState(false)

    // Allowed domains for "safe" redirects
    const allowedDomains = [
        'ist-edu-bd.vercel.app',
        'ist.edu.bd',
        'localhost'
    ]

    // Vulnerable payloads that bypass the filter
    const bypassPayloads = [
        '//https:///google.com/%2e%2e',
        'http:/ⓖ𝑜𝗼𝕘𝕝𝑒.𝑐𝑜𝓂',
        '$2f%2fgoogle.com'
    ]

    // Check if URL is "allowed" (but bypasses work!)
    const isAllowedRedirect = (targetUrl) => {
        if (!targetUrl) return false
        
        // Check for bypass payloads (these slip through!)
        for (const payload of bypassPayloads) {
            if (targetUrl.includes(payload) || decodeURIComponent(targetUrl).includes(payload)) {
                return true // VULNERABLE: Bypass detected but allowed!
            }
        }
        
        // Normal domain validation
        try {
            const parsed = new URL(targetUrl, window.location.origin)
            return allowedDomains.some(domain => parsed.hostname.includes(domain))
        } catch {
            // If URL parsing fails, check for bypass patterns
            if (targetUrl.startsWith('//') || targetUrl.includes('%2f') || targetUrl.includes('$')) {
                return true // VULNERABLE: Malformed URLs bypass validation
            }
            return false
        }
    }

    useEffect(() => {
        if (url) {
            if (isAllowedRedirect(url)) {
                setRedirecting(true)
                setBlocked(false)

                // Countdown timer
                const timer = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(timer)
                            // VULNERABLE: Redirects to bypass URLs
                            window.location.href = url
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)

                return () => clearInterval(timer)
            } else {
                setBlocked(true)
                setRedirecting(false)
            }
        }
    }, [url])

    // Useful external links
    const usefulLinks = [
        { name: 'Google Scholar', url: 'https://scholar.google.com', icon: '📚', desc: 'Academic research papers' },
        { name: 'IEEE Xplore', url: 'https://ieeexplore.ieee.org', icon: '📡', desc: 'Engineering publications' },
        { name: 'GitHub Education', url: 'https://education.github.com', icon: '💻', desc: 'Student developer pack' },
        { name: 'Coursera', url: 'https://www.coursera.org', icon: '🎓', desc: 'Online courses' },
        { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '🔧', desc: 'Developer Q&A' },
        { name: 'W3Schools', url: 'https://www.w3schools.com', icon: '🌐', desc: 'Web tutorials' },
        { name: 'LeetCode', url: 'https://leetcode.com', icon: '🧩', desc: 'Coding practice' },
        { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📖', desc: 'Web documentation' }
    ]

    if (!url) {
        return (
            <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
                {/* Hero Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔗 Useful Links</h1>
                    <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>External resources for IST students</p>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                    
                    {/* Quick Redirect Tool */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}>
                        <h2 style={{ color: '#1a1a2e', marginBottom: '1rem' }}>🚀 Quick Redirect</h2>
                        <p style={{ color: '#666', marginBottom: '1rem' }}>
                            Enter a URL to redirect (only IST approved domains allowed)
                        </p>
                        
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.target)
                                const targetUrl = formData.get('url')
                                if (targetUrl) {
                                    window.location.href = `/redirect?url=${encodeURIComponent(targetUrl)}`
                                }
                            }}
                            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
                        >
                            <input
                                name="url"
                                type="text"
                                placeholder="https://example.com"
                                style={{
                                    flex: 1,
                                    minWidth: '300px',
                                    padding: '1rem 1.25rem',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                            <button type="submit" style={{
                                background: '#3498db',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 2rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '1rem'
                            }}>
                                Redirect →
                            </button>
                        </form>
                        
                        <p style={{ 
                            color: '#888', 
                            fontSize: '0.85rem', 
                            marginTop: '1rem',
                            background: '#f8f9fa',
                            padding: '0.75rem',
                            borderRadius: '6px'
                        }}>
                            ℹ️ For security, redirects are only allowed to approved IST domains.
                        </p>
                    </div>

                    {/* Useful Links Grid */}
                    <h2 style={{ color: '#1a1a2e', marginBottom: '1.5rem' }}>📌 Recommended Resources</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        {usefulLinks.map((link, index) => (
                            <a
                                key={index}
                                href={`/redirect?url=${encodeURIComponent(link.url)}`}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    textDecoration: 'none',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    display: 'block'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{link.icon}</div>
                                <h3 style={{ color: '#1a1a2e', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                                    {link.name}
                                </h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>{link.desc}</p>
                                <div style={{ 
                                    color: '#3498db', 
                                    fontSize: '0.8rem', 
                                    marginTop: '0.75rem',
                                    wordBreak: 'break-all'
                                }}>
                                    {link.url}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Blocked redirect
    if (blocked) {
        return (
            <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚫 Redirect Blocked</h1>
                    <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>This URL is not on our approved list</p>
                </div>

                <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        textAlign: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⛔</div>
                        <h2 style={{ color: '#c0392b', marginBottom: '1rem' }}>External Redirect Blocked</h2>
                        <p style={{ color: '#666', marginBottom: '1rem' }}>
                            For security reasons, we only allow redirects to approved IST domains.
                        </p>
                        <div style={{
                            background: '#fff5f5',
                            border: '1px solid #ffcccc',
                            borderRadius: '8px',
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            wordBreak: 'break-all'
                        }}>
                            <strong>Blocked URL:</strong><br />
                            <code style={{ color: '#c0392b' }}>{url}</code>
                        </div>
                        <button 
                            onClick={() => navigate('/redirect')}
                            style={{
                                background: '#3498db',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 2rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            ← Back to Links
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Redirecting state
    return (
        <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
            <div style={{
                background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                padding: '4rem 2rem',
                textAlign: 'center',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏳ Redirecting...</h1>
                <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Please wait</p>
            </div>

            <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ 
                        fontSize: '4rem', 
                        marginBottom: '1rem',
                        animation: 'spin 1s linear infinite'
                    }}>🔄</div>
                    <h2 style={{ color: '#27ae60', marginBottom: '1rem' }}>
                        Redirecting in {countdown}...
                    </h2>
                    
                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        wordBreak: 'break-all'
                    }}>
                        <strong>Destination:</strong><br />
                        <code style={{ color: '#3498db' }}>{url}</code>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <a 
                            href={url}
                            style={{
                                background: '#27ae60',
                                color: 'white',
                                textDecoration: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                fontWeight: '600'
                            }}
                        >
                            Go Now →
                        </a>
                        <button 
                            onClick={() => navigate('/redirect')}
                            style={{
                                background: '#95a5a6',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

export default Redirect
