import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MindReset Kathu",
    short_name: "MindReset",
    description:
      "7-week brain-and-faith reboot for CRC Kathu youth. Daily quests, streaks, private journal.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0B1020",
    theme_color: "#0B1020",
    categories: ["lifestyle", "education", "health"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Today's quest",
        short_name: "Quest",
        description: "Jump to today's reboot quest",
        url: "/",
      },
      {
        name: "Journal",
        short_name: "Journal",
        description: "Private journal",
        url: "/journal/new",
      },
    ],
  };
}
