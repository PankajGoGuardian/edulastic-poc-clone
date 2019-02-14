import styled from 'styled-components';
import { Row } from 'antd';
import { EduButton } from '@edulastic/common';

export const Button = styled(EduButton)`
  width: 30%;
`;

export const StyledRow = styled(Row)`
  margin-bottom: 20px;
`;

export const StyledRowLabel = styled(Row)`
  margin-bottom: 10px;
`;

export const StudentWrapper = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
`;
