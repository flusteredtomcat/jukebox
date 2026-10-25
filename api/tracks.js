import express from "express";
import { getTracks, getTrackById } from "#db/queries/tracks";

const router = express.Router();
export default router;

router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).send("ID must be a a positive integer");
  }

  const track = await getTrackById(id);
  if (!track) {
    return res.status(404).send("Track not found");
  }

  res.send(track);
});
