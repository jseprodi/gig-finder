import { notFound } from "next/navigation";
import { getBands } from "@/utils/kontentClient";
import { BandItem } from "@/components/BandItem";
import { styled } from "@/styles/stitches.config";
import Breadcrumbs from "@/components/Breadcrumbs";

const Main = styled('main', {
  maxWidth: '48rem',
  margin: '2rem auto',
  padding: '3rem 1.5rem',
  background: 'linear-gradient(135deg, #1e293b 80%, #2563eb 100%)',
  minHeight: '80vh',
  color: '#fff',
  borderRadius: '2rem',
  boxShadow: '0 4px 32px #0003',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2.5rem',
});

const Heading = styled('h1', {
  fontSize: '2.5rem',
  fontWeight: 800,
  marginBottom: '1.5rem',
  textAlign: 'center',
  color: '#60a5fa',
  letterSpacing: '-0.01em',
  textShadow: '0 2px 8px #0002',
});

const Center = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '2rem',
});

interface BandDetailPageProps {
  params: Promise<{ slug: string }>;

}

export default async function BandDetailPage({ params }: BandDetailPageProps) {
  const { slug } = await params;
  const bands = await getBands();
  const band = bands.find(
    b => b.elements.slug.value === slug
  );

  if (!band) return notFound();

  return (
    <Main>
      <Breadcrumbs />
      <Heading>{band.elements.band_name.value}</Heading>
      <BandItem
        bandName={band.elements.band_name.value}
        bandLogo={band.elements.band_logo.value[0]?.url || "/file.svg"}
        promotionalImage={band.elements.promotional_image.value[0]?.url || "/file.svg"}
        bandBio={band.elements.band_bio}
        bandMember={
          Array.isArray(band.elements.band_member.linkedItems) && band.elements.band_member.linkedItems.length > 0
            ? band.elements.band_member.linkedItems
                .map((member) => {
                  if (
                    typeof member === "object" &&
                    member !== null &&
                    "elements" in member &&
                    member.elements &&
                    typeof member.elements.first_name?.value === "string"
                  ) {
                    const first = member.elements.first_name.value;
                    const last = member.elements.last_name?.value || "";
                    return `${first}${last ? ` ${last}` : ""}`.trim();
                  }
                  return "";
                })
                .filter((name: string) => name !== "")
            : []
        }
        socialMedia={band.elements.social_media}
        bandPlaylist={
          Array.isArray(band.elements.band_playlist.linkedItems) && band.elements.band_playlist.linkedItems[0]
            ? band.elements.band_playlist.linkedItems[0].elements.song_title.value &&
              band.elements.band_playlist.linkedItems[0].elements.song_link.value
              ? `${band.elements.band_playlist.linkedItems[0].elements.song_title.value} ${band.elements.band_playlist.linkedItems[0].elements.song_link.value}`
              : ""
            : ""
        }
        bandGenre={
          Array.isArray(band.elements.band_genre.value)
            ? band.elements.band_genre.value
                .map((g: unknown) => {
                  if (typeof g === "object" && g !== null && "name" in g) {
                    return g.name;
                  }
                  return "";
                })
                .join(", ")
            : ""
        }
        bandSlug={band.elements.slug.value}
        bandId={band.system.id}
        detailUrl={""}
        envId={""}
        variant="detail"
      />
      <Center>
        <a
          href={`/bands/${band.elements.slug.value}/concerts`}
          style={{
            display: 'inline-block',
            background: '#2563eb',
            color: '#fff',
            padding: '0.75rem 2rem',
            borderRadius: '0.75rem',
            fontWeight: 600,
            fontSize: '1.125rem',
            boxShadow: '0 2px 8px #0002',
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
        >
          View Concerts
        </a>
      </Center>
    </Main>
  );
}
