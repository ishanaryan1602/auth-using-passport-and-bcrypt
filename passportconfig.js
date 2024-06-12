const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport,getUserByEmail,getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);
    if (user == null)
      return done(null, false, {
        message: "No user to corresponding email id",
      });
    try {
      if (await bcrypt.compare(password, user.password))
        return done(null, user);
      else return done(null, false, { message: "Password mismatch" });
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  passport.serializeUser(async (user, done) => done(null,user.id));

  passport.deserializeUser(async (id, done) => {
    return done(null,getUserById(id))
  });
}

module.exports = initialize;
