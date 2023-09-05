import { smallDesktopWidth, tabletWidth } from '@edulastic/colors'
import { MainHeader, EduButton, FlexContainer } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Row } from 'antd'
import qs from 'qs'
import ClassSelect, { StudentSlectCommon } from '../ClassSelector'
import ShowActiveClass from '../ShowActiveClasses'
import AttemptSelect from './AttemptSelect'
import { getUserDetails } from '../../Login/ducks'

const Header = ({
  t,
  titleText,
  titleSubContent,
  classList,
  attempts,
  classSelect,
  showActiveClass,
  setClassList,
  setShowClass,
  showAllClassesOption = true,
  titleIcon,
  showExit = false,
  showReviewResponses,
  reviewResponses,
  onExit,
  showPerformance,
  setShowPerformance,
  previewModal,
  isCliUser,
  user,
  ...rest
}) => {
  /* for mathia, cliUser param is preserved in search always unlike normal cli user
   * it appears only on initial launch (used to show banner)
   */
  const { cliUser } =
    qs.parse(window.location.search, { ignoreQueryPrefix: true }) || {}
  return (
    <MainHeader
      Icon={titleIcon}
      headingText={titleText}
      headingSubContent={titleSubContent}
      {...rest}
    >
      <Row type="flex" align="middle">
        {!showReviewResponses && <StudentSlectCommon />}
        {classSelect && (
          <ClassSelect
            t={t}
            classList={classList}
            showAllClassesOption={showAllClassesOption}
          />
        )}
        {showActiveClass && (
          <ShowActiveClass
            t={t}
            classList={classList}
            setClassList={setClassList}
            setShowClass={setShowClass}
          />
        )}
        {(attempts.length > 1 || showReviewResponses || previewModal) && (
          <FlexContainer>
            {attempts.length > 1 && <AttemptSelect attempts={attempts} />}
            {showReviewResponses && (
              <EduButton
                data-cy="view-response-in-header"
                onClick={reviewResponses}
                isBlue
              >
                Review Responses
              </EduButton>
            )}
            {showExit && !showReviewResponses && !cliUser && (
              <EduButton
                data-cy="finishTest"
                onClick={() => {
                  if (showPerformance) setShowPerformance(false)
                  else setShowPerformance(true)
                }}
              >
                {showPerformance
                  ? 'Test Activity Preview'
                  : 'Check Performance'}
              </EduButton>
            )}
            {showExit && !showReviewResponses && !cliUser && (
              <EduButton data-cy="finishTest" onClick={onExit}>
                EXIT
              </EduButton>
            )}
          </FlexContainer>
        )}
      </Row>
    </MainHeader>
  )
}

Header.propTypes = {
  t: PropTypes.func.isRequired,
  titleText: PropTypes.string.isRequired,
  classSelect: PropTypes.bool.isRequired,
  showActiveClass: PropTypes.bool.isRequired,
  onExit: PropTypes.func,
  reviewResponses: PropTypes.func,
  attempts: PropTypes.array,
}

Header.defaultProps = {
  onExit: () => null,
  reviewResponses: () => null,
  attempts: [],
}

const enhance = compose(
  memo,
  withNamespaces('header'),
  connect(
    (state) => ({
      isCliUser: get(state, 'user.isCliUser', false),
      user: getUserDetails(state),
    }),
    null
  )
)

export default enhance(Header)

export const AssignmentTitle = styled.div`
  font-family: Open Sans;
  font-size: ${(props) => props.theme.header.headerTitleFontSize};
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.header.headerTitleTextColor};
  @media screen and (max-width: ${smallDesktopWidth}) {
    font-size: ${(props) => props.theme.titleSecondarySectionFontSize};
  }
  @media screen and (max-width: ${tabletWidth}) {
    padding-left: 0;
  }
`
