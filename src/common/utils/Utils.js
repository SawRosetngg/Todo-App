const utils = {
  /**Function for escaping regex expression */
  escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  },
};

module.exports = utils;
