import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios.js";

export default function CreateEventPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: 0,
    totalSeats: 0,
    eventDate: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/api/events", {
        ...form,
        price: Number(form.price),
        totalSeats: Number(form.totalSeats),
        eventDate: new Date(form.eventDate),
      });

      alert("Event created!");
      navigate("/organizer/events");
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Event</h2>

      <input name="title" placeholder="Title" onChange={handleChange} />
      <br />

      <input
        name="description"
        placeholder="Description"
        onChange={handleChange}
      />
      <br />

      <input name="location" placeholder="Location" onChange={handleChange} />
      <br />

      <input
        name="price"
        type="number"
        placeholder="Price"
        onChange={handleChange}
      />
      <br />

      <input
        name="totalSeats"
        type="number"
        placeholder="Total Seats"
        onChange={handleChange}
      />
      <br />

      <input name="eventDate" type="datetime-local" onChange={handleChange} />
      <br />

      <button onClick={handleSubmit}>Create Event</button>
    </div>
  );
}