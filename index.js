import express from "express";
import ordinal from "ordinal";
import getCommands from "./commands.js";
import execute from "./utils/execute.js";
import formatString from "./utils/formatString.js";

const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.ref !== "refs/heads/main" || body.commits?.length === 0)
    return res.status(200).send("Webhook received successfully");

  const commit = body.commits[0];
  console.log(
    formatString(
      "New commit {0} by {1} in {2}",
      commit.message,
      commit.author.name,
      body.repository.name
    )
  );

  const commands = getCommands(body);

  if (commands) {
    execute(commands)
      .then(function () {
        console.log("All commands executed successfully.");
      })
      .catch(function ({ index }) {
        console.log(ordinal(index + 1) + " command failed.");
      });
  }

  res.status(200).send("Webhook received successfully");
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log("listening on port " + PORT));
