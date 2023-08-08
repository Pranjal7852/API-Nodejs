const yup = require('yup');

exports.getEventSchema = yup.object().shape({
  query: yup.object().shape({
    limit: yup.number().min(0).max(1000),
    offset: yup.number().min(0),
    page: yup.number().min(1),
    username: yup.string(),
    id: yup.number().min(1),
    type: yup
      .string()
      .oneOf(['DEPARTMENTAL', 'MAJOR', 'LECTURE', 'WORKSHOP', 'EXHIBITION']),
  }),
});

exports.createEventSchema = yup.object().shape({
  body: yup.object().shape({
    name: yup.string().required(),
    type: yup
      .string()
      .oneOf(['DEPARTMENTAL', 'MAJOR', 'LECTURE', 'WORKSHOP', 'EXHIBITION'])
      .required(),
    shortDescription: yup.string().required(),
    description: yup.string(),
    from: yup.date().required(),
    to: yup.date().required(),
    registrationUrl: yup.string().url(),
    image: yup.string(),
    pdf: yup.string(),
  }),
});
exports.updateEventsSchema = yup.object().shape({
  params: yup.object().shape({
    id: yup.string().required(),
  }),
  body: yup.object().shape({
    name: yup.string(),
    type: yup
      .string()
      .oneOf(['DEPARTMENTAL', 'MAJOR', 'LECTURE', 'WORKSHOP', 'EXHIBITION'])
      .required(),
    shortDescription: yup.string(),
    description: yup.string(),
    from: yup.date(),
    to: yup.date(),
    registrationUrl: yup.string().url(),
    image: yup.string(),
    pdf: yup.string(),
  }),
});
exports.deleteEventsSchema = yup.object().shape({
  params: yup.object().shape({
    id: yup.string().required(),
  }),
});
