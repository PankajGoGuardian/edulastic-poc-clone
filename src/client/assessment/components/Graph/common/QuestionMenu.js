import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { throttle } from "lodash";
import { themeColor, desktopWidth, extraDesktopWidthMax } from "@edulastic/colors";
import PerfectScrollbar from "react-perfect-scrollbar";
import { withWindowSizes } from "@edulastic/common";

class QuestionMenu extends Component {
  state = {
    activeTab: 0
  };

  handleScroll = option => {
    window.scrollTo({
      top: option.offset - 115,
      behavior: "smooth"
    });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.throttledFindActiveTab);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.throttledFindActiveTab);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ activeTab: nextProps.activeTab });
  }

  isActive = (index, options) => {
    const { activeTab } = this.state;
    const { advancedAreOpen } = this.props;

    if (!advancedAreOpen && options[index].section === "advanced") return false;

    // first section
    if (window.scrollY <= 10 && activeTab !== index) return this.setState({ activeTab: 0 });

    // last section
    if (
      window.scrollY + window.outerHeight / 1.3 >=
        options[options.length - 1].offset + options[options.length - 1].height &&
      window.scrollY - options[options.length - 1].offset < options[options.length - 1].height &&
      activeTab !== index
    )
      return this.setState({ activeTab: options.length - 1 });

    // other sections
    if (
      window.scrollY + window.outerHeight - window.outerHeight / (window.outerHeight / window.outerWidth + 1) >
        options[index].offset &&
      window.scrollY - options[index].offset < options[index].height &&
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
    const { main, advanced, isSidebarCollapsed, advancedAreOpen, handleAdvancedOpen, windowWidth } = this.props;
    const { activeTab } = this.state;

    return (
      <Menu isSidebarCollapsed={isSidebarCollapsed}>
        <ScrollbarContainer>
          <MainOptions activeTab={activeTab} main={main} advancedAreOpen={advancedAreOpen} windowWidth={windowWidth}>
            {main &&
              main.map((option, index) => (
                <Option
                  key={index}
                  onClick={() => this.handleScroll(option)}
                  className={index === activeTab && "active"}
                >
                  {option.label}
                </Option>
              ))}
          </MainOptions>
          {advanced.length > 0 && (
            <Fragment>
              <AdvancedOptionsHeader onClick={handleAdvancedOpen} advancedAreOpen={advancedAreOpen}>
                <p>{advancedAreOpen ? "HIDE" : "SHOW"} ADVANCED OPTIONS</p>
              </AdvancedOptionsHeader>
              {advancedAreOpen && (
                <AdvancedOptions>
                  {advanced.map((option, index) => (
                    <Option
                      key={index}
                      onClick={() => this.handleScroll(option)}
                      className={main.length + index === activeTab && "active"}
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
  isSidebarCollapsed: PropTypes.bool.isRequired,
  advancedAreOpen: PropTypes.bool.isRequired,
  handleAdvancedOpen: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired
};

QuestionMenu.defaultProps = {
  main: [],
  advanced: []
};

export default connect(({ authorUi }) => ({
  isSidebarCollapsed: authorUi.isSidebarCollapsed
}))(withWindowSizes(QuestionMenu));

const Menu = styled.div`
  position: fixed;
  left: 160px;
  top: 150px;
  width: 230px;
  padding: 40px 0 0;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 300px;
    padding-left: 43px;
    padding-top: 46px;
  }

  @media (max-width: ${desktopWidth}) {
    display: none;
  }
`;

const ScrollbarContainer = styled(PerfectScrollbar)`
  padding-top: 10px;
  padding-left: 10px;
  max-height: calc(100vh - 255px);
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
const AdvancedOptionsHeader = styled.div`
  cursor: pointer;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  margin: 50px 0px;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    right: -27px;
    transform: translateY(-50%) ${props => props.advancedAreOpen && "rotate(180deg)"};
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5.5px solid ${themeColor};
    transition: all 0.2s ease;
  }
  p {
    margin: 0;
    font-size: 11px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.36;
    letter-spacing: 0.2px;
    text-align: left;
    color: #434b5d;
  }
`;

const AdvancedOptions = styled.ul`
  list-style: none;
  padding: 0;
  border-left: 2px solid #b9d5fa;
`;
