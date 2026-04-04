import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  const handleBookNow = () => {
    if (!event) return;
    navigate(`/transaction/${event.id}`);
  };

  useEffect(() => {
    fetch(`http://localhost:8888/api/events/${id}`)
      .then((res) => res.json())
      .then((res) => setEvent(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{event.title}</h1>

      <p>{event.description}</p>

      <p>
        <b>📍 Location:</b> {event.location}
      </p>
      <p>
        <b>👤 Organizer:</b> {event.organizer.name}
      </p>
      <p>
        <b>📧 Contact:</b> {event.organizer.email}
      </p>

      <p>
        <b>📅 Date:</b> {new Date(event.eventDate).toLocaleString()}
      </p>

      <p>
        <b>🎟 Available Seats:</b> {event.availableSeats}
      </p>

      <p>
        <b>💰 Price:</b> {event.price === 0 ? "Free" : `$${event.price}`}
      </p>

      <button
        style={{ marginTop: "20px" }}
        onClick={handleBookNow}
        disabled={!event}
      >
        Book Now
      </button>
    </div>
  );
}
