import PropTypes from 'prop-types'
import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { withKeyboard } from '@edulastic/common'
import { IconGraphRightArrow } from '@edulastic/icons'
import { smallDesktopWidth } from '@edulastic/colors'
import FlexContainer from '../common/FlexContainer'
import Circle from '../common/Circle'
import { getDisabledQuestionDropDownIndexMapSelector } from '../../selectors/test'

const SidebarQuestionList = ({
  questions,
  selectedQuestion,
  gotoQuestion,
  t,
  isSidebarVisible,
  toggleSideBar,
  blockNavigationToAnsweredQuestions,
  disabledQuestionDropDownIndexMap,
}) => (
  <SidebarWrapper>
    <MinimizeButton onClick={toggleSideBar} minimized={isSidebarVisible}>
      <IconGraphRightArrow />
    </MinimizeButton>
    {isSidebarVisible && (
      <Title>{t('common.layout.questionlist.heading')} </Title>
    )}
    {isSidebarVisible && (
      <Questions>
        <PerfectScrollbar style={{ paddingTop: '2px' }}>
          {questions.map((item, index) => {
            const active = selectedQuestion === index
            return (
              <ItemContainer
                active={active}
                key={index}
                onClick={() => {
                  if (
                    blockNavigationToAnsweredQuestions ||
                    disabledQuestionDropDownIndexMap[item]
                  )
                    return
                  gotoQuestion(index)
                }}
              >
                <FlexContainer alignItems="center" justifyContent="center">
                  <Circle
                    data-cy={`queCircle-${index + 1}`}
                    data-test={active}
                    r={6}
                    active={active}
                  />
                  <Content
                    active={active}
                    disableClickEvents={
                      blockNavigationToAnsweredQuestions ||
                      disabledQuestionDropDownIndexMap[item]
                    }
                  >
                    {t('common.layout.questionlist.question')} {index + 1}
                  </Content>
                </FlexContainer>
              </ItemContainer>
            )
          })}
        </PerfectScrollbar>
      </Questions>
    )}
  </SidebarWrapper>
)

SidebarQuestionList.propTypes = {
  gotoQuestion: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

const enhance = compose(
  withNamespaces('student'),
  connect((state) => ({
    // Direct subscribe to disabled item index maps for disabling sidebar menu in practice player
    disabledQuestionDropDownIndexMap: getDisabledQuestionDropDownIndexMapSelector(
      state
    ),
  }))
)

export default enhance(SidebarQuestionList)

const ItemContainer = withKeyboard(styled.div`
  border-left: solid 5px
    ${(props) =>
      props.active
        ? props.theme.widgets.assessmentPlayers.sidebarContentBorderColor
        : 'transparent'};
  padding: 18px 35px;
  width: 100%;
  box-sizing: border-box;
  background: ${(props) =>
    props.active
      ? props.theme.widgets.assessmentPlayers.sidebarContentBackgroundColor
      : 'transparent'};
`)

const Content = styled.div`
  color: ${(props) =>
    props.active
      ? props.theme.widgets.assessmentPlayers.sidebarActiveTextColor
      : props.theme.widgets.assessmentPlayers.sidebarTextColor};
  font-size: ${(props) =>
    props.theme.widgets.assessmentPlayerSimple.sidebarFontSize};
  line-height: 1;
  letter-spacing: 0.2px;
  text-transform: capitalize;
  cursor: ${({ disableClickEvents }) =>
    disableClickEvents ? 'not-allowed' : 'pointer'};

  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${(props) => props.theme.linkFontSize};
    line-height: 10px;
  }
`

const SidebarWrapper = styled.div`
  position: relative;
  padding-top: 20px;
`

const Title = styled(Content)`
  text-transform: uppercase;
  text-align: center;
  font-size: 15px;
`

export const MinimizeButton = styled.div`
  position: absolute;
  top: 0px;
  right: ${({ minimized }) => (minimized ? '-15px' : '-25px')};
  padding: 9px;
  z-index: 10;
  background: ${(props) =>
    props.theme.widgets.assessmentPlayers.sidebarContentBackgroundColor};
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: left 300ms ease-in-out;

  svg {
    fill: ${(props) =>
      props.theme.widgets.assessmentPlayers.sidebarActiveTextColor};
    transform: rotate(${({ minimized }) => (!minimized ? 0 : '-180deg')});
    transition: transform 300ms ease-in-out;

    &:hover,
    &:active,
    &:focus {
      fill: ${(props) =>
        props.theme.widgets.assessmentPlayers.sidebarActiveTextColor};
    }
  }
`

const Questions = styled.div`
  height: 87vh;
  overflow: auto;
  margin-top: 20px;
`
