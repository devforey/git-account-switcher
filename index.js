import print from "print-cli";
import readline from "readline";
import { exec } from "child_process";
import { exit } from "process";

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

print.PRINT({
  text: "Select Git Workspace",
});

readlineInterface.question("A. Personal, B. Work", async (choice) => {
  switchGit(choice.toUpperCase());
});

const choiceInfo = {
  A: {
    sshUrl: "~/.ssh/id_ed25519",
    name: "",
    email: "",
  },
  B: {
    sshUrl: "~/.ssh/id_ed25519-dummy",
    name: "",
    email: "",
  },
};

function switchGit(choice) {
  if (!cmd("ssh-add -D")) {
    return;
  }

  const choiceData = choiceInfo[choice];

  if (!cmd(`ssh-add ${choiceData.sshUrl}`)) {
    return;
  }

  if (!cmd(`git config --global user.name "${choiceData.name}"`)) {
    return;
  }

  if (!cmd(`git config --global user.email "${choiceData.email}"`)) {
    return;
  }

  console.log(`[SUCCESS] Switch SSH`);
  exit();
}

function cmd(commandStr) {
  try {
    console.log(`[LOG] ${commandStr}`);
    let { strerr } = exec(commandStr);
    if (strerr) {
      console.log(`ERROR ${strerr}`);
      return false;
    }
    return true;
  } catch (e) {
    console.log(`ERROR ${e}`);
    return false;
  }
}
