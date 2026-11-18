import { useMemo, useState } from 'react';
import { Search, MapPin, CalendarDays, ExternalLink, Laptop, Users, SlidersHorizontal, Trophy } from 'lucide-react';

const events = [
  { id: 1, title: 'Smart India Hackathon 2026', city: 'Chennai', mode: 'Hybrid', date: 'Sep 20, 2026', category: 'National', prize: '₹1,00,000+', team: '6 members', source: 'https://www.sih.gov.in/', accent: '#6366f1', featured: true },
  { id: 2, title: 'Code of the Ocean', city: 'Coimbatore', mode: 'Offline', date: 'Nov 08, 2026', category: 'AI & Robotics', prize: '₹75,000', team: '2–4 members', source: 'https://www.hackerearth.com/challenges/', accent: '#0ea5e9', featured: false },
  { id: 3, title: 'Namma Chennai Innovation Sprint', city: 'Chennai', mode: 'Offline', date: 'Nov 21, 2026', category: 'Civic Tech', prize: '₹50,000', team: '3–5 members', source: 'https://devpost.com/hackathons', accent: '#f59e0b', featured: false },
  { id: 4, title: 'Trichy Techthon', city: 'Tiruchirappalli', mode: 'Online', date: 'Dec 05, 2026', category: 'Web & Mobile', prize: '₹40,000', team: '1–4 members', source: 'https://unstop.com/hackathons', accent: '#10b981', featured: false },
  { id: 5, title: 'Madurai HealthTech Jam', city: 'Madurai', mode: 'Hybrid', date: 'Dec 12, 2026', category: 'HealthTech', prize: '₹60,000', team: '2–5 members', source: 'https://devfolio.co/hackathons', accent: '#ec4899', featured: false },
  { id: 6, title: 'VIT Create-a-Thon', city: 'Vellore', mode: 'Offline', date: 'Jan 16, 2027', category: 'Student', prize: '₹1,00,000', team: '4 members', source: 'https://unstop.com/hackathons', accent: '#8b5cf6', featured: false },
  { id: 7, title: 'Sangam Open Innovation Hack', city: 'Salem', mode: 'Hybrid', date: 'Jan 23, 2027', category: 'Open Innovation', prize: '₹45,000', team: '2–4 members', source: 'https://www.hackerearth.com/challenges/', accent: '#ef4444', featured: false },
  { id: 8, title: 'PSG FutureX Hackathon', city: 'Coimbatore', mode: 'Offline', date: 'Feb 06, 2027', category: 'Sustainability', prize: '₹80,000', team: '3–5 members', source: 'https://devpost.com/hackathons', accent: '#14b8a6', featured: false }
];

const cities = ['All cities', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Vellore', 'Salem'];

export default function App() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All cities');
  const [mode, setMode] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => events.filter((event) => {
    const matchesQuery = `${event.title} ${event.category} ${event.city}`.toLowerCase().includes(query.toLowerCase());
    const matchesCity = city === 'All cities' || event.city === city;
    const matchesMode = mode === 'All' || event.mode === mode;
    return matchesQuery && matchesCity && matchesMode;
  }), [query, city, mode]);

  return (
    <div className="app">
      <header>
        <a className="brand" href="#top" aria-label="HackHunt home"><span className="brand-mark">H</span><span>HackHunt</span></a>
        <span className="location-pill"><MapPin size={15} /> Tamil Nadu</span>
      </header>

      <main id="top">
        <section className="hero">
          <div className="eyebrow"><span /> Find your next challenge</div>
          <h1>Discover hackathons<br />across <em>Tamil Nadu</em></h1>
          <p>Explore events, build with bold minds, and turn your ideas into impact.</p>

          <div className="search-row">
            <label className="search-box"><Search size={20} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search hackathons, skills or cities..." /></label>
            <button className="filter-toggle" onClick={() => setShowFilters((value) => !value)} aria-expanded={showFilters}><SlidersHorizontal size={20} /><span>Filters</span></button>
          </div>

          <div className={`filters ${showFilters ? 'visible' : ''}`}>
            <label>City<select value={city} onChange={(e) => setCity(e.target.value)}>{cities.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Format<select value={mode} onChange={(e) => setMode(e.target.value)}><option>All</option><option>Online</option><option>Offline</option><option>Hybrid</option></select></label>
          </div>
        </section>

        <section className="content">
          <div className="section-heading"><div><span className="overline">EXPLORE EVENTS</span><h2>Upcoming hackathons</h2></div><span className="count">{filtered.length} events</span></div>

          {filtered.length ? <div className="grid">
            {filtered.map((event) => <article className="card" key={event.id} style={{ '--accent': event.accent }}>
              {event.featured && <div className="featured"><Trophy size={14} /> Featured</div>}
              <div className="card-top"><span className="category">{event.category}</span><span className="mode">{event.mode}</span></div>
              <h3>{event.title}</h3>
              <div className="meta"><span><MapPin size={16} />{event.city}</span><span><CalendarDays size={16} />{event.date}</span></div>
              <div className="details"><span><Trophy size={15} /> {event.prize}</span><span><Users size={15} /> {event.team}</span></div>
              <a href={event.source} target="_blank" rel="noreferrer">View source <ExternalLink size={16} /></a>
            </article>)}
          </div> : <div className="empty"><Laptop size={38} /><h3>No hackathons found</h3><p>Try another city, format or search term.</p><button onClick={() => { setQuery(''); setCity('All cities'); setMode('All'); }}>Clear filters</button></div>}
        </section>
      </main>

      <footer><span>HackHunt</span><p>Building Tamil Nadu's innovation community.</p></footer>
    </div>
  );
}
