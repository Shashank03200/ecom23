require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const path = require("path");

const PORT = process.env.PORT || 5000;

// Utils
const connectDB = require("./utils/connect-db");
const getSessionStore = require("./utils/mongo-session");

const app = express();
const sessionStore = getSessionStore(session);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  req.session.isAuth = true;
  res.send(req.sessionID);
});

app.use("/api/auth", require("./routes/auth.routes"));

// Error Response Middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    msg: err.message,
  });
});

// Code to be used in production / deployment
// Server static assets if in production
// if (process.env.NODE_ENV === "production") {
// Set a static folder
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
// }
connectDB
  .then((db) => {
    console.log("MongoDB connected\n");
    app.listen(PORT, () => {
      console.log("Server started on Port ", PORT);
    });
  })
  .catch((err) => console.log(err));
