import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { withTheme } from 'styled-components'
import { throttle } from 'lodash'
import {
  themeColor,
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
} from '@edulastic/colors'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { withWindowSizes } from '@edulastic/common'
import VideoThumbnail from '@edulastic/common/src/components/VideoThumbnail'
import IframeVideoModal from '@edulastic/common/src/components/IframeVideoModal'

import AdvancedOptionsLink from './AdvancedOptionsLink'

class QuestionMenu extends Component {
  state = {
    activeTab: 0,
    isVideoModalVisible: false,
  }

  handleScroll = (option) => {
    window.removeEventListener('scroll', this.throttledFindActiveTab)
    const { main, advanced, extras, theme } = this.props
    const options = [...main, ...advanced, ...extras]
    const activeTab = options.findIndex((opt) => opt.label === option.label)
    this.setState({ activeTab }, () => {
      const node = option.el
      window.scroll({
        left: 0,
        top: node.offsetTop - theme.HeaderHeight.xl, // 50 is the height of how to author button area
        behavior: 'smooth',
      })
      setTimeout(
        () => window.addEventListener('scroll', this.throttledFindActiveTab),
        1000
      )
    })
  }

  componentDidMount() {
    const { scrollContainer } = this.props
    this.contentWrapper = scrollContainer?.current
    window.addEventListener('scroll', this.throttledFindActiveTab)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.throttledFindActiveTab)
  }

  findActiveTab = () => {
    const { main, advanced, extras, advancedAreOpen, theme } = this.props
    const { activeTab } = this.state
    let allOptions = main
    if (advancedAreOpen) {
      allOptions = allOptions.concat(advanced)
    }
    allOptions = allOptions.concat(extras)
    for (let i = 0; i < allOptions.length; i++) {
      const elm = allOptions[i].el
      if (
        allOptions.length > activeTab &&
        window.scrollY >= elm.offsetTop &&
        window.scrollY <
          elm.offsetTop + elm.scrollHeight / 2 + theme.HeaderHeight.xl
      ) {
        this.setState({ activeTab: i + 1 })
      }
      if (
        allOptions[0] &&
        window.scrollY + theme.HeaderHeight.xl <
          allOptions[0].el.scrollHeight / 2
      ) {
        this.setState({ activeTab: 0 })
      } else if (
        allOptions.length > activeTab &&
        window.scrollHeight <= window.scrollY + this.contentWrapper.clientHeight
      ) {
        this.setState({ activeTab: allOptions.length - 1 })
      }
    }
  }

  throttledFindActiveTab = throttle(this.findActiveTab, 200)

  closeModal = () => {
    this.setState({ isVideoModalVisible: false })
  }

  openModal = () => {
    this.setState({ isVideoModalVisible: true })
  }

  get menuOptions() {
    const { main, advanced, extras, isPremiumUser, isPowerTeacher } = this.props
    if (!isPremiumUser || !isPowerTeacher) {
      return (main || []).concat(extras) || []
    }
    return ((main || []).concat(advanced) || []).concat(extras) || []
  }

  render() {
    const {
      handleAdvancedOpen,
      windowWidth,
      questionTitle,
      isPremiumUser,
      isPowerTeacher,
    } = this.props
    const { activeTab, isVideoModalVisible } = this.state

    return (
      <Menu>
        <ScrollbarContainer height="auto" mb="10px">
          <MainOptions activeTab={activeTab} windowWidth={windowWidth}>
            {this.menuOptions.map((option, index) => (
              <Option
                key={index}
                onClick={(e) => this.handleScroll(option, e)}
                className={`option ${index === activeTab && 'active'}`}
              >
                {option.label}
              </Option>
            ))}
          </MainOptions>
          {!isPowerTeacher && (
            <AdvancedOptionsLink
              handleAdvancedOpen={handleAdvancedOpen}
              isPremiumUser={isPremiumUser}
            />
          )}
        </ScrollbarContainer>
        <VideoThumbnailWapper onClick={this.openModal}>
          <VideoThumbnail
            questionTitle={questionTitle}
            title="How to author video"
            width="100%"
            maxWidth="100%"
            margin="30px 0 0 0"
          />
        </VideoThumbnailWapper>
        <IframeVideoModal
          questionTitle={questionTitle}
          visible={isVideoModalVisible}
          closeModal={this.closeModal}
        />
      </Menu>
    )
  }
}

QuestionMenu.propTypes = {
  main: PropTypes.array,
  advanced: PropTypes.array,
  extras: PropTypes.array,
  advancedAreOpen: PropTypes.bool.isRequired,
  handleAdvancedOpen: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  scrollContainer: PropTypes.object,
  questionTitle: PropTypes.string,
}

QuestionMenu.defaultProps = {
  main: [],
  advanced: [],
  extras: [],
  scrollContainer: null,
  questionTitle: '',
}

export default withTheme(withWindowSizes(QuestionMenu))
export { default as AdvancedOptionsLink } from './AdvancedOptionsLink'

const Menu = styled.div`
  position: fixed;
  width: 230px;
  padding: 50px 0px 30px 0px;
  height: 100%;
`

const ScrollbarContainer = styled(PerfectScrollbar)`
  padding-top: 10px;
  padding-left: 10px;
  height: ${({ height }) => height || ''};
  margin-bottom: ${({ mb }) => mb || ''};
  max-height: ${(props) =>
    `calc(100vh - ${props.theme.HeaderHeight.xs + 110}px)`};
  /* 110px is for top-Bottom padding(60) and breadcrumbs height(50) */

  @media (min-width: ${mediumDesktopExactWidth}) {
    max-height: ${(props) =>
      `calc(100vh - ${props.theme.HeaderHeight.md + 110}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    max-height: ${(props) =>
      `calc(100vh - ${props.theme.HeaderHeight.xl + 110}px)`};
  }
`

const MainOptions = styled.ul`
  position: relative;
  list-style: none;
  padding: 0;
  border-left: 2px solid #b9d5fa;

  &::before {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${themeColor};
    content: '';
    position: absolute;
    left: -7.5px;
    top: -5px;
    z-index: 5;
    transition: 0.2s ease transform, 0.2s ease opacity;
    transform: ${({ activeTab, windowWidth }) => {
      const h = windowWidth >= parseInt(extraDesktopWidthMax, 10) ? 80 : 50
      return `translateY(${activeTab * h}px)`
    }};
  }
`

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
    content: '';
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
`

const VideoThumbnailWapper = styled.div`
  position: relative;
  width: 100%;
`
