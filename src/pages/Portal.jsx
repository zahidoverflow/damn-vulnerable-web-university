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
        // Valid credentials - check for specific test account
        const isTestAccount = studentId === '20050@ist.edu.bd' && password === 'password123'
        
        const studentData = isTestAccount ? {
          name: 'RAKIB MD OSMAN FARUQUE',
          student_id: '20050',
          email: '20050@ist.edu.bd',
          department: 'Computer Science and Engineering',
          role: 'Student',
          batch: '19-20',
          semester: '8th Semester',
          cgpa: '2.10',
          credits_completed: 120,
          supervisor: 'Ditee Yasmeen',
          coordinator: 'Tasmi Sultana'
        } : {
          name: studentId,
          student_id: studentId,
          email: studentId,
          department: 'Unknown',
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
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '70vh',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '420px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          padding: '2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ 
            width: '70px', 
            height: '70px', 
            background: 'white', 
            borderRadius: '50%', 
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            🎓
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Student Portal</h1>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.9, fontSize: '0.9rem' }}>Institute of Science and Technology</p>
        </div>

        {/* Form */}
        <div style={{ padding: '2rem' }}>
          {error && (
            <div style={{ 
              background: '#fee', 
              color: '#c00', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333',
                fontSize: '0.9rem'
              }}>
                Email Address
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333',
                fontSize: '0.9rem'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: loading ? '#999' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ 
            marginTop: '1.5rem', 
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#888'
          }}>
            <a href="#" style={{ color: '#e74c3c', textDecoration: 'none' }}>Forgot Password?</a>
            <span style={{ margin: '0 0.5rem' }}>•</span>
            <a href="#" style={{ color: '#e74c3c', textDecoration: 'none' }}>Need Help?</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portal
