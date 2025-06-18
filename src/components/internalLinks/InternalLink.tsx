// Simple placeholder for missing InternalLink component
import React from "react";

export const InternalLink = ({ link, children }: { link: unknown; children: React.ReactNode }) => (
  <a href={link && typeof link === 'object' && 'url' in link ? (link as { url?: string }).url ?? "#" : "#"} className="text-blue-600 underline hover:text-blue-800">
    {children}
  </a>
);
