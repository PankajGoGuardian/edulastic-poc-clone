import { MainHeader } from "@edulastic/common";
import { IconProfileHighlight } from "@edulastic/icons";
import React, { memo } from "react";
import { withNamespaces } from "react-i18next";

const ProfileHeader = ({ t }) => <MainHeader Icon={IconProfileHighlight} headingText={t("common.profileTitle")} />;

export default memo(withNamespaces("header")(ProfileHeader));
