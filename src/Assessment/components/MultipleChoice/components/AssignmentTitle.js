import styled from "styled-components";

const AssignmentTitle = styled.span`
  font-size: 25px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.dashboardHeaderTitleColor};
`;

export default AssignmentTitle;
