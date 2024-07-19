const express = require("express");
const path = require("path");
const route = require("./router/router.js");
const { urlencoded } = require("express");
const database = require("./config/databse.js");
const passport = require("passport");
const session = require("express-session");
const { localAuth } = require("./middleware/middleware.js");
const app = express();

app.set("view engine", "ejs");
app.use(urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "/public")));


app.use(session({
  secret: 'Your Security Key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
localAuth(passport);

app.use(route);

app.listen(5900, (err) => {
    database();
  if (err) {
    console.log(err);
  } else {
    console.log("Server Connected http://localhost:5900");
  }
});
