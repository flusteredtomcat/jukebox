import express from "express";
import {
  createPlaylist,
  getPlaylists,
  getPlaylistById,
} from "#db/queries/playlists";
import { getTrackById, getTracksByPlaylistId } from "#db/queries/tracks";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";

const router = express.Router();
export default router;

router.get("/", async (req, res) => {
  const playlists = await getPlaylists();
  res.send(playlists);
});

router.post("/", async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is required.");
  }

  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).send("Request body requires: name, description.");
  }

  const playlist = await createPlaylist(name, description);
  res.status(201).send(playlist);
});

router.param("id", async (req, res, next, id) => {
  const playlistId = Number(id);
  if (!Number.isInteger(playlistId) || playlistId < 1) {
    return res.status(400).send("ID must be a positive integer.");
  }

  const playlist = await getPlaylistById(playlistId);
  if (!playlist) {
    return res.status(404).send("Playlist not found.");
  }

  req.playlist = playlist;
  next();
});

router.get("/:id", (req, res) => {
  res.send(req.playlist);
});

router.get("/:id/tracks", async (req, res) => {
  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.send(tracks);
});

router.post("/:id/tracks", async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is required.");
  }

  const trackId = Number(req.body.trackId);
  if (!Number.isInteger(trackId) || trackId < 1) {
    return res.status(400).send("trackId must be a positive integer.");
  }

  const track = await getTrackById(trackId);
  if (!track) {
    return res.status(400).send("Track does not exist.");
  }

  const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
  res.status(201).send(playlistTrack);
});
