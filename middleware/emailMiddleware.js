module.exports = function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
};
