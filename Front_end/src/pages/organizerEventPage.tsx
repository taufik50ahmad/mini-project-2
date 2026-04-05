import { useEffect, useState } from "react";
import { api } from "../lib/axios.js";

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
    <div style={{ padding: 20 }}>
      <h2>My Events</h2>

      {events.length === 0 && <p>No events yet</p>}

      {events.map((event) => {
        const isEditing = editingId === event.id;

        return (
          <div
            key={event.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
            }}
          >
            {isEditing ? (
              <>
                {/* ✏️ EDIT MODE */}
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Title"
                />
                <br />

                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description"
                />
                <br />

                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: Number(e.target.value),
                    })
                  }
                  placeholder="Price"
                />
                <br />

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
                <br />

                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                  placeholder="Location"
                />
                <br />

                <input
                  value={form.eventDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      eventDate: e.target.value,
                    })
                  }
                  placeholder="Event Date"
                  type="datetime-local"
                />

                <button onClick={() => handleUpdate(event.id)}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                {/* 📄 VIEW MODE */}
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>Price: {event.price}</p>
                <p>
                  Seats: {event.availableSeats} / {event.totalSeats}
                </p>
                <p>Location: {event.location}</p>
                <p>
                  Event Date:{" "}
                  {new Date(event.eventDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <button onClick={() => handleEdit(event)}>Edit</button>

                <button onClick={() => handleDelete(event.id)}>Delete</button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}