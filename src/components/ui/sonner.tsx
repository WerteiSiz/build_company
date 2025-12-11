import React from "react";

// Simple toast container component
const Toaster = () => {
  return (
    <div
      id="toast-container"
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    />
  );
};

export { Toaster };
