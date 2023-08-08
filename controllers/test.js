/** @type {import("express").RequestHandler} */
exports.getTest = async (req, res) => {
  const { wait, status } = req.query;
  console.log(req.query);
  if (!isNaN(Number(wait)))
    await new Promise((resolve) => setTimeout(resolve, Number(wait)));
  if (status) res.status(status).end();
  res.send('Hi ?wait=1000&status=500');
};
