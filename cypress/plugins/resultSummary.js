const loadJsonFile = require("load-json-file");
const cTable = require("console.table");

const [PASSED, FAILED, SKIPPED] = ["passed", "failed", "skipped"];

const result = loadJsonFile.sync("./cypress/reports/cypress-report.json");
const { stats, suites } = result;
const completesummary = [];
const getAllSummary = {};
let currentSuite = "";

function getFormatedTime(millis) {
  let minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  const hour = Math.floor(minutes / 60);
  minutes = hour > 0 ? (minutes % 60).toFixed(0) : minutes;
  return `${(hour > 0 ? (hour > 10 ? `${hour}:` : `0${hour}:`) : "") + (minutes < 10 ? "0" : "") + minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function finalSummary(stats) {
  const { testsRegistered: tests, passes, failures, skipped, duration, pending } = stats;
  // console.log(`---------------------------------------------------------`);
  /* console.table([
    {
      "": "Total",
      Time: duration > 1000 ? getFormatedTime(duration) : `${duration}ms`,
      Tests: tests,
      Passing: `${passes}(${Math.round((passes * 100) / tests)}%)`,
      Failing: `${failures}(${Math.round((failures * 100) / tests)}%)`,
      Skipped: `${skipped}(${Math.round((skipped * 100) / tests)}%)`,
      Pending: `${pending}(${Math.round((pending * 100) / tests)}%)`
    }
  ]);
  // console.log(`Total Test = ${tests} , Passed = ${passes} , Failed = ${failures} , Skipped = ${skipped}`);
  console.log(`Test Passing % = ${Math.round((passes * 100) / tests)}%`); */
  return {
    "#Spec": Object.keys(getAllSummary).length,
    Status: tests === passes ? "✔" : "✖",
    Spec: "Overall",
    Duration: duration > 1000 ? getFormatedTime(duration) : `${duration}ms`,
    Tests: tests,
    Passing: `${passes}(${Math.round((passes * 100) / tests)}%)`,
    Failing: `${failures}(${Math.round((failures * 100) / tests)}%)`,
    Skipped: `${skipped}(${Math.round((skipped * 100) / tests)}%)`,
    Pending: `${pending}(${Math.round((pending * 100) / tests)}%)`
  };
}

function getSuiteSummary(suite) {
  suite.forEach(suit => {
    const { suites, tests } = suit;
    if (tests.length > 0) {
      tests.forEach(test => {
        const { duration, context, state } = test;
        const contexts = context && JSON.parse(context);
        // console.log("test -", test.uuid);
        const specName = contexts
          ? Array.isArray(contexts)
            ? contexts.filter(con => con.title === "specName")[0].value
            : contexts.value
          : currentSuite;
        currentSuite = specName;
        const specSummary = getAllSummary[specName]
          ? getAllSummary[specName]
          : { time: 0, total: 0, pass: 0, fail: 0, skip: 0, pending: 0 };
        let { time, total, pass, fail, skip, pending } = specSummary;
        total++;
        time += duration;
        if (state === PASSED) pass++;
        else if (state === FAILED) fail++;
        else if (state === SKIPPED) skip++;
        else pending++;
        getAllSummary[specName] = { time, total, pass, fail, skip, pending };
      });
    }
    if (suites.length > 0) {
      getSuiteSummary(suites);
    }
  });
}

getSuiteSummary(suites.suites);
Object.keys(getAllSummary)
  .sort()
  .forEach((suiteName, i) => {
    const { time, total, pass, fail, skip, pending } = getAllSummary[suiteName];
    completesummary.push({
      "#Spec": `${i + 1}`,
      Status: total === pass ? "✔" : "✖",
      Spec: `${suiteName}`,
      Duration: time > 1000 ? getFormatedTime(time) : `${time}ms`,
      Tests: total,
      Passing: `${pass}`,
      Failing: fail,
      Skipped: skip,
      Pending: pending
    });
  });

completesummary.push({
  "#Spec": "-",
  Status: "-",
  Spec: "-",
  Duration: "-",
  Tests: "-",
  Passing: "-",
  Failing: "-",
  Skipped: "-",
  Pending: "-"
});

completesummary.push(finalSummary(stats));
console.table("Run Summary", completesummary);
