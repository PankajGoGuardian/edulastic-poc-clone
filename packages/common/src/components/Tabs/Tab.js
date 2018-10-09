import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { textColor, blue, mobileWidth, greenDark, mainBgColor } from '@edulastic/colors';
import { IconPensilEdit } from '@edulastic/icons';

const Tab = ({ label, onClick, active, style, editable, onChange }) => {
  const inputTab = (
    <EditableTab>
      <Input type="text" value={label} onChange={onChange} />
      <IconPensilEdit color={greenDark} />
    </EditableTab>
  );
  return (
    <Container onClick={onClick} active={active} style={style}>
      {editable ? inputTab : label}
    </Container>
  );
};

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  style: PropTypes.object,
  editable: PropTypes.bool,
  onChange: PropTypes.func,
};

Tab.defaultProps = {
  onClick: () => {},
  active: false,
  style: {},
  editable: false,
  onChange: () => {},
};

export default Tab;

const Container = styled.div`
  color: ${({ active }) => (active ? blue : textColor)};
  padding: 10px 25px;
  cursor: pointer;
  border-bottom: 2px solid ${({ active }) => (active ? blue : mainBgColor)};

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
`;

const EditableTab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
