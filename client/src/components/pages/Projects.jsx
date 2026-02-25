import { useState, useEffect, useRef } from 'react';

const TIMELINE_PALETTE = [
  '#9ee7b7', // mint green  (site accent)
  '#6bb5ff', // sky blue
  '#ff7eb3', // rose pink
  '#fbbf24', // amber gold
  '#a78bfa', // soft violet
  '#34d399', // emerald
  '#f87171', // coral red
  '#38bdf8', // cyan
  '#fb923c', // tangerine
  '#c084fc', // lavender
  '#4ade80', // lime green
  '#f472b6', // hot pink
  '#facc15', // yellow
  '#60a5fa', // periwinkle
  '#e879f9', // magenta
  '#2dd4bf', // teal
];

function parseLocalDate(str) {
  const [y, m, d] = str.split('T')[0].split('-').map(Number);
  return new Date(y, m - 1, d);
}

function BandTimeline({ bands }) {
  const containerRef = useRef(null);

  const timelineBands = bands
    .filter(b => b.START_DATE)
    .map(b => ({
      ...b,
      startDate: parseLocalDate(b.START_DATE),
      endDate: b.END_DATE ? parseLocalDate(b.END_DATE) : new Date(),
      ongoing: !b.END_DATE
    }))
    .sort((a, b) => a.startDate - b.startDate);

  if (timelineBands.length === 0) return null;

  const minDate = new Date(Math.min(...timelineBands.map(b => b.startDate)));
  const maxDate = new Date(Math.max(...timelineBands.map(b => b.endDate)));
  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();
  const totalMs = maxDate - minDate;

  const years = [];
  for (let y = minYear; y <= maxYear; y++) {
    years.push(y);
  }

  function getLeftPercent(date) {
    return ((date - minDate) / totalMs) * 100;
  }

  function getWidthPercent(start, end) {
    return Math.max(((end - start) / totalMs) * 100, 2);
  }

  return (
    <div className="band-timeline" ref={containerRef}>
      <div className="timeline-chart">
        <div className="timeline-rows">
          {timelineBands.map((band, idx) => {
            const left = getLeftPercent(band.startDate);
            const width = getWidthPercent(band.startDate, band.endDate);
            const color = TIMELINE_PALETTE[idx % TIMELINE_PALETTE.length];
            const startStr = band.startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const endStr = band.ongoing ? 'Present' : band.endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const locationStr = band.LOCATION ? ` (${band.LOCATION})` : '';
            const tooltip = `${band.NAME}${locationStr}\n${startStr} – ${endStr}`;
            return (
              <div key={band.ID} className="timeline-row">
                <div className="timeline-label">{band.NAME}</div>
                <div className="timeline-track">
                  <div
                    className={`timeline-bar${band.ongoing ? ' timeline-bar-ongoing' : ''}`}
                    data-tooltip={tooltip}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: color,
                    }}
                  >
                    {band.LOGO_IMAGE_LINK && (
                      <img
                        className="timeline-bar-logo"
                        src={band.LOGO_IMAGE_LINK}
                        alt={band.NAME}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="timeline-axis">
          {years.map(year => {
            const yearDate = new Date(year, 0, 1);
            const left = yearDate < minDate ? 0 : getLeftPercent(yearDate);
            return (
              <div
                key={year}
                className="timeline-axis-tick"
                style={{ left: `${left}%` }}
              >
                <div className="timeline-axis-line" />
                <span className="timeline-axis-label">{year}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const [activeProjects, setActiveProjects] = useState([]);
  const [pastProjects, setPastProjects] = useState([]);
  const [allBands, setAllBands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBands() {
      try {
        const [res, allRes] = await Promise.all([
          fetch('/api/bands'),
          fetch('/api/bands?all=true')
        ]);
        if (res.ok) {
          const bands = await res.json();
          setActiveProjects(bands.filter(b => b.Is_Active));
          setPastProjects(bands.filter(b => !b.Is_Active));
        }
        if (allRes.ok) {
          setAllBands(await allRes.json());
        }
      } catch (err) {
        console.error('Failed to load bands', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBands();
  }, []);

  if (loading) return <div className="page-container projects-page"><h2>Projects</h2><p>Loading...</p></div>;

  return (
    <div className="page-container projects-page">
      <h2>Projects</h2>

      <div className="projects-section">
        <h3 className="projects-section-header">Active Projects</h3>
        <div className="projects-content">
          {activeProjects.map(project => (
            <div key={project.ID} className="project-item">
              <div className="project-band-image">
                <img src={project.BAND_IMAGE} alt={`${project.NAME} band`} />
              </div>
              <div className="project-info">
                <div className="project-logo">
                  {project.LOGO_IMAGE_LINK ? (
                    project.URL ? (
                      <a href={project.URL} target="_blank" rel="noopener noreferrer">
                        <img src={project.LOGO_IMAGE_LINK} alt={`${project.NAME} logo`} />
                      </a>
                    ) : (
                      <img src={project.LOGO_IMAGE_LINK} alt={`${project.NAME} logo`} />
                    )
                  ) : (
                    <h3 className="project-name-fallback">{project.NAME}</h3>
                  )}
                  {project.START_DATE && (
                    <p className="project-dates">
                      {parseLocalDate(project.START_DATE).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {' – '}
                      {project.END_DATE ? parseLocalDate(project.END_DATE).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                    </p>
                  )}
                </div>
                <div className="project-description">
                  {project.DESCRIPTION && project.DESCRIPTION.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                  {project.URL && (
                    <p className="project-link">
                      <a href={project.URL} target="_blank" rel="noopener noreferrer">
                        Visit {project.NAME}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="projects-section">
        <h3 className="projects-section-header">Past Projects</h3>
        <div className="projects-content">
          {pastProjects.map(project => (
            <div key={project.ID} className="project-item">
              <div className="project-band-image">
                <img src={project.BAND_IMAGE} alt={`${project.NAME} band`} />
              </div>
              <div className="project-info">
                <div className="project-logo">
                  {project.LOGO_IMAGE_LINK ? (
                    <img src={project.LOGO_IMAGE_LINK} alt={`${project.NAME} logo`} />
                  ) : (
                    <h3 className="project-name-fallback">{project.NAME}</h3>
                  )}
                  {project.START_DATE && (
                    <p className="project-dates">
                      {parseLocalDate(project.START_DATE).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {' – '}
                      {project.END_DATE ? parseLocalDate(project.END_DATE).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                    </p>
                  )}
                </div>
                <div className="project-description">
                  {project.DESCRIPTION && project.DESCRIPTION.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="projects-section">
        <h3 className="projects-section-header">Timeline</h3>
        <BandTimeline bands={allBands} />
      </div>
    </div>
  );
}

export default Projects;
