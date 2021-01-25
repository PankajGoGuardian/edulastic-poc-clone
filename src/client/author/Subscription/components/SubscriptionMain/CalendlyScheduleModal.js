import { EduButton } from '@edulastic/common'
import React, { useState } from 'react'
import { InlineWidget } from 'react-calendly'
import SelectStates from './SelectStates'
import { CalendlyModal } from './styled'

const CalendlyScheduleModal = ({ visible, setShowSelectStates }) => {
  const [calendlyParams, setCalendlyParams] = useState(null)
  const [isAvailableDatesDisabled, setIsAvailableDatesDisabled] = useState(true)
  const [showCalendlyModal, setShowCalendlyModal] = useState(false)

  const handleAvailableDates = () => {
    if (calendlyParams) {
      setShowCalendlyModal(true)
    }
  }
  const handleCloseCalendlyModal = () => {
    setShowSelectStates(false)
    setShowCalendlyModal(false)
    setIsAvailableDatesDisabled(true)
  }
  return (
    <CalendlyModal
      visible={visible}
      title={showCalendlyModal ? '' : 'Select your state'}
      onCancel={handleCloseCalendlyModal}
      footer={[
        <EduButton
          height="45px"
          onClick={handleAvailableDates}
          disabled={isAvailableDatesDisabled}
        >
          See available dates
        </EduButton>,
      ]}
      centered
      destroyOnClose
      className={showCalendlyModal ? 'schedule' : 'select-state'}
    >
      {showCalendlyModal ? (
        calendlyParams && <InlineWidget url={calendlyParams} />
      ) : (
        <div style={{ margin: '10px 0px 15px' }}>
          <SelectStates
            setCalendlyParams={setCalendlyParams}
            setIsAvailableDatesDisabled={setIsAvailableDatesDisabled}
          />
        </div>
      )}
    </CalendlyModal>
  )
}

export default CalendlyScheduleModal
