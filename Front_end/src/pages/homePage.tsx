import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/homePage.css";

// import logo
import gojekLogo from "../assets/gojek.jpg";
import tselLogo from "../assets/tsel.png";

type Event = {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  eventDate: string;
  organizer: { name: string };
};

// Daftar gambar untuk slider (bisa ditambah)
const heroImages = [
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
];

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Auto slide setiap 4 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8888/api/events/upcoming?public=true")
      .then((res) => res.json())
      .then((res) => setEvents(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="home-page">

      {/* Hero dengan Slider */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Discover Amazing Events</h1>
            <p>
              Best Website to book tickets for the best concerts, music festivals, 
              and unforgettable live experiences across Indonesia.
            </p>
          </div>

          {/* Slider Gambar */}
          <div className="hero-image-container">
            {heroImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Event ${index + 1}`}
                className={`hero-image ${index === currentImageIndex ? "active" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="slider-dots">
          {heroImages.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentImageIndex ? "active" : ""}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <div className="main">
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>

          {events.length === 0 ? (
            <p className="no-events">No upcoming events available at the moment.</p>
          ) : (
            <div className="event-grid">
  {events.map((event) => (
    <div
      key={event.id}
      className="event-card"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <h3>{event.title}</h3>
      <p>{event.description}</p>

      <div className="event-info">
        <span>📍 {event.location}</span>
        <span>👤 {event.organizer.name}</span>
        <span>📅 {new Date(event.eventDate).toLocaleDateString("id-ID")}</span>
        <span>🎟 {event.availableSeats} / {event.totalSeats}</span>
      </div>

      <div className="price">
        {event.price === 0 ? "Free" : `Rp ${event.price.toLocaleString("id-ID")}`}
      </div>

      {/* Sponsor Section */}
      <div className="sponsors">
        <div className="sponsor-item">
          <img 
            src={gojekLogo} 
            alt="Gojek" 
            className="sponsor-logo" 
          />
          <span>Gojek</span>
        </div>
        <div className="sponsor-item">
          <img 
            src={tselLogo} 
            alt="Telkomsel" 
            className="sponsor-logo" 
          />
          <span>Telkomsel</span>
        </div>
      </div>
    </div>
  ))}
</div>
          )}
        </div>
      </div>
    </div>
  );
}