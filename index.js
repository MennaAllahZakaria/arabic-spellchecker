const express = require('express');
const dbConnection = require("./config/database");
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const globalError = require("./middlewares/errorMiddleware");
const mountRoutes = require("./routes/index.routes");

const ApiError = require("./utils/apiError");
const path = require('path');
dotenv.config({ path: "config.env" });

const app = express();

// Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // form-data
// Connect to MongoDB
dbConnection();

//Mount Routes
mountRoutes(app);

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(process.env.NODE_ENV);
}


app.all("*", (req, res, next) => {
  //Create error and send it to error handling middleware
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

//Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

//handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down...`);
    process.exit(1);
  });
});
