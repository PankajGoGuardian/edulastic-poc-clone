import { capitalize } from "lodash";

export const getFormattedName = (...names) => {
  const nameArr = names.filter(n => n?.trim()).map(n => capitalize(n));
  const lName = nameArr.splice(nameArr.length - 1)[0];
  return nameArr.length ? lName + ", " + nameArr.join(" ") : lName;
};

export const dummyTableData = [...new Array(50)].map(i => ({
  firstName: "sara",
  lastName: "ansh",
  lastActivityDate: "jan 23",
  className: "Test Class x",
  assessments: [
    { name: "test1 long name", score: "100" },
    { name: "test2", score: "10" },
    { name: "test3", score: "40" },
    { name: "test4", score: "60" },
    { name: "test5", score: "87" },
    { name: "test6", score: "98" },
    { name: "test7", score: "56" },
    { name: "test8", score: "45" }
  ]
}));

export const dummyAssessmentsData = [
  { name: "test1 long name", id: "dafasda" },
  { name: "test2", id: "adsfasd" },
  { name: "test3", id: "dafdasg" },
  { name: "test4", id: "adfdsha" },
  { name: "test5", id: "dasgdag" },
  { name: "test6", id: "sdgadds" },
  { name: "test7", id: "ewagbdd" },
  { name: "test8", id: "gadsaad" }
];
