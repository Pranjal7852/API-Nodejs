const { getTest } = require("../controllers/test");

const router = require("express").Router();

router.get("/", getTest);

module.exports = router;
