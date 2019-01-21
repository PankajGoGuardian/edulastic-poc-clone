import React, { memo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { compose } from "redux";
import AssignmentTitle from "../../components/assignments/common/assignmentTitle";
import HeaderWrapper from "./headerWrapper";
import ClassSelect from "../../component/ClassSelector";

const Header = ({ t, titleText, classSelect = true }) => (
  <HeaderWrapper>
    <Wrapper>
      <AssignmentTitle>{t(titleText)}</AssignmentTitle>
      {classSelect && <ClassSelect t={t} />}
    </Wrapper>
  </HeaderWrapper>
);

Header.propTypes = {
  t: PropTypes.func.isRequired,
  titleText: PropTypes.string.isRequired
};

const enhance = compose(
  memo,
  withNamespaces("header")
);

export default enhance(Header);

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
