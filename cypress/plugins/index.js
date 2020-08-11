const fs = require("fs-extra");
const { addMatchImageSnapshotPlugin } = require("cypress-image-snapshot/plugin");

const path = require("path");

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve("cypress", "config", `${file}.json`);
  return fs.readFileSync(pathToConfigFile);
}

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);

  on("before:browser:launch", (browser = {}, args) => {
    if (browser.name === "chrome") {
      args.push("--cast-initial-screen-width=1920");
      args.push("--cast-initial-screen-height=1080");
      args.push("--start-fullscreen");
      args.push("--disable-dev-shm-usage");

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

  // build env configuration
  const confFile = config.env.configFile || "common";
  const commonConfig = JSON.parse(getConfigurationByFile("common"));
  const envConfig = JSON.parse(getConfigurationByFile(confFile));
  envConfig.env.testExecutionEnv = config.env.testExecutionEnv || "local";
  if (["prod", "uat", "qa"].indexOf(envConfig.env.ENVIRONMENT) >= 0) envConfig.API_URL = `${envConfig.baseUrl}/api`;
  const configuration = { ...commonConfig, ...envConfig };

  return configuration;
};
