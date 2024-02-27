export default function (body) {
  if (body.repository.name === "example-repo")
    return [
      "cd /home/user/" + body.repository.name,
      "git pull",
      "npm install",
      "npm run build",
      { command: "npm run pm2 delete example-repo", continueOnError: true },
      "pm2 start index.js -n example-repo",
    ];
}
