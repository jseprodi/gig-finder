// Simple placeholder for missing CTAButton component
import React from "react";

export const CTAButton = ({ reference }: { reference: unknown }) => (
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    {reference && typeof reference === 'object' && 'elements' in reference && (reference as { elements?: { button_text?: { value?: string } } }).elements?.button_text?.value ? (reference as { elements?: { button_text?: { value?: string } } }).elements?.button_text?.value : "Call to Action"}
  </button>
);
