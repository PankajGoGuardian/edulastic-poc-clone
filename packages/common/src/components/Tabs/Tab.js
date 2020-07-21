import { greyThemeDark2, mobileWidth, themeColor, title, white } from "@edulastic/colors";
import { IconClose, IconPencilEdit } from "@edulastic/icons";
import { Button } from "antd";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import styled from "styled-components";

const Tab = ({
  IconPosition,
  label,
  onClick,
  active,
  style,
  editable,
  close,
  onClose,
  onChange,
  data_cy,
  type,
  borderRadius,
  addTabs,
  isAddTab,
  isPassageQuestion
}) => {
  const textWidth = useMemo(() => (label?.length || 0) * 10 + 10, [label]);

  const inputTab = (
    <EditableTab>
      <Input
        isPassageQuestion={isPassageQuestion}
        type="text"
        style={{ width: `${textWidth}px` }}
        value={label}
        onChange={onChange}
      />
      {active && <IconPencilEdit color={themeColor} width={16} height={16} />}
    </EditableTab>
  );

  const closeButton = (
    <CloseIcon IconPosition={IconPosition} className="close-icon">
      <IconClose color={active ? white : "#AAAFB5"} width={8} height={8} onClick={onClose} />
    </CloseIcon>
  );

  const labelBar = <span data-cy={data_cy || null}>{label}</span>;

  if (isAddTab) {
    return (
      <AddTabButton tabsBtn onClick={() => addTabs()}>
        <GreenPlusIcon>+</GreenPlusIcon>
        ADD TAB
      </AddTabButton>
    );
  }

  return (
    <Container active={active} style={style} type={type} borderRadius={borderRadius} onClick={onClick}>
      {editable ? inputTab : labelBar}
      {close && closeButton}
    </Container>
  );
};

Tab.propTypes = {
  label: PropTypes.any.isRequired,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  style: PropTypes.object,
  editable: PropTypes.bool,
  close: PropTypes.bool,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  data_cy: PropTypes.string,
  type: PropTypes.string,
  IconPosition: PropTypes.string,
  borderRadius: PropTypes.bool
};

Tab.defaultProps = {
  onClick: () => {},
  active: false,
  style: {},
  editable: false,
  close: false,
  onChange: () => {},
  onClose: evt => {
    evt.stopPropagation();
  },
  data_cy: "",
  type: "default",
  borderRadius: false,
  IconPosition: null
};

export default Tab;

const Container = styled.div`
  color: ${title};
  padding: ${({ type }) => (type === "primary" ? "0px 25px" : "10px 25px")};
  cursor: pointer;
  background: ${white};
  height: ${({ type }) => (type === "primary" ? "28px" : "auto")};
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: ${({ active }) => `1px solid ${active ? themeColor : "transparent"}`};
  background: ${white};
  color: ${({ active }) => (active ? themeColor : greyThemeDark2)};
  border-radius: 0px;
  text-transform: uppercase;
  position: relative;
  margin: 3px 3px 3px 0px;
  font-weight: 600;
  line-height: normal;
  font-size: 12px;

  input {
    font-weight: 600;
    text-transform: uppercase;
  }

  svg {
    width: 8px;
    height: 8px;
    fill: ${({ active }) => (active ? white : greyThemeDark2)};
    position: absolute;
    top: 10px;
    right: 5px;
    &:hover {
      fill: ${({ active }) => (active ? white : greyThemeDark2)};
    }
  }

  @media (max-width: ${mobileWidth}) {
    width: 50%;
    margin-bottom: 10px;
  }
`;

const Input = styled.input`
  border: 0;
  width: 100%;
  text-align: ${({ isPassageQuestion }) => (isPassageQuestion ? "left" : "center")};
  outline: none;
  background: transparent;
  text-align: center;
`;

const EditableTab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const CloseIcon = styled.span`
  margin-left: 14px;
  float: ${props => (props.IconPosition ? props.IconPosition : "none")};
`;

export const AddTabButton = styled(Button)`
  color: ${themeColor};
  height: 45px;
  width: 170px;
  font-size: 11px;
  border: none;
  display: flex !important;
  flex-direction: row;
  width: max-content;
  align-items: center;
  padding: 0px 15px;
  span:last-child {
    color: ${themeColor};
  }
  &:focus > span {
    position: unset;
  }
  &:active > span {
    position: unset;
  }
  &:focus {
    color: ${themeColor};
  }
`;

export const GreenPlusIcon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid ${themeColor};
  left: 10px;
  top: 12px;
  font-size: 18px;
  line-height: 1;
  color: #fff !important;
  background: ${themeColor};
`;
