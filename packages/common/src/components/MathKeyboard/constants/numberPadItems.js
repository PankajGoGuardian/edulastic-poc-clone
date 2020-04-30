import React from "react";

import Group940 from "../assets/keyboardButtons/fractionwhite.svg";
import LeftIco from "../assets/keyboardButtons/left.svg";
import RightIco from "../assets/keyboardButtons/right.svg";
import DeleteIco from "../assets/keyboardButtons/delete.svg";

import { CustomImage } from "./keyboardButtons";

export const NUMBER_PAD_ITEMS = [
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "\\div", label: "÷", data_cy: "div" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "\\times", label: "×", data_cy: "times" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "-", label: "-" },
  { value: "0", label: "0" },
  { value: ".", label: "." },
  { value: ",", label: "," },
  { value: "+", label: "+" },
  { value: "left_move", label: <img src={LeftIco} width={10} alt="left" /> },
  { value: "right_move", label: <img src={RightIco} width={10} alt="right" /> },
  {
    value: "Backspace",
    label: <img src={DeleteIco} width={10} alt="delete" />
  },
  { value: "=", label: "=" },
  {
    handler: "/",
    labelcy: "divide",
    value: "divide",
    label: <CustomImage src={Group940} width={25} height={40} role="presentation" />,
    types: ["all", "basic", "algebra"],
    command: "cmd"
  }
];
