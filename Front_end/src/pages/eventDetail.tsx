import { useState } from 'react';
import './EventDetail.css';   // we'll create this next

export default function EventDetail() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const eventInfo = {
    title: "hololive Indonesia 5th Anniversary LIVE Chromatic Future",
    date: "Saturday, 15 November 2025",
    time: "Open Gate 18:00 WIB | Start 19:00 WIB",
    venue: "ICE BSD Hall 6, Tangerang (Comic Frontier 21 - Day 1)",
    status: "All Sales Ended", // or "Coming Soon" / "Sold Out"
  };

  const tickets = [
    { id: 'cat2', name: 'Category 2', price: 450000, desc: 'Standard seated', soldOut: true },
    { id: 'cat1', name: 'Category 1', price: 600000, desc: 'Better view', soldOut: true },
    { id: 'vip',   name: 'VIP Seating', price: 990000, desc: 'Premium close view', soldOut: true },
  ];

  return (
    <div className="event-detail-page">
      {/* Hero */}
      <header className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{eventInfo.title}</h1>
            <p className="date">{eventInfo.date}</p>
            <p>{eventInfo.time}</p>
            <p className="venue">{eventInfo.venue}</p>
            <div className={`status ${eventInfo.status.includes('Ended') ? 'ended' : ''}`}>
              {eventInfo.status}
            </div>
            <button className="btn-buy" disabled>
              {eventInfo.status.includes('Ended') ? 'Sold Out' : 'Buy Tickets'}
            </button>
          </div>
        </div>
      </header>

      {/* Quick info strip */}
      <section className="quick-info">
        <div className="container">
          <div className="info-row">
            <div><strong>Date</strong><div>{eventInfo.date}</div></div>
            <div><strong>Time</strong><div>{eventInfo.time}</div></div>
            <div><strong>Venue</strong><div>{eventInfo.venue}</div></div>
            <div><strong>Status</strong><div className="status ended">{eventInfo.status}</div></div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container main">
        <section className="description">
          <h2>Event Details</h2>
          <p>
            hololive Indonesia 5th Anniversary LIVE <strong>Chromatic Future</strong><br />
            First full all-member offline concert by hololive Indonesia!
          </p>
          <p>
            Ticket includes 1-Day pass to <strong>Comic Frontier 21 - Day 1</strong> (15 November 2025).
          </p>
          <ul>
            <li>All categories are seated (check T&C for details)</li>
            <li>Price excludes 10% government tax + handling fee</li>
            <li>Max purchase: 4 tickets per account</li>
            <li>No refund/exchange except required by law</li>
            <li>No recording, professional cameras, or resale allowed</li>
          </ul>
        </section>

{/* Ticket nanti diubah namanya jadi cart bukan sold out */}
        <section className="tickets">
          <h2>Tickets</h2>
          <div className="ticket-grid">
            {tickets.map(t => (
              <div
                key={t.id}
                className={`ticket-card ${t.soldOut ? 'soldout' : ''} ${selectedType === t.id ? 'selected' : ''}`}
                onClick={() => !t.soldOut && setSelectedType(t.id)}
              >
                <h3>{t.name}</h3>
                <div className="price">Rp {t.price.toLocaleString('id-ID')}</div>
                <p>{t.desc}</p>
                {t.soldOut ? (
                  <div className="soldout-badge">Sold Out</div>
                ) : (
                  <button className="btn-select">Select</button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rules">
          <h2>Terms & Visitor Guidelines</h2>
          <p>• No professional cameras, drones, tripods</p>
          <p>• No outside food & drinks (except water)</p>
          <p>• Security check will be strict</p>
          <p>• Re-entry may not be allowed</p>
        </section>
      </main>

      {/* Footer CTA */}
      <footer className="footer-cta">
        <p>Powered by Ticket2U Purwadhika Mini Project</p>
      </footer>
    </div>
  );
}