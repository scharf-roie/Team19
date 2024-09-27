const express = require("express");
//var router = express.router(); //used to get page
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 8888;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

const usersLoggedIn = new Set();


app.get('/login', async (req, res) => {
  const User =   dbo.getDb().collection("user");
  console.log(req.query.username);
  const findUser = await User.findOne({
    user: req.query.username, //query to take in User info
    pass: req.query.password
  });

  if(findUser) {
      usersLoggedIn.add(req.query.username);
      res.status(200).end(); //send HTTP response code w/ 200 being good
  } 
  else {
    res.status(401).end(); 
  }
});

app.get('/is-logged-in', async (req, res) => {
  if(usersLoggedIn.has(req.query.username))
    res.status(200).send('logged-in');
  else
    res.status(200).send('not-logged-in');
})


app.get('/register', async (req, res) => {
  const User =   dbo.getDb().collection("user");
  const result = await User.insertOne({
    user: req.query.username,
    pass: req.query.password
  });
})



app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);

  });
  console.log(`Server is running on port: ${port}`);
});