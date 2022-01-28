const router = require("express").Router();
const User = require("../model/user");
const verify = require("./verifyToken");

//Une fois logué, l’utilisateur peut accéder à la liste des utilisateurs déjà enregistrés sur la plateforme via la route /users

router.get("/user", verify, async (req, res) => {
  const user = await User.find();
  if (!user) return res.status(400).send("il faut se connecter ");
  res.send(user);
});

module.exports = router;
