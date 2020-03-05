import { MainHeader } from "@edulastic/common";
import React, { memo } from "react";
import { IconProfileHighlight } from "@edulastic/icons";
import { withNamespaces } from "react-i18next";

const ProfileHeader = ({ t }) => <MainHeader Icon={IconProfileHighlight} headingText={t("common.profileTitle")} />;

export default memo(withNamespaces("header")(ProfileHeader));
