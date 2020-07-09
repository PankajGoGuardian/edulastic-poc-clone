const fs = require("fs-extra");
const { addMatchImageSnapshotPlugin } = require("cypress-image-snapshot/plugin");

const path = require("path");

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve("cypress", "config", `${file}.json`);
  return fs.readFileSync(pathToConfigFile);
}

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);

  on("before:browser:launch", (browser = {}, launchOptions) => {
    if (config.env.configFile === "visual-regression") {
      if (browser.family === "chromium" && browser.name !== "electron") {
        launchOptions.args.push("--window-size=1920,1080");
        launchOptions.args.push("--start-fullscreen");
      }

      if (browser.name === "electron") {
        launchOptions.preferences.width = 1920;
        launchOptions.preferences.height = 1080;
        launchOptions.preferences.fullscreen = true;
      }
      return launchOptions;
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
