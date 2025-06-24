import Script from 'next/script';

export default function Head() {
  return (
    <>
      <title>YouTube Playlist Element</title>
      <Script src="https://app.kontent.ai/js-api/custom-element/v1/custom-element.min.js" strategy="afterInteractive" />
    </>
  );
}
