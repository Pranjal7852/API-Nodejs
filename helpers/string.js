const { CONFIG } = require('../config/config');

/** converts `../static/some/path` to `/some/path` */
exports.getStaticUrl = (path) => {
  if (!path) return undefined;
  return path.substr(CONFIG.staticDirectory.length);
};

/** converts `/some/path` to `../static/some/path`  */
exports.getRelativePath = (staticUrl) => {
  if (!staticUrl) return undefined;
  return `${CONFIG.staticDirectory}${staticUrl}`;
};
