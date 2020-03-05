import { EduButton, MainHeader } from "@edulastic/common";
import { IconManage } from "@edulastic/icons";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// ducks
import { fetchClassListAction } from "../../ducks";
// components
import { ButtonsWrapper } from "./styled";
import { withNamespaces } from "react-i18next";

const Header = ({ classId, t }) => (
  <MainHeader Icon={IconManage} headingText={t("common.manageClassTitle")}>
    <ButtonsWrapper>
      <Link to={`/author/manageClass/${classId}`}>
        <EduButton height="40px" isGhost data-cy="cancel">
          Cancel
        </EduButton>
      </Link>
      <EduButton height="40px" data-cy="updateClass" htmlType="submit">
        Update Class
      </EduButton>
    </ButtonsWrapper>
  </MainHeader>
);

export default withNamespaces("header")(
  connect(
    null,
    { fetchClassList: fetchClassListAction }
  )(Header)
);
