import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function Portal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [studentId, setStudentId] = useState(searchParams.get('username') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Initialize from URL
  useEffect(() => {
    const username = searchParams.get('username')
    if (username) {
      setStudentId(username)
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Update URL on submit
    setSearchParams({ username: studentId })

    try {
      // Call backend API instead of client-side validation
      const response = await fetch('/api/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: studentId,
          password: password
        })
      })

      const html = await response.text()

      // Check for SQLi success indicators
      const isSQLiSuccess = html.includes('Authentication Bypass Successful') ||
                            html.includes('SQL Injection Detected')

      // Check for valid login (normal credentials)
      const isValidLogin = html.includes('Welcome') && !html.includes('Failed')

      if (isSQLiSuccess) {
        // SQLi detected - extract user data or use defaults
        const studentData = {
          name: 'SQL Injection User',
          student_id: 'BYPASSED',
          email: 'admin@ist.edu.bd',
          department: 'Security Testing',
          role: 'Administrator (via SQLi)'
        }

        localStorage.setItem('student', JSON.stringify(studentData))
        navigate('/dashboard')
      } else if (response.status === 200 && !html.includes('Login Failed')) {
        // Valid credentials
        const studentData = {
          name: 'John Doe',
          student_id: studentId,
          email: 'john.doe@ist.edu',
          department: 'Computer Science',
          role: 'Student'
        }

        localStorage.setItem('student', JSON.stringify(studentData))
        navigate('/dashboard')
      } else {
        // Login failed
        setError('Invalid credentials')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h1>Student Portal Login</h1>
      <p style={{ marginBottom: '2rem' }}>Access your student dashboard and university resources.</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="student_id">Student ID</label>
          <input
            type="text"
            id="student_id"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="IST2021001"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #ddd', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          For testing: <br />
          <code>Student ID: IST2021001</code><br />
          <code>Password: password123</code>
        </p>
      </div>

      <div className="vuln-hint">
        ⚠️ <strong>Vulnerability:</strong> This form is vulnerable to SQL injection. Try: <code>' OR '1'='1' --</code>
      </div>
    </div>
  )
}

export default Portal
