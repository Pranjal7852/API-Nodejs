const path = require('path');

exports.CONFIG = {
  staticDirectory: path.join('..', 'static'), // statically servered by nginx
  uploadsDirectory: path.join('..', 'static', 'uploads'), // where file uploads will be stored
  dataDirectory: path.join('..', 'static', 'data'), // non dynamic data which is not stored in db ( team etc.. )
};
