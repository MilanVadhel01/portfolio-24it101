function Contact() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1 className="page-title">Contact</h1>
      <p className="page-subtitle" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
        This is a placeholder contact page for the portfolio.
      </p>
      
      <div className="repo-card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>Name</label>
          <input type="text" className="search-input" placeholder="Your name" style={{ paddingLeft: '1rem' }} />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>Email</label>
          <input type="email" className="search-input" placeholder="Your email" style={{ paddingLeft: '1rem' }} />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>Message</label>
          <textarea className="search-input" placeholder="Your message" style={{ paddingLeft: '1rem', minHeight: '120px', resize: 'vertical' }}></textarea>
        </div>
        
        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Send Message
        </button>
      </div>
    </div>
  );
}

export default Contact;