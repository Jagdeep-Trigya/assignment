const express = require("express");
const dealRouter = express.Router();

const { test,createNewdeal,updatedeal,getdealById,getAlldeals, countdeals, deletedeal} = require("../controller/dealController");

dealRouter.get("/test-connection", test);
dealRouter.post("/createNewdeal", createNewdeal);
dealRouter.put("/updateDeal/:id", updatedeal);
dealRouter.get("/get-deal-byid/:id", getdealById);
dealRouter.get("/get-all-deal", getAlldeals);
dealRouter.get("/get-deal-count", countdeals);
dealRouter.delete("/delete-deal/:id", deletedeal);

module.exports = dealRouter;