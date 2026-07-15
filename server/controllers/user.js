const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");

module.exports.registerUser = (req, res) => {
  const { firstName, lastName, email, password, mobileNo } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).send({ error: "Email invalid" });
  }
  if (!mobileNo || mobileNo.length !== 11) {
    return res.status(400).send({ error: "Mobile number invalid" });
  }
  if (!password || password.length < 8) {
    return res.status(400).send({ error: "Password must be at least 8 characters" });
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).send({ error: "Email already registered" });
      }

      const newUser = new User({
        firstName,
        lastName,
        email,
        mobileNo,
        password: bcrypt.hashSync(password, 10),
      });

      return newUser
        .save()
        .then(() => res.status(201).send({ message: "Registered successfully" }))
        .catch((error) => auth.errorHandler(error, req, res));
    })
    .catch((error) => auth.errorHandler(error, req, res));
};

module.exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).send({ error: "Invalid email" });
  }

  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "No account found with that email" });
      }

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(401).send({ error: "Email and password do not match" });
      }

      return res.status(200).send({ access: auth.createAccessToken(user) });
    })
    .catch((error) => auth.errorHandler(error, req, res));
};

module.exports.getUserDetails = (req, res) => {
  return User.findById(req.user.id)
    .select("-password")
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      return res.status(200).send({ user });
    })
    .catch((error) => auth.errorHandler(error, req, res));
};
