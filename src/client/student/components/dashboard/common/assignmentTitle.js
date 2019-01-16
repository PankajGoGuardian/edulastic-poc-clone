import styled from 'styled-components';

const AssignmentsTitle = styled.div`
  font-family: Open Sans;
  font-size: ${props => props.theme.headerTitleFontSize};
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.headerTitleTextColor};
  @media screen and (max-width: 768px) {
    padding-left: 40px;
  }
`;

export default AssignmentsTitle;
