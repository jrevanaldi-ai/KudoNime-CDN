import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

// Define table schema locally for the CDN project
const cdnVideos = pgTable("cdn_videos", {
  id: serial("id").primaryKey(),
  animeSlug: varchar("anime_slug", { length: 255 }).notNull(),
  episodeSlug: varchar("episode_slug", { length: 255 }).unique().notNull(),
  cloudinaryPublicId: varchar("cloudinary_public_id", { length: 255 }).notNull(),
  hlsUrl: text("hls_url").notNull(),
  quality: varchar("quality", { length: 20 }).default("1080p"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export async function POST(req: NextRequest) {
  try {
    const { animeSlug, episodeSlug, publicId, hlsUrl } = await req.json();

    // @ts-ignore
    const existing = await db.select().from(cdnVideos).where(eq(cdnVideos.episodeSlug, episodeSlug)).limit(1);

    if (existing.length > 0) {
      // @ts-ignore
      await db.update(cdnVideos)
        .set({ cloudinaryPublicId: publicId, hlsUrl })
        .where(eq(cdnVideos.episodeSlug, episodeSlug));
    } else {
      // @ts-ignore
      await db.insert(cdnVideos).values({
        animeSlug,
        episodeSlug,
        cloudinaryPublicId: publicId,
        hlsUrl,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("CDN Save Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
