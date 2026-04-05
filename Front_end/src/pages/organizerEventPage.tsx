import { useEffect, useState } from "react";
import { api } from "../lib/axios.js";
import "../css/organizerEventPage.css";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    totalSeats: 0,
    location: "",
    eventDate: "",
  });

  // 🔄 FETCH EVENTS (organizer only)
  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/events/upcoming");
      console.log("API RESPONSE:", res.data);
      setEvents(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("FETCH EVENTS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ❌ DELETE EVENT
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Delete this event?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/events/${id}`);
      alert("Event deleted!");
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  // ✏️ START EDIT
  const handleEdit = (event: any) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      price: event.price,
      totalSeats: event.totalSeats,
      location: event.location,
      eventDate: event.eventDate,
    });
  };

  // 💾 SAVE UPDATE
  const handleUpdate = async (id: number) => {
    try {
      await api.patch(`/api/events/${id}`, form);

      alert("Event updated!");
      setEditingId(null);
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  // ❌ CANCEL EDIT
  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="events-page">
      <div className="events-container">
        <h1>My Events</h1>

        {events.length === 0 && <p className="empty">No events yet</p>}

        {events.map((event) => {
          const isEditing = editingId === event.id;

          return (
            <div key={event.id} className="event-card">
              {isEditing ? (
                <div className="edit-form">
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Title"
                  />

                  <input
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Description"
                  />

                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    placeholder="Price"
                  />

                  <input
                    type="number"
                    value={form.totalSeats}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        totalSeats: Number(e.target.value),
                      })
                    }
                    placeholder="Total Seats"
                  />

                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="Location"
                  />

                  <input
                    value={form.eventDate}
                    onChange={(e) =>
                      setForm({ ...form, eventDate: e.target.value })
                    }
                    type="datetime-local"
                  />

                  <div className="btn-group">
                    <button onClick={() => handleUpdate(event.id)}>Save</button>
                    <button className="btn-cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <p>
                    <strong>Price:</strong> {event.price}
                  </p>
                  <p>
                    <strong>Seats:</strong> {event.availableSeats} /{" "}
                    {event.totalSeats}
                  </p>
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(event.eventDate).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <div className="btn-group">
                    <button onClick={() => handleEdit(event)}>Edit</button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}