import styled from "styled-components";

const AssignmentContentWrapper = styled.div`
  border-radius: 10px;
  padding: ${props => (props.hasCollapseButtons ? 0 : "0")};
  background: ${props => (props.hasCollapseButtons ? "transparent" : props.theme.assignment.cardContainerBgColor)};
  margin-bottom: 1rem;
  min-height: 75vh;
  @media screen and (max-width: 767px) {
    padding: 0px 15px;
  }
`;

export default AssignmentContentWrapper;
