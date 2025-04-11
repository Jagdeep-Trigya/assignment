const express = require("express");
const userRouter = express.Router();

const { testConnection,createUser,loginUser,getUserbyId,getAllUser,updateUser,deleteUser} = require("../controller/userController");

userRouter.get("/test-connection", testConnection);
userRouter.post("/createUser", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/getUser/:id", getUserbyId);
userRouter.get("/getAllUser", getAllUser);
userRouter.put("/updateUser/:id", updateUser);
userRouter.delete("/deleteUser/:id", deleteUser);

module.exports = userRouter;