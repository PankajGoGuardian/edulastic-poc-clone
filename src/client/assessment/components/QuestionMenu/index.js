import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { throttle } from "lodash";
import { themeColor, extraDesktopWidthMax, mediumDesktopExactWidth } from "@edulastic/colors";
import PerfectScrollbar from "react-perfect-scrollbar";
import { withWindowSizes } from "@edulastic/common";
import VideoThumbnail from "@edulastic/common/src/components/VideoThumbnail";
import IframeVideoModal from "@edulastic/common/src/components/IframeVideoModal";

import AdvancedOptionsLink from "./AdvancedOptionsLink";

class QuestionMenu extends Component {
  state = {
    activeTab: 0,
    isVideoModalVisible: false
  };

  handleScroll = option => {
    this.contentWrapper.removeEventListener("scroll", this.throttledFindActiveTab);
    const { main, advanced } = this.props;
    const options = [...main, ...advanced];
    const activeTab = options.findIndex(opt => opt.label === option.label);

    this.setState({ activeTab }, () => {
      option.el.scrollIntoView({
        behavior: "smooth"
      });
      setTimeout(() => this.contentWrapper.addEventListener("scroll", this.throttledFindActiveTab), 1000);
    });
  };

  componentDidMount() {
    const { scrollContainer } = this.props;
    this.contentWrapper = scrollContainer?.current;
    this.contentWrapper.addEventListener("scroll", this.throttledFindActiveTab);
  }

  componentWillUnmount() {
    this.contentWrapper.removeEventListener("scroll", this.throttledFindActiveTab);
  }

  componentWillReceiveProps(nextProps) {
    const { scrollContainer } = this.props;

    if (scrollContainer?.current !== nextProps.scrollContainer.current) {
      this.contentWrapper = nextProps.scrollContainer.current;
    }
    this.setState({ activeTab: nextProps.activeTab });
    this.findActiveTab();
  }

  findActiveTab = () => {
    const { main, advanced, advancedAreOpen } = this.props;
    const { activeTab } = this.state;
    let allOptions = main;
    if (advancedAreOpen) {
      allOptions = allOptions.concat(advanced);
    }
    for (let i = 0; i < allOptions.length; i++) {
      const elm = allOptions[i].el;
      if (
        allOptions.length > activeTab &&
        this.contentWrapper.scrollTop >= elm.offsetTop - this.contentWrapper.offsetTop + elm.scrollHeight
      ) {
        this.setState({ activeTab: i + 1 });
      }
    }
    if (allOptions[0] && this.contentWrapper.scrollTop < allOptions[0].el.scrollHeight / 2) {
      this.setState({ activeTab: 0 });
    } else if (
      allOptions.length > activeTab &&
      this.contentWrapper.scrollHeight <= this.contentWrapper.scrollTop + this.contentWrapper.clientHeight
    ) {
      this.setState({ activeTab: allOptions.length - 1 });
    }
  };

  throttledFindActiveTab = throttle(this.findActiveTab, 200);

  closeModal = () => {
    this.setState({ isVideoModalVisible: false });
  };

  openModal = () => {
    this.setState({ isVideoModalVisible: true });
  };

  render() {
    const {
      main,
      advanced,
      advancedAreOpen,
      handleAdvancedOpen,
      windowWidth,
      questionTitle,
      hideAdvancedToggleOption
    } = this.props;
    const { activeTab, isVideoModalVisible } = this.state;

    return (
      <Menu>
        <ScrollbarContainer>
          <MainOptions activeTab={activeTab} main={main} advancedAreOpen={advancedAreOpen} windowWidth={windowWidth}>
            {main &&
              main.map((option, index) => (
                <Option
                  key={index}
                  onClick={e => this.handleScroll(option, e)}
                  className={`option ${index === activeTab && "active"}`}
                >
                  {option.label}
                </Option>
              ))}
          </MainOptions>
          {advanced.length > 0 && (
            <Fragment>
              <AdvancedOptionsLink
                handleAdvancedOpen={handleAdvancedOpen}
                advancedAreOpen={advancedAreOpen}
                hideAdvancedToggleOption={hideAdvancedToggleOption}
              />
              {advancedAreOpen && (
                <AdvancedOptions>
                  {advanced.map((option, index) => (
                    <Option
                      key={index}
                      onClick={e => this.handleScroll(option, e)}
                      className={`option ${main.length + index === activeTab && "active"}`}
                    >
                      {option.label}
                    </Option>
                  ))}
                </AdvancedOptions>
              )}
            </Fragment>
          )}
        </ScrollbarContainer>

        {!advancedAreOpen ? (
          <div style={{ position: "absolute", bottom: "180px", width: "100%" }} onClick={this.openModal}>
            <VideoThumbnail
              questionTitle={questionTitle}
              title="How to author video"
              width="100%"
              maxWidth="100%"
              margin="30px 0 0 0"
            />
          </div>
        ) : null}
        <IframeVideoModal questionTitle={questionTitle} visible={isVideoModalVisible} closeModal={this.closeModal} />
      </Menu>
    );
  }
}

QuestionMenu.propTypes = {
  activeTab: PropTypes.number.isRequired,
  main: PropTypes.array,
  advanced: PropTypes.array,
  advancedAreOpen: PropTypes.bool.isRequired,
  handleAdvancedOpen: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  scrollContainer: PropTypes.object,
  questionTitle: PropTypes.string
};

QuestionMenu.defaultProps = {
  main: [],
  advanced: [],
  scrollContainer: null,
  questionTitle: ""
};

export default withWindowSizes(QuestionMenu);
export { default as AdvancedOptionsLink } from "./AdvancedOptionsLink";

const Menu = styled.div`
  position: fixed;
  width: 230px;
  padding: 30px 0px;
  height: 100%;
`;

const ScrollbarContainer = styled(PerfectScrollbar)`
  padding-top: 10px;
  padding-left: 10px;
  max-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs + 110}px)`};
  /* 110px is for top-Bottom padding(60) and breadcrumbs height(50) */

  @media (min-width: ${mediumDesktopExactWidth}) {
    max-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md + 110}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    max-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl + 110}px)`};
  }
`;

const MainOptions = styled.ul`
  position: relative;
  list-style: none;
  padding: 0;
  border-left: 2px solid #b9d5fa;

  &::before {
    opacity: ${props => (props.activeTab > props.main.length - 1 ? (props.advancedAreOpen ? 1 : 0) : 1)};
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${themeColor};
    content: "";
    position: absolute;
    left: -7.5px;
    top: -5px;
    z-index: 5;
    transition: 0.2s ease transform, 0.2s ease opacity;
    transform: translateY(
      ${props =>
        `${props.activeTab * (props.windowWidth >= extraDesktopWidthMax.replace("px", "") ? 80 : 50) +
          (props.activeTab > props.main.length - 1
            ? props.windowWidth >= extraDesktopWidthMax.replace("px", "")
              ? 50
              : 79
            : 0)}px`}
    );
  }
`;

const Option = styled.li`
  cursor: pointer;
  font-size: 12px;
  padding-left: 25px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 0;
  height: 0;
  position: relative;
  letter-spacing: 0.2px;
  text-align: left;
  color: #6a737f;
  margin-bottom: 50px;
  transition: 0.2s ease color;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:before {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    top: 50%;
    left: -5.5px;
    background: #b9d5fa;
    border-radius: 50%;
    transform: translateY(-50%);
    z-index: 1;
  }

  &.active {
    color: ${themeColor};
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    padding-left: 35px;
    margin-bottom: 80px;
  }
`;

const AdvancedOptions = styled.ul`
  list-style: none;
  padding: 0;
  border-left: 2px solid #b9d5fa;
`;
