import {
  borderGrey,
  extraDesktopWidth,
  greyThemeLighter,
  themeColor,
} from '@edulastic/colors'
import {
  CustomModalStyled,
  EduButton,
  EduIf,
  EduSwitchStyled,
  RadioBtn,
  RadioGrp,
} from '@edulastic/common'
import {
  releaseGradeLabels,
  releaseGradeTypes,
} from '@edulastic/constants/const/test'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DatePicker, Icon, Row } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { getUserFeatures } from '../../../../student/Login/ducks'
import {
  bulkUpdateAssignmentSettingsAction,
  setBulkUpdateAssignmentSettingState,
} from '../../../src/actions/assignments'
import { getBulkUpdateAssignmentSettingsCallStateSelector } from '../../../src/selectors/assignments'

const VIEWS = {
  CLOSE_DATE: 'CLOSE DATE',
  RELEASE_SCORE_POLICY: 'RELEASE SCORE POLICY',
  ALLOW_TEACHER_REDIRECT: 'ALLOW TEACHER REDIRECT',
}

const disableDate = (current) => current && current.valueOf() < Date.now()

const BulkEditTestModal = ({
  visible,
  toggleModal,
  selectedRows,
  features,
  bulkUpdateAssignmentSettings,
  apiCallStatus,
  setAPICallStatus,
}) => {
  const [selectedView, setSelectedView] = useState()
  const [data, setData] = useState({})

  let releaseGradeKeys = Object.values(releaseGradeLabels)
  if (!features?.assessmentSuperPowersReleaseScorePremium) {
    releaseGradeKeys = [
      releaseGradeLabels.DONT_RELEASE,
      releaseGradeLabels.WITH_RESPONSE,
    ]
  }

  const handleUpdate = () => {
    const tests = selectedRows?.map(({ itemId: testId, testType }) => ({
      testId,
      testType,
    }))

    const updateData = {
      tests,
    }

    if (selectedView === VIEWS.CLOSE_DATE) {
      updateData.endDate = data.endDate
    } else if (selectedView === VIEWS.RELEASE_SCORE_POLICY) {
      updateData.releaseScore = data.releaseScore
    } else if (selectedView === VIEWS.ALLOW_TEACHER_REDIRECT) {
      updateData.allowTeacherRedirect = !!data.allowTeacherRedirect
    }

    bulkUpdateAssignmentSettings(updateData)
  }

  const loading = apiCallStatus === 'INITIATED'

  useEffect(() => {
    if (apiCallStatus && !loading) {
      setAPICallStatus(false)
      toggleModal()
    }
  }, [apiCallStatus])

  useEffect(() => {
    if (apiCallStatus) {
      setAPICallStatus(false)
    }
  }, [])

  return (
    <StyledModal
      centered
      minWidth="614px"
      visible={visible}
      onCancel={toggleModal}
      title={
        <div>
          Bulk Update
          <p style={{ fontSize: '12px' }}>
            Select the option that need to be updated for the selected tests.
          </p>
        </div>
      }
      destroyOnClose
      footer={[
        <EduButton
          disabled={loading}
          isGhost
          key="cancel"
          onClick={toggleModal}
        >
          CANCEL
        </EduButton>,
        <EduButton
          disabled={loading}
          data-cy="update"
          key="update"
          onClick={handleUpdate}
        >
          Update
          <EduIf condition={loading}>
            <Icon type="loading" spin />
          </EduIf>
        </EduButton>,
      ]}
    >
      <RadioGrp
        value={selectedView}
        onChange={(e) => setSelectedView(e.target.value)}
      >
        {Object.values(VIEWS).map((item) => (
          <RadioBtn
            style={{ marginTop: '10px' }}
            data-cy={item}
            value={item}
            key={item}
          >
            {item}
          </RadioBtn>
        ))}
      </RadioGrp>
      <br />
      <br />
      <EduIf condition={selectedView === VIEWS.CLOSE_DATE}>
        <div>
          <Label>Close Date</Label>
        </div>
        <StyledDatePicker
          allowClear={false}
          style={{ width: '100%' }}
          size="large"
          showTime={{ use12Hours: true, format: 'hh:mm a' }}
          format="YYYY-MM-DD hh:mm a"
          value={moment(data.endDate)}
          disabledDate={disableDate}
          placeholder="Close Date"
          showToday={false}
          onChange={(value) =>
            setData({ ...data, endDate: moment(value).valueOf() })
          }
        />
        <Info>
          <StyledFontAwesomeIcon icon={faInfoCircle} aria-hidden="true" />
          <InfoText>
            Close Date will not be applied to assignments that are already
            closed or have a close policy as close by admin or teacher.
          </InfoText>
        </Info>
      </EduIf>
      <EduIf condition={selectedView === VIEWS.RELEASE_SCORE_POLICY}>
        <div>
          <Label>Release Score Policy</Label>
        </div>
        <RadioGrp
          value={data.releaseScore}
          onChange={(e) => setData({ ...data, releaseScore: e.target.value })}
        >
          {releaseGradeKeys.map((item, index) => (
            <Row key={index} style={{ marginBottom: '5px' }}>
              <RadioBtn
                style={{ marginTop: '10px' }}
                data-cy={item}
                value={item}
                key={item}
              >
                {releaseGradeTypes[item]}
              </RadioBtn>
            </Row>
          ))}
        </RadioGrp>
        {!!data.releaseScore &&
          (data.releaseScore === releaseGradeLabels.DONT_RELEASE ? (
            <Info>
              <StyledFontAwesomeIcon icon={faInfoCircle} aria-hidden="true" />
              <InfoText>
                This setting will be retained and the scores will not be
                released to the students.
              </InfoText>
            </Info>
          ) : (
            <Info>
              <StyledFontAwesomeIcon icon={faInfoCircle} aria-hidden="true" />
              <InfoText>
                This setting will be retained and scores will be released
                automatically when students complete the assignment.
              </InfoText>
            </Info>
          ))}
      </EduIf>
      <EduIf condition={selectedView === VIEWS.ALLOW_TEACHER_REDIRECT}>
        <Label>Allow Teachers to Redirect</Label>{' '}
        <CustomEduSwitchStyled
          size="large"
          disabled={!features.premium}
          checked={data.allowTeacherRedirect}
          onChange={(value) =>
            setData({ ...data, allowTeacherRedirect: value })
          }
        />
      </EduIf>
    </StyledModal>
  )
}

export default connect(
  (state) => ({
    features: getUserFeatures(state),
    apiCallStatus: getBulkUpdateAssignmentSettingsCallStateSelector(state),
  }),
  {
    setAPICallStatus: setBulkUpdateAssignmentSettingState,
    bulkUpdateAssignmentSettings: bulkUpdateAssignmentSettingsAction,
  }
)(BulkEditTestModal)

export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-left: 2px;
`

export const StyledModal = styled(CustomModalStyled)`
  @media (min-width: ${extraDesktopWidth}) {
    min-width: 750px !important;
  }
`
export const StyledDatePicker = styled(DatePicker)`
  .ant-calendar-picker-input {
    background: ${greyThemeLighter};
    border: 1px #e1e1e1 solid;
    font-size: ${borderGrey};
  }
  svg {
    fill: ${themeColor};
  }
`

export const Info = styled.div`
  display: flex;
  font-weight: bold;
  margin-top: 12px;
`

export const InfoText = styled.span`
  margin-left: 22px;
`

export const Label = styled.label`
  width: 100%;
  font-weight: bold;
`

export const CustomEduSwitchStyled = styled(EduSwitchStyled)`
  width: 46px;
`
