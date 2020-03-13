export const languages = [
  [
    { label: "C", lang: "c" },
    { label: "C++", lang: "cplus" },
    { label: "C#", lang: "cSharp" },
    { label: "GO*", lang: "go" }
  ],
  [
    { label: "JAVA 8", lang: "java" },
    { label: "JAVA 11", lang: "java" },
    { label: "JAVASCRIPT", lang: "javascript" },
    { label: "OBJECTIVE C*", lang: "objectivec" }
  ],
  [
    { label: "PEARL*", lang: "pearl" },
    { label: "PYTHON 2.7", lang: "python" },
    { label: "PYTHON 3", lang: "python" },
    { label: "R*", lang: "r" }
  ],
  [
    { label: "RUBY", lang: "ruby" },
    { label: "SCALA", lang: "scala" },
    { label: "VISUAL BASIC", lang: "visualbasic" },
    { label: "BASH*", lang: "bash" }
  ],
  [
    { label: "KOTLIN", lang: "kotlin" },
    { label: "JAVA 7", lang: "java" },
    { label: "PHP*", lang: "java" },
    { label: "SWIFT", lang: "swift" }
  ]
];

export const TestCaseCategories = [
  "Independent cases",
  "Invalid cases",
  "More advanced cases",
  "Negative cases",
  "Outcome not possible cases",
  "Repeated cases",
  "Time complexity",
  "Unexpected cases"
];

export const visibilityOptions = ["open", "hidden"];

export const dataSource = [
  {
    id: 1,
    input: "10 20 30 40 50",
    category: "Basic cases",
    description: "No description",
    visibility: "open",
    weightage: 9,
    timelimit: "",
    active: true,
    number: "0",
    output: "40"
  },
  {
    id: 2,
    input: "23 55 67 22 40 65 44 20",
    category: "Basic cases",
    visibility: "open",
    weightage: 9,
    timelimit: "",
    active: true,
    number: "1",
    output: "44"
  },
  {
    id: 3,
    input: "1 4",
    category: "Basic cases",
    visibility: "hidden",
    weightage: 9,
    timelimit: "",
    active: true,
    number: "2",
    output: "3"
  },
  {
    id: 4,
    input: "1 2 4",
    category: "Basic cases",
    visibility: "hidden",
    weightage: 9,
    timelimit: "",
    active: true,
    number: "3",
    output: "3"
  }
];
