import { MainHeader } from "@edulastic/common";
import React, { memo } from "react";
import { IconProfileHighlight } from "@edulastic/icons";

const ProfileHeader = () => <MainHeader Icon={IconProfileHighlight} headingText="common.profileTitle" />;

export default memo(ProfileHeader);
