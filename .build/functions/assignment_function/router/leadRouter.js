const express = require("express");
const leadRouter = express.Router();

const { test,createNewLead,updateLead,getLeadById,getAllLeads, countLeads, deleteLead} = require("../controller/leadController");

leadRouter.get("/test-connection", test);
leadRouter.post("/createNewLead", createNewLead);
leadRouter.put("/updateLead/:id", updateLead);
leadRouter.get("/get-lead-byid/:id", getLeadById);
leadRouter.get("/get-all-lead", getAllLeads);
leadRouter.get("/get-lead-count", countLeads);
leadRouter.delete("/delete-lead/:id", deleteLead);

module.exports = leadRouter;