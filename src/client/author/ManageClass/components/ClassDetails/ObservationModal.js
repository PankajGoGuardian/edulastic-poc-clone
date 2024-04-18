import React from 'react'
import Observations from '../../../Reports/subPages/dataWarehouseReports/wholeLearnerReport/components/WLRDetails/Observation/Observations'
import { StyledObservationModal, ObservationContainer } from './styled'

function ObservationModal(props) {
  const { visible, onClose, data, selectedStudent, termId } = props

  return (
    <StyledObservationModal
      title="Observations"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      modalWidth="700px"
      modalMinHeight="660px"
    >
      <ObservationContainer>
        <Observations
          studentId={selectedStudent._id}
          termId={termId}
          studentData={selectedStudent}
          data={data}
          isModal
        />
      </ObservationContainer>
    </StyledObservationModal>
  )
}

export default ObservationModal
