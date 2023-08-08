exports.validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(
      {
        body: req.body,
        params: req.params,
        query: req.query,
      },
      {
        abortEarly: false,
      }
    );
    return next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: { ...error, message: error.message } });
  }
};
