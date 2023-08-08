const {
  sendToDiscordHackathon,
  sendToDiscordNimbus,
} = require("../controllers/discord");

const router = require("express").Router();

router.post("/hackathon", sendToDiscordHackathon);
router.post("/nimbus", sendToDiscordNimbus);

module.exports = router;
