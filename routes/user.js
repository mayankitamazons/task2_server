var express = require("express");
const UserController = require("../controllers/UserController");

var router = express.Router();

router.get("/list", UserController.userList);
router.get("/:id", UserController.userDetail);
router.post("/", UserController.register);
router.put("/:id", UserController.userUpdate);
router.delete("/:id", UserController.userDelete);

module.exports = router;