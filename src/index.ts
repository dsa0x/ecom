import CartManager from "modelManagers/cartManager";
import mongoose from "mongoose";
import express from "express";
import app from "setup/express";
import "setup/mongoose";
import { db, dbStart } from "setup/mongoose";
import config from "./config";

const clearTerminal = () => {
  const { exec } = require("child_process");

  exec(`clear`, (error: any, stdout: any, stderr: any) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`server running on port : ${config.port}`);
  });
};

dbStart(
  app.listen(config.port, () => {
    // clearTerminal();
  })
);

// app.listen(config.port, () => {
//   // clearTerminal();
// });
