import React from "react";
import styled from "styled-components";

import Group942 from "../assets/keyboardButtons/942.svg";
import Group943 from "../assets/keyboardButtons/943.svg";
import Group944 from "../assets/keyboardButtons/944.svg";
import Group993 from "../assets/keyboardButtons/993.svg";
import Group944v2 from "../assets/keyboardButtons/944-2.svg";
import Group999 from "../assets/keyboardButtons/999.svg";
import Group1052 from "../assets/keyboardButtons/1052.svg";
import Group2251 from "../assets/keyboardButtons/2251.svg";
import Group2249 from "../assets/keyboardButtons/2249.svg";
import Group2247 from "../assets/keyboardButtons/2247.svg";
import Group2245 from "../assets/keyboardButtons/2245.svg";
import Group2206 from "../assets/keyboardButtons/2206.svg";
import Group1006 from "../assets/keyboardButtons/1006.svg";
import Group1007 from "../assets/keyboardButtons/1007.svg";
import Group2207 from "../assets/keyboardButtons/2207.svg";
import Group2208 from "../assets/keyboardButtons/2208.svg";
import Group2209 from "../assets/keyboardButtons/2209.svg";
import Group2210 from "../assets/keyboardButtons/2210.svg";
import Group2211 from "../assets/keyboardButtons/2211.svg";
import Group1004 from "../assets/keyboardButtons/1004.svg";
import Group1005 from "../assets/keyboardButtons/1005.svg";
import Group1015 from "../assets/keyboardButtons/1015.svg";
import Group1008 from "../assets/keyboardButtons/1008.svg";
import Group1009 from "../assets/keyboardButtons/1009.svg";
import Group2256 from "../assets/keyboardButtons/2256.svg";
import Group2253 from "../assets/keyboardButtons/2253.svg";
import Group2263 from "../assets/keyboardButtons/2263.svg";
import Group2261 from "../assets/keyboardButtons/2261.svg";
import Group2266 from "../assets/keyboardButtons/2266.svg";
import Group2267 from "../assets/keyboardButtons/2267.svg";
import Group2262 from "../assets/keyboardButtons/2262.svg";
import Group1023 from "../assets/keyboardButtons/1023.svg";
import Group1025 from "../assets/keyboardButtons/1025.svg";
import Group1045 from "../assets/keyboardButtons/1045.svg";
import Group1012 from "../assets/keyboardButtons/1012.svg";
import Group1013 from "../assets/keyboardButtons/1013.svg";
import Group1022 from "../assets/keyboardButtons/1022.svg";
import Group1014 from "../assets/keyboardButtons/1014.svg";
import Group1054 from "../assets/keyboardButtons/1054.svg";
import Group1029 from "../assets/keyboardButtons/1029.svg";
import Group1030 from "../assets/keyboardButtons/1030.svg";
import Group1058 from "../assets/keyboardButtons/1058.svg";
import Group2357 from "../assets/keyboardButtons/2357.svg";
import Group6105 from "../assets/keyboardButtons/6105.svg";
import Group6106 from "../assets/keyboardButtons/6106.svg";

// Operators
import Group2737 from "../assets/keyboardButtons/2737.svg";
import Group2735 from "../assets/keyboardButtons/2735.svg";
import Group2736 from "../assets/keyboardButtons/2736.svg";
import Group2788 from "../assets/keyboardButtons/2788.svg";
// trignometry
import Group2243 from "../assets/keyboardButtons/2243.svg";
import Group2248 from "../assets/keyboardButtons/2248.svg";

// geometry
import Group3171 from "../assets/keyboardButtons/3171.svg";
import Group2744 from "../assets/keyboardButtons/2744.svg";
import Group2745 from "../assets/keyboardButtons/2745.svg";
import Group3169 from "../assets/keyboardButtons/3169.svg";
import Group3173 from "../assets/keyboardButtons/3173.svg";
import Group3163 from "../assets/keyboardButtons/3163.svg";
import Group6101 from "../assets/keyboardButtons/6101.svg";
import Group3181 from "../assets/keyboardButtons/3181.svg";
import Group3167 from "../assets/keyboardButtons/3167.svg";
import Group3172 from "../assets/keyboardButtons/3172.svg";
import Group3168 from "../assets/keyboardButtons/3168.svg";
import Group1053 from "../assets/keyboardButtons/1053.svg";
import Group3176 from "../assets/keyboardButtons/3176.svg";
import Group6104 from "../assets/keyboardButtons/6104.svg";
import Group6102 from "../assets/keyboardButtons/6102.svg";
import Group6103 from "../assets/keyboardButtons/6103.svg";
import Group3180 from "../assets/keyboardButtons/3180.svg";
import Group3170 from "../assets/keyboardButtons/3170.svg";
import Group3177 from "../assets/keyboardButtons/3177.svg";
import Group2751 from "../assets/keyboardButtons/2751.svg";
import Group2752 from "../assets/keyboardButtons/2752.svg";
import Group2478 from "../assets/keyboardButtons/2478.svg";
import Group2252 from "../assets/keyboardButtons/2252.svg";
import Group2254 from "../assets/keyboardButtons/2254.svg";
import Group2738 from "../assets/keyboardButtons/2738.svg";

// Basic
import Fraction from "../assets/keyboardButtons/fraction.svg";
import Sqrt from "../assets/keyboardButtons/sqrt.svg";
import Group1043 from "../assets/keyboardButtons/1043.svg";
// Full keypad tab icons
import Grupo6134 from "../assets/Grupo6134.svg";
import Grupo6135 from "../assets/Grupo6135.svg";
import Grupo6136 from "../assets/Grupo6136.svg";
import Grupo6137 from "../assets/Grupo6137.svg";
import Grupo6138 from "../assets/Grupo6138.svg";
import Grupo6140 from "../assets/Grupo6140.svg";
import Grupo6141 from "../assets/Grupo6141.svg";
import Grupo6142 from "../assets/Grupo6142.svg";

export const CustomImage = styled.img.attrs({ className: "keyboardButton", draggable: false })`
  width: ${({ width }) => (width ? `${width}px` : "32px")};
  height: ${({ height }) => (height ? `${height}px` : "32px")};
  object-fit: contain;
`;

const OPERATORS = [
  {
    handler: "+",
    label: <CustomImage src={Group2735} width={12} height={12} role="presentation" />,
    types: ["basic"],
    command: "write"
  },
  {
    handler: "-",
    label: <CustomImage src={Group2737} width={12} height={8} role="presentation" />,
    types: ["basic"],
    command: "write"
  },
  {
    handler: "\\times",
    label: <CustomImage src={Group2736} width={10} height={10} role="presentation" />,
    types: ["basic"],
    command: "write"
  },
  {
    handler: "\\div",
    label: <CustomImage src={Group2788} width={12} height={12} role="presentation" />,
    command: "cmd",
    types: ["all"]
  }
];

// keypad mode buttons
const BASIC = [
  {
    handler: "/",
    labelcy: "divide",
    value: "divide",
    label: <CustomImage src={Fraction} width={25} height={40} role="presentation" />,
    types: ["basic"],
    command: "cmd"
  },
  {
    handler: "\\sqrt",
    labelcy: "sqrt",
    label: <CustomImage src={Sqrt} width={32} height={32} role="presentation" />,
    types: ["basic"],
    command: "cmd"
  },
  {
    handler: "\\sqrt[3]{}",
    label: <CustomImage src={Group1043} role="presentation" width={32} height={32} />,
    types: ["basic"],
    command: "write"
  },
  {
    handler: "^",
    labelcy: "super",
    label: <CustomImage src={Group942} role="presentation" width={25} height={25} />,
    types: ["basic"],
    command: "cmd"
  },
  {
    handler: "\\pi",
    label: "π",
    types: ["basic"],
    command: "cmd"
  }
];

const INTERMEDIATE = [
  {
    handler: "≤",
    label: "≤",
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: "<",
    label: "<",
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: ">",
    label: ">",
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: "≥",
    label: "≥",
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: "\\times",
    label: <CustomImage src={Group2736} width={10} height={10} role="presentation" />,
    types: ["intermediate"],
    command: "write"
  },
  {
    handler: "=",
    label: "=",
    types: ["intermediate"],
    command: "write"
  },
  {
    handler: "\\pm",
    label: "±",
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: "\\pi",
    label: "π",
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: "\\log", // handler: "\\iota"
    label: "log",
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: "\\infinity",
    label: "∞",
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: "°",
    label: "º",
    labelcy: "°",
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: "(",
    label: "(",
    types: ["intermediate"],
    command: "write"
  },
  {
    handler: ")",
    label: ")",
    types: ["intermediate"],
    command: "write"
  },
  {
    handler: "[",
    label: "[",
    types: ["intermediate"],
    command: "write"
  },
  {
    handler: "]",
    label: "]",
    types: ["intermediate"],
    command: "write"
  },
  {
    handler: "/",
    labelcy: "divide",
    value: "divide",
    label: <CustomImage src={Fraction} width={25} height={40} role="presentation" />,
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: "^",
    labelcy: "super",
    label: <CustomImage src={Group942} role="presentation" width={25} height={25} />,
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: "\\sqrt",
    labelcy: "sqrt",
    label: <CustomImage src={Sqrt} role="presentation" />,
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: "\\sqrt[{}]{}",
    label: <CustomImage src={Group999} role="presentation" />,
    types: ["intermediate"],
    command: "write"
  },
  {
    handler: "|",
    labelcy: "|",
    label: <CustomImage src={Group993} role="presentation" />,
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: "(",
    labelcy: "(",
    label: <CustomImage src={Group944} role="presentation" />,
    types: ["intermediate"],
    command: "cmd"
  },
  {
    handler: "[",
    label: <CustomImage src={Group944v2} role="presentation" />,
    types: ["intermediate"],
    command: "cmd",
    name: "squareBrackets"
  }
];

const ADVANCED_MATRICES = [
  {
    handler: "/",
    labelcy: "divide",
    value: "divide",
    label: <CustomImage src={Fraction} width={25} height={40} role="presentation" />,
    types: ["advanced_matrices"],
    command: "cmd"
  },
  {
    handler: "^",
    labelcy: "super",
    label: <CustomImage src={Group942} role="presentation" width={25} height={25} />,
    types: ["advanced_matrices"],
    command: "cmd"
  },
  {
    handler: "\\sqrt",
    labelcy: "sqrt",
    label: <CustomImage src={Sqrt} width={32} height={32} role="presentation" />,
    types: ["advanced_matrices"],
    command: "cmd"
  },
  {
    handler: "\\log", // handler: "\\iota"
    label: "log",
    types: ["advanced_matrices"],
    command: "cmd"
  },
  {
    handler: "\\bmatrix",
    label: <CustomImage src={Group1004} role="presentation" />,
    types: ["advanced_matrices"],
    command: "cmd",
    name: "bmatrix"
  },
  {
    handler: "\\begin{bmatrix}{}&{}&{}\\\\{}&{}&{}\\\\{}&{}&{}\\end{bmatrix}",
    label: <CustomImage src={Group1005} role="presentation" />,
    types: ["advanced_matrices"],
    command: "write",
    name: "tripleMatrix"
  },
  {
    handler: "Shift-Spacebar",
    label: <CustomImage src={Group1006} role="presentation" />,
    types: ["advanced_matrices"],
    command: "keystroke",
    name: "shiftSpacebar"
  },
  {
    handler: "Shift-Enter",
    label: <CustomImage src={Group1007} role="presentation" />,
    types: ["advanced_matrices"],
    command: "keystroke",
    name: "shiftEnter"
  }
];

const ADVANCED_TRIGNOMETRY = [
  {
    handler: "i",
    label: "i",
    types: ["advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "e",
    label: "e",
    types: ["advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\degree",
    label: <CustomImage src={Group3173} width={8} height={8} role="presentation" />,
    types: ["advanced_trignometry"],
    command: "write"
  },
  {
    handler: "\\pi",
    label: "π",
    types: ["advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "^",
    labelcy: "super",
    label: <CustomImage src={Group942} role="presentation" width={25} height={25} />,
    types: ["advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "/",
    labelcy: "divide",
    value: "divide",
    label: <CustomImage src={Fraction} width={25} height={40} role="presentation" />,
    types: ["advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "|",
    labelcy: "|",
    label: <CustomImage src={Group993} role="presentation" />,
    types: ["advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\sqrt",
    labelcy: "sqrt",
    label: <CustomImage src={Sqrt} role="presentation" />,
    types: ["advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\sin",
    label: "sin",
    types: ["advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\cos",
    label: "cos",
    types: ["advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\tan",
    label: "tan",
    types: ["advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\cot",
    label: "cot",
    types: ["advanced_trignometry"],
    command: "cmd"
  },
  {
    handler: "\\sin^{-1}",
    label: <CustomImage src={Group2251} role="presentation" />,
    types: ["advanced_trignometry"],
    command: "write"
  },
  {
    handler: "\\cos^{-1}",
    label: <CustomImage src={Group2247} role="presentation" />,
    types: ["advanced_trignometry"],
    command: "write"
  },
  {
    handler: "\\sec^{-1}",
    label: <CustomImage src={Group2249} role="presentation" />,
    types: ["advanced_trignometry"],
    command: "write"
  },
  {
    handler: "\\csc^{-1}",
    label: <CustomImage src={Group2245} role="presentation" />,
    types: ["advanced_trignometry"],
    command: "write"
  },
  {
    handler: "\\tan^{-1}",
    label: <CustomImage src={Group2243} role="presentation" />,
    types: ["advanced_trignometry"],
    command: "write"
  },
  {
    handler: "\\cot^{-1}",
    label: <CustomImage src={Group2248} role="presentation" />,
    types: ["advanced_trignometry"],
    command: "write"
  }
];

const GEOMETRY = [
  {
    handler: "\\perp",
    label: <CustomImage src={Group3171} width={16} height={16} role="presentation" />,
    types: ["all", "geometry"],
    command: "cmd"
  },
  {
    handler: "\\angle",
    label: <CustomImage src={Group2744} width={12} height={12} role="presentation" />,
    types: ["all", "geometry"],
    command: "write"
  },
  {
    handler: "\\triangle",
    label: <CustomImage src={Group3169} width={16} height={16} role="presentation" />,
    types: ["all", "geometry"],
    command: "write"
  },
  {
    handler: "\\degree",
    label: <CustomImage src={Group3173} width={8} height={8} role="presentation" />,
    types: ["all", "geometry"],
    command: "write"
  },
  {
    handler: "\\parallel",
    label: <CustomImage src={Group3163} width={16} height={16} role="presentation" />,
    types: ["all", "geometry"],
    command: "cmd"
  },
  {
    handler: "\\text{m}\\angle",
    label: <CustomImage src={Group6101} width={24} height={24} role="presentation" />,
    types: ["all", "geometry"],
    command: "write"
  },
  {
    handler: "\\odot",
    label: <CustomImage src={Group3170} width={16} height={16} role="presentation" />,
    types: ["all", "geometry"],
    command: "write"
  },
  {
    handler: "\\theta",
    label: <CustomImage src={Group2478} width={14} height={14} role="presentation" />,
    types: ["all", "geometry"],
    command: "cmd"
  },
  {
    handler: "\\nparallel",
    label: <CustomImage src={Group3181} width={16} height={16} role="presentation" />,
    types: ["all", "geometry"],
    command: "cmd"
  },
  {
    handler: "\\sim",
    label: <CustomImage src={Group3167} width={16} height={16} role="presentation" />,
    types: ["all", "geometry"],
    command: "write"
  },
  {
    handler: "\\parallelogram",
    label: <CustomImage src={Group3172} width={24} height={24} role="presentation" />,
    types: ["all", "geometry"],
    command: "write"
  },
  {
    handler: "\\equiv",
    label: <CustomImage src={Group2751} width={12} height={12} role="presentation" />,
    types: ["geometry"],
    command: "cmd"
  },
  {
    handler: "\\undersim",
    label: <CustomImage src={Group1052} role="presentation" />,
    types: ["all", "geometry"],
    command: "cmd"
  },
  {
    handler: "\\cong",
    label: <CustomImage src={Group3168} width={12} height={12} role="presentation" />,
    types: ["all", "geometry"],
    command: "write"
  },
  {
    handler: "\\overarc",
    label: <CustomImage src={Group1053} role="presentation" />,
    types: ["all", "geometry"],
    command: "cmd"
  },
  {
    handler: "\\pi",
    label: <CustomImage src={Group3176} width={12} height={12} role="presentation" />,
    types: ["all", "geometry"],
    command: "write"
  },
  {
    handler: "\\overline",
    label: <CustomImage src={Group6104} role="presentation" />,
    types: ["all", "geometry"],
    command: "cmd"
  },
  {
    handler: "\\overrightarrow",
    label: <CustomImage src={Group6102} role="presentation" />,
    types: ["all", "geometry"],
    command: "cmd"
  },
  {
    handler: "\\overleftrightarrow",
    label: <CustomImage src={Group6103} role="presentation" />,
    types: ["all", "geometry"],
    command: "cmd"
  },
  {
    handler: "\\square",
    label: <CustomImage src={Group3180} width={16} height={16} role="presentation" />,
    types: ["all", "geometry"],
    command: "write"
  }
];

const UNITS_SI = [
  {
    handler: "mm^{2}",
    label: (
      <span role="presentation">
        mm<sup>2</sup>
      </span>
    ),
    types: ["all", "units_si"],
    command: "write"
  },
  {
    handler: "cm^{2}",
    label: (
      <span role="presentation">
        cm<sup>2</sup>
      </span>
    ),
    types: ["all", "units_si"],
    command: "write"
  },
  {
    handler: "m^{2}",
    label: (
      <span role="presentation">
        m<sup>2</sup>
      </span>
    ),
    types: ["all", "units_si"],
    command: "write"
  },
  {
    handler: "km^{2}",
    label: (
      <span role="presentation">
        km<sup>2</sup>
      </span>
    ),
    types: ["all", "units_si"],
    command: "write"
  },
  {
    handler: "µg",
    label: "µg",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "mg",
    label: "mg",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "g",
    label: "g",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "kg",
    label: "kg",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "µm",
    label: "µm",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "mm",
    label: "mm",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "cm",
    label: "cm",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "m",
    label: "m",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "km",
    label: "km",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "µs",
    label: "µs",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "ms",
    label: "ms",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "s",
    label: "s",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "mL",
    label: "mL",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "L",
    label: "L",
    types: ["units_si"],
    command: "cmd"
  },
  {
    handler: "\\text{m/s}",
    label: "m/s",
    types: ["units_si"],
    command: "write"
  },
  {
    handler: "\\text{cm/s}",
    label: "cm/s",
    types: ["units_si"],
    command: "write"
  },
  {
    handler: "\\text{km/s}",
    label: "km/s",
    types: ["units_si"],
    command: "write"
  },
  {
    handler: "\\text{m/}s^2",
    label: (
      <span role="presentation">
        m/s<sup>2</sup>
      </span>
    ),
    types: ["units_si"],
    command: "write"
  },
  {
    handler: "\\text{m/}s^2",
    label: (
      <span role="presentation">
        m/s<sup>2</sup>
      </span>
    ),
    types: ["units_si"],
    command: "write"
  },
  {
    handler: "mm^3",
    label: (
      <span role="presentation">
        mm<sup>3</sup>
      </span>
    ),
    types: ["units_si"],
    command: "write"
  },
  {
    handler: "cm^3",
    label: (
      <span role="presentation">
        cm<sup>3</sup>
      </span>
    ),
    types: ["units_si"],
    command: "write"
  },
  {
    handler: "m^3",
    label: (
      <span role="presentation">
        m<sup>3</sup>
      </span>
    ),
    types: ["units_si"],
    command: "write"
  },
  {
    handler: "km^3",
    label: (
      <span role="presentation">
        km<sup>3</sup>
      </span>
    ),
    types: ["units_si"],
    command: "write"
  },
  {
    handler: "\\text{kg/}m^3",
    label: (
      <span role="presentation">
        kg/m<sup>3</sup>
      </span>
    ),
    types: ["units_si"],
    command: "write"
  },
  {
    handler: "\\text{g/}cm^3",
    label: (
      <span role="presentation">
        g/cm<sup>3</sup>
      </span>
    ),
    types: ["units_si"],
    command: "write"
  }
];

const UNITS_US = [
  {
    handler: "in^{2}",
    label: (
      <span role="presentation">
        in<sup>2</sup>
      </span>
    ),
    types: ["all", "units_us"],
    command: "write"
  },
  {
    handler: "mi^{2}",
    label: (
      <span role="presentation">
        mi<sup>2</sup>
      </span>
    ),
    types: ["all", "units_us"],
    command: "write"
  },
  {
    handler: "\\text{ft}^{2}",
    label: (
      <span role="presentation">
        ft<sup>2</sup>
      </span>
    ),
    types: ["all", "units_us"],
    command: "write"
  },
  {
    handler: "feet",
    label: "feet",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "oz",
    label: "oz",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "lb",
    label: "lb",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "in",
    label: "in",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "\\text{ft}",
    label: "ft",
    types: ["units_us"],
    command: "write"
  },
  {
    handler: "mi",
    label: "mi",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "fl oz",
    label: "fl oz",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "pt",
    label: "pt",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "gal",
    label: "gal",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "second",
    label: "second",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "min",
    label: "min",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "hour",
    label: "hour",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "sq mi",
    label: "sq mi",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "yard",
    label: "yard",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "acre",
    label: "acre",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "cup",
    label: "cup",
    types: ["units_us"],
    command: "cmd"
  },
  {
    handler: "\\text{qt}",
    label: "qt",
    types: ["units_us"],
    command: "write"
  },
  {
    handler: "\\text{tbsp}",
    label: "tbsp",
    types: ["units_us"],
    command: "write"
  },
  {
    handler: "\\text{ton}",
    label: "ton",
    types: ["units_us"],
    command: "write"
  },
  {
    handler: "\\text{tsp}",
    label: "tsp",
    types: ["units_us"],
    command: "write"
  },
  {
    handler: "\\text{mph}",
    label: "mph",
    types: ["units_us"],
    command: "write"
  },
  {
    handler: "\\text{fps}",
    label: "fps",
    types: ["units_us"],
    command: "write"
  },
  {
    handler: "\\text{ft/sec}^2",
    label: (
      <span role="presentation">
        ft/sec<sup>2</sup>
      </span>
    ),
    types: ["units_us"],
    command: "write"
  },
  {
    handler: "\\text{in}^3",
    label: (
      <span role="presentation">
        in<sup>3</sup>
      </span>
    ),
    types: ["units_us"],
    command: "write"
  },
  {
    handler: "\\text{mi}^3",
    label: (
      <span role="presentation">
        mi<sup>3</sup>
      </span>
    ),
    types: ["units_us"],
    command: "write"
  },
  {
    handler: "\\text{ft}^3",
    label: (
      <span role="presentation">
        ft<sup>3</sup>
      </span>
    ),
    types: ["units_us"],
    command: "write"
  }
];

export const KEYBOARD_BUTTONS = [
  ...OPERATORS,
  ...BASIC,
  ...INTERMEDIATE,
  ...ADVANCED_MATRICES,
  ...ADVANCED_TRIGNOMETRY,
  ...GEOMETRY,
  ...UNITS_SI,
  ...UNITS_US
];

const tabIconSize = {
  width: 28,
  height: 28
};

export const TAB_BUTTONS = [
  {
    label: <CustomImage src={Grupo6134} {...tabIconSize} role="presentation" />,
    name: "General",
    key: "GENERAL",
    buttons: [
      ...OPERATORS,
      {
        handler: "\\pm",
        label: "±",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "%",
        label: "%",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "^",
        labelcy: "super",
        label: <CustomImage src={Group942} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "_",
        label: <CustomImage src={Group943} width={25} height={40} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "/",
        labelcy: "divide",
        value: "divide",
        label: <CustomImage src={Fraction} width={25} height={40} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\sqrt",
        labelcy: "sqrt",
        label: <CustomImage src={Sqrt} width={32} height={32} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\sqrt[3]{}",
        label: <CustomImage src={Group1043} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\sqrt[{}]{}",
        label: <CustomImage src={Group999} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\pi",
        label: "π",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "e",
        label: "e",
        types: ["all"],
        command: "cmd"
      }
    ]
  },
  {
    label: "Kg",
    key: "UNIT",
    name: "Units",
    buttons: [
      ...UNITS_SI,
      ...UNITS_US,
      {
        handler: "\\text{g}\\ \\text{mol}^{-1}",
        label: <CustomImage src={Group1054} role="presentation" />,
        types: ["all", "chemistry"],
        command: "write"
      }
    ]
  },
  {
    label: <CustomImage src={Grupo6135} {...tabIconSize} role="presentation" />,
    name: "Symbols",
    key: "SYMBOLS",
    buttons: [
      {
        handler: "\\sim",
        label: <CustomImage src={Group3167} width={16} height={16} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\equiv",
        label: <CustomImage src={Group2751} width={12} height={12} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\approx",
        label: <CustomImage src={Group2745} width={12} height={12} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\simeq",
        label: <CustomImage src={Group2752} width={12} height={12} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\cong",
        label: <CustomImage src={Group3168} width={12} height={12} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: ">",
        label: ">",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "<",
        label: "<",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "≥",
        label: "≥",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "≤",
        label: "≤",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "≮",
        label: "≮",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "≯",
        label: "≯",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\infinity",
        label: "∞",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\subset",
        label: <CustomImage src={Group2256} width={12} height={12} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\supset",
        label: <CustomImage src={Group2253} width={12} height={12} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\subseteq",
        label: <CustomImage src={Group2263} width={12} height={12} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\supseteq",
        label: <CustomImage src={Group2261} width={12} height={12} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\in",
        label: <CustomImage src={Group2267} width={12} height={12} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\notin",
        label: <CustomImage src={Group2266} width={14} height={14} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\union",
        label: <CustomImage src={Group2252} width={14} height={14} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\intersection",
        label: <CustomImage src={Group2254} width={14} height={14} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\square",
        label: <CustomImage src={Group3180} width={12} height={12} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\triangle",
        label: <CustomImage src={Group3169} width={12} height={12} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\bigcirc",
        label: <CustomImage src={Group3177} width={12} height={12} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\odot",
        label: <CustomImage src={Group3170} width={16} height={16} role="presentation" />,
        types: ["all"],
        command: "write"
      }
    ]
  },
  {
    label: <CustomImage src={Grupo6136} {...tabIconSize} role="presentation" />,
    name: "Arrows",
    key: "ARROW",
    buttons: [
      {
        handler: "\\leftarrow",
        label: "←",
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\rightarrow",
        label: "→",
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\uparrow",
        label: "↑",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\downarrow",
        label: "↓",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\longleftrightarrow",
        label: <CustomImage src={Group2738} width={24} height={20} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\rightleftharpoons",
        label: "⇋",
        types: ["all", "chemistry"],
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
        handler: "\\vdots",
        label: <CustomImage src={Group2208} width={18} height={18} role="presentation" />,
        types: ["all"],
        command: "cmd",
        name: "vdots"
      },
      {
        handler: "\\ldots",
        label: <CustomImage src={Group2206} width={20} height={20} role="presentation" />,
        types: ["all"],
        command: "cmd",
        name: "ldots"
      },
      {
        handler: "\\ddots",
        label: <CustomImage src={Group2207} width={18} height={18} role="presentation" />,
        types: ["all"],
        command: "cmd",
        name: "ldoddotsts"
      },
      {
        handler: "\\therefore",
        label: <CustomImage src={Group2209} width={18} height={18} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\because",
        label: <CustomImage src={Group2210} width={18} height={18} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: ":",
        label: <CustomImage src={Group2211} width={16} height={16} role="presentation" />,
        types: ["all"],
        command: "cmd"
      }
    ]
  },
  {
    label: <CustomImage src={Grupo6137} {...tabIconSize} role="presentation" />,
    name: "Greek",
    key: "GREEK",
    buttons: [
      {
        handler: "\\alpha",
        label: "α",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\beta",
        label: "β",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\gamma",
        label: "γ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\delta",
        label: "δ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\varepsilon",
        label: "ε",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\zeta",
        label: "ζ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\eta",
        label: "η",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\theta",
        label: <CustomImage src={Group2478} width={14} height={14} role="presentation" />,
        types: ["all", "geometry"],
        command: "cmd"
      },
      {
        handler: "\\vartheta",
        label: "ϑ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\iota",
        label: "ι",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\kappa",
        label: "κ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\lambda",
        label: "λ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\mu",
        label: "μ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\nu",
        label: "ν",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\xi",
        label: "ξ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "o",
        label: "ο",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\pi",
        label: "π",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\varpi",
        label: "ϖ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\rho",
        label: "ρ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\varsigma",
        label: "ς",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\sigma",
        label: "σ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\tau",
        label: "τ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\upsilon",
        label: "υ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\varphi",
        label: "φ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\phi",
        label: "ϕ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\chi",
        label: "χ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\psi",
        label: "ψ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\omega",
        label: "ω",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Alpha",
        label: "Α",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Beta",
        label: "Β",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Gamma",
        label: "Γ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Delta",
        label: "Δ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Epsilon",
        label: "Ε",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Zeta",
        label: "Ζ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Eta",
        label: "Η",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Theta",
        label: "Θ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Iota",
        label: "Ι",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Kappa",
        label: "Κ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Lambda",
        label: "Λ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "Μ",
        label: "Μ",
        types: ["all"],
        command: "cmd",
        name: "Mu"
      },
      {
        handler: "Ν",
        label: "Ν",
        types: ["all"],
        command: "cmd",
        name: "Nu"
      },
      {
        handler: "\\Xi",
        label: "Ξ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "Ο",
        label: "Ο",
        types: ["all"],
        command: "cmd",
        name: "Omicron"
      },
      {
        handler: "\\Pi",
        label: "Π",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Rho",
        label: "Ρ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Sigma",
        label: "Σ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Tau",
        label: "Τ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Upsilon",
        label: "Υ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Phi",
        label: "Φ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Chi",
        label: "Χ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Psi",
        label: "Ψ",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\Omega",
        label: "Ω",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "ℝ",
        label: <CustomImage src={Group2357} width={14} height={14} role="presentation" />,
        types: ["all"],
        command: "write"
      }
    ]
  },
  {
    label: <CustomImage src={Grupo6138} {...tabIconSize} role="presentation" />,
    name: "Matrices",
    key: "MATRIX",
    buttons: [
      {
        handler: "\\begin{bmatrix}{}\\\\{}\\end{bmatrix}",
        label: <CustomImage src={Group1008} width={28} height={28} role="presentation" />,
        types: ["all"],
        command: "write",
        name: "bmatrix"
      },
      {
        handler: "\\begin{bmatrix}{}&{}\\end{bmatrix}",
        label: <CustomImage src={Group1009} width={29} height={29} role="presentation" />,
        types: ["all"],
        command: "write",
        name: "bmatrix"
      },
      {
        handler: "\\bmatrix",
        label: <CustomImage src={Group1004} role="presentation" />,
        types: ["all"],
        command: "cmd",
        name: "bmatrix"
      },
      {
        handler: "\\begin{bmatrix}{}&{}&{}\\\\{}&{}&{}\\\\{}&{}&{}\\end{bmatrix}",
        label: <CustomImage src={Group1005} role="presentation" />,
        types: ["all"],
        command: "write",
        name: "tripleMatrix"
      },
      {
        handler: "\\begin{vmatrix}{}&{}\\\\{}&{}\\end{vmatrix}",
        label: <CustomImage src={Group1015} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "Shift-Spacebar",
        label: <CustomImage src={Group1006} role="presentation" />,
        types: ["all"],
        command: "keystroke",
        name: "shiftSpacebar"
      },
      {
        handler: "Shift-Enter",
        label: <CustomImage src={Group1007} role="presentation" />,
        types: ["all"],
        command: "keystroke",
        name: "shiftEnter"
      }
    ]
  },
  {
    label: <CustomImage src={Grupo6140} {...tabIconSize} role="presentation" />,
    name: "Decorations",
    key: "DECORATIONS",
    buttons: [
      {
        handler: "\\xrightarrow[{}]{}",
        label: <CustomImage src={Group1022} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\overline",
        label: <CustomImage src={Group6104} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\overrightarrow",
        label: <CustomImage src={Group6102} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\overleftrightarrow",
        label: <CustomImage src={Group6103} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\overarc",
        label: <CustomImage src={Group1053} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\undersim",
        label: <CustomImage src={Group1052} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "(",
        labelcy: "(",
        label: <CustomImage src={Group944} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "[",
        label: <CustomImage src={Group944v2} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "{",
        label: <CustomImage src={Group1023} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "|",
        labelcy: "|",
        label: <CustomImage src={Group993} role="presentation" />,
        types: ["all"],
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
    ]
  },
  {
    label: <CustomImage src={Grupo6141} {...tabIconSize} role="presentation" />,
    name: "Big Operators",
    key: "BIG_OPERATOR",
    buttons: [
      {
        handler: "\\sum",
        label: <CustomImage src={Group1030} role="presentation" />,
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\infinity",
        label: "∞",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\subset",
        label: <CustomImage src={Group2256} width={14} height={14} role="presentation" />,
        types: ["all", "sets"],
        command: "cmd"
      },
      {
        handler: "\\supset",
        label: <CustomImage src={Group2253} width={14} height={14} role="presentation" />,
        types: ["all", "sets"],
        command: "cmd"
      },
      {
        handler: "\\subseteq",
        label: <CustomImage src={Group2263} width={14} height={14} role="presentation" />,
        types: ["all", "sets"],
        command: "cmd"
      },
      {
        handler: "\\supseteq",
        label: <CustomImage src={Group2261} width={14} height={14} role="presentation" />,
        types: ["all", "sets"],
        command: "cmd"
      },
      {
        handler: "\\notin",
        label: <CustomImage src={Group2266} width={14} height={14} role="presentation" />,
        types: ["all", "sets"],
        command: "cmd"
      },
      {
        handler: "\\ni",
        label: <CustomImage src={Group2262} width={14} height={14} role="presentation" />,
        types: ["all", "sets"],
        command: "cmd"
      },
      {
        handler: "\\nsubset",
        label: "⊄",
        types: ["all", "sets"],
        command: "cmd"
      },
      {
        handler: "\\union",
        label: <CustomImage src={Group2252} width={14} height={14} role="presentation" />,
        types: ["all", "sets"],
        command: "cmd"
      },
      {
        handler: "\\intersection",
        label: <CustomImage src={Group2254} width={14} height={14} role="presentation" />,
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
    ]
  },
  {
    label: <CustomImage src={Grupo6142} {...tabIconSize} role="presentation" />,
    name: "Calculus",
    key: "CALCULUS",
    buttons: [
      {
        handler: "\\frac{\\operatorname d{}}{\\operatorname d{}}",
        label: <CustomImage src={Group6105} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\frac{\\partial{}}{\\partial{}}",
        label: <CustomImage src={Group6106} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\int_{}^{}",
        label: <CustomImage src={Group1029} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\lim_{x\\to {}}",
        label: <CustomImage src={Group1058} role="presentation" />,
        types: ["all", "calculus"],
        command: "write"
      },
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
        handler: "\\overset{H}{}",
        label: <CustomImage src={Group1014} role="presentation" />,
        types: ["all", "chemistry"],
        command: "write"
      },
      {
        handler: "\\log\\left({}\\right)", // handler: "\\iota"
        label: "log",
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\log_{}\\left({}\\right)", // handler: "\\iota"
        label: (
          <span role="presentation">
            log<sub>x</sub>
          </span>
        ),
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\ln\\left({}\\right)",
        label: "In",
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\sin",
        label: "sin",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\cos",
        label: "cos",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\tan",
        label: "tan",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\cot",
        label: "cot",
        types: ["all"],
        command: "cmd"
      },
      {
        handler: "\\sin^{-1}",
        label: <CustomImage src={Group2251} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\cos^{-1}",
        label: <CustomImage src={Group2247} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\sec^{-1}",
        label: <CustomImage src={Group2249} role="presentation" />,
        types: ["all"],
        command: "write"
      },
      {
        handler: "\\csc^{-1}",
        label: <CustomImage src={Group2245} role="presentation" />,
        types: ["all"],
        command: "write"
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
    ]
  }
];
