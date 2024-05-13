const PORT = 4131;
const express = require("express");
const session = require('express-session')
const app = express();
const data = require("./data");



const bcrypt = require("bcrypt");
const saltRounds = 10;

// helper function for adding user to database. Hashes's given plaintext password
async function hashPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

// helper function for validating user login information
async function checkPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

app.set("views", "templates");
app.set("view engine", "pug");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/css", express.static("resources/css"));
app.use("/js", express.static("resources/js"));

app.use(session({
  secret: 'some secret string',
}));


app.use((req, res, next) => {
  console.log("About to handle", req.method, req.originalUrl);

  // run the actual request handler
  next();

  console.log("Status returned by server: ", res.statusCode);
});

// middleware to check if user is logged in
function auth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).redirect("/login");
  }
}


app.get("/login", (req, res) => {
  res.render("loginform.pug");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userInfo = await data.getUser(username);
  if (userInfo) {
    const isValid = await checkPassword(password, userInfo.user_password);
    if (isValid) {
      req.session.user = userInfo;
      console.log(req.session.user);
      res.status(200).redirect("/");
    } else {
      res.status(401).redirect("/login");
    }
  } else {
    res.status(401).redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).redirect("/");
});


app.get("/", async (req, res) => {
  //const posts = await data.getPosts();
  let page = parseInt(req.query.page ?? 1)
  if (! page) {
    // this should catch "Nan" from a bad parseInt
    page = 1;
  }

  // -1 so that we go to 0 indexing.
  let offset = (page-1)*5;
  let posts =  (await data.getPosts()).slice(offset, offset+5);
  res.render("mainpage", { posts: posts, page: page, user: req.session.user });
});


app.post("/", async (req, res) => {
  let page = parseInt(req.query.page ?? 1);
  if (! page) {
    // this should catch "Nan" from a bad parseInt
    page = 1;
  }

  // -1 so that we go to 0 indexing.
  let offset = (page-1)*5;
  let posts =  (await data.getMostLiked()).slice(offset, offset+5);
  res.render("mainpage", { posts: posts, page: page, user: req.session.user });
});


app.get("/register", (req, res) => {
  res.render("registerform.pug");
});


app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const userInfo = {
    user_name: username,
    user_password: hashedPassword,
  };
  
  const ret_val = await data.addUser(userInfo);
  if (ret_val) {
    res.status(200).redirect("/login");
  } else {
    res.status(500).redirect("/register");
  }
});

// allows user to edit their post if they are logged in
app.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  console.log("updating post with id", id);
  
  const ret_val = await data.updatePost({id: id, content: req.body.newPost});
  if (ret_val) {
    res.status(200).redirect("/");
  } else {
    res.status(404).redirect("/");
  } 
});



app.post("/submit", auth, async (req, res) => {

  const post_data = {
    user_id: req.session.user.user_id,
    post_data: req.body.newPost,
  };
  const ret_val = await data.addPost(post_data);
  if (ret_val) {
    res.status(200).redirect("/");
  } else {
    res.status(500).redirect("/error");
  }

});

app.post("/like/:id", async (req, res) => {
  const id = req.params.id;
  console.log("liking post with id", id);
  const ret_val = await data.likePost(id);
  if (ret_val) {
    res.status(200).send("ok");
  }

});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  console.log("deleting post with id", id);
  const ret_val = await data.deletePost(id);
  if (ret_val) {
    res.status(200).redirect("/");
  } else {
    res.status(404).redirect("/");
  }
});







app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
});
