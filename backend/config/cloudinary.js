// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
require("dotenv").config();

const cloudinaryConnection = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CloudName,
      api_key: process.env.ApiKey,
      api_secret: process.env.ApiSecret,
    });
    console.log("Cloudinary connected successfully! ☁️");
  } catch (err) {
    console.error("Error connecting to Cloudinary:", err);
    console.log("Something is wrong with Cloudinary setup 🤦‍♂️🤷‍♂️");
  }
};

module.exports = { cloudinaryConnection, cloudinary };
