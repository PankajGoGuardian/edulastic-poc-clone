import React, { Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { get } from "lodash";
import { Tooltip } from "antd";
import styled from "styled-components";

import { nonAutoGradableTypes } from "@edulastic/constants";
import { IconLogoCompact, IconSave, IconPause, IconLogout, IconSend } from "@edulastic/icons";
import { withWindowSizes } from "@edulastic/common";
import { boxShadowDefault } from "@edulastic/colors";

import {
  Header,
  FlexContainer,
  HeaderLeftMenu,
  MobileMainMenu as Mobile,
  HeaderMainMenu,
  TestButton,
  ToolButton
} from "../common";
import {
  IPAD_PORTRAIT_WIDTH,
  MEDIUM_DESKTOP_WIDTH,
  SMALL_DESKTOP_WIDTH,
  headerOffsetHashMap
} from "../../constants/others";

import QuestionSelectDropdown from "../common/QuestionSelectDropdown";
import { ifZoomed } from "../../../common/utils/helpers";
import ToolBar from "./ToolBar";
import { isZoomGreator } from "../../../common/utils/helpers";
import ToolbarModal from "../common/ToolbarModal";

const PlayerHeader = ({
  title,
  dropdownOptions,
  currentItem,
  onOpenExitPopup,
  theme,
  gotoQuestion,
  onPause,
  onSaveProgress,
  showSubmit,
  onSubmit,
  settings,
  windowWidth,
  items,
  answerChecksUsedForItem,
  checkAnswer,
  toggleBookmark,
  isBookmarked,
  onshowHideHints,
  toggleToolsOpenStatus,
  toolsOpenStatus
}) => {
  const [isToolbarModalVisible, setToolbarModalVisible] = useState(false);

  const calcBrands = ["DESMOS", "GEOGEBRASCIENTIFIC"];

  const isZoomed = ifZoomed(theme?.zoomLevel);
  const InnerContainer = isZoomed ? HeaderInnerContainer : Fragment;
  const showSettingIcon = windowWidth < MEDIUM_DESKTOP_WIDTH || isZoomGreator("md", theme?.zoomLevel);
  const navZoomStyle = { zoom: theme?.header?.navZoom };
  let isNonAutoGradable = false;
  const item = items[currentItem];
  if (item.data && item.data.questions) {
    item.data.questions.forEach(question => {
      if (nonAutoGradableTypes.includes(question.type)) {
        isNonAutoGradable = true;
      }
    });
  }
  return (
    <Fragment>
      <ToolbarModal
        isVisible={isToolbarModalVisible}
        onClose={() => setToolbarModalVisible(false)}
        checkAnswer={checkAnswer}
        windowWidth={windowWidth}
      />
      <HeaderPracticePlayer>
        <HeaderLeftMenu skinb={"true"}>
          <LogoCompact color={"#fff"} />
        </HeaderLeftMenu>
        <HeaderMainMenu skinb={"true"}>
          <HeaderFlexContainer justifyContent="space-between">
            <PlayerTitle>{title}</PlayerTitle>
            <InnerContainer>
              <FlexContainer justifyContent="flex-end">
                {showSettingIcon && (
                  <ToolTipContainer>
                    <Tooltip placement="top" title="Tool" overlayStyle={navZoomStyle}>
                      <ToolButton
                        next
                        skin
                        size="large"
                        type="primary"
                        icon="tool"
                        data-cy="setting"
                        onClick={() => setToolbarModalVisible(true)}
                      />
                    </Tooltip>
                  </ToolTipContainer>
                )}
                {windowWidth >= SMALL_DESKTOP_WIDTH && (
                  <TestButton
                    answerChecksUsedForItem={answerChecksUsedForItem}
                    settings={settings}
                    items={items}
                    currentItem={currentItem}
                    isNonAutoGradable={isNonAutoGradable}
                    checkAnswer={checkAnswer}
                    toggleBookmark={() => toggleBookmark(item._id)}
                    isBookmarked={isBookmarked}
                    handletoggleHints={onshowHideHints}
                  />
                )}
                {windowWidth >= MEDIUM_DESKTOP_WIDTH && !isZoomGreator("md", theme?.zoomLevel) && (
                  <ToolBar
                    settings={settings}
                    calcBrands={calcBrands}
                    tools={toolsOpenStatus}
                    changeCaculateMode={() => {}}
                    toggleToolsOpenStatus={toggleToolsOpenStatus}
                    qType={get(items, `[${currentItem}].data.questions[0].type`, null)}
                  />
                )}
                <ContainerRight>
                  <FlexDisplay>
                    {showSubmit && (
                      <Save onClick={onSubmit} title="Submit">
                        <IconSend color={theme.widgets.assessmentPlayerSimple.headerIconColor} />
                      </Save>
                    )}
                    <Save onClick={onSaveProgress} title="Save">
                      <IconSave color={theme.widgets.assessmentPlayerSimple.headerIconColor} />
                    </Save>
                    {onPause && (
                      <Save onClick={onPause} title="Pause">
                        <IconPause color={theme.widgets.assessmentPlayerSimple.headerIconColor} />
                      </Save>
                    )}
                    {!onPause && (
                      <StyledLink to="/home/assignments">
                        <IconPause color={theme.widgets.assessmentPlayerSimple.headerIconColor} />
                      </StyledLink>
                    )}
                    <Save onClick={onOpenExitPopup} title="Exit">
                      <IconLogout color={theme.widgets.assessmentPlayerSimple.headerIconColor} />
                    </Save>
                  </FlexDisplay>
                </ContainerRight>
              </FlexContainer>
            </InnerContainer>
          </HeaderFlexContainer>
        </HeaderMainMenu>
      </HeaderPracticePlayer>
      <Mobile>
        <QuestionSelectDropdown
          key={currentItem}
          currentItem={currentItem}
          gotoQuestion={gotoQuestion}
          options={dropdownOptions}
          skinb={"true"}
        />
      </Mobile>
    </Fragment>
  );
};

PlayerHeader.defaultProps = {
  onSaveProgress: () => {}
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    state => ({
      settings: state.test.settings
    }),
    null
  )
);

export default enhance(PlayerHeader);

const LogoCompact = styled(IconLogoCompact)`
  zoom: ${({ theme }) => theme?.widgets?.assessmentPlayers?.textZoom};
  width: 21px;
  height: 21px;
  margin: 10px;
  fill: ${props => props.theme.widgets.assessmentPlayers.logoColor};
  &:hover {
    fill: ${props => props.theme.widgets.assessmentPlayers.logoColor};
  }
`;

const PlayerTitle = styled.h1`
  zoom: ${({ theme }) => theme?.widgets?.assessmentPlayers?.textZoom};
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #fff;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
/* 
`;
const Save = styled.div`
  background: ${props => props.theme.headerIconBgColor};
  border-radius: 5px;
  padding: 13px;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  &:hover {
    svg {
      fill: ${props => props.theme.headerIconHoverColor};
    }
  }
`;

const StyledLink = styled(Link)`
  background: ${props => props.theme.headerIconBgColor};
  border-radius: 5px;
  padding: 12px 14px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    svg {
      fill: ${props => props.theme.headerIconHoverColor};
    }
  }
`;

const FlexDisplay = styled.div`
  display: flex;
`;

const ContainerRight = styled.div`
  zoom: ${({ theme }) => theme?.widgets?.assessmentPlayers?.textZoom};
  display: flex;
  margin-left: 40px;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    margin-left: auto;
  }
`;

const HeaderPracticePlayer = styled(Header)`
  background: ${props => props.theme.headerBg};
  box-shadow: ${boxShadowDefault};
  height: ${({ theme }) => headerOffsetHashMap[(theme?.zoomLevel)]}px;
  z-index: 1;
`;

const HeaderFlexContainer = styled(FlexContainer)``;

const HeaderInnerContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const ToolTipContainer = styled.div`
  zoom: ${({ theme }) => theme?.header?.navZoom};
`;
