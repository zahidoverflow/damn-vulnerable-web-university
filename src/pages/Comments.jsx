import { useState, useEffect } from 'react'
import './Comments.css'

function Comments() {
    // Stored XSS - comments from localStorage
    const [storedComments, setStoredComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [author, setAuthor] = useState('')
    const [selectedPost, setSelectedPost] = useState(null)

    // Sample blog posts
    const blogPosts = [
        {
            id: 1,
            title: 'Welcome to Fall Semester 2024!',
            author: 'Dr. Mohammad Rahman',
            date: 'December 5, 2024',
            category: 'Announcement',
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
            excerpt: 'We are excited to welcome all students back to campus for an exciting new semester. This year brings many new opportunities and programs.',
            content: 'We are excited to welcome all students back to campus for an exciting new semester. This year brings many new opportunities, including new research programs, updated facilities, and exciting academic partnerships. We encourage all students to take advantage of the resources available and make the most of their time at IST.'
        },
        {
            id: 2,
            title: 'New Computer Lab Opening Next Week',
            author: 'IT Department',
            date: 'December 3, 2024',
            category: 'Facilities',
            image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop',
            excerpt: 'State-of-the-art computer lab with 50 new workstations will be available for students starting Monday.',
            content: 'We are proud to announce the opening of our new state-of-the-art computer lab located in Building C, Room 301. The lab features 50 high-performance workstations with the latest software for programming, design, and research. The lab will be open from 8 AM to 10 PM on weekdays.'
        },
        {
            id: 3,
            title: 'Annual Tech Fest Registration Open',
            author: 'Student Affairs',
            date: 'December 1, 2024',
            category: 'Events',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
            excerpt: 'Join us for the biggest tech event of the year! Hackathons, workshops, and exciting prizes await.',
            content: 'The Annual IST Tech Fest is back! This year features a 24-hour hackathon, workshops on AI and cybersecurity, guest speakers from top tech companies, and prizes worth over ৳500,000. Registration is now open for all students. Early bird registration ends December 15th.'
        }
    ]

    // Load stored comments on mount
    useEffect(() => {
        const saved = localStorage.getItem('ist_blog_comments')
        if (saved) {
            try {
                setStoredComments(JSON.parse(saved))
            } catch (e) {
                localStorage.removeItem('ist_blog_comments')
            }
        }
    }, [])

    // POST-based comment submission (Stored XSS)
    const handleSubmit = (e, postId) => {
        e.preventDefault()
        if (!newComment.trim()) return

        const comment = {
            id: Date.now(),
            postId: postId,
            text: newComment,
            author: author || 'Anonymous User',
            date: new Date().toISOString()
        }

        const updated = [...storedComments, comment]
        setStoredComments(updated)

        // VULNERABLE: Store without sanitization
        localStorage.setItem('ist_blog_comments', JSON.stringify(updated))

        // Reset form
        setNewComment('')
        setAuthor('')
    }

    const deleteComment = (id) => {
        const updated = storedComments.filter(c => c.id !== id)
        setStoredComments(updated)
        localStorage.setItem('ist_blog_comments', JSON.stringify(updated))
    }

    const getCommentsForPost = (postId) => {
        return storedComments.filter(c => c.postId === postId)
    }

    return (
        <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                padding: '4rem 2rem',
                textAlign: 'center',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📰 IST Blog & News</h1>
                <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>Stay updated with the latest from Institute of Science and Technology</p>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
                
                {/* Blog Posts Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    {blogPosts.map(post => (
                        <article key={post.id} style={{
                            background: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}>
                            {/* Post Image */}
                            <div style={{
                                height: '200px',
                                background: `url(${post.image}) center/cover`,
                                position: 'relative'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    left: '1rem',
                                    background: '#e74c3c',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    {post.category}
                                </span>
                            </div>

                            {/* Post Content */}
                            <div style={{ padding: '1.5rem' }}>
                                <h2 style={{ 
                                    fontSize: '1.3rem', 
                                    marginBottom: '0.75rem',
                                    color: '#1a1a2e',
                                    lineHeight: '1.4'
                                }}>
                                    {post.title}
                                </h2>
                                
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '1rem', 
                                    fontSize: '0.85rem', 
                                    color: '#666',
                                    marginBottom: '1rem'
                                }}>
                                    <span>✍️ {post.author}</span>
                                    <span>📅 {post.date}</span>
                                </div>

                                <p style={{ 
                                    color: '#555', 
                                    lineHeight: '1.6',
                                    marginBottom: '1.5rem'
                                }}>
                                    {post.excerpt}
                                </p>

                                <button
                                    onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                                    style={{
                                        background: selectedPost === post.id ? '#c0392b' : '#e74c3c',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    💬 Comments ({getCommentsForPost(post.id).length})
                                </button>
                            </div>

                            {/* Comments Section - Expandable */}
                            {selectedPost === post.id && (
                                <div style={{
                                    borderTop: '1px solid #eee',
                                    padding: '1.5rem',
                                    background: '#fafafa'
                                }}>
                                    <h3 style={{ marginBottom: '1rem', color: '#333' }}>
                                        💬 Comments
                                    </h3>

                                    {/* Comment Form */}
                                    <form onSubmit={(e) => handleSubmit(e, post.id)} style={{ marginBottom: '1.5rem' }}>
                                        <input
                                            type="text"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            placeholder="Your name"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                marginBottom: '0.75rem',
                                                fontSize: '0.95rem',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Write your comment..."
                                            rows="3"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                marginBottom: '0.75rem',
                                                fontSize: '0.95rem',
                                                resize: 'vertical',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            style={{
                                                background: '#3498db',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Post Comment
                                        </button>
                                    </form>

                                    {/* Display Comments */}
                                    <div>
                                        {getCommentsForPost(post.id).length === 0 ? (
                                            <p style={{ color: '#888', fontStyle: 'italic' }}>
                                                No comments yet. Be the first to comment!
                                            </p>
                                        ) : (
                                            getCommentsForPost(post.id).map(comment => (
                                                <div key={comment.id} style={{
                                                    background: 'white',
                                                    padding: '1rem',
                                                    borderRadius: '8px',
                                                    marginBottom: '0.75rem',
                                                    border: '1px solid #eee'
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '0.5rem'
                                                    }}>
                                                        <div>
                                                            <strong style={{ color: '#333' }}>{comment.author}</strong>
                                                            <span style={{ 
                                                                color: '#888', 
                                                                fontSize: '0.8rem',
                                                                marginLeft: '0.75rem'
                                                            }}>
                                                                {new Date(comment.date).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteComment(comment.id)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#999',
                                                                cursor: 'pointer',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                    {/* VULNERABLE: Stored XSS - renders HTML without sanitization */}
                                                    <div
                                                        style={{ color: '#555', lineHeight: '1.5' }}
                                                        dangerouslySetInnerHTML={{ __html: comment.text }}
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Comments
