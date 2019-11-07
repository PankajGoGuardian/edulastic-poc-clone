import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { throttle } from "lodash";
import { themeColor, extraDesktopWidthMax, smallDesktopWidth, mediumDesktopExactWidth } from "@edulastic/colors";
import PerfectScrollbar from "react-perfect-scrollbar";
import { withWindowSizes } from "@edulastic/common";

import AdvancedOptionsLink from "./AdvancedOptionsLink";

class QuestionMenu extends Component {
  state = {
    activeTab: 0
  };

  handleScroll = (option, e) => {
    e.target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (option.el.clientHeight >= window.innerHeight / 2) {
      window.scrollTo({
        top: option.el.offsetTop - 111,
        behavior: "smooth"
      });
    } else {
      window.scrollTo({
        top: option.el.offsetTop - 111 + option.el.clientHeight - window.innerHeight / 2,
        behavior: "smooth"
      });
    }
  };

  componentDidMount() {
    window.addEventListener("scroll", this.throttledFindActiveTab);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.throttledFindActiveTab);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ activeTab: nextProps.activeTab });
    this.findActiveTab();
  }

  isActive = (index, options) => {
    const { activeTab } = this.state;
    const { advancedAreOpen } = this.props;

    if ((!advancedAreOpen && options[index].section === "advanced") || !options[index].el) return false;

    const summaryScrollHeight = document.querySelector("#react-app").scrollHeight;
    const { el } = options[index];
    const activeOption = document.querySelector(".option.active");
    const scrollBarOptions = document.querySelector(".option.active")?.parentNode?.parentNode;

    if (!scrollBarOptions) {
      return;
    }

    scrollBarOptions.scrollTo({
      top: activeOption.offsetTop,
      behavior: "smooth"
    });

    if (window.scrollY <= 40 && activeTab !== index && index === 0) {
      return this.setState({ activeTab: 0 });
    }

    // last section
    if (
      window.scrollY + window.innerHeight >= summaryScrollHeight - 40 &&
      activeTab !== index &&
      index === options.length - 1
    ) {
      return this.setState({ activeTab: options.length - 1 });
    }

    if (
      window.scrollY + window.innerHeight / 3 >= el.offsetTop &&
      window.scrollY + (window.innerHeight / 4) * 2 <= el.offsetTop + el.clientHeight &&
      activeTab !== index
    ) {
      return this.setState({ activeTab: index });
    }
  };

  findActiveTab = () => {
    const { main, advanced } = this.props;
    const allOptions = main.concat(advanced);

    for (let i = 0; i < allOptions.length; i++) {
      this.isActive(i, allOptions);
    }
  };

  throttledFindActiveTab = throttle(this.findActiveTab, 200);

  render() {
    const { main, advanced, advancedAreOpen, handleAdvancedOpen, windowWidth } = this.props;
    const { activeTab } = this.state;

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
              <AdvancedOptionsLink handleAdvancedOpen={handleAdvancedOpen} advancedAreOpen={advancedAreOpen} />
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
  windowWidth: PropTypes.number.isRequired
};

QuestionMenu.defaultProps = {
  main: [],
  advanced: []
};

export default withWindowSizes(QuestionMenu);
export { default as AdvancedOptionsLink } from "./AdvancedOptionsLink";

const Menu = styled.div`
  position: fixed;
  width: 230px;
  padding: 30px 0px;
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
              ? 48
              : 77
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
