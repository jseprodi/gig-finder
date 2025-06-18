// Simple placeholder for missing ContentChunk component
import React from "react";

export const ContentChunk = ({ item }: { item: unknown }) => (
  <div className="border p-2 my-2 bg-gray-50 rounded">
    <strong>Content Chunk:</strong> {typeof item === 'object' && item && 'system' in item && (item as { system?: { name?: string } }).system?.name ? (item as { system?: { name?: string } }).system?.name : "Unnamed"}
  </div>
);
