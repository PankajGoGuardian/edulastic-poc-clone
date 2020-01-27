class FileHelper {
  static getSpecName(name) {
    const filepath = name.split(/[/\\]/);
    const specName = filepath[filepath.length - 1];
    return specName;
  }

  static getTestFullName() {
    let currentTestContext = Cypress.mocha.getRunner().currentRunnable;
    let screenshotFileName;
    if (currentTestContext) {
      screenshotFileName =
        currentTestContext.type === "hook"
          ? currentTestContext.title
              .split(" for ")
              .reverse()
              .join(" -- ")
          : currentTestContext.title;

      while (currentTestContext.parent && currentTestContext.parent.title.length > 0) {
        screenshotFileName = `${currentTestContext.parent.title} -- ${screenshotFileName}`;
        currentTestContext = currentTestContext.parent;
        // console.log("inside while");
      }
    } else screenshotFileName = "there is no test running currently";
    return screenshotFileName.replace(/[\/\\<>:\"]/g, "").slice(0, 220);
  }

  static getTestFlow() {
    let currentTestContext = Cypress.mocha.getRunner().currentRunnable;
    let testcaseFlow;
    if (currentTestContext) {
      testcaseFlow = currentTestContext.title;
      while (currentTestContext.parent && currentTestContext.parent.title.length > 0) {
        testcaseFlow = `${currentTestContext.parent.title} > ${testcaseFlow}`;
        currentTestContext = currentTestContext.parent;
      }
    }
    return testcaseFlow;
  }
}

export default FileHelper;
