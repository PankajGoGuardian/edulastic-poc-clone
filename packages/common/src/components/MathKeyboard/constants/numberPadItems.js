import React from "react";

import Fraction from "../assets/keyboardButtons/fraction.svg";
import dot from "../assets/keyboardButtons/dot.svg";
import number1 from "../assets/numberpad/number1.svg";
import number2 from "../assets/numberpad/number2.svg";
import number3 from "../assets/numberpad/number3.svg";
import number4 from "../assets/numberpad/number4.svg";
import number5 from "../assets/numberpad/number5.svg";
import number6 from "../assets/numberpad/number6.svg";
import number7 from "../assets/numberpad/number7.svg";
import number8 from "../assets/numberpad/number8.svg";
import number9 from "../assets/numberpad/number9.svg";
import number0 from "../assets/numberpad/number0.svg";
import { CustomImage } from "./keyboardButtons";

export const NUMBER_PAD_ITEMS = [
  { value: "1", label: <CustomImage src={number1} width={6} height={14} role="presentation" /> },
  { value: "2", label: <CustomImage src={number2} width={8} height={14} role="presentation" /> },
  { value: "3", label: <CustomImage src={number3} width={8} height={14} role="presentation" /> },
  { value: "4", label: <CustomImage src={number4} width={10} height={15} role="presentation" /> },
  { value: "5", label: <CustomImage src={number5} width={8} height={14} role="presentation" /> },
  { value: "6", label: <CustomImage src={number6} width={8} height={14} role="presentation" /> },
  { value: "7", label: <CustomImage src={number7} width={8} height={14} role="presentation" /> },
  { value: "8", label: <CustomImage src={number8} width={8} height={14} role="presentation" /> },
  { value: "9", label: <CustomImage src={number9} width={8} height={14} role="presentation" /> },
  { value: "0", label: <CustomImage src={number0} width={8} height={14} role="presentation" /> },
  { value: ".", label: <CustomImage src={dot} width={5} height={5} role="presentation" /> },
  {
    handler: "/",
    labelcy: "divide",
    value: "divide",
    label: <CustomImage src={Fraction} width={25} height={40} role="presentation" />,
    command: "cmd"
  }
];

/**
import LeftIco from "../assets/keyboardButtons/left.svg";
import RightIco from "../assets/keyboardButtons/right.svg";
import DeleteIco from "../assets/keyboardButtons/delete.svg";
{ value: "\\div", label: "÷", data_cy: "div" }
{ value: ",", label: "," },
{ value: "left_move", label: <img src={LeftIco} width={10} alt="left" /> },
{ value: "right_move", label: <img src={RightIco} width={10} alt="right" /> },
{
  value: "Backspace",
  label: <img src={DeleteIco} width={10} alt="delete" />
},
{ value: "=", label: "=" }
 */
