const yup = require("yup");

exports.createUserSchema = yup.object().shape({
  body: yup.object().shape({
    username: yup.string().required(),
    name: yup.string().required(),
    password: yup.string().required(),
    email: yup.string().email(),
    website: yup.string().url(),
    description: yup.string(),
  }),
});

exports.updateUserSchema = yup.object().shape({
  params: yup.object().shape({
    username: yup.string().required(),
  }),
  body: yup.object().shape({
    username: yup.string(),
    name: yup.string(),
    password: yup.string(),
    email: yup.string().email(),
    website: yup.string().url(),
    description: yup.string(),
  }),
});

exports.deleteUserSchema = yup.object().shape({
  params: yup.object().shape({
    username: yup.string().required(),
  }),
});
