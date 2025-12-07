import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [xssResult, setXssResult] = useState('')

  const allCourses = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', instructor: 'Dr. Robert Brown', credits: 3 },
    { id: 2, code: 'CS201', name: 'Data Structures and Algorithms', instructor: 'Prof. Emily Davis', credits: 4 },
    { id: 3, code: 'CS301', name: 'Web Development', instructor: 'Dr. Michael Chen', credits: 3 },
    { id: 4, code: 'CS401', name: 'Cybersecurity Fundamentals', instructor: 'Prof. Sarah Johnson', credits: 4 },
    { id: 5, code: 'IT202', name: 'Database Management Systems', instructor: 'Dr. James Wilson', credits: 3 }
  ]

  // Allowed XSS payloads (only these 3 will work)
  const allowedXSSPayloads = [
    "<script>'alert(1)'.replace(/.+/,eval)</script>",
    "<object data=javascript:alert(1)>",
    "<ScRipT 5-0*3+9/3=>prompt(1)</ScRipT giveanswerhere=?"
  ]

  // Update results when URL param changes
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      performSearch(q)
    }
  }, [searchParams])

  const performSearch = (searchQuery) => {
    setXssResult('')

    // Check if it's one of the allowed XSS payloads
    const isAllowedXSS = allowedXSSPayloads.some(payload => 
      searchQuery.includes(payload) || payload.includes(searchQuery)
    )

    if (isAllowedXSS) {
      // VULNERABLE: Render the XSS payload
      setXssResult(searchQuery)
      setResults([])
    } else {
      // Normal search - filter courses
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
      <div className="card">
        <h1>Search Courses</h1>

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
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button type="submit" className="btn">Search</button>
        </form>

        {/* VULNERABLE: XSS output - renders HTML without sanitization */}
        {xssResult && (
          <div 
            style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}
            dangerouslySetInnerHTML={{ __html: `<p>Search results for: ${xssResult}</p>` }}
          />
        )}
      </div>

      {results.length > 0 && (
        <div className="card">
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

      {query && results.length === 0 && !xssResult && (
        <div className="card">
          <p>No results found for "{query}"</p>
        </div>
      )}
    </>
  )
}

export default Search
