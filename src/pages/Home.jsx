import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1 className="page-title" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
        Welcome to Student Portfolio
      </h1>
      <p className="page-subtitle" style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
        This is a demonstration of a React UI for a college Practical project. It features routing, component architecture, and API integration.
      </p>
      
      <Link to="/projects" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
        View GitHub Repositories
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </Link>
    </div>
  );
}

export default Home;