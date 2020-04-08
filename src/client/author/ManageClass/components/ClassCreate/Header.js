import { MainHeader, EduButton } from "@edulastic/common";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { IconManage } from "@edulastic/icons";
// ducks
import { fetchClassListAction } from "../../ducks";
// components
import { ButtonsWrapper } from "./styled";
import { withNamespaces } from "react-i18next";

const Header = ({ t, type, exitPath }) => (
  <MainHeader
    Icon={IconManage}
    headingText={type === "group" ? t("common.manageGroupTitle") : t("common.manageClassTitle")}
  >
    <ButtonsWrapper>
      <Link to={exitPath || "/author/manageClass"}>
        <EduButton isGhost data-cy="cancel">
          Cancel
        </EduButton>
      </Link>
      <EduButton data-cy="saveClass" htmlType="submit">
        Save {type === "group" ? "" : "Class"}
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
