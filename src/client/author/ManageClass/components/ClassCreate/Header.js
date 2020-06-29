import { EduButton, MainHeader } from "@edulastic/common";
import { IconManage } from "@edulastic/icons";
import React from "react";
import { withNamespaces } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
// ducks
import { fetchClassListAction } from "../../ducks";
// components
import { ButtonsWrapper } from "./styled";

const Header = ({ t, type, exitPath }) => (
  <MainHeader
    Icon={IconManage}
    headingText={type === "group" ? t("common.manageGroupTitle") : t("common.manageClassTitle")}
  >
    <ButtonsWrapper>
      <Link to={exitPath || "/author/manageClass"}>
        <EduButton isBlue isGhost data-cy="cancel">
          Cancel
        </EduButton>
      </Link>
      <EduButton isBlue data-cy="saveClass" htmlType="submit">
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
