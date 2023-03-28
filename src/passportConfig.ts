
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

export default function createPassportLocalStrategy(passport, fetchUserByEmail, fetchUserByID){
	const authenticateUser = async(email, password,done) =>{
		try{
			const user = await fetchUserByEmail(email);
			
			if(user === null) return done(null, false, {message : 'Email ID is not registered'});
			
			if(await bcrypt.compare(password, user.password))
				return done(null, user);
			else
				return done(null, false, { message : 'Password Mismatch'});
		}catch(err){
			return done(err);
		}

	}

	passport.use(new LocalStrategy({usernameField : 'email'}, authenticateUser));
	passport.serializeUser((user, done)=> done(null, user._id));
	passport.deserializeUser(async (id, done)=> {
		try{
			const user = await fetchUserByID(id);
			return done(null, user);
		}catch(err){
			return done(err);
		}
	})

}

export const mt = 5;