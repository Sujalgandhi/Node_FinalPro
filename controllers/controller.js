const multer = require("multer");
const fs = require("fs");
const { blog_model, loginModel } = require("../models/blog_model");

const addUser = async (req, res) => {
  try {
    let usercheck = loginModel.findOne({ email: req.body.email });

    if (usercheck) {
      console.log("User Already Exists");
      res.redirect("back");
    }

    let userData = await loginModel.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.redirect("/loginPage");
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    let useFind = await loginModel.findOne({ username: req.body.username });
    if (useFind) {
      if (useFind.password == req.body.password) {
        console.log("Login Successful");
        res.cookie("userName", useFind.id).redirect("/");
      } else {
        console.log("wrong Password");
        res.redirect("/loginPage");
      }
    } else {
      console.log("Usereror");
      res.redirect("/loginPage");
    }
  } catch (error) {
    console.log(error);
  }
};

const logOut = async (req, res) => {
  try {
    console.log("Log Out Successful...");
    req.logOut((err) => {
      if (err) console.log(err);
    });
    res.redirect("/loginPage");
  } catch (error) {
    console.log(error);
  }
};

const signPage = async (req, res) => {
  try {
    res.render("signPage");
  } catch (error) {
    console.log(error);
  }
};

const imageMulter = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const Upload = multer({ storage: imageMulter }).single("image");

const home = async (req, res) => {
  try {
    const show = await blog_model.find();
    console.log(show);
    res.render("home", { show });
  } catch (error) {
    console.log(error);
  }
};

const formPage = async (req, res) => {
  try {
    await res.render("blog_form");
  } catch (error) {
    console.log(error);
  }
};

const addBlog = async (req, res) => {
  try {
    let image = "";
    if (req.file) {
      image = req.file.path;
      console.log(image);
    }
    const addDataBlog = await blog_model.create({
      title: req.body.title,
      // author: req.body.author,
      date: req.body.date,
      dsc: req.body.dsc,
      image: image,
    });
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

const deleteBlog = async (req, res) => {
  let id = req.query.id;
  try {
    let Data = await blog_model.findById(id);
    console.log("delete data" + Data);
    let imgpath = Data.image;
    let deleteData = await blog_model.findByIdAndDelete(id);

    if (imgpath && fs.existsSync(imgpath)) {
      fs.unlinkSync(imgpath);
    }
    res.redirect("back");
    console.log(deleteData);
  } catch (error) {
    console.log(error);
  }
};

const editPage = async (req, res) => {
  try {
    let data = await blog_model.findById(req.query.id);
    await res.render("edit_form", { val: data });
  } catch (error) {
    console.log(error);
  }
};

const update = async (req, res) => {
  try {
    let image = "";
    let id = req.body.id;
    if (req.file) {
      image = req.file.path;
      console.log(image);
    } else {
      image = req.body.old_img;
    }

    console.log("Id: " + id);

    let updateData = await blog_model.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        // author: req.body.author,
        date: req.body.date,
        dsc: req.body.dsc,
        image: image,
      },
      { new: true }
    );

    console.log("updated Data::   " + updateData);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const loginPage = async (req, res) => {
  let userdata = await loginModel.find();
  await res.render("login", { userdata });
};

module.exports = {
  home,
  formPage,
  addBlog,
  Upload,
  deleteBlog,
  editPage,
  update,
  loginPage,
  signPage,
  login,
  addUser,
  logOut,
};
