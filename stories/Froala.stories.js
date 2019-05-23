// @ts-check
import React from "react";
import { set } from "lodash";
import styled, { ThemeProvider } from "styled-components";
import FroalaEditorDynamic from "@edulastic/common/src/components/FroalaEditor.Dynamic";
import { themes } from "../src/client/assessment/themes";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
//common.mathInputMathBorderColor

storiesOf("FroalaEditor", module).add("simple", () => (
  <ThemeProvider theme={themes.default}>
    <FroalaEditorDynamic value="x" onChange={v => action("changed", v)} />
  </ThemeProvider>
));
