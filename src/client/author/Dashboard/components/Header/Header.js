import React from "react";
import { Link } from "react-router-dom";
import { HeaderWrapper, TitleWrapper, ManageClassButton, IconPlus, ButtonText } from "./styled";
import { green } from "@edulastic/colors";

function HeaderSection() {
  return (
    <HeaderWrapper>
      <TitleWrapper>Dashboard</TitleWrapper>
      <Link to={"/author/manageClass"}>
        <ManageClassButton>
          <IconPlus color={green} />
          <ButtonText>Manage Class</ButtonText>
        </ManageClassButton>
      </Link>
    </HeaderWrapper>
  );
}
export default HeaderSection;
