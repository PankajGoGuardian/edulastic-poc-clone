const fs = require("fs-extra");
const { addMatchImageSnapshotPlugin } = require("cypress-image-snapshot/plugin");

const path = require("path");

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve("cypress", "config", `${file}.json`);

  return fs.readJson(pathToConfigFile);
}

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);

  on("before:browser:launch", (browser = {}, args) => {
    if (browser.name === "chrome") {
      args.push("--cast-initial-screen-width=1920");
      args.push("--cast-initial-screen-height=1080");
      args.push("--start-fullscreen");

      return args;
    }

    if (browser.name === "electron") {
      args.width = 1920;
      args.height = 1080;
      args.fullscreen = true;

      return args;
    }
  });

  on("task", {
    readFileContent(filename) {
      if (fs.existsSync(filename)) {
        return fs.readFileSync(filename, "utf8");
      }
      return null;
    }
  });

  const file = config.env.configFile || "production";
  return getConfigurationByFile(file);
};
