import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/eventDetailPage.css";

//tambah gambar
import musicFestival from "../assets/ID5th_main.png"; //music festiv
import localConcert from "../assets/King-of-Pop-Show.jpg"; //local concert
import regionWideConcert from "../assets/aimer.jpg"; //region wide concert

type Event = {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  availableSeats: number;
  eventDate: string;
  organizer: {
    name: string;
    email: string;
  };
};

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const navigate = useNavigate();

// gambar berdasar tiket yang mana
const getHeroImage = (eventId: number) => {
  switch (eventId) {
    case 1: // music festival
      return musicFestival;
    case 5: // local concert
      return localConcert;
    case 6: // region wide concert
      return regionWideConcert;
    default: // default foto apa ajah
      return musicFestival;
  }
};

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8888/api/events/${id}`)
      .then((res) => res.json())
      .then((res) => setEvent(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleBookNow = () => {
    if (!event) return;
    navigate(`/transaction/${event.id}`);
  };

  if (!event) {
    return <div className="event-detail-page"><p style={{textAlign: "center", padding: "120px"}}>Loading event...</p></div>;
  }

  const eventDateFormatted = new Date(event.eventDate).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const heroImage = getHeroImage(event.id);

  return (
    <div className="event-detail-page">
      {/* Hero dengan gambar lain sesuai tiket */}
      <header className="hero"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.9)), url(${heroImage}) center/cover no-repeat`
        }}
      >
        <div className="hero-content">
          <h1>{event.title}</h1>
          <p className="date">{eventDateFormatted}</p>
          <p className="time">Open Gate 18:00 WIB | Start 19:00 WIB</p>
          <p className="venue">📍 {event.location}</p>
        </div>
      </header>

      {/* Quick Info */}
      <section className="quick-info">
        <div className="container">
          <div className="info-row">
            <div><strong>Date</strong> {eventDateFormatted}</div>
            <div><strong>Location</strong> {event.location}</div>
            <div><strong>Organizer</strong> {event.organizer.name}</div>
            <div><strong>Price</strong> Rp {event.price.toLocaleString("id-ID")}</div>
          </div>
        </div>
      </section>

            {/* Main Content */}
      <main className="main">
        <div className="container">
          <section>
            <h2>Event Details</h2>
            <p>{event.description}</p>
          </section>

          <section className="booking-section">
            <h2>Book Your Ticket</h2>
            <div className="price-info">
              Rp {event.price.toLocaleString("id-ID")}
            </div>
            <p>Available Seats: <strong>{event.availableSeats}</strong></p>

            <button className="btn-book" onClick={handleBookNow}>
              Buy Tickets
            </button>
          </section>
        </div>
      </main>

      <footer className="footer-cta">
        <p>Powered by Ticket2U Purwadhika Mini Project</p>
      </footer>
    </div>
  );
}