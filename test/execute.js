import ordinal from "ordinal";
import execute from "../utils/execute.js";

const commands = [
  { command: "dir", continueOnError: true },
  { command: "ls", continueOnError: true },
  "echo hello world",
];

execute(commands)
  .then(function () {
    console.log("All commands executed successfully!");
  })
  .catch(function ({ index }) {
    console.log(ordinal(index + 1) + " command failed.");
  });
