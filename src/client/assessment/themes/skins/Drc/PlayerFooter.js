import { IconDrc } from '@edulastic/icons'
import React from 'react'
import { withNamespaces } from '@edulastic/localization'
import { keyboard as keyboardConst } from '@edulastic/constants'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import { withWindowSizes } from '@edulastic/common'
import { Tooltip } from 'antd'
import { setSettingsModalVisibilityAction } from '../../../../student/Sidebar/ducks'
import { themes } from '../../../../theme'
import { Container, ControlBtn } from './styled'
import { useUtaPauseAllowed } from '../../common/SaveAndExit'

const {
  playerSkin: { drc },
} = themes

const { footer } = drc

const PlayerFooter = ({
  blockNavigationToAnsweredQuestions,
  defaultAP,
  toggleBookmark,
  currentItem,
  items,
  isBookmarked,
  t,
  LCBPreviewModal,
  isDocbased,
  finishTest,
  utaId,
  hidePause,
  overlayStyle,
  moveToPrev,
  moveToNext,
  setSettingsModalVisibility,
  handleReviewOrSubmit,
  isPremiumContentWithoutAccess = false,
}) => {
  const isFirst = () => (isDocbased ? true : currentItem === 0)
  const isLast = () => currentItem === items.length - 1

  const _pauseAllowed = useUtaPauseAllowed(utaId)
  const showPause = _pauseAllowed === undefined ? true : _pauseAllowed
  return (
    <MainFooter isSidebarVisible className="drc-player-footer">
      <Container>
        {!isDocbased && (
          <Tooltip
            placement="top"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            title={t('common.test.reviewOrEnd')}
          >
            <ButtonWrapper
              isPrimary={false}
              data-cy="submit"
              aria-label="Review/End Test"
              onClick={handleReviewOrSubmit}
            >
              <span>{t('common.test.reviewOrEnd')}</span>
            </ButtonWrapper>
          </Tooltip>
        )}
        {showPause && (
          <Tooltip
            placement="top"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            title={
              hidePause
                ? `${t('common.test.pause')} disabled`
                : t('common.test.pause')
            }
          >
            <ButtonWrapper
              data-cy="finishTest"
              aria-label="Pause and exit test"
              onClick={() => {
                if (hidePause) {
                  return
                }
                finishTest()
              }}
              disabled={hidePause}
              isPrimary
            >
              {t('common.test.pause')}
            </ButtonWrapper>
          </Tooltip>
        )}

        {!blockNavigationToAnsweredQuestions && (
          <Tooltip
            placement="top"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            title={t('common.test.flag')}
          >
            <ButtonWrapper
              disabled={isPremiumContentWithoutAccess}
              isPrimary
              active={isBookmarked}
              onClick={
                !isPremiumContentWithoutAccess &&
                (defaultAP
                  ? toggleBookmark
                  : () => toggleBookmark(items[currentItem]?._id))
              }
              data-cy="bookmark"
              aria-label="Bookmark question"
            >
              {t('common.test.flag')}
            </ButtonWrapper>
          </Tooltip>
        )}

        {!LCBPreviewModal && (
          <Tooltip
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placement="bottom"
            title="Options"
          >
            <ButtonWrapper
              isPrimary
              data-cy="testOptions"
              onClick={() => setSettingsModalVisibility(true)}
              aria-label="Test options"
            >
              options
            </ButtonWrapper>
          </Tooltip>
        )}
      </Container>

      <RightContent>
        <Tooltip
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          placement="top"
          title={
            blockNavigationToAnsweredQuestions
              ? 'This assignment is restricted from navigating back to the previous question.'
              : 'Previous'
          }
          overlayStyle={overlayStyle}
        >
          <ControlBtn
            data-cy="prev"
            aria-label="Previous question"
            icon="left"
            type="primary"
            disabled={isFirst() || blockNavigationToAnsweredQuestions}
            onClick={(e) => {
              moveToPrev()
              e.target.blur()
            }}
            // added separate keydown event handler to restrict calling on blur event for keyboard event
            onKeyDown={(e) => {
              const code = e.which || e.keyCode
              if (code !== 9) e.preventDefault()
              if (
                [keyboardConst.ENTER_KEY, keyboardConst.SPACE_KEY].includes(
                  code
                )
              )
                moveToPrev()
            }}
          >
            <IconDrc.IconPrevious />
          </ControlBtn>
        </Tooltip>
        <Tooltip
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          placement="top"
          title="Next"
          overlayStyle={overlayStyle}
        >
          <ControlBtn
            data-cy="next"
            aria-label={isLast() ? 'Submit test' : 'Next question'}
            type="primary"
            icon="right"
            onClick={(e) => {
              moveToNext()
              e.target.blur()
            }}
            // added separate keydown event handler to restrict calling on blur event for keyboard event
            onKeyDown={(e) => {
              const code = e.which || e.keyCode
              if (code !== keyboardConst.TAB_KEY) e.preventDefault()
              if (
                [keyboardConst.ENTER_KEY, keyboardConst.SPACE_KEY].includes(
                  code
                )
              )
                moveToNext()
            }}
            style={{ marginLeft: '5px' }}
          >
            <IconDrc.IconNext
              style={{ marginRight: '10px' }}
              aria-hidden="true"
            />
            <span>{isLast() ? 'SUBMIT' : 'NEXT'}</span>
          </ControlBtn>
        </Tooltip>
      </RightContent>
    </MainFooter>
  )
}

const enhance = compose(
  withNamespaces('student'),
  withWindowSizes,
  connect(null, {
    setSettingsModalVisibility: setSettingsModalVisibilityAction,
  })
)

export default enhance(PlayerFooter)

const MainFooter = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  display: flex;
  padding: 0 15px 0 50px;
  z-index: 50;
  background: ${footer.background};
  border-top: 1px solid ${footer.border};
  color: ${footer.textColor};
  font-size: 13px;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`

const ButtonWrapper = styled.span.attrs({
  role: 'button',
})`
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: ${(props) =>
    props.isPrimary && !props.active
      ? `1px solid ${footer.textColor}`
      : `1px solid ${footer.background}`};
  margin-right: ${(props) => (props.isPrimary ? '5px' : '20px')};
  background: ${(props) =>
    props.isPrimary && !props.active ? footer.background : footer.textColor};
  color: ${(props) =>
    props.isPrimary && !props.active ? footer.textColor : footer.background};
  padding: 7px 20px;
  font-size: 10px;
  text-transform: uppercase;
  ${(props) =>
    !props.disabled
      ? `
    :hover {
      border: ${
        props.isPrimary
          ? `1px solid ${footer.background}`
          : `1px solid ${footer.textColor}`
      };
      background: ${props.isPrimary ? footer.textColor : footer.background};
      color: ${props.isPrimary ? footer.background : footer.textColor};
    }
  `
      : `
    opacity: 0.5; 
    cursor: default;
  `}
`

const RightContent = styled.div`
  display: flex;
  align-items: center;
`
