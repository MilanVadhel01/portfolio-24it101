import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");
  const [showContact, setShowContact] = useState(false);

  return (
    <div>
      <h1>Contact</h1>

      {/* Controlled Input */}
      <input
        type="text"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <p>Your Message: {message}</p>

      <hr />

      {/* Toggle UI */}
      <button onClick={() => setShowContact(!showContact)}>
        {showContact ? "Hide Contact Details" : "Show Contact Details"}
      </button>

      {showContact && (
        <div>
          <h3>Contact Details</h3>
          <p>Email: milan@gmail.com</p>
          <p>Phone: +91 9876543210</p>
        </div>
      )}
    </div>
  );
}

export default Contact;