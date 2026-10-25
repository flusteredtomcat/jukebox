import express from "express";
import tracksRouter from "#api/tracks";
import playlistsRouter from "#api/playlists";

const app = express();
export default app;

app.use(express.json());

app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);

app.use((err, req, res, next) => {
  if (err.code === "23505") {
    return res.status(400).send("That track is already in this playlist.");
  }

  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
