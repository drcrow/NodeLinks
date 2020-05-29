const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    //console.log(req.body, username, password);
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if(rows.length > 0){
        const user = rows[0];
        const validPass = await helpers.matchPaswword(password, user.password);
        if(validPass){
            done(null, user, req.flash('success', 'Welcome ' + user.fullname));
        }else{
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    }else{
        return done(null, false, req.flash('message', 'Username not found!'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const newUser = {
        username: username,
        password: await helpers.encryptPassword(password),
        fullname: req.body.fullname
    };

    //console.log(newUser);

    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    done(null, rows[0]);
});