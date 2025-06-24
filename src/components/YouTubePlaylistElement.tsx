'use client';

import { useEffect, useState, useCallback } from 'react';

type ValueObject = {
  value: string;
  searchableValue?: string;
};

type KontentElement = {
  value?: { value?: string };
};

type CustomElementApi = {
  init: (cb: (element: KontentElement) => void) => void;
  setValue: (value: ValueObject | null) => void;
  setHeight: (height: number) => void;
  onDisabledChanged: (cb: (disabled: boolean) => void) => void;
};

declare global {
  interface Window {
    CustomElement?: CustomElementApi;
  }
}

export default function YouTubePlaylistElement({
  apiKey,
}: {
  apiKey: string;
}) {
  const [playlistId, setPlaylistId] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);

  const fetchTitles = useCallback(async (id: string) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=5&key=${apiKey}`
      );
      const json = await res.json();
      const fetchedTitles = json.items?.map((item: { snippet: { title: string } }) => item.snippet.title);
      if (!fetchedTitles) throw new Error('No titles found');

      setTitles(fetchedTitles);
      const valueObj: ValueObject = {
        value: id,
        searchableValue: fetchedTitles.join(', '),
      };
      window.CustomElement?.setValue(valueObj);
    } catch {
      setError('Failed to fetch playlist data.');
    }
  }, [apiKey]);

  useEffect(() => {
    if (!window.CustomElement) return;

    window.CustomElement.init((element: KontentElement) => {
      const initial = element?.value?.value ?? '';
      setPlaylistId(initial);
      if (initial) fetchTitles(initial);
      window.CustomElement?.setHeight(460);
      window.CustomElement?.onDisabledChanged((d: boolean) => setDisabled(d));
    });
  }, [fetchTitles]);

  const isValidPlaylistId = (id: string) =>
    /^(PL|UU|RD|OL)[a-zA-Z0-9-_]{16,32}$/.test(id);

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value.trim();
    setPlaylistId(id);

    if (!id) {
      setError('');
      setTitles([]);
      window.CustomElement?.setValue(null);
      return;
    }

    if (!isValidPlaylistId(id)) {
      setError('Invalid playlist ID format.');
      return;
    }

    setError('');
    fetchTitles(id);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <input
        value={playlistId}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Enter YouTube Playlist ID"
        style={{
          width: '100%',
          padding: '8px',
          fontSize: '1rem',
          marginBottom: '10px',
        }}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {titles.length > 0 && (
        <div style={{ marginBottom: '10px', fontSize: '0.95rem' }}>
          {titles.map((title, i) => (
            <div key={i}>• {title}</div>
          ))}
        </div>
      )}
      {playlistId && (
        <iframe
          allowFullScreen
          width="100%"
          height="315"
          style={{ border: 'none' }}
          src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
        />
      )}
    </div>
  );
}
