import { EduButton, MainHeader } from "@edulastic/common";
import { IconManage } from "@edulastic/icons";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// components
import { withNamespaces } from "react-i18next";
import { ButtonsWrapper } from "./styled";

// ducks
import { fetchClassListAction } from "../../ducks";

const Header = ({ t, classId, type, exitPath }) => (
  <MainHeader
    Icon={IconManage}
    headingText={type === "custom" ? t("common.manageGroupTitle") : t("common.manageClassTitle")}
  >
    <ButtonsWrapper>
      <Link to={exitPath || `/author/manageClass/${classId}`}>
        <EduButton isBlue height="40px" isGhost data-cy="cancel">
          Cancel
        </EduButton>
      </Link>
      <EduButton isBlue height="40px" data-cy="updateClass" htmlType="submit">
        Update {type === "custom" ? "" : "Class"}
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
