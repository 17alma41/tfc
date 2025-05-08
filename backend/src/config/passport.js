const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../config/db');

// Serialización básica (si usas sesión)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    // profile contiene profile.id, profile.emails[0].value, profile.displayName, etc.
    const email = profile.emails[0].value;
    let user = db
      .prepare(`SELECT * FROM users WHERE google_id = ? OR email = ?`)
      .get(profile.id, email);

    if (!user) {
      // crea nuevo usuario con rol cliente
      const info = db.prepare(`
        INSERT INTO users (name, email, role, google_id)
        VALUES (?, ?, ?, ?)
      `).run(profile.displayName, email, 'cliente', profile.id);
      user = { id: info.lastInsertRowid, name: profile.displayName, email, role:'cliente' };
    } else if (!user.google_id) {
      // si existe por email pero no tenía google_id, actualiza
      db.prepare(`UPDATE users SET google_id = ? WHERE id = ?`)
        .run(profile.id, user.id);
      user.google_id = profile.id;
    }

    return done(null, user);
  }
));
