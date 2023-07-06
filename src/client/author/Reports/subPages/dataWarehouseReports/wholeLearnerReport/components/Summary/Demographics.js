import React from 'react'
import { DemographicsWrapper } from '../../common/styled'
import DemographicItem from './DemographicItem'

const Demographics = ({ data }) => {
  const {
    race = '',
    gender = '',
    frlStatus,
    ellStatus,
    iepStatus,
    hispanicEthnicity,
  } = data
  return (
    <DemographicsWrapper>
      <div className="demographic-item">
        <span>Race :&nbsp;</span>
        <span data-testid="race">{race}</span>
      </div>
      <div className="demographic-item">
        <span>Gender :&nbsp;</span>
        <span data-testid="gender">{gender}</span>
      </div>
      <DemographicItem type={frlStatus} value="FRL Status" />
      <DemographicItem type={iepStatus} value="IEP Status" />
      <DemographicItem type={ellStatus} value="ELL Status" />
      <DemographicItem type={hispanicEthnicity} value="Hispanic Ethnicity" />
    </DemographicsWrapper>
  )
}

export default Demographics
