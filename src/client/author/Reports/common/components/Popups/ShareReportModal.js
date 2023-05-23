import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { Row, Col, Input } from 'antd'
import { CustomModalStyled, EduButton, notification } from '@edulastic/common'
import { report } from '@edulastic/constants'
import { themeColor, lightGreySecondary, red } from '@edulastic/colors'
import { MultipleSelect } from '../widgets/MultipleSelect'

import {
  getCollaborativeGroupList,
  shareReportAction,
} from '../../../components/sharedReports/ducks'

const ShareReportModal = ({
  reportType,
  reportFilters,
  showDemographicFilterWarning = false,
  showModal,
  setShowModal,
  collaborativeGroups,
  shareReport,
  sharedWithType = report.sharedWithType.COLLABORATION_GROUP,
}) => {
  const dropdownData =
    sharedWithType === report.sharedWithType.COLLABORATION_GROUP
      ? collaborativeGroups.map(({ _id: key, name: title }) => ({
          key,
          title,
        }))
      : []

  const [sharedReportTitle, setSharedReportTitle] = useState('')
  const [selected, setSelected] = useState([])

  const onSelect = (item) => {
    const filteredSelected = selected.filter((o) => o.key !== item.key)
    if (!item.key) {
      setSelected([])
    } else if (filteredSelected.length === selected.length) {
      setSelected([...selected, item])
    } else {
      setSelected(filteredSelected)
    }
  }

  const handleOnSubmit = () => {
    if (!sharedReportTitle) {
      // notify about empty shareTitle
      notification({ type: 'warn', msg: 'Title cannot be empty' })
    } else if (!selected.length) {
      // notify about empty selected items
      notification({ type: 'warn', msg: 'Select group(s) to share' })
    } else {
      const sharedWith = selected.map(({ key: _id, title: name }) => ({
        _id,
        name,
        type: sharedWithType,
      }))
      shareReport({
        title: sharedReportTitle,
        reportType,
        filters: reportFilters,
        sharedWith,
      })
      setShowModal(false)
    }
  }

  const hasCollaborationGroups = !!dropdownData.length
  const shownWithNoGroups = !hasCollaborationGroups && showModal
  useEffect(() => {
    if (shownWithNoGroups) {
      notification({
        type: 'warn',
        msg: 'Collaboration groups are empty. Create one to continue...',
      })
      setShowModal(false)
    }
  }, [shownWithNoGroups])

  if (!hasCollaborationGroups) {
    return null
  }

  return (
    <CustomModalStyled
      centered
      title="Share Report"
      visible={showModal}
      onCancel={() => setShowModal(false)}
      footer={[
        <EduButton
          isGhost
          data-cy="cancel"
          key="back"
          variant="create"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </EduButton>,
        <EduButton
          data-cy="submit"
          key="submit"
          color="primary"
          variant="create"
          disabled={!selected.length}
          onClick={handleOnSubmit}
        >
          Share Report
        </EduButton>,
      ]}
    >
      <Row type="flex" width="100%" align="middle" gutter={[10, 10]}>
        <Col span={6}>Report Name</Col>
        <Col span={18}>
          <Input
            value={sharedReportTitle}
            placeholder="Provide a name for the shared report (upto 50 characters)"
            maxLength={50}
            onChange={(e) => setSharedReportTitle(e.target.value)}
          />
        </Col>
        <Col span={24}>
          <DropdownContainer>
            <MultipleSelect
              containerClassName="share-report-multiselect"
              data={dropdownData}
              by={selected}
              valueToDisplay={selected}
              prefix="Collaboration Group"
              onSelect={onSelect}
              placeholder="Select group(s) to share"
              dropdownStyle={{ zIndex: '1025' }}
            />
          </DropdownContainer>
          {showDemographicFilterWarning && (
            <InfoText>
              * Please note demographics filters will not be shared.
            </InfoText>
          )}
        </Col>
      </Row>
    </CustomModalStyled>
  )
}

const enhance = connect(
  (state) => ({
    collaborativeGroups: getCollaborativeGroupList(state),
  }),
  {
    shareReport: shareReportAction,
  }
)

export default enhance(ShareReportModal)

const DropdownContainer = styled.div`
  .ant-select-selection {
    &__rendered {
      padding-left: 0px;
    }
  }

  .ant-select {
    min-width: 100%;
    font-size: 11px;
  }

  .ant-input-affix-wrapper .ant-input-suffix {
    right: 8px;
    i {
      svg {
        color: ${themeColor};
      }
    }
  }

  .control-dropdown {
    button {
      background-color: ${lightGreySecondary};
      border-radius: 3px;
      padding: 8.5px 18px;
      padding-right: 8px;
      height: 34px;
      font-size: 11px;
      font-weight: 600;
      max-width: 100%;
      width: 100%;

      i {
        color: ${themeColor};
      }
    }
  }
`
const InfoText = styled.span`
  display: block;
  color: ${red};
  margin: 10px 0px 0px 0px;
`
