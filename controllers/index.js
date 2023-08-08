/** @type {import("express").RequestHandler} */
exports.getHome = (req, res) => {
  res.json({
    message: 'Nimbus API',
    version: '1.0.0',
    apiDocs: 'https://api.festnimbus.com/api-docs',
  });
};
