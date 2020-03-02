import React, { memo } from "react";
import PropTypes from "prop-types";
import { HeaderTabs } from "@edulastic/common";
import { HeaderMidContainer } from "@edulastic/common/src/components/MainHeader";
import { StyledTabs } from "@edulastic/common/src/components/HeaderTabs";

function TestPageNav({ onChange, current, buttons, showPublishButton = true, owner = false }) {
  return (
    <HeaderMidContainer>
      <StyledTabs>
        {buttons.map(({ value, text, icon }, index) => (
          <HeaderTabs
            style={!showPublishButton && owner && index <= 1 ? { cursor: "not-allowed" } : {}}
            dataCy={value}
            isActive={current === value}
            icon={icon}
            linkLabel={text}
            key={value}
            onClickHandler={!showPublishButton && owner && index <= 1 ? "" : onChange(value)}
          />
        ))}
      </StyledTabs>
    </HeaderMidContainer>
  );
}

TestPageNav.propTypes = {
  onChange: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  owner: PropTypes.bool.isRequired,
  showPublishButton: PropTypes.bool.isRequired,
  buttons: PropTypes.array.isRequired
};

export default memo(TestPageNav);
