const passport = require("passport");

const passportAuth = passport.authenticate("jwt", { session: false });

module.exports = passportAuth;