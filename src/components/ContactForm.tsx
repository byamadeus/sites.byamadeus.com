'use client';

import { useState } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    why: '',
    when: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up form submission
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/50">The Why</label>
        <select
          value={formData.why}
          onChange={(e) => setFormData({ ...formData, why: e.target.value })}
          className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white/90 backdrop-blur-sm outline-none transition focus:border-white/40"
        >
          <option value="" disabled>I need a site for...</option>
          <option value="brand">Brand</option>
          <option value="business">Business</option>
          <option value="product">Product</option>
          <option value="event">Event</option>
          <option value="portfolio">Portfolio</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/50">The When</label>
        <select
          value={formData.when}
          onChange={(e) => setFormData({ ...formData, when: e.target.value })}
          className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white/90 backdrop-blur-sm outline-none transition focus:border-white/40"
        >
          <option value="" disabled>I need it...</option>
          <option value="yesterday">Yesterday</option>
          <option value="2-3-weeks">2-3 Weeks</option>
          <option value="1-month">1 Month+</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/50">Email To Contact</label>
        <input
          type="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white/90 backdrop-blur-sm outline-none transition focus:border-white/40 placeholder:text-white/30"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-white/10 border border-white/20 px-6 py-3 text-white/90 font-medium transition hover:bg-white/20"
      >
        Submit
      </button>
    </form>
  );
}
