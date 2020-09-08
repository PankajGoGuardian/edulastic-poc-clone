import React from "react";
import { CustomImage } from "./keyboardButtons";
import lefticon from "../assets/headerButtons/left.svg";
import righticon from "../assets/headerButtons/right.svg";
// import redoicon from "../assets/headerButtons/redo.svg";
// import undoicon from "../assets/headerButtons/undo.svg";
import deleteicon from "../assets/headerButtons/delete.svg";

export const HEADER_BUTTONS = [
  {
    handler: "left_move",
    label: <CustomImage src={lefticon} width={20} height={13} role="presentation" />,
    types: ["all"],
    command: "cmd"
  },
  {
    handler: "right_move",
    label: <CustomImage src={righticon} width={20} height={13} role="presentation" />,
    types: ["all"],
    command: "cmd"
  },
  // {
  //   handler: "",
  //   label: <CustomImage src={undoicon} width={20} height={17} role="presentation" />,
  //   types: ["all"],
  //   command: "cmd"
  // },
  // {
  //   handler: "",
  //   label: <CustomImage src={redoicon} width={20} height={17} role="presentation" />,
  //   types: ["all"],
  //   command: "cmd"
  // },
  {
    handler: "Backspace",
    label: <CustomImage src={deleteicon} width={20} height={15} role="presentation" />,
    types: ["all"],
    command: "cmd"
  }
];
