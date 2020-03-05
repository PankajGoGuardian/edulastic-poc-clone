import React, { memo } from "react";
import { MainHeader } from "@edulastic/common";
import { withNamespaces } from "react-i18next";

const ProfileHeader = ({ t }) => <MainHeader headingText={t("common.profileTitle")} />;

export default memo(withNamespaces("header")(ProfileHeader));
