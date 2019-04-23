import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { throttle } from "lodash";
import { newBlue, desktopWidth } from "@edulastic/colors";

class QuestionMenu extends Component {
  state = {
    advancedAreOpen: false,
    activeTab: 0
  };

  handleAdvancedOpen = () => {
    const { advancedAreOpen } = this.state;
    this.setState({ advancedAreOpen: !advancedAreOpen });
  };

  handleScroll = (option, index) =>
    window.scrollTo({
      top: option.offset - (index === 0 ? 90 : 250),
      behavior: "smooth"
    });

  componentDidMount() {
    window.addEventListener("scroll", this.throttledFindActiveTab);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.throttledFindActiveTab);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ activeTab: nextProps.activeTab });
  }

  calcScrollPosition = (index, offset) => {
    const scrollYMax =
      Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      ) - window.innerHeight;

    if (index === 0) {
      return window.scrollY + 90;
    }
    if (index !== 0 && offset < scrollYMax) {
      return window.scrollY + 250;
    }
    if (index !== 0 && offset >= scrollYMax) {
      return window.scrollY + 650;
      // return window.scrollY + (offset - scrollYMax + 200)
    }
  };

  isActive = (index, options) => {
    const scrollPosition = this.calcScrollPosition(index, options[index].offset);

    if (index === 0) {
      if (scrollPosition <= options[index].offset) {
        return true;
      }
    } else if (index === options.length - 1) {
      if (scrollPosition <= document.documentElement.scrollHeight && scrollPosition >= options[index].offset) {
        return true;
      }
    } else if (scrollPosition >= options[index].offset && scrollPosition <= options[index + 1].offset) {
      return true;
    }
    return false;
  };

  findActiveTab = () => {
    const { main, advanced } = this.props;
    const { activeTab } = this.state;
    const allOptions = main.concat(advanced);

    if (allOptions) {
      allOptions.forEach((option, index) => {
        if (this.isActive(index, allOptions)) {
          if (index !== activeTab) {
            return this.setState({ activeTab: index });
          }
        }
      });
    }
  };

  throttledFindActiveTab = throttle(this.findActiveTab, 200);

  render() {
    const { main, advanced, isSidebarCollapsed } = this.props;
    const { advancedAreOpen, activeTab } = this.state;
    return (
      <Menu isSidebarCollapsed={isSidebarCollapsed}>
        <MainOptions activeTab={activeTab} main={main} advancedAreOpen={advancedAreOpen}>
          {main &&
            main.map((option, index) => (
              <Option
                key={index}
                onClick={() => this.handleScroll(option, index)}
                className={index === activeTab && "active"}
              >
                {option.label}
              </Option>
            ))}
        </MainOptions>
        {advanced.length > 0 && (
          <Fragment>
            <AdvancedOptionsHeader onClick={this.handleAdvancedOpen} advancedAreOpen={advancedAreOpen}>
              <p>{advancedAreOpen ? "HIDE" : "SHOW"} ADVANCED OPTIONS</p>
            </AdvancedOptionsHeader>
            {advancedAreOpen && (
              <AdvancedOptions>
                {advanced.map((option, index) => (
                  <Option
                    key={index}
                    onClick={() => this.handleScroll(option, main.length + index)}
                    className={main.length + index === activeTab && "active"}
                  >
                    {option.label}
                  </Option>
                ))}
              </AdvancedOptions>
            )}
          </Fragment>
        )}
      </Menu>
    );
  }
}

QuestionMenu.propTypes = {
  activeTab: PropTypes.number.isRequired,
  main: PropTypes.shape,
  advanced: PropTypes.shape,
  isSidebarCollapsed: PropTypes.bool.isRequired
};

QuestionMenu.defaultProps = {
  main: [],
  advanced: []
};

export default connect(({ authorUi }) => ({
  isSidebarCollapsed: authorUi.isSidebarCollapsed
}))(QuestionMenu);

const Menu = styled.div`
  position: fixed;
  left: ${props => (props.isSidebarCollapsed ? "185px" : "325px")};
  top: 150px;
  width: 280px;
  padding: 56px 0 0 27px;
  margin-right: 40px;

  @media (max-width: ${desktopWidth}) {
    display: none;
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
    background: ${newBlue};
    content: "";
    position: absolute;
    left: -7.5px;
    top: -5px;
    z-index: 5;
    transition: 0.2s ease transform, 0.2s ease opacity;
    transform: translateY(
      ${props => `${props.activeTab * 80 + (props.activeTab > props.main.length - 1 ? 115 : 0)}px`}
    );
  }
`;

const Option = styled.li`
  cursor: pointer;
  font-size: 14px;
  padding-left: 35px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 0;
  position: relative;
  letter-spacing: 0.2px;
  text-align: left;
  color: #6a737f;
  margin-bottom: 80px;
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
    color: ${newBlue};
  }
`;
const AdvancedOptionsHeader = styled.div`
  cursor: pointer;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  margin: 101px 0 65px;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    right: -27px;
    transform: translateY(-50%) ${props => props.advancedAreOpen && "rotate(180deg)"};
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5.5px solid ${newBlue};
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
