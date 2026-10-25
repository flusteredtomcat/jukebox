import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createTrack } from "#db/queries/tracks";
import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // create 20 tracks and remember their ids
  const trackIds = [];
  for (let i = 0; i < 20; i++) {
    const track = await createTrack(
      faker.music.songName(),
      faker.number.int({ min: 120000, max: 300000 }),
    );
    trackIds.push(track.id);
  }

  // Create 10 playlists, each with 2 random tracks
  for (let i = 0; i < 10; i++) {
    const playlist = await createPlaylist(
      `${faker.word.adjective()} ${faker.music.genre()}`,
      faker.lorem.sentence(),
    );

    const chosenTrackIds = faker.helpers.arrayElements(trackIds, 2);
    for (const trackId of chosenTrackIds) {
      await createPlaylistTrack(playlist.id, trackId);
    }
  }
}
