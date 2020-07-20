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
      // temp
      args.push("--disable-dev-shm-usage");
      args.push("--disable-background-networking");
      args.push("--enable-features=NetworkService,NetworkServiceInProcess");
      args.push("--disable-background-timer-throttling");
      args.push("--disable-backgrounding-occluded-windows");
      args.push("--disable-breakpad");
      args.push("--disable-client-side-phishing-detection");
      args.push("--disable-default-apps");
      args.push("--disable-dev-shm-usage");
      args.push("--disable-extensions");
      args.push("--disable-features=site-per-process,TranslateUI");
      args.push("--disable-hang-monitor");
      args.push("--disable-ipc-flooding-protection");
      args.push("--disable-popup-blocking");
      args.push("--disable-prompt-on-repost");
      args.push("--disable-renderer-backgrounding");
      args.push("--disable-sync");
      args.push("--force-color-profile=srgb");
      args.push("--metrics-recording-only");
      args.push("--no-first-run");
      args.push("--safebrowsing-disable-auto-update");
      args.push("--enable-automation");
      args.push("--password-store=basic");
      args.push("--use-mock-keychain");
      args.push("--webview-disable-safebrowsing-support");
      //
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
