import express from "express"
import execute from "./execute"

const app = express()
app.use(express.json())

app.post("/webhook", (req, res) => {
  const { body } = req

  if (body.ref !== "refs/heads/main" || body.commits?.length === 0)
    return res.status(200).send("Webhook received successfully")

  const commit = body.commits[0]
  console.log("New commit by " + commit.author.name + ": " + commit.message)

  if (body.repository.name === "media-downloader") {
    const commands = [
      "cd ~/media-downloader/",
      "git pull origin main",
      "npm install",
      "npm run build",
      { command: "pm2 delete media-downloader", continueOnError: true },
      "npm run start:pm2"
    ]

    execute(commands, function (errorIndex) {
      if (errorIndex === null) {
        console.log("All commands executed successfully!")
      } else {
        console.error("Command failed: " + commands[errorIndex])
      }
    })
  }

  res.status(200).send("Webhook received successfully")
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log("listening on port " + PORT))
