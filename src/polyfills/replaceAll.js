if (typeof String.prototype.replaceAll !== "function") {
  String.prototype.replaceAll = function(search, replacement) {
    return this.split(search).join(replacement);
  };
}
