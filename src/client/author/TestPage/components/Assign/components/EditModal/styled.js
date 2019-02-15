import styled from 'styled-components';
import { Row, Switch, Radio, Col } from 'antd';
import { EduButton } from '@edulastic/common';
const RadioGroup = Radio.Group;

// Edit Modal styled
export const Button = styled(EduButton)`
  width: 30%;
`;

export const StyledRow = styled(Row)`
  margin-bottom: 20px;
`;

export const StyledRowLabel = styled(Row)`
  margin-bottom: 10px;
`;

export const SettingsBtn = styled.span`
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  color: #06affc;
`;

export const StudentWrapper = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
`;

// Settings styled

export const AlignRight = styled(RadioGroup)`
  float: right;
`;

export const AlignSwitchRight = styled(Switch)`
  float: right;
`;

export const StyledRowSettings = styled.div`
  border-bottom: 1px solid rgba(128, 128, 128, 0.26);
  padding: 15px 0px;
  font-size: 10px;
  display: flex;
`;

export const FlexItem = styled(Col)`
  display: flex;
  justify-content: center;
`;

export const TbleHeader = styled(Row)`
  margin: 18px 0;
`;
