const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { connectDb } = require("./config/db.js");

const userRoutes = require("./routes/userRoutes");

const app = express();
dotenv.config();
const hostname = process.env.DEVURL;
const port = process.env.PORT;

// Call the connectDb function to establish the database connection
connectDb();

app.use(cors());
app.use("/media", express.static("media"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoutes);

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running on ${hostname}:${port}`);
});
