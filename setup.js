const inquirer = require("inquirer");
const Enmap = require("enmap");
const fs = require("fs");

const defaultSettings = {
  "prefix": "!",
  "modLogChannel": "mod-log",
  "modRole": "Moderator",
  "adminRole": "Administrator",
  "systemNotice": "false",
  "welcomeChannel": "welcome",
  "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
  "welcomeEnabled": "false"
};

const settings = new Enmap({
  name: "settings",
  cloneLevel: 'deep',
  ensureProps: true
});


let prompts = [
  {
    type: "list",
    name: "resetDefaults",
    message: "Do you want to reset default settings?",
    choices: ["Yes", "No"]
  },
];

(async function () {
  console.log("Setting Up GuideBot Configuration...");
  await settings.defer;
  if (!settings.has("default")) {
    prompts = prompts.slice(1);
    console.log("First Start! Inserting default guild settings in the database...");
    await settings.set("default", defaultSettings);
  }

  const answers = await inquirer.prompt(prompts);

  if (answers.resetDefaults && answers.resetDefaults === "Yes") {
    console.log("Resetting default guild settings...");
    await settings.set("default", defaultSettings);
  }
  console.log("Configuration has been written, enjoy!");
  await settings.close();
}());