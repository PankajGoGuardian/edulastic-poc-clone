import styled from "styled-components";

const AssignmentContentWrapper = styled.div`
  border-radius: 10px;
  box-shadow: ${props => (props.hasCollapseButtons ? "none" : "0 3px 10px 0 rgba(0, 0, 0, 0.1)")};
  padding: ${props => (props.hasCollapseButtons ? 0 : "0")};
  background: ${props => (props.hasCollapseButtons ? "transparent" : props.theme.assignment.cardContainerBgColor)};
  margin-bottom: 1rem;
  min-height: 75vh;
  @media screen and (max-width: 767px) {
    padding: 0px 15px;
  }
`;

export default AssignmentContentWrapper;
