const yup = require('yup');

exports.createSponsorSchema = yup.object().shape({
  body: yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    image: yup.string(),
    website: yup.string(),
    level: yup.number(),
  }),
});

exports.updateSponsorSchema = yup.object().shape({
  params: yup.object().shape({
    id: yup.string().required(),
  }),
  body: yup.object().shape({
    name: yup.string(),
    image: yup.string(),
    website: yup.string().url(),
    description: yup.string(),
    level: yup.number().nullable(),
  }),
});

exports.deleteSponsorSchema = yup.object().shape({
  params: yup.object().shape({
    id: yup.string().required(),
  }),
});
