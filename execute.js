import boxen from "boxen"
import { exec } from "child_process"

function box(title, borderColor = "yellow", content = "") {
  console.log(
    boxen(content, {
      title,
      borderColor,
      titleAlignment: "left",
      fullscreen: (width) => [width]
    })
  )
}

export default function (commands) {
  return new Promise((resolve, reject) => {
    function execCommand(index = 0) {
      if (index === commands.length) {
        return resolve()
      }

      const object = commands[index]
      const command = typeof object === "string" ? object : object.command

      if (command.startsWith("cd ")) {
        const directory = command.substring(3).trim()

        process.chdir(directory)

        box("Command succeeded: " + command, "green")
        return execCommand(index + 1)
      }

      exec(command, function (error, stdout, stderr) {
        if (error) box("Command failed: " + command, "red", stderr)
        else box("Command succeeded: " + command, "green", stdout)

        if (!error || object?.continueOnError) execCommand(index + 1)
        else reject({ error, index })
      })
    }

    execCommand(0)
  })
}
