/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";

import { withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { extraDesktopWidthMax, mediumDesktopExactWidth } from "@edulastic/colors";
import { IconBookmark } from "@edulastic/icons";
import { Tooltip } from "../../../../common/utils/helpers";
import { Header, FlexContainer, HeaderWrapper, HeaderMainMenu, LogoCompact, MainActionWrapper } from "../../common";
import AudioControls from "../../../AudioControls";
import { MAX_MOBILE_WIDTH } from "../../../constants/others";
import {
  ControlBtn,
  HeaderTopMenu,
  StyledFlexContainer,
  StyledProgress,
  StyledTitle,
  StyledQuestionMark,
  StyledButton,
  StyledIcon
} from "./styled";
import { themes } from "../../../../theme";
import { get, round } from "lodash";
import { getUserRole } from "../../../../author/src/selectors/user";
import QuestionList from "./QuestionList";
import ToolBar from "./ToolBar";
import { setZoomLevelAction } from "../../../../student/Sidebar/ducks";

const {
  playerSkin: { sbac }
} = themes;
const { header } = sbac;

const PlayerHeader = ({
  title,
  currentItem,
  gotoQuestion,
  settings,
  headerRef,
  isMobile,
  moveToPrev,
  moveToNext,
  overlayStyle,
  options,
  skipped = [],
  changeTool,
  toggleToolsOpenStatus,
  tool,
  calcBrands,
  changeCaculateMode,
  finishTest,
  showUserTTS,
  userRole,
  LCBPreviewModal,
  items,
  qType,
  setZoomLevel,
  zoomLevel,
  defaultAP,
  isDocbased,
  toolsOpenStatus
}) => {
  useEffect(() => {
    return () => setZoomLevel(1);
  }, []);

  const totalQuestions = options.length;
  const totalAnswered = skipped.filter(s => !s).length;
  const isFirst = () => (isDocbased ? true : currentItem === 0);

  const headerStyle = {
    borderBottom: `1px solid ${header.borderColor}`,
    background: header.background,
    flexDirection: "column",
    padding: "0",
    zIndex: 505
  };

  const data = items[currentItem]?.data?.questions[0];
  const showAudioControls = userRole === "teacher" && !!LCBPreviewModal;
  const canShowPlayer =
    ((showUserTTS === "yes" && userRole === "student") || (userRole === "teacher" && !!LCBPreviewModal)) &&
    data?.tts &&
    data?.tts?.taskStatus === "COMPLETED";

  return (
    <StyledFlexContainer>
      <Header ref={headerRef} style={headerStyle}>
        <HeaderTopMenu style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
          <FlexContainer>
            {!isDocbased && (
              <>
                <QuestionList options={options} currentItem={currentItem} gotoQuestion={gotoQuestion} />
                <div style={{ width: 136, display: "flex" }}>
                  <StyledProgress
                    percent={round((totalAnswered / totalQuestions) * 100)}
                    size="small"
                    strokeColor="#1B5392"
                  />
                </div>
              </>
            )}
            <StyledTitle>{title}</StyledTitle>
          </FlexContainer>
          <StyledQuestionMark type="question-circle" theme="filled" />
        </HeaderTopMenu>
        <HeaderMainMenu style={{ padding: "0 20px" }}>
          <HeaderSbacPlayer>
            <HeaderWrapper justifyContent="space-between">
              <FlexContainer>
                <LogoCompact isMobile={isMobile} fillColor={header.logoColor} />
                <MainActionWrapper>
                  <Tooltip placement="top" title="Previous" overlayStyle={overlayStyle}>
                    <ControlBtn
                      data-cy="prev"
                      icon="left"
                      disabled={isFirst()}
                      onClick={e => {
                        moveToPrev();
                        e.target.blur();
                      }}
                    />
                  </Tooltip>
                  <Tooltip placement="top" title="Next" overlayStyle={overlayStyle}>
                    <ControlBtn
                      data-cy="next"
                      icon="right"
                      onClick={e => {
                        moveToNext();
                        e.target.blur();
                      }}
                      style={{ marginLeft: "5px" }}
                    />
                  </Tooltip>
                </MainActionWrapper>
                <FlexContainer style={{ marginLeft: "28px" }}>
                  <Tooltip placement="top" title="Save & Exit">
                    <StyledButton onClick={finishTest}>
                      <StyledIcon type="save" theme="filled" />
                    </StyledButton>
                  </Tooltip>
                  {canShowPlayer && (
                    <AudioControls
                      showAudioControls={showAudioControls}
                      key={data.id}
                      item={data}
                      qId={data.id}
                      audioSrc={data?.tts?.titleAudioURL}
                      className="sbac-question-audio-controller"
                    />
                  )}
                </FlexContainer>
              </FlexContainer>
              <ToolBar
                changeTool={changeTool || toggleToolsOpenStatus}
                settings={settings}
                tool={tool || toolsOpenStatus}
                calcBrands={calcBrands}
                changeCaculateMode={changeCaculateMode}
                qType={qType}
                setZoomLevel={setZoomLevel}
                zoomLevel={zoomLevel}
                isDocbased={isDocbased}
              />
            </HeaderWrapper>
          </HeaderSbacPlayer>
        </HeaderMainMenu>
      </Header>
    </StyledFlexContainer>
  );
};

PlayerHeader.propTypes = {
  title: PropTypes.string.isRequired,
  currentItem: PropTypes.number.isRequired,
  gotoQuestion: PropTypes.func.isRequired,
  settings: PropTypes.object,
  toggleBookmark: PropTypes.func,
  isBookmarked: PropTypes.bool,
  headerRef: PropTypes.node,
  isMobile: PropTypes.bool,
  moveToPrev: PropTypes.func.isRequired,
  moveToNext: PropTypes.func.isRequired,
  overlayStyle: PropTypes.object,
  options: PropTypes.array,
  skipped: PropTypes.array,
  bookmarks: PropTypes.array,
  changeTool: PropTypes.func.isRequired,
  tool: PropTypes.array.isRequired,
  calcBrands: PropTypes.array,
  changeCaculateMode: PropTypes.func,
  finishTest: PropTypes.func.isRequired,
  showUserTTS: PropTypes.bool,
  userRole: PropTypes.string,
  LCBPreviewModal: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  qType: PropTypes.string.isRequired,
  setZoomLevel: PropTypes.func.isRequired,
  zoomLevel: PropTypes.oneOf([PropTypes.number, PropTypes.string])
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces("student"),
  connect(
    state => ({
      settings: state.test.settings,
      showUserTTS: get(state, "user.user.tts", "no"),
      userRole: getUserRole(state)
    }),
    {
      setZoomLevel: setZoomLevelAction
    }
  )
);

export default enhance(PlayerHeader);

const HeaderSbacPlayer = styled(FlexContainer)`
  padding: 12px 0px;
  justify-content: space-between;

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding: 11px 0px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    padding: 14px 0px;
  }
  @media (max-width: ${MAX_MOBILE_WIDTH}px) {
    padding: 0px;
  }
`;

const StyledIconBookmark = styled(IconBookmark)`
  ${({ theme }) => `
    width: ${theme.default.headerBookmarkIconWidth};
    height: ${theme.default.headerBookmarkIconHeight};
  `}
`;

const BreadcrumbContainer = styled.div`
  flex: 1;
`;
