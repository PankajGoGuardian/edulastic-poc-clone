import { MainHeader, EduButton } from "@edulastic/common";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { IconManage } from "@edulastic/icons";
// ducks
import { fetchClassListAction } from "../../ducks";
// components
import { ButtonsWrapper, CancelClassBtn, SaveClassBtn } from "./styled";
import { withNamespaces } from "react-i18next";

const Header = ({ t }) => (
  <MainHeader Icon={IconManage} headingText={t("common.manageClassTitle")}>
    <ButtonsWrapper>
      <Link to="/author/manageClass">
        <EduButton isGhost data-cy="cancel">
          Cancel
        </EduButton>
      </Link>
      <EduButton data-cy="saveClass" htmlType="submit">
        Save Class
      </EduButton>
    </ButtonsWrapper>
  </MainHeader>
);

const enhance = compose(
  withNamespaces("header"),
  connect(
    null,
    { fetchClassList: fetchClassListAction }
  )
);
export default enhance(Header);
