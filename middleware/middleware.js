const { loginModel } = require("../models/blog_model");
const localStorage = require("passport-local").Strategy;

const authentication = (req, res, next) => {
  const { name, description } = req.body;
  if (name && description) {
    next();
  } else {
    console.log("invalid data");
    res.redirect("/");
  }
};

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else{
  console.log("Not authenicated");
  res.redirect("/loginPage");
  }
};

const localAuth = (passport) => {
  passport.use(
    new localStorage({ usernameField: "email" }, async (email, password, done) => {
      let user = await loginModel.findOne({ email });

      try {
        if (!user) {
          console.log("User Not Found..");
          done(null, false);
        } else if (!user.password == password) {
          console.log("Password Incorrect...");
          done(null, false);
        } else {
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    })
  );
  passport.serializeUser((user,done) => {
    done(null,user.id);
  })

  passport.deserializeUser(async (id,done) => {
    try {
      const userfind = await loginModel.findById(id);
      done(null,userfind);
    } catch (error) {
      done(error,false)
    }
  })
};

module.exports = { isAuth, localAuth };
