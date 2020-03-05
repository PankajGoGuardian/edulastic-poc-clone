import React, { memo } from "react";
import { MainHeader } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

const ProfileHeader = ({ t }) => <MainHeader headingText={t("common.profileTitle")} />;

export default memo(withNameSpaces("header")(ProfileHeader));
