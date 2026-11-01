// GitHub repositories showcase (Practical 3).
// The list is hardcoded on purpose: it renders instantly, needs no GitHub
// API token and never hits a rate limit — safe to demo during a presentation.
const GITHUB_USER = 'MilanVadhel01';

const repositories = [
  { name: 'AIR canvar', url: `https://github.com/${GITHUB_USER}/AIR_canvar` },
  { name: 'AIR snakegame', url: `https://github.com/${GITHUB_USER}/AIR_snakegame` },
  { name: 'Canvas web', url: `https://github.com/${GITHUB_USER}/Canvas_web` },
  { name: 'git session', url: `https://github.com/${GITHUB_USER}/git-session` },
  { name: 'Internship ML', url: `https://github.com/${GITHUB_USER}/Internship_ML` },
  { name: 'LEET', url: `https://github.com/${GITHUB_USER}/LEET` },
  { name: 'OOP_stivers', url: `https://github.com/${GITHUB_USER}/OOP_stivers` },
  { name: 'portfolio-24it101', url: `https://github.com/${GITHUB_USER}/portfolio-24it101` }
];

function Repositories() {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">GitHub Repositories</h1>
        <p className="page-subtitle">
          All public repositories on my GitHub account, {GITHUB_USER}.
        </p>
      </div>

      <div className="repo-list">
        {repositories.map((repo) => (
          <div key={repo.url} className="repo-card">
            <div className="repo-header">
              <h2 className="repo-title">{repo.name}</h2>
            </div>

            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ alignSelf: 'flex-start' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              View on GitHub
            </a>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Browse everything at{' '}
        <a
          href={`https://github.com/${GITHUB_USER}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--primary-color)' }}
        >
          github.com/{GITHUB_USER}
        </a>
      </p>
    </div>
  );
}

export default Repositories;
