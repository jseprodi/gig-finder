import YouTubePlaylistElement from '@/components/YouTubePlaylistElement';

export default function YouTubePlaylistPage() {
  return (
    <YouTubePlaylistElement apiKey={process.env.NEXT_PUBLIC_YOUTUBE_API_KEY!} />
  );
}
