import React, { useMemo } from 'react'
import { Spin, Tooltip } from 'antd'
import { IconInfo } from '@edulastic/icons'
import { get } from 'lodash'
import MasteryTable from './MasteryTable'
import { Spacer } from '../../../../../../../../common/styled'
import SectionLabel from '../../../../../../common/components/SectionLabel'
import LabelledControlDropdown from '../../../../common/components/LabelledControlDropdown'

const MasteryReportSection = (props) => {
  const { SPRFFilterData, selectedScale, setSelectedScale, loading } = props
  const { scaleInfo: scales } = get(SPRFFilterData, 'data.result', {})
  const scaleOptions = useMemo(
    () => (scales || []).map((s) => ({ key: s._id, title: s.name })),
    [scales]
  )
  const selectedScaleOption = useMemo(
    () => scaleOptions.find((s) => s.key === selectedScale._id),
    [scaleOptions, selectedScale]
  )
  const onSelectScale = (_, selected) => {
    setSelectedScale((scales || []).find((s) => s._id === selected.key))
  }

  return (
    <>
      <SectionLabel
        $margin="32px 0 59px 0"
        style={{ fontSize: '18px' }}
        wrapperStyle={{ alignItems: 'flex-end' }}
        sectionLabelFilters={
          <LabelledControlDropdown
            dataCy="standardsProficiency"
            label="Standard Proficiency"
            by={selectedScaleOption}
            selectCB={onSelectScale}
            data={scaleOptions}
            showPrefix={false}
          />
        }
        separator={<Spacer />}
      >
        Understand how the student is performing across domains and standards
        for Edulastic Tests &nbsp;
        <Tooltip title="Standard mastery data is currently supported for Edulastic Tests only.">
          <IconInfo />
        </Tooltip>
      </SectionLabel>
      <Spin spinning={loading}>
        <MasteryTable {...props} />
      </Spin>
    </>
  )
}

export default MasteryReportSection
