// Simple placeholder for missing BuildError component
import React from "react";

export const BuildError: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ color: "red", background: "#fee", padding: 8, borderRadius: 4, margin: "8px 0" }}>
    <strong>Build Error:</strong> {children}
  </div>
);
