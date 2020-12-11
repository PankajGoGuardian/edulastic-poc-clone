import React, { useState, useEffect } from 'react'
import Button from "antd/es/Button";
import Select from "antd/es/Select";
import Spin from "antd/es/Spin";
import { CheckboxLabel, EduButton, notification } from '@edulastic/common'
import styled from 'styled-components'
import {
  backgroundGrey2,
  black,
  green,
  themeColorTagsBg,
} from '@edulastic/colors'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'

const CanvasSyncModal = ({
  visible,
  handleCancel,
  syncClassLoading,
  getCanvasCourseListRequest,
  getCanvasSectionListRequest,
  canvasCourseList,
  canvasSectionList,
  syncClassWithCanvas,
  canvasCode,
  canvasCourseSectionCode,
  user,
  groupId,
  institutionId,
  isFetchingCanvasData,
  syncCanvasCoTeacher,
}) => {
  const [course, setCourse] = useState(canvasCode)
  const [section, setSection] = useState(canvasCourseSectionCode)
  const [coTeacherFlag, setCoTeacherFlag] = useState(syncCanvasCoTeacher)
  const [isDisabled, setIsDisabled] = useState(
    !!canvasCode && !!canvasCourseSectionCode
  )

  // filter already synced canvas sections
  const activeCanvasClassSectionCode = user?.orgData?.classList
    .filter(
      (o) =>
        o.active === 1 &&
        o.canvasCourseSectionCode &&
        `${o._id}` !== `${groupId}` &&
        `${o.canvasCode}` === `${course}`
    )
    .map((o) => `${o.canvasCourseSectionCode}`)
  canvasSectionList = canvasSectionList.filter(
    (o) =>
      !activeCanvasClassSectionCode.includes(`${o.id}`) &&
      `${o.course_id}` === `${course}`
  )
  const isSyncDisabled =
    isFetchingCanvasData ||
    !canvasCourseList?.length ||
    !canvasSectionList?.length

  useEffect(() => {
    if (institutionId) {
      canvasCourseList = []
      getCanvasCourseListRequest(institutionId)
    }
  }, [institutionId])

  useEffect(() => {
    if (canvasCourseList.length && institutionId) {
      getCanvasSectionListRequest({ allCourseIds: [course], institutionId })
    }
  }, [canvasCourseList])

  const handleCourseChange = (value) => {
    getCanvasSectionListRequest({ institutionId, allCourseIds: [value] })
    setCourse(value)
    setSection('')
    setCoTeacherFlag(false)
  }

  useEffect(() => {
    if (!course && canvasCourseList.length)
      handleCourseChange(canvasCourseList[0].id)
  }, [canvasCourseList])

  useEffect(() => {
    if (!section) {
      setSection(canvasSectionList?.[0]?.id || undefined)
    }
  }, [canvasSectionList])

  const onCoTeacherChange = ({ target }) => {
    setCoTeacherFlag(target.checked)
  }

  const handleSync = () => {
    if (!course || !section) {
      return notification({ msg: 'bothCourseandSectionRequired' })
    }

    const {
      id: canvasCourseCode,
      name: canvasCourseName,
    } = canvasCourseList.find(({ id }) => id === course)

    const selectedSectionDetails = canvasSectionList.find(
      ({ id }) => id === section
    )
    if (!selectedSectionDetails) {
      return notification({ msg: 'bothCourseandSectionRequired' })
    }

    const { id: sectionId, name: sectionName } = selectedSectionDetails

    const data = {
      userId: user._id,
      groupId,
      canvasCourseCode,
      canvasCourseName,
      sectionId,
      sectionName,
      institutionId,
      districtId: user?.districtIds?.[0],
      syncCanvasCoTeacher: coTeacherFlag,
    }
    syncClassWithCanvas(data)
  }

  const Title = <h4>Select Canvas Course & Section</h4>
  const Footer = [
    ...(!!canvasCode && !!canvasCourseSectionCode
      ? [
          // eslint-disable-next-line react/jsx-indent
          <Button
            disabled={syncClassLoading}
            onClick={() => setIsDisabled(false)}
          >
            Change Details
          </Button>,
        ]
      : []),
    <EduButton disabled={syncClassLoading} isGhost onClick={handleCancel}>
      Cancel
    </EduButton>,
    <EduButton
      type="primary"
      disabled={isSyncDisabled}
      loading={syncClassLoading}
      onClick={handleSync}
    >
      {syncClassLoading ? 'Syncing...' : 'Sync'}
    </EduButton>,
  ]

  return (
    <StyledModal
      visible={visible}
      title={Title}
      footer={Footer}
      centered
      onCancel={handleCancel}
    >
      {isFetchingCanvasData && <Spin />}
      <FieldWrapper>
        <label>Course</label>
        <Select
          placeholder="Select a Course"
          value={+course || undefined}
          onChange={handleCourseChange}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          disabled={isDisabled}
        >
          {canvasCourseList.map((c) => (
            <Select.Option key={c.id} value={+c.id}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
      </FieldWrapper>
      <FieldWrapper>
        <label>Section</label>
        <Select
          placeholder="Select a Section"
          value={+section || undefined}
          onChange={(value) => {
            setSection(value)
          }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          disabled={isDisabled}
          notFoundContent={
            activeCanvasClassSectionCode?.length ? (
              <div style={{ color: black }}>
                No new Canvas Section available to sync
              </div>
            ) : undefined
          }
        >
          {canvasSectionList.map((s) => (
            <Select.Option key={s.id} value={+s.id}>
              {s.name}
            </Select.Option>
          ))}
        </Select>
      </FieldWrapper>
      <CheckboxLabel
        style={{ margin: '10px 0px 20px 0px' }}
        checked={coTeacherFlag}
        onChange={onCoTeacherChange}
        disabled={isDisabled}
      >
        Enroll Co-Teacher (All teachers present in Canvas class will share the
        same class)
      </CheckboxLabel>
    </StyledModal>
  )
}

export default CanvasSyncModal

const StyledModal = styled(ConfirmationModal)`
  .ant-modal-content {
    .ant-modal-header {
      padding-bottom: 5px;
      h4 {
        font-weight: ${({ theme }) => theme.semiBold};
      }
    }
    .ant-modal-body {
      display: block;
    }
  }
`

const FieldWrapper = styled.div`
  display: block;
  margin-bottom: 10px;
  label {
    display: block;
    margin-bottom: 5px;
    text-align: left;
    text-transform: uppercase;
    font-size: ${({ theme }) => theme.smallFontSize};
    font-weight: ${({ theme }) => theme.semiBold};
  }
  .ant-select {
    width: 100%;
    .ant-select-selection {
      background: ${backgroundGrey2};
      border-radius: 2px;
      .ant-select-selection__rendered {
        min-height: 35px;
        line-height: 35px;
        font-weight: 500;
        .ant-select-selection__choice {
          background: ${themeColorTagsBg};
          color: ${green};
          font-size: ${({ theme }) => theme.smallFontSize};
          font-weight: ${({ theme }) => theme.semiBold};
        }
      }
    }
  }
`
