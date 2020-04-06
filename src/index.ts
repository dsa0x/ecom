import express from "express";
import app from "loaders/express";
import "loaders/mongoose";
import config from "./config";
// import app fr

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
  });
};

clearTerminal();

app.listen(config.port, () => {
  console.log(`server running on port : ${config.port}`);
});
