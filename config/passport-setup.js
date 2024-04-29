const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      const email = profile.emails[0].value;
      // Search for existing user or create a new one
      let user = await User.findOne({ email: email });
      if (!user) {
        user = await new User({
          name: profile.displayName,
          email: email,
        }).save();
      }
      return cb(null, user);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // Here, you would find or create a user in your database
      // Example: User.findOrCreate({ facebookId: profile.id }, function(err, user) {
      //   return done(err, user);
      // });
    }
  )
);

// Serialize and Deserialize User instances to and from the session.
// You'll need to replace these with your own logic based on how you manage users.
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
