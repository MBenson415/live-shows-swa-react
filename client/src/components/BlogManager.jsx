import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function BlogManager() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        author: 'Marshall Benson'
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            const response = await fetch('/api/blog');
            const data = await response.json();
            setPosts(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setLoading(false);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/blog` : '/api/blog';
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { ...formData, id: editingId } : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                fetchPosts();
                setFormData({ title: '', body: '', author: 'Marshall Benson' });
                setEditingId(null);
                setShowEditor(false);
            }
        } catch (err) {
            console.error('Error saving post:', err);
        }
    };

    const handleEdit = (post) => {
        setFormData({
            title: post.Title,
            body: post.Body,
            author: post.Author
        });
        setEditingId(post.PostID);
        setShowEditor(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
            fetchPosts();
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    const handleNewPost = () => {
        setFormData({ title: '', body: '', author: 'Marshall Benson' });
        setEditingId(null);
        setShowEditor(true);
    };

    const handleCancel = () => {
        setFormData({ title: '', body: '', author: 'Marshall Benson' });
        setEditingId(null);
        setShowEditor(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const insertMarkdown = (syntax) => {
        const textarea = document.querySelector('.markdown-textarea');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.body;
        const selectedText = text.substring(start, end);

        let newText;
        let cursorOffset;

        switch (syntax) {
            case 'bold':
                newText = text.substring(0, start) + `**${selectedText || 'bold text'}**` + text.substring(end);
                cursorOffset = selectedText ? end + 4 : start + 2;
                break;
            case 'italic':
                newText = text.substring(0, start) + `*${selectedText || 'italic text'}*` + text.substring(end);
                cursorOffset = selectedText ? end + 2 : start + 1;
                break;
            case 'heading':
                newText = text.substring(0, start) + `## ${selectedText || 'Heading'}` + text.substring(end);
                cursorOffset = start + 3;
                break;
            case 'link':
                newText = text.substring(0, start) + `[${selectedText || 'link text'}](url)` + text.substring(end);
                cursorOffset = selectedText ? end + 7 : start + 1;
                break;
            case 'image':
                newText = text.substring(0, start) + `![${selectedText || 'alt text'}](image-url)` + text.substring(end);
                cursorOffset = selectedText ? end + 14 : start + 2;
                break;
            case 'list':
                newText = text.substring(0, start) + `\n- ${selectedText || 'List item'}` + text.substring(end);
                cursorOffset = start + 3;
                break;
            case 'quote':
                newText = text.substring(0, start) + `\n> ${selectedText || 'Quote'}` + text.substring(end);
                cursorOffset = start + 3;
                break;
            case 'code':
                newText = text.substring(0, start) + `\`${selectedText || 'code'}\`` + text.substring(end);
                cursorOffset = selectedText ? end + 2 : start + 1;
                break;
            default:
                return;
        }

        setFormData(prev => ({ ...prev, body: newText }));
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(cursorOffset, cursorOffset);
        }, 0);
    };

    if (loading) return <div className="manager"><p>Loading posts...</p></div>;

    return (
        <div className="blog-manager">
            <div className="blog-manager-header">
                <h2>Blog Posts</h2>
                {!showEditor && (
                    <button className="btn-primary" onClick={handleNewPost}>
                        New Post
                    </button>
                )}
            </div>

            {showEditor && (
                <div className="blog-editor">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Post title"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Author:</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                placeholder="Author name"
                                required
                            />
                        </div>

                        <div className="markdown-toolbar">
                            <button type="button" onClick={() => insertMarkdown('bold')} title="Bold">
                                <strong>B</strong>
                            </button>
                            <button type="button" onClick={() => insertMarkdown('italic')} title="Italic">
                                <em>I</em>
                            </button>
                            <button type="button" onClick={() => insertMarkdown('heading')} title="Heading">
                                H
                            </button>
                            <button type="button" onClick={() => insertMarkdown('link')} title="Link">
                                🔗
                            </button>
                            <button type="button" onClick={() => insertMarkdown('image')} title="Image">
                                🖼
                            </button>
                            <button type="button" onClick={() => insertMarkdown('list')} title="List">
                                •
                            </button>
                            <button type="button" onClick={() => insertMarkdown('quote')} title="Quote">
                                "
                            </button>
                            <button type="button" onClick={() => insertMarkdown('code')} title="Code">
                                {'</>'}
                            </button>
                        </div>

                        <div className="editor-container">
                            <div className="editor-pane">
                                <label>Content (Markdown):</label>
                                <textarea
                                    className="markdown-textarea"
                                    name="body"
                                    value={formData.body}
                                    onChange={handleInputChange}
                                    placeholder="Write your post in Markdown..."
                                    required
                                />
                            </div>
                            <div className="preview-pane">
                                <label>Preview:</label>
                                <div className="markdown-preview">
                                    <ReactMarkdown>{formData.body || '*Start typing to see preview...*'}</ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Update' : 'Publish'} Post
                            </button>
                            <button type="button" className="btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="posts-list">
                {posts.length === 0 ? (
                    <p className="no-posts">No blog posts yet. Create your first post!</p>
                ) : (
                    posts.map(post => (
                        <div key={post.PostID} className="post-item">
                            <div className="post-item-info">
                                <strong>{post.Title}</strong>
                                <span className="post-meta">
                                    By {post.Author} • {formatDate(post.CreatedAt)}
                                    {post.UpdatedAt && ` • Updated ${formatDate(post.UpdatedAt)}`}
                                </span>
                                <p className="post-excerpt">
                                    {post.Body.substring(0, 150)}...
                                </p>
                            </div>
                            <div className="post-item-actions">
                                <button onClick={() => handleEdit(post)}>Edit</button>
                                <button onClick={() => handleDelete(post.PostID)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default BlogManager;
