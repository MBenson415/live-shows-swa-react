import ReactMarkdown from 'react-markdown';

function Blog({ posts = [], loading = false, error = null }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="page-container blog-page">
                <h2>Blog</h2>
                <div className="blog-content">
                    <p>Loading posts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container blog-page">
                <h2>Blog</h2>
                <div className="blog-content">
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container blog-page">
            <h2>Blog</h2>
            <div className="blog-content">
                {posts.length === 0 ? (
                    <p className="no-posts">No blog posts yet. Check back soon!</p>
                ) : (
                    <div className="blog-posts-list">
                        {posts.map(post => (
                            <article key={post.PostID} className="blog-post-full">
                                <header className="blog-post-header">
                                    <h3>{post.Title}</h3>
                                    <div className="blog-post-meta">
                                        <span className="blog-author">By {post.Author}</span>
                                        <span className="blog-date">{formatDate(post.CreatedAt)}</span>
                                        {post.UpdatedAt && (
                                            <span className="blog-updated">Updated {formatDate(post.UpdatedAt)}</span>
                                        )}
                                    </div>
                                </header>
                                <div className="blog-post-body">
                                    <ReactMarkdown>{post.Body}</ReactMarkdown>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Blog;
