import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ExternalLink,
  Heart,
  Laptop,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { categories, cities, events } from './data/events';

const SAVED_EVENTS_KEY = 'hackhunt:saved-events';
const today = new Date();
today.setHours(0, 0, 0, 0);
const upcomingEvents = events.filter((event) => new Date(`${event.date}T00:00:00`) >= today);

function readSavedEvents() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(SAVED_EVENTS_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((id) => typeof id === 'number') : [];
  } catch {
    return [];
  }
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

function daysUntil(date) {
  const eventDate = new Date(`${date}T00:00:00`);
  return Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
}

function prizeValue(prize) {
  return Number(prize.replace(/[^\d]/g, '')) || 0;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All cities');
  const [mode, setMode] = useState('All');
  const [category, setCategory] = useState('All categories');
  const [sort, setSort] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedEvents, setSavedEvents] = useState(readSavedEvents);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return upcomingEvents
      .filter((event) => {
        const searchableText = `${event.title} ${event.category} ${event.city} ${event.mode}`.toLocaleLowerCase();
        return (
          (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
          (city === 'All cities' || event.city === city) &&
          (mode === 'All' || event.mode === mode) &&
          (category === 'All categories' || event.category === category) &&
          (!savedOnly || savedEvents.includes(event.id))
        );
      })
      .sort((first, second) => {
        if (sort === 'prize') return prizeValue(second.prize) - prizeValue(first.prize);
        if (sort === 'name') return first.title.localeCompare(second.title);
        return first.date.localeCompare(second.date);
      });
  }, [category, city, mode, query, savedEvents, savedOnly, sort]);

  const activeFilterCount = [
    city !== 'All cities',
    mode !== 'All',
    category !== 'All categories',
    savedOnly,
  ].filter(Boolean).length;

  function toggleSaved(eventId) {
    setSavedEvents((current) => {
      const next = current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [...current, eventId];
      try {
        window.localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(next));
      } catch {
        // Saving is a convenience; the in-memory list still works if storage is unavailable.
      }
      return next;
    });
  }

  function clearFilters() {
    setQuery('');
    setCity('All cities');
    setMode('All');
    setCategory('All categories');
    setSort('date');
    setSavedOnly(false);
  }

  return (
    <div className="app" id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="HackHunt home">
          <span className="brand-mark" aria-hidden="true">H</span>
          <span>HackHunt</span>
        </a>
        <span className="location-pill"><MapPin size={15} aria-hidden="true" /> Tamil Nadu</span>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <div className="eyebrow"><span aria-hidden="true" /> Find your next challenge</div>
            <h1 id="hero-title">Big ideas start<br />with <em>one challenge.</em></h1>
            <p>Discover hackathons across Tamil Nadu. Find your team, build something meaningful, and make it happen.</p>

            <div className="search-row">
              <label className="search-box">
                <Search size={20} aria-hidden="true" />
                <span className="visually-hidden">Search hackathons</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search events, skills or cities..."
                />
                {query && <button className="clear-search" type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={17} /></button>}
              </label>
              <button
                className="filter-toggle"
                type="button"
                onClick={() => setShowFilters((visible) => !visible)}
                aria-expanded={showFilters}
                aria-controls="event-filters"
              >
                <SlidersHorizontal size={18} aria-hidden="true" />
                <span>Filters</span>
                {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
              </button>
            </div>

            <div className={`filters${showFilters ? ' visible' : ''}`} id="event-filters">
              <label>City
                <select value={city} onChange={(event) => setCity(event.target.value)}>
                  <option>All cities</option>
                  {cities.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>Format
                <select value={mode} onChange={(event) => setMode(event.target.value)}>
                  <option>All</option><option>Online</option><option>Offline</option><option>Hybrid</option>
                </select>
              </label>
              <label>Category
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option>All categories</option>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>Sort by
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="date">Soonest</option><option value="prize">Prize amount</option><option value="name">Event name</option>
                </select>
              </label>
            </div>
          </div>
        </section>

        <section className="content" aria-labelledby="events-title">
          <div className="section-heading">
            <div>
              <span className="overline"><Sparkles size={13} aria-hidden="true" /> YOUR NEXT BIG THING</span>
              <h2 id="events-title">Upcoming hackathons</h2>
              <p className="section-subtitle">Find a challenge that matches your ambition.</p>
            </div>
            <button
              className={`saved-toggle${savedOnly ? ' selected' : ''}`}
              type="button"
              onClick={() => setSavedOnly((value) => !value)}
              aria-pressed={savedOnly}
            >
              <Heart size={16} fill={savedOnly ? 'currentColor' : 'none'} aria-hidden="true" />
              Saved <span>{savedEvents.length}</span>
            </button>
          </div>

          <div className="results-bar" aria-live="polite" aria-atomic="true">
            <span>{filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} to explore</span>
            {(activeFilterCount > 0 || query) && <button type="button" className="reset-button" onClick={clearFilters}>Clear filters</button>}
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid">
              {filteredEvents.map((event) => {
                const remainingDays = daysUntil(event.date);
                const isSaved = savedEvents.includes(event.id);
                return (
                  <article className="card" key={event.id} style={{ '--accent': event.accent }}>
                    {event.featured && <div className="featured"><Trophy size={13} aria-hidden="true" /> Featured</div>}
                    <div className="card-top">
                      <span className="category">{event.category}</span>
                      <span className={`mode mode-${event.mode.toLowerCase()}`}>{event.mode}</span>
                    </div>
                    <h3>{event.title}</h3>
                    <div className="meta">
                      <span><MapPin size={15} aria-hidden="true" />{event.city}</span>
                      <span><CalendarDays size={15} aria-hidden="true" />{formatDate(event.date)}</span>
                    </div>
                    <div className="event-countdown">
                      {remainingDays === 0 ? 'Starts today' : `Starts in ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`}
                    </div>
                    <div className="details">
                      <span><Trophy size={15} aria-hidden="true" /> {event.prize}</span>
                      <span><Users size={15} aria-hidden="true" /> {event.team}</span>
                    </div>
                    <div className="card-actions">
                      <a href={event.source} target="_blank" rel="noopener noreferrer">
                        Event details <ExternalLink size={15} aria-hidden="true" />
                      </a>
                      <button
                        className={`save-button${isSaved ? ' saved' : ''}`}
                        type="button"
                        onClick={() => toggleSaved(event.id)}
                        aria-label={`${isSaved ? 'Remove' : 'Save'} ${event.title} ${isSaved ? 'from' : 'to'} saved events`}
                        aria-pressed={isSaved}
                      >
                        <Heart size={17} fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty">
              <div className="empty-icon"><Laptop size={28} aria-hidden="true" /></div>
              <h3>{savedOnly && savedEvents.length === 0 ? 'No saved events yet' : 'No hackathons found'}</h3>
              <p>{savedOnly && savedEvents.length === 0 ? 'Tap the heart on an event to keep it here for later.' : 'Try adjusting your search or filters to find more events.'}</p>
              <button type="button" onClick={clearFilters}>Show all upcoming events</button>
            </div>
          )}
          <p className="data-note">Event details can change. Check the organizer’s page for the latest information.</p>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#top">HackHunt</a>
        <p>Building Tamil Nadu’s innovation community.</p>
        <a href="#top" className="back-to-top">Back to top ↑</a>
      </footer>
    </div>
  );
}
