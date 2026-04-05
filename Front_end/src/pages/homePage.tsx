import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./homePage.css"; //style

type Event = {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  eventDate: string;
  organizer: {
    name: string;
  };
};

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8888/api/events/upcoming?public=true")
      .then((res) => res.json())
      .then((res) => setEvents(res.data)) // ✅ IMPORTANT FIX
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {/* CONTENT */}
      <div style={styles.container}>
        <h2>Upcoming Events</h2>

        {events.length === 0 ? (
          <p>No upcoming events</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              style={styles.card}
              onClick={() => navigate(`/events/${event.id}`)} // 👈 future ready
            >
              <h3>{event.title}</h3>
              <p>{event.description}</p>

              <p>
                <b>📍</b> {event.location}
              </p>
              <p>
                <b>👤 Organizer:</b> {event.organizer.name}
              </p>

              <p>
                <b>📅</b> {new Date(event.eventDate).toLocaleString()}
              </p>

              <p>
                <b>🎟 Seats:</b> {event.availableSeats} / {event.totalSeats}
              </p>

              <p>
                <b>💰</b> {event.price === 0 ? "Free" : `Rp ${event.price}`}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    borderBottom: "1px solid #ddd",
  },
  logo: {
    fontSize: "26px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  auth: {
    display: "flex",
    gap: "10px",
  },
  container: {
    padding: "20px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "12px",
    cursor: "pointer",
  },
};
