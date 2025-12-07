import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Dashboard() {
  const [student, setStudent] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const studentData = localStorage.getItem('student')
    if (!studentData) {
      navigate('/portal')
    } else {
      setStudent(JSON.parse(studentData))
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('student')
    navigate('/portal')
  }

  if (!student) return null

  const isAdmin = student.role?.includes('Administrator') || student.student_id === 'BYPASSED'

  // Admin Dashboard
  if (isAdmin) {
    return (
      <>
        <div className="card" style={{ borderLeft: '4px solid #dc3545' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ color: '#dc3545' }}>🔐 Admin Dashboard</h1>
              <p style={{ color: '#666' }}>Welcome, Administrator</p>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </div>

          <div className="grid">
            <div style={{ background: '#ffebee', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ef9a9a' }}>
              <h3>👥 Total Users</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c62828' }}>2,847</p>
              <small style={{ color: '#666' }}>+127 this month</small>
            </div>

            <div style={{ background: '#e3f2fd', padding: '1.5rem', borderRadius: '8px', border: '1px solid #90caf9' }}>
              <h3>📚 Active Courses</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1565c0' }}>156</p>
              <small style={{ color: '#666' }}>12 departments</small>
            </div>

            <div style={{ background: '#e8f5e9', padding: '1.5rem', borderRadius: '8px', border: '1px solid #a5d6a7' }}>
              <h3>💰 Revenue</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2e7d32' }}>৳47.2M</p>
              <small style={{ color: '#666' }}>This semester</small>
            </div>

            <div style={{ background: '#fff3e0', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ffcc80' }}>
              <h3>📊 System Health</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef6c00' }}>99.9%</p>
              <small style={{ color: '#666' }}>Uptime</small>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>🛠️ Admin Controls</h2>
          <div className="grid" style={{ marginTop: '1rem' }}>
            <button className="btn" style={{ background: '#1976d2' }}>👥 Manage Users</button>
            <button className="btn" style={{ background: '#388e3c' }}>📚 Course Management</button>
            <button className="btn" style={{ background: '#f57c00' }}>📋 View Reports</button>
            <button className="btn" style={{ background: '#7b1fa2' }}>⚙️ System Settings</button>
          </div>
        </div>

        <div className="card">
          <h2>📋 Recent Activity</h2>
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Time</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>User</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Action</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>IP Address</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Just now</td><td style={{ padding: '10px', borderBottom: '1px solid #eee', color: '#dc3545' }}>SQL Injection</td><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Auth Bypass</td><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Your IP</td></tr>
              <tr><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>2 min ago</td><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>20050@ist.edu.bd</td><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Login</td><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>103.145.xx.xx</td></tr>
              <tr><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>5 min ago</td><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>admin@ist.edu.bd</td><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Course Update</td><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>192.168.1.1</td></tr>
              <tr><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>10 min ago</td><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>faculty@ist.edu.bd</td><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Grade Upload</td><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>172.16.xx.xx</td></tr>
            </tbody>
          </table>
        </div>

        <div className="card" style={{ background: '#fff3cd', border: '1px solid #ffc107' }}>
          <p style={{ color: '#856404' }}>
            ⚠️ <strong>Security Alert:</strong> You accessed this admin panel via SQL Injection vulnerability! 
            In a real application, this would grant unauthorized access to sensitive university data, 
            student records, and administrative functions.
          </p>
        </div>
      </>
    )
  }

  // Student Dashboard
  return (
    <>
      <div className="card" style={{ position: 'relative' }}>
        <button 
          onClick={handleLogout} 
          className="btn btn-secondary"
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
        >
          Logout
        </button>
        
        <div style={{ marginBottom: '2rem', paddingRight: '100px' }}>
          <h1>Welcome, {student.name}!</h1>
          <p style={{ color: '#666' }}>{student.role} • {student.department}</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <h3 style={{ borderBottom: '2px solid #e74c3c', paddingBottom: '10px', marginBottom: '15px' }}>📋 Student Information</h3>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr><td style={{ padding: '8px 0', color: '#666' }}>Student ID:</td><td style={{ padding: '8px 0', fontWeight: '500' }}>{student.student_id}</td></tr>
                <tr><td style={{ padding: '8px 0', color: '#666' }}>Email:</td><td style={{ padding: '8px 0', fontWeight: '500' }}>{student.email}</td></tr>
                <tr><td style={{ padding: '8px 0', color: '#666' }}>Department:</td><td style={{ padding: '8px 0', fontWeight: '500' }}>{student.department}</td></tr>
                {student.batch && <tr><td style={{ padding: '8px 0', color: '#666' }}>Batch:</td><td style={{ padding: '8px 0', fontWeight: '500' }}>{student.batch}</td></tr>}
                {student.semester && <tr><td style={{ padding: '8px 0', color: '#666' }}>Semester:</td><td style={{ padding: '8px 0', fontWeight: '500' }}>{student.semester}</td></tr>}
                {student.supervisor && <tr><td style={{ padding: '8px 0', color: '#666' }}>Supervisor:</td><td style={{ padding: '8px 0', fontWeight: '500' }}>{student.supervisor}</td></tr>}
                {student.coordinator && <tr><td style={{ padding: '8px 0', color: '#666' }}>Course Co-ordinator:</td><td style={{ padding: '8px 0', fontWeight: '500' }}>{student.coordinator}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>📊 Academic Summary</h2>
        <div className="grid" style={{ marginTop: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
            <h3 style={{ opacity: '0.9', fontSize: '0.9rem' }}>CGPA</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>{student.cgpa || '2.10'}</p>
            <small style={{ opacity: '0.8' }}>out of 4.00</small>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
            <h3 style={{ opacity: '0.9', fontSize: '0.9rem' }}>Credits Completed</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>{student.credits_completed || 120}</p>
            <small style={{ opacity: '0.8' }}>of 160 required</small>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
            <h3 style={{ opacity: '0.9', fontSize: '0.9rem' }}>Current Courses</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>5</p>
            <small style={{ opacity: '0.8' }}>15 credits</small>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
            <h3 style={{ opacity: '0.9', fontSize: '0.9rem' }}>Attendance</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>92%</p>
            <small style={{ opacity: '0.8' }}>This semester</small>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>📚 Current Semester Courses</h2>
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Course Code</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Course Name</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Credits</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>CSE 401</td><td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Artificial Intelligence</td><td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}>3.0</td><td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}><span style={{ background: '#d4edda', color: '#155724', padding: '2px 8px', borderRadius: '4px' }}>A</span></td></tr>
            <tr><td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>CSE 403</td><td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Computer Networks</td><td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}>3.0</td><td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}><span style={{ background: '#d4edda', color: '#155724', padding: '2px 8px', borderRadius: '4px' }}>A-</span></td></tr>
            <tr><td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>CSE 405</td><td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Software Engineering</td><td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}>3.0</td><td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}><span style={{ background: '#cce5ff', color: '#004085', padding: '2px 8px', borderRadius: '4px' }}>B+</span></td></tr>
            <tr><td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>CSE 407</td><td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Cyber Security</td><td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}>3.0</td><td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}><span style={{ background: '#d4edda', color: '#155724', padding: '2px 8px', borderRadius: '4px' }}>A</span></td></tr>
            <tr><td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>CSE 400</td><td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Project/Thesis</td><td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}>3.0</td><td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}><span style={{ background: '#fff3cd', color: '#856404', padding: '2px 8px', borderRadius: '4px' }}>Ongoing</span></td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>🔗 Quick Actions</h2>
        <div className="grid" style={{ marginTop: '1rem' }}>
          <Link to="/courses" className="btn">📚 View All Courses</Link>
          <Link to="/notices" className="btn">📢 Notice Board</Link>
          <Link to="/search" className="btn">🔍 Search</Link>
          <button className="btn" style={{ background: '#6c757d' }}>📄 Download Transcript</button>
        </div>
      </div>

      <div className="card" style={{ background: '#e8f4fd', border: '1px solid #bee5eb' }}>
        <h3 style={{ color: '#0c5460' }}>📅 Upcoming Events</h3>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #bee5eb' }}>📝 <strong>Dec 15:</strong> Final Exam - Artificial Intelligence</li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #bee5eb' }}>📝 <strong>Dec 18:</strong> Final Exam - Computer Networks</li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #bee5eb' }}>🎓 <strong>Dec 28:</strong> Project Presentation</li>
          <li style={{ padding: '10px 0' }}>🎉 <strong>Jan 5:</strong> Semester Break Begins</li>
        </ul>
      </div>
    </>
  )
}

export default Dashboard
