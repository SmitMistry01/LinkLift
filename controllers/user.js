const User = require("../models/user.js");
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../services/auth.js");

async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;

    // Create a new user if email is not taken
    await User.create({ name, email, password });
    return res.render("home");
  }

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      // Correctly check the result of the findOne() call
      return res.render("login", {
        error: "Invalid Credentials",
      });
    }
    //if all is correct we then create session id
    //session ID, also called a session token, is a unique identifier that a web server assigns to a user for the duration of the current session.

    const sessionId = uuidv4();
    setUser(sessionId, user);

    //Server returns session ID, which is stored as a cookie.
    res.cookie("uid", sessionId);

    // User exists and credentials are valid
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error logging in");
  }
}

module.exports = { handleUserSignUp, handleUserLogin };
