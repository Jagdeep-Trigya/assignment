const express = require('express');
const app = express();
app.use(express.json());
const cors =  require("cors");
app.use(cors());

const userRouter =  require("./router/userRouter");
const leadRouter =  require("./router/leadRouter");
const dealRouter =  require("./router/dealRouter");
const clientRouter =  require("./router/clientRouter");
const companyRouter =  require("./router/companyRouter");
const importCsvRouter = require("./router/fileUpload");

app.use("/user", userRouter);
app.use("/lead", leadRouter);
app.use("/deal", dealRouter);
app.use("/client", clientRouter);
app.use("/company", companyRouter);
app.use("/import-csv-router", importCsvRouter);

module.exports = app;
