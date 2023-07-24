import React from 'react'
<<<<<<< HEAD
=======
import { capitalize } from 'lodash'
>>>>>>> edulasticv2-e34.1.0
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
<<<<<<< HEAD
        <span>Race :&nbsp;</span>
        <span data-testid="race">{race}</span>
      </div>
      <div className="demographic-item">
        <span>Gender :&nbsp;</span>
        <span data-testid="gender">{gender}</span>
=======
        <span>DEMOGRAPHICS</span>
      </div>
      <div className="demographic-item">
        <span className="title">Race :&nbsp;</span>
        <span data-testid="race">{race}</span>
      </div>
      <div className="demographic-item">
        <span className="title">Gender :&nbsp;</span>
        <span data-testid="gender">{capitalize(gender)}</span>
>>>>>>> edulasticv2-e34.1.0
      </div>
      <DemographicItem type={frlStatus} value="FRL Status" />
      <DemographicItem type={iepStatus} value="IEP Status" />
      <DemographicItem type={ellStatus} value="ELL Status" />
      <DemographicItem type={hispanicEthnicity} value="Hispanic Ethnicity" />
    </DemographicsWrapper>
  )
}

export default Demographics
