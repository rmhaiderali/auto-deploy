import chalk from "chalk"
import { exec } from "child_process"

function createStringWithDash(n) {
  return "─".repeat(n)
}

function enclose(text) {
  const line = createStringWithDash(text.length)
  return line + "\n" + text + "\n" + line
}

export default function (commands, callback) {
  function next(index = 0) {
    if (index === commands.length) {
      return callback(null)
    }

    const object = commands[index]
    const command = typeof object === "string" ? object : object.command

    if (command.startsWith("cd ")) {
      const directory = command.substring(3).trim()

      process.chdir(directory)

      console.log(chalk.yellow(enclose("Changed directory to: " + directory)))
      return next(index + 1)
    }

    exec(command, function (error, stdout, stderr) {
      if (error || stderr) {
        if (error) console.log(error)
        if (stderr) console.log(stderr)
        console.log(chalk.red(enclose("Command failed: " + command)))
      } else {
        console.log(stdout)
        console.log(chalk.green(enclose("Command succeeded: " + command)))
      }

      if (!error || object?.continueOnError) next(index + 1)
      else callback(index)
    })
  }

  next(0)
}
