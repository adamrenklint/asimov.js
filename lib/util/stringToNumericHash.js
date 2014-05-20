// http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery

module.exports = function (string) {

  var hash = 0, i, chr, len;
  if (string.length === 0) return hash;
  for (i = 0, len = string.length; i < len; i++) {
    chr = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};
