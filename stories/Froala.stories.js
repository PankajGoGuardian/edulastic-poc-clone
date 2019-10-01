// @ts-check
import React from "react";
import { set } from "lodash";
import styled, { ThemeProvider } from "styled-components";
import FroalaEditorDynamic from "@edulastic/common/src/components/FroalaEditor.Dynamic";
import FroalaEditor from "@edulastic/common/src/components/FroalaEditor";
import { themes } from "../src/client/assessment/themes";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
//common.mathInputMathBorderColor

storiesOf("FroalaEditor", module)
  .add("default one", () => (
    <ThemeProvider theme={themes.default}>
      <FroalaEditor onChange={v => action("changed", v)} />
    </ThemeProvider>
  ))
  .add("with config", () => (
    <ThemeProvider theme={themes.default}>
      <FroalaEditor onChange={v => action("changed", v)} toolbarButtons={["bold", "italic", "underline"]} />
    </ThemeProvider>
  ))
  .add("with H1 H2", () => (
    <ThemeProvider theme={themes.default}>
      <FroalaEditor
        onChange={v => {
          action("changed");
          console.log("changed", v);
        }}
        toolbarButtons={["bold", "italic", "underline", "h1", "h2"]}
      />
    </ThemeProvider>
  ))
  .add("with BackgroundColor", () => (
    <ThemeProvider theme={themes.default}>
      <FroalaEditor
        onChange={v => {
          action("changed");
          console.log("changed", v);
        }}
        backgroundColor="orange"
        toolbarButtons={["bold", "italic", "underline", "h1", "h2"]}
      />
    </ThemeProvider>
  ));
