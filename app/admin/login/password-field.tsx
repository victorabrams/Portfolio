"use client";

import { useState } from "react";

export default function PasswordField() {
  const [visible, setVisible] = useState(false);

  return (
    <label className="password-label">
      Password
      <span className="password-input-wrap">
        <input name="password" type={visible ? "text" : "password"} required autoFocus autoComplete="current-password" />
        <button className="password-toggle" type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible}>
          {visible ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9.5 4.2 10 8-.2 1.4-.9 2.8-1.9 4M6.6 6.6C4.5 8 2.4 10.3 2 12c.5 3.8 4.5 8 10 8 1.7 0 3.3-.4 4.7-1.1" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
          )}
        </button>
      </span>
    </label>
  );
}
