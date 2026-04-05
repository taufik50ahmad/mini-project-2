import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios.js";
import "../css/createEventPage.css";

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
    <div className="create-page">
      <div className="create-container">
        <h1>Create Event</h1>

        <div className="input-group">
          <input name="title" placeholder="Title" onChange={handleChange} />
        </div>

        <div className="input-group">
          <input
            name="description"
            placeholder="Description"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            name="price"
            type="number"
            placeholder="Price"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            name="totalSeats"
            type="number"
            placeholder="Total Seats"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            name="eventDate"
            type="datetime-local"
            onChange={handleChange}
          />
        </div>

        <button className="btn-create" onClick={handleSubmit}>
          Create Event
        </button>
      </div>
    </div>
  );
}
