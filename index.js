import express from "express";
import ordinal from "ordinal";
import execute from "./execute.js";

const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
  const { body } = req;

  if (body.ref !== "refs/heads/main" || body.commits?.length === 0)
    return res.status(200).send("Webhook received successfully");

  const commit = body.commits[0];
  console.log(
    `New commit "${commit.message}" by ${commit.author.name} in ${body.repository.name}`
  );

  let commands = null;
  if (
    ["media-downloader", "moments-poster", "quiz-app"].includes(
      body.repository.name
    )
  )
    commands = [
      "cd /home/haider/" + body.repository.name,
      "git pull",
      "npm install",
      "npm run build",
      { command: "npm run pm2:d", continueOnError: true },
      "npm run pm2:s",
    ];
  else if (body.repository.name === "whatsapp-express")
    commands = [
      "cd /home/haider/" + body.repository.name,
      "git pull",
      "npm install",
      { command: "npm run pm2:d", continueOnError: true },
      "npm run pm2:s",
    ];
  else if (body.repository.name === "auto-deploy")
    commands = [
      "cd /home/haider/" + body.repository.name,
      "git pull",
      "npm install",
      "pm2 restart " + body.repository.name,
    ];

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
