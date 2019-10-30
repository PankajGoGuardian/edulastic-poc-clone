import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { EduButton } from "@edulastic/common";
import { boxShadowDefault, themeColor, themeLightGrayColor } from "@edulastic/colors";

import { IconChevronLeft, IconGraphRightArrow, IconMenuOpenClose } from "@edulastic/icons";

const CollapseButton = ({ open, onClick }) => (
  <Button onClick={onClick}>
    {!open && <IconChevronLeft color={themeColor} />}
    <MidIcon color={themeLightGrayColor} />
    {open && <IconGraphRightArrow color={themeColor} />}
  </Button>
);

CollapseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default CollapseButton;

const MidIcon = styled(IconMenuOpenClose)`
  transform: rotate(90deg);
`;

const Button = styled(EduButton)`
  border: 0px;
  padding: 4px;
  right: -20px;
  top: 25px;
  z-index: 1;
  display: flex;
  position: absolute;
  align-items: center;
  box-shadow: ${boxShadowDefault};
`;
