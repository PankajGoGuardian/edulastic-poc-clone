import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { newBlue, white, mobileWidth, tabGrey } from "@edulastic/colors";
import { IconPencilEdit, IconClose } from "@edulastic/icons";

const Tab = ({ label, onClick, active, style, editable, close, onClose, onChange, data_cy, type, borderRadius }) => {
  const inputTab = (
    <EditableTab>
      <Input type="text" value={label} onChange={onChange} />
      <IconPencilEdit color={newBlue} width={16} height={16} />
    </EditableTab>
  );

  const closeButton = (
    <CloseIcon>
      <IconClose color={active ? white : "#AAAFB5"} width={8} height={8} onClick={onClose} />
    </CloseIcon>
  );

  const labelBar = <span data-cy={data_cy || null}>{label}</span>;

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
  borderRadius: false
};

export default Tab;

const Container = styled.div`
  color: ${({ active }) => (active ? white : tabGrey)};
  padding: ${({ type }) => (type === "primary" ? "0 10px" : "10px 25px")};
  cursor: pointer;
  background: ${({ active }) => (active ? newBlue : white)};
  height: ${({ type }) => (type === "primary" ? "28px" : "auto")};
  line-height: ${({ type }) => (type === "primary" ? "26px" : "normal")};
  min-width: ${({ type }) => (type === "primary" ? "120px" : "0")};
  text-align: center;
  border-radius: ${({ borderRadius }) => (borderRadius ? "4px" : 0)};

  &:first-child {
    border-radius: 4px 0 0 4px;
  }

  &:nth-last-child(2) {
    border-radius: 0 4px 4px 0;
  }

  span {
    font-size: 11px;
    font-weight: 600;
    margin: auto;
    color: ${({ active }) => (active ? white : tabGrey)};
  }

  svg {
    width: 6px;
    height: 6px;
    fill: ${({ active }) => (active ? white : tabGrey)};
  }

  @media (max-width: ${mobileWidth}) {
    width: 50%;
    margin-bottom: 10px;
  }
`;

const Input = styled.input`
  border: 0;
  width: 100%;
  text-align: center;
  outline: none;
  background: transparent;
`;

const EditableTab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseIcon = styled.span`
  margin-left: 14px;
`;
