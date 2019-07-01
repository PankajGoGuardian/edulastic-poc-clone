import React, { memo } from "react";
import PropTypes from "prop-types";
import { FlexContainer } from "@edulastic/common";
import { Container, Link } from "./styled";

function TestPageNav({ onChange, current, buttons, showPublishButton = true, owner = false }) {
  return (
    <Container>
      {buttons.map(({ value, text, icon }, index) => (
        <Link
          data-cy={value}
          style={!showPublishButton && owner && index <= 1 ? { cursor: "not-allowed" } : {}}
          key={value}
          active={(current === value).toString()}
          onClick={!showPublishButton && owner && index <= 1 ? "" : onChange(value)}
        >
          <FlexContainer>
            {icon}
            <div>{text}</div>
          </FlexContainer>
        </Link>
      ))}
    </Container>
  );
}

TestPageNav.propTypes = {
  onChange: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  owner: PropTypes.bool,
  showPublishButton: PropTypes.bool,
  buttons: PropTypes.array.isRequired
};

export default memo(TestPageNav);
