const loadJsonFile = require("load-json-file");
const cTable = require("console.table");

const [PASSED, FAILED, SKIPPED] = ["passed", "failed", "skipped"];

const result = loadJsonFile.sync("./cypress/reports/cypress-report.json");
const { stats, suites } = result;
const completesummary = [];
const getAllSummary = {};
let currentSuite;

function getFormatedTime(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function finalSummary(stats) {
  const { testsRegistered: tests, passes, failures, skipped, duration, pending } = stats;
  console.log(`----------------------------------------------------`);
  console.table([
    {
      name: "Total",
      time: duration > 1000 ? getFormatedTime(duration) : `${duration}ms`,
      total: tests,
      pass: `${passes}(${Math.round((passes * 100) / tests)}%)`,
      fail: `${failures}(${Math.round((failures * 100) / tests)}%)`,
      skip: `${skipped}(${Math.round((skipped * 100) / tests)}%)`,
      pending: `${pending}(${Math.round((pending * 100) / tests)}%)`
    }
  ]);
  // console.log(`Total Test = ${tests} , Passed = ${passes} , Failed = ${failures} , Skipped = ${skipped}`);
  console.log(`Test Passing % = ${Math.round((passes * 100) / tests)}%`);
}

function getSuiteSummary(suite) {
  suite.forEach(suit => {
    const { suites, tests } = suit;
    if (tests.length > 0) {
      tests.forEach(test => {
        const { duration, context, state } = test;
        const specName = context ? JSON.parse(context).filter(con => con.title === "specName")[0].value : currentSuite;
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
  .forEach(suiteName => {
    const { time, total, pass, fail, skip, pending } = getAllSummary[suiteName];
    completesummary.push({
      status: total === pass ? "✔" : "✖",
      name: `${suiteName}`,
      time: time > 1000 ? getFormatedTime(time) : `${time}ms`,
      total,
      pass,
      fail,
      skip,
      pending
    });
  });

console.table("Run Summary", completesummary);
finalSummary(stats);
