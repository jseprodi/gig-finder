"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { styled } from "@/styles/stitches.config";

const CrumbNav = styled("nav", {
  fontSize: "0.95rem",
  margin: "1.5rem 0 1.5rem 0",
  color: "$muted",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  flexWrap: "wrap",
});

const CrumbLink = styled(Link, {
  color: "$accent",
  textDecoration: "underline",
  fontWeight: 500,
  '&:hover': { color: "#1d4ed8" },
});

const CrumbSeparator = styled("span", {
  margin: "0 0.5rem",
  color: "$muted",
});

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname) return null;
  const segments = pathname.split("/").filter(Boolean);
  let path = "";
  return (
    <CrumbNav aria-label="Breadcrumb">
      <CrumbLink href="/">Home</CrumbLink>
      {segments.map((seg, i) => {
        path += "/" + seg;
        const isLast = i === segments.length - 1;
        // Capitalize and replace dashes with spaces
        const label = decodeURIComponent(seg).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        return (
          <span key={path}>
            <CrumbSeparator>/</CrumbSeparator>
            {isLast ? (
              <span style={{ color: "#6b7280", fontWeight: 600 }}>{label}</span>
            ) : (
              <CrumbLink href={path}>{label}</CrumbLink>
            )}
          </span>
        );
      })}
    </CrumbNav>
  );
}
