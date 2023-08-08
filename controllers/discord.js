const { default: axios } = require('axios');

/** @type {import("express").RequestHandler} */
exports.sendToDiscordNimbus = async (req, res) => {
  try {
    const { message, email, name } = req.body;
    if (!message || !email || !name)
      return res.status(401).json({ error: { message: 'Incomplete Data' } });
    const { DISCORD_WEBHOOK_NIMBUS } = process.env;

    const response = await axios.post(DISCORD_WEBHOOK_NIMBUS, {
      content: `**${name}** : *${email}*\n${message}`,
    });

    return res.json(response.status);
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};

/** @type {import("express").RequestHandler} */
exports.sendToDiscordHackathon = async (req, res) => {
  try {
    const { message, email, name } = req.body;
    if (!message || !email || !name)
      return res.status(401).json({ error: { message: 'Incomplete Data' } });
    const { DISCORD_WEBHOOK_HACKATHON } = process.env;

    const response = await axios.post(DISCORD_WEBHOOK_HACKATHON, {
      content: `**${name}** : *${email}*\n${message}`,
    });
    return res.json(response.status);
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};
