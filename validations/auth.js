const yup = require("yup");

exports.getAuthTokenSchema = yup.object().shape({
  body: yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  }),
});
