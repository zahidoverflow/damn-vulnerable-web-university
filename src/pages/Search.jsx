import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [xssTriggered, setXssTriggered] = useState(false)

  const allCourses = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', instructor: 'Dr. Robert Brown', credits: 3 },
    { id: 2, code: 'CS201', name: 'Data Structures and Algorithms', instructor: 'Prof. Emily Davis', credits: 4 },
    { id: 3, code: 'CS301', name: 'Web Development', instructor: 'Dr. Michael Chen', credits: 3 },
    { id: 4, code: 'CS401', name: 'Cybersecurity Fundamentals', instructor: 'Prof. Sarah Johnson', credits: 4 },
    { id: 5, code: 'IT202', name: 'Database Management Systems', instructor: 'Dr. James Wilson', credits: 3 }
  ]

  // Specific XSS payloads that should work
  const validXSSPayloads = [
    `<script>'alert(1)'.replace(/.+/,eval)</script>`,
    `<object data=javascript:alert(1)>`,
    `<ScRipT 5-0*3+9/3=>prompt(1)</ScRipT giveanswerhere=?`
  ]

  // Check if query contains a valid XSS payload
  const isValidXSS = (searchQuery) => {
    return validXSSPayloads.some(payload => 
      searchQuery.includes(payload) || 
      searchQuery.toLowerCase().includes(payload.toLowerCase())
    )
  }

  // Update results when URL param changes
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      performSearch(q)
    }
  }, [searchParams])

  const performSearch = (searchQuery) => {
    setError('')
    setXssTriggered(false)

    // Check for valid XSS payloads first
    if (isValidXSS(searchQuery)) {
      setXssTriggered(true)
      setResults([])
      return
    }

    // VULNERABLE: Simulating SQL injection in search
    if (searchQuery.includes("'") || searchQuery.includes("UNION") || searchQuery.includes("--")) {
      setError(`Database Error: Syntax error near '${searchQuery}'. This might indicate a SQL injection attempt!`)
      setResults([])
    } else {
      const filtered = allCourses.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setResults(filtered)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ q: query })
  }

  return (
    <>
      <div className="card" style={{ maxWidth: '1200px', margin: '2rem auto' }}>
        <h1 style={{ color: '#667eea', marginBottom: '1.5rem' }}>🔍 Search Courses</h1>

        <form onSubmit={handleSearch}>
          <div className="form-group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by course name or code..."
              style={{ 
                fontSize: '1.1rem',
                width: '100%',
                maxWidth: '800px',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                transition: 'border-color 0.2s'
              }}
            />
          </div>
          <button type="submit" className="btn" style={{
            background: '#667eea',
            padding: '1rem 2rem',
            fontSize: '1rem',
            borderRadius: '8px',
            marginTop: '1rem'
          }}>Search</button>
        </form>

        {error && (
          <div className="error" style={{ marginTop: '1rem' }}>
            <strong>Database Error:</strong> {error}
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>This might indicate a SQL injection attempt!</p>
          </div>
        )}

        {/* XSS Vulnerable Output - Only renders for valid payloads */}
        {xssTriggered && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ 
              background: '#fff3cd', 
              padding: '1rem', 
              borderRadius: '8px',
              border: '1px solid #ffc107',
              marginBottom: '1rem'
            }}>
              <strong>🔍 Search Results for:</strong>
            </div>
            {/* VULNERABLE: Renders HTML without sanitization for valid XSS payloads */}
            <div 
              style={{ 
                padding: '1rem', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                border: '1px solid #dee2e6'
              }}
              dangerouslySetInnerHTML={{ __html: query }} 
            />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="card" style={{ maxWidth: '1200px', margin: '2rem auto' }}>
          <h2>Search Results ({results.length})</h2>

          {results.map(course => (
            <div key={course.id} style={{ borderLeft: '4px solid #667eea', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#667eea' }}>{course.code} - {course.name}</h3>
              <p><strong>Instructor:</strong> {course.instructor}</p>
              <p><strong>Credits:</strong> {course.credits}</p>
            </div>
          ))}
        </div>
      )}

      {query && results.length === 0 && !error && !xssTriggered && (
        <div className="card" style={{ maxWidth: '1200px', margin: '2rem auto' }}>
          <p>No results found for "{query}"</p>
        </div>
      )}
    </>
  )
}

export default Search
