import React from "react";
import styled from "styled-components";

import Delete from "../keyboardButtons/delete.svg";
import Sqrt from "../keyboardButtons/sqrt.svg";
import Group941 from "../keyboardButtons/941.svg";
import Group942 from "../keyboardButtons/942.svg";
import Group944 from "../keyboardButtons/944.svg";
import Group993 from "../keyboardButtons/993.svg";
import Group940v2 from "../keyboardButtons/940-2.svg";
import Group944v2 from "../keyboardButtons/944-2.svg";
import Group999 from "../keyboardButtons/999.svg";
import Group1052 from "../keyboardButtons/1052.svg";
import Group2251 from "../keyboardButtons/2251.svg";
import Group2249 from "../keyboardButtons/2249.svg";
import Group2247 from "../keyboardButtons/2247.svg";
import Group2245 from "../keyboardButtons/2245.svg";
import Group2206 from "../keyboardButtons/2206.svg";
import Group1006 from "../keyboardButtons/1006.svg";
import Group1007 from "../keyboardButtons/1007.svg";
import Group2207 from "../keyboardButtons/2207.svg";
import Group1004 from "../keyboardButtons/1004.svg";
import Group2208 from "../keyboardButtons/2208.svg";
import Group1005 from "../keyboardButtons/1005.svg";
import Group1002 from "../keyboardButtons/1002.svg";
import Group2256 from "../keyboardButtons/2256.svg";
import Group2253 from "../keyboardButtons/2253.svg";
import Group2263 from "../keyboardButtons/2263.svg";
import Group2261 from "../keyboardButtons/2261.svg";
import Group2266 from "../keyboardButtons/2266.svg";
import Group2262 from "../keyboardButtons/2262.svg";
import Group1023 from "../keyboardButtons/1023.svg";
import Group1025 from "../keyboardButtons/1025.svg";
import Group1045 from "../keyboardButtons/1045.svg";
import Group1012 from "../keyboardButtons/1012.svg";
import Group1013 from "../keyboardButtons/1013.svg";
import Group1022 from "../keyboardButtons/1022.svg";
import Group1014 from "../keyboardButtons/1014.svg";
import Group1054 from "../keyboardButtons/1054.svg";
import Group1029 from "../keyboardButtons/1029.svg";
import Group1030 from "../keyboardButtons/1030.svg";
import Group1058 from "../keyboardButtons/1058.svg";
import Group1030v2 from "../keyboardButtons/1030v2.svg";
import Group2357 from "../keyboardButtons/2357.svg";
import Group1043 from "../keyboardButtons/1043.svg";

export const CustomImage = styled.img.attrs({ className: "keyboardButton" })`
  width: ${({ width }) => (width ? `${width}px` : "25px")};
  height: ${({ height }) => (height ? `${height}px` : "25px")};
  object-fit: contain;
`;

const COMPARISON = [
  {
    handler: "≮",
    label: "≮",
    types: ["all", "comparison"],
    command: "cmd"
  },
  {
    handler: "≯",
    label: "≯",
    types: ["all", "comparison"],
    command: "cmd"
  },
  {
    handler: "≠",
    label: "≠",
    types: ["all", "comparison"],
    command: "cmd"
  },
  {
    handler: "≈",
    label: "≈",
    types: ["all", "comparison"],
    command: "cmd"
  }
];

const GENERAL = [
  {
    handler: "\\sqrt[3]{}",
    label: <CustomImage src={Group1043} role="presentation" />,
    types: ["all", "general"],
    command: "write"
  },
  {
    handler: "\\therefore",
    label: "∴",
    types: ["all", "general"],
    command: "cmd"
  },
  {
    handler: ":",
    label: ":",
    types: ["all", "general"],
    command: "cmd"
  },
  {
    handler: "%",
    label: "%",
    types: ["all", "general"],
    command: "cmd"
  },
  {
    handler: "/",
    label: <CustomImage src={Group940v2} role="presentation" />,
    types: ["all", "general", "calculus", "algebra"],
    command: "cmd"
  },
  {
    handler: "leftright2",
    label: "x²",
    types: ["all", "general"],
    command: "cmd"
  },
  {
    handler: "\\ldots",
    label: <CustomImage src={Group2206} role="presentation" />,
    types: ["all", "general"],
    command: "cmd",
    name: "ldots"
  },
  {
    handler: "\\ddots",
    label: <CustomImage src={Group2207} role="presentation" />,
    types: ["all", "general"],
    command: "cmd",
    name: "ldoddotsts"
  },

  {
    handler: "\\vdots",
    label: <CustomImage src={Group2208} role="presentation" />,
    types: ["all", "general"],
    command: "cmd",
    name: "vdots"
  },
  {
    handler: "_",
    label: <CustomImage src={Group1002} role="presentation" />,
    types: ["all", "general", "general", "chemistry"],
    command: "cmd",
    name: "underscore"
  },
  {
    handler: "\\sec",
    label: "sec",
    types: ["all"],
    command: "cmd"
  },
  {
    handler: "\\csc",
    label: "csc",
    types: ["all"],
    command: "cmd"
  }
];

const GEOMETRY = [
  {
    handler: "⊥",
    label: "⊥",
    types: ["all", "geometry"],
    command: "cmd"
  },
  {
    handler: "∥",
    label: "∥",
    types: ["all", "geometry"],
    command: "cmd"
  },
  {
    handler: "∦",
    label: "∦",
    types: ["all", "geometry"],
    command: "cmd"
  },
  {
    handler: "\\underset{\\sim}{\\mathbf{}}",
    label: <CustomImage src={Group1052} role="presentation" />,
    types: ["all", "geometry"],
    command: "write"
  }
];

const SETS = [
  {
    handler: "\\subset",
    label: <CustomImage src={Group2256} role="presentation" />,
    types: ["all", "sets"],
    command: "cmd"
  },
  {
    handler: "\\supset",
    label: <CustomImage src={Group2253} role="presentation" />,
    types: ["all", "sets"],
    command: "cmd"
  },
  {
    handler: "\\subseteq",
    label: <CustomImage src={Group2263} role="presentation" />,
    types: ["all", "sets"],
    command: "cmd"
  },
  {
    handler: "\\supseteq",
    label: <CustomImage src={Group2261} role="presentation" />,
    types: ["all", "sets"],
    command: "cmd"
  },
  // {
  // commenting because it is wrongly mapped , `in` is already present
  // shows `in` as label but renders ∈, used in sets
  //   handler: "\\in",
  //   label: "in",
  //   types: ["all", "sets"],
  //   command: "cmd"
  // },
  {
    handler: "\\notin",
    label: <CustomImage src={Group2266} role="presentation" />,
    types: ["all", "sets"],
    command: "cmd"
  },
  {
    handler: "\\ni",
    label: <CustomImage src={Group2262} role="presentation" />,
    types: ["all", "sets"],
    command: "cmd"
  },
  {
    handler: "\\not\\subset",
    label: "⊄",
    types: ["all", "sets"],
    command: "write"
  },
  {
    handler: "\\union",
    label: "∪",
    types: ["all", "sets"],
    command: "cmd"
  },
  {
    handler: "\\intersection",
    label: "∩",
    types: ["all", "sets"],
    command: "cmd"
  },
  {
    handler: "\\emptyset",
    label: "∅",
    types: ["all", "sets"],
    command: "cmd"
  },
  {
    handler: ",",
    label: ",",
    types: ["all", "sets"],
    command: "cmd"
  },
  {
    handler: "!",
    label: "!",
    types: ["all", "sets"],
    command: "cmd"
  },
  {
    handler: "\\backslash",
    label: "\\",
    types: ["all", "sets"],
    command: "cmd"
  },
  {
    handler: "\\left[\\right)",
    label: <CustomImage src={Group1025} role="presentation" />,
    types: ["all", "sets"],
    command: "write"
  },
  {
    handler: "\\left(\\right]",
    label: <CustomImage src={Group1045} role="presentation" />,
    types: ["all", "sets"],
    command: "write"
  }
];

const GREEK = [
  {
    handler: "\\alpha",
    label: "α",
    types: ["all", "greek"],
    command: "cmd"
  },
  {
    handler: "\\gamma",
    label: "γ",
    types: ["all", "greek"],
    command: "cmd"
  },
  {
    handler: "\\delta",
    label: "δ",
    types: ["all", "greek", "calculus", "greek"],
    command: "cmd"
  },
  {
    handler: "\\sigma",
    label: "σ",
    types: ["all", "greek"],
    command: "cmd"
  },
  {
    handler: "\\Sigma",
    label: "Σ",
    types: ["all", "greek"],
    command: "cmd"
  },
  {
    handler: "\\lambda",
    label: "λ",
    types: ["all", "greek"],
    command: "cmd"
  },
  {
    handler: "\\phi",
    label: "ϕ",
    types: ["all", "greek"],
    command: "cmd"
  },
  {
    handler: "\\tau",
    label: "τ",
    types: ["all", "greek"],
    command: "cmd"
  },
  {
    handler: "\\varepsilon",
    label: "ε",
    types: ["all", "greek"],
    command: "cmd"
  },
  {
    handler: "\\beta",
    label: "β",
    types: ["all", "greek"],
    command: "cmd"
  }
];

const CHEMISTRY = [
  {
    handler: "\\frac{\\mathrm{}}{\\mathrm{}}H",
    label: <CustomImage src={Group1012} role="presentation" />,
    types: ["all", "chemistry"],
    command: "write"
  },
  {
    handler: "H\\frac{\\mathrm{}}{\\mathrm{}}",
    label: <CustomImage src={Group1013} role="presentation" />,
    types: ["all", "chemistry"],
    command: "write"
  },
  {
    handler: "\\rightarrow",
    label: "→",
    types: ["all", "chemistry"],
    command: "write"
  },
  {
    handler: "\\leftarrow",
    label: "←",
    types: ["all", "chemistry"],
    command: "write"
  },
  {
    handler: "\\rightleftharpoons",
    label: "⇋",
    types: ["all", "chemistry"],
    command: "write"
  },
  {
    handler: "\\longleftrightarrow",
    label: "←→",
    types: ["all", "chemistry"],
    command: "write"
  },
  {
    handler: "\\xrightarrow[]{}",
    label: <CustomImage src={Group1022} role="presentation" />,
    types: ["all", "chemistry"],
    command: "write"
  },
  {
    handler: "mol",
    label: "mol",
    types: ["all", "chemistry"],
    command: "write"
  },
  {
    handler: "'",
    label: "'",
    types: ["all", "chemistry"],
    command: "write"
  },
  {
    handler: "\\overset{}^{H}",
    label: <CustomImage src={Group1014} role="presentation" />,
    types: ["all", "chemistry"],
    command: "write"
  },
  {
    handler: "\\text{g}\\ \\text{mol}^{-1}",
    label: <CustomImage src={Group1054} role="presentation" />,
    types: ["all", "chemistry"],
    command: "write"
  }
];

const GROUPING = [
  {
    handler: "{",
    label: <CustomImage src={Group1023} role="presentation" />,
    types: ["all", "grouping", "sets"],
    command: "cmd"
  }
];

const MISC = [
  {
    handler: "\\propto",
    label: "∝",
    types: ["all", "misc"],
    command: "cmd"
  },
  {
    handler: "abc",
    label: "abc",
    types: ["all", "misc"],
    command: "cmd"
  },
  {
    handler: "\\cdot",
    label: "·",
    types: ["all", "misc"],
    command: "cmd"
  },
  {
    handler: "\\longdiv",
    label: <CustomImage src={Group1030v2} role="presentation" />,
    types: ["all", "misc"],
    command: "cmd"
  },
  {
    handler: "ℝ",
    label: <CustomImage src={Group2357} role="presentation" />,
    types: ["all", "misc"],
    command: "write"
  }
];

const CALCULUS = [
  {
    handler: "d",
    label: "d",
    types: ["all", "calculus"],
    command: "cmd"
  },
  {
    handler: "f",
    label: "f",
    types: ["all", "calculus"],
    command: "cmd"
  },
  {
    handler: "\\int_{}^{}",
    label: <CustomImage src={Group1029} role="presentation" />,
    types: ["all", "calculus"],
    command: "write"
  },
  {
    handler: "\\sum",
    label: <CustomImage src={Group1030} role="presentation" />,
    types: ["all", "calculus"],
    command: "cmd"
  },
  {
    handler: "\\partial",
    label: "∂",
    types: ["all", "calculus"],
    command: "cmd"
  },
  {
    handler: "\\lim_{x\\to {}}",
    label: <CustomImage src={Group1058} role="presentation" />,
    types: ["all", "calculus"],
    command: "write"
  }
];

const DISCRETE = [
  {
    handler: "\\lfloor",
    label: "⌊",
    types: ["all", "discrete"],
    command: "cmd"
  },
  {
    handler: "\\rfloor",
    label: "⌋",
    types: ["all", "discrete"],
    command: "cmd"
  },
  {
    handler: "\\lceil",
    label: "⌈",
    types: ["all", "discrete"],
    command: "cmd"
  },
  {
    handler: "\\rceil",
    label: "⌉",
    types: ["all", "discrete"],
    command: "cmd"
  },
  {
    handler: "\\uparrow",
    label: "↑",
    types: ["all", "discrete"],
    command: "cmd"
  },
  {
    handler: "\\equiv",
    label: "≡",
    types: ["all", "discrete"],
    command: "cmd"
  },
  {
    handler: "\\and",
    label: "∧",
    types: ["all", "discrete"],
    command: "cmd"
  },
  {
    handler: "\\or",
    label: "∨",
    types: ["all", "discrete"],
    command: "cmd"
  },
  {
    handler: "\\not",
    label: "¬",
    types: ["all", "discrete"],
    command: "cmd"
  },
  {
    handler: "\\exist",
    label: "∃",
    types: ["all", "discrete"],
    command: "cmd"
  },
  {
    handler: "\\forall",
    label: "∀",
    types: ["all", "discrete"],
    command: "cmd"
  },
  {
    handler: "\\oplus",
    label: "⊕",
    types: ["all", "discrete"],
    command: "cmd"
  }
];

const BASIC = [
  {
    handler: "=",
    label: "=",
    types: ["all", "basic", "intermediate", "advanced_matrices", "advanced_trignometry"],
    command: "write"
  },
  {
    handler: "<",
    label: "<",
    types: ["all", "basic", "intermediate", "advanced_matrices", "advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: ">",
    label: ">",
    types: ["all", "basic", "intermediate", "advanced_matrices", "advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "(",
    labelcy: "(",
    label: <CustomImage src={Group944} role="presentation" />,
    types: ["all", "basic", "intermediate", "advanced_matrices", "advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "[",
    label: <CustomImage src={Group944v2} role="presentation" />,
    types: [
      "all",
      "basic",
      "intermediate",
      "advanced_matrices",
      "advanced_trignometry",
      "algebra",
      "grouping"
    ],
    command: "cmd",
    name: "squareBrackets"
  },
  {
    handler: "\\frac{}{}",
    labelcy: "fraction",
    label: <CustomImage src={Group941} role="presentation" />,
    types: ["all", "basic", "intermediate", "advanced_matrices", "advanced_trignometry", "general"],
    command: "write"
  },
  {
    handler: "\\sqrt",
    labelcy: "sqrt",
    label: <CustomImage src={Sqrt} role="presentation" />,
    types: ["basic"],
    command: "cmd"
  },
  {
    handler: "^",
    labelcy: "super",
    label: <CustomImage src={Group942} role="presentation" />,
    types: [
      "all",
      "basic",
      "intermediate",
      "general",
      "advanced_matrices",
      "advanced_trignometry",
      "chemistry"
    ],
    command: "cmd"
  },
  {
    handler: "Backspace",
    labelcy: "backspace",
    label: <CustomImage src={Delete} role="presentation" />,
    types: ["all", "basic"],
    command: "cmd"
  },
  {
    handler: "\\$",
    label: "$",
    types: ["all", "basic"],
    command: "write"
  },
  {
    handler: "°",
    label: "º",
    labelcy: "°",
    types: ["basic"],
    command: "cmd"
  },
  {
    handler: "\\pm",
    label: "±",
    types: ["basic"],
    command: "cmd"
  }
];

const INTERMEDIATE = [
  {
    handler: "\\sqrt",
    labelcy: "sqrt",
    label: <CustomImage src={Sqrt} role="presentation" />,
    types: ["all", "intermediate", "advanced_matrices", "advanced_trignometry", "general"],
    command: "cmd"
  },
  {
    handler: "\\sqrt[{}]{}",
    label: <CustomImage src={Group999} role="presentation" />,
    types: ["all", "intermediate", "advanced_matrices", "advanced_trignometry"],
    command: "write"
  },
  {
    handler: "|",
    labelcy: "|",
    label: <CustomImage src={Group993} role="presentation" />,
    types: ["all", "intermediate", "advanced_matrices", "advanced_trignometry", "general", "misc"],
    command: "cmd"
  },
  {
    handler: "\\pm",
    label: "±",
    types: ["all", "intermediate", "advanced_matrices", "advanced_trignometry", "general"],
    command: "cmd"
  },
  {
    handler: "≤",
    label: "≤",
    types: ["all", "intermediate", "advanced_matrices", "advanced_trignometry", "comparison"],
    command: "cmd"
  },
  {
    handler: "≥",
    label: "≥",
    types: ["all", "intermediate", "advanced_matrices", "advanced_trignometry", "comparison"],
    command: "cmd"
  },
  {
    handler: "°",
    label: "º",
    labelcy: "°",
    types: ["all", "intermediate", "advanced_matrices", "advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\Pi",
    label: "π",
    types: ["all", "intermediate", "advanced_matrices", "advanced_trignometry", "algebra", "greek"],
    command: "cmd"
  },
  {
    handler: "\\infinity",
    label: "∞",
    types: ["all", "intermediate", "advanced_matrices", "advanced_trignometry", "general"],
    command: "cmd"
  }
];

const ADVANCED_MATRICES = [
  {
    handler: "i",
    label: "i",
    types: ["all", "advanced_matrices", "advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "e",
    label: "e",
    types: ["all", "advanced_matrices", "advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\Theta",
    label: "Θ",
    types: ["all", "advanced_matrices", "advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\log", // handler: "\\iota"
    label: "log",
    types: ["all", "advanced_matrices", "advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\bmatrix",
    label: <CustomImage src={Group1004} role="presentation" />,
    types: ["all", "advanced_matrices"],
    command: "cmd",
    name: "bmatrix"
  },
  {
    handler: "\\begin{bmatrix}{}&{}&{}\\\\{}&{}&{}\\\\{}&{}&{}\\end{bmatrix}",
    label: <CustomImage src={Group1005} role="presentation" />,
    types: ["all", "advanced_matrices"],
    command: "write",
    name: "tripleMatrix"
  },
  {
    handler: "Shift-Spacebar",
    label: <CustomImage src={Group1006} role="presentation" />,
    types: ["all", "advanced_matrices"],
    command: "keystroke",
    name: "shiftSpacebar"
  },

  {
    handler: "Shift-Enter",
    label: <CustomImage src={Group1007} role="presentation" />,
    types: ["all", "advanced_matrices"],
    command: "keystroke",
    name: "shiftEnter"
  }
];

const ADVANCED_TRIGNOMETRY = [
  {
    handler: "\\sin",
    label: "sin",
    types: ["all", "advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\cos",
    label: "cos",
    types: ["all", "advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\tan",
    label: "tan",
    types: ["all", "advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\cot",
    label: "cot",
    types: ["all", "advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\sin^{-1}",
    label: <CustomImage src={Group2251} role="presentation" />,
    types: ["all", "advanced_trignometry"],
    command: "write"
  },
  {
    handler: "\\cos^{-1}",
    label: <CustomImage src={Group2247} role="presentation" />,
    types: ["all", "advanced_trignometry"],
    command: "write"
  },
  {
    handler: "\\sec^{-1}",
    label: <CustomImage src={Group2249} role="presentation" />,
    types: ["all", "advanced_trignometry"],
    command: "write"
  },
  {
    handler: "\\csc^{-1}",
    label: <CustomImage src={Group2245} role="presentation" />,
    types: ["all", "advanced_trignometry"],
    command: "write"
  }
];

const UNITS_SI = [
  {
    handler: "g",
    label: "g",
    types: ["all", "units_si"],
    command: "cmd"
  },
  {
    handler: "kg",
    label: "kg",
    types: ["all", "units_si"],
    command: "cmd"
  },
  {
    handler: "mg",
    label: "mg",
    types: ["all", "units_si"],
    command: "cmd"
  },
  {
    handler: "µg",
    label: "µg",
    types: ["all", "units_si"],
    command: "cmd"
  },
  {
    handler: "m",
    label: "m",
    types: ["all", "units_si"],
    command: "cmd"
  },
  {
    handler: "km",
    label: "km",
    types: ["all", "units_si"],
    command: "cmd"
  },
  {
    handler: "cm",
    label: "cm",
    types: ["all", "units_si"],
    command: "cmd"
  },
  {
    handler: "mm",
    label: "mm",
    types: ["all", "units_si"],
    command: "cmd"
  },
  {
    handler: "L",
    label: "L",
    types: ["all", "units_si"],
    command: "cmd"
  },
  {
    handler: "mL",
    label: "mL",
    types: ["all", "units_si"],
    command: "cmd"
  },
  {
    handler: "s",
    label: "s",
    types: ["all", "units_si"],
    command: "cmd"
  },
  {
    handler: "ms",
    label: "ms",
    types: ["all", "units_si"],
    command: "cmd"
  }
];

const UNITS_US = [
  {
    handler: "feet",
    label: "feet",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "oz",
    label: "oz",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "lb",
    label: "lb",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "in",
    label: "in",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "ft",
    label: "ft",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "mi",
    label: "mi",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "fl oz",
    label: "fl oz",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "pt",
    label: "pt",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "gal",
    label: "gal",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "second",
    label: "second",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "min",
    label: "min",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "hour",
    label: "hour",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "sq mi",
    label: "sq mi",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "yard",
    label: "yard",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "acre",
    label: "acre",
    types: ["all", "units_us"],
    command: "cmd"
  },
  {
    handler: "cup",
    label: "cup",
    types: ["all", "units_us"],
    command: "cmd"
  }
];

export const KEYBOARD_BUTTONS = [
  ...BASIC,
  ...INTERMEDIATE,
  ...ADVANCED_MATRICES,
  ...ADVANCED_TRIGNOMETRY,
  ...UNITS_SI,
  ...UNITS_US,
  // belows are not in keypad mode list
  ...DISCRETE,
  ...MISC,
  ...CALCULUS,
  ...GROUPING,
  ...CHEMISTRY,
  ...GREEK,
  ...SETS,
  ...GEOMETRY,
  ...GENERAL,
  ...COMPARISON
];
