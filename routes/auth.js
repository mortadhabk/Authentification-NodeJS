const router = require("express").Router();

const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  //validation de données avant la creation d'utilisateur
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // verification if notre utilisateur existe dans le base de donnée
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //hash le password
  //genSalt est le niveau de cryptage par defaut
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(req.body.password, salt);

  // creation d'utilisateur
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//login
router.post("/login", async (req, res) => {
  //validation de données avant la creation d'utilisateur
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // verification if notre utilisateur existe dans le base de donnée
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Email");

  //Password verification
  const validPass = bcrypt.compareSync(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  //creation de token

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
