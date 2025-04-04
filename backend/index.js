const express = require("express");
const app = express();
const app_routing = require("./modules/app-routing");
const validator = require("./middlewares/validator");
const headerAuth = require("./middlewares/header_auth");
const cors = require("cors");

app.use(cors());
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(validator.extractHeaderLang);
// app.use(headerAuth.validateHeader);
app.use(headerAuth.header);

app_routing.v1(app);

app.listen(process.env.PORT | 5000, () => {
    console.log(`Server started on: http://localhost:${process.env.PORT}`);
});