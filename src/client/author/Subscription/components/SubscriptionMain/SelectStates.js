import React from 'react'
import { SelectInputStyled } from '../../../../assessment/styled/InputStyles'

const SelectStates = ({ setIsAvailableDatesDisabled, setCalendlyParams }) => {
  const map = {
    'Select State': 0,
    Alabama: 1,
    Alaska: 2,
    Arizona: 1,
    Arkansas: 2,
    California: 1,
    Colorado: 4,
    Connecticut: 5,
    Delaware: 2,
    'District of Columbia': 2,
    Florida: 6,
    Georgia: 6,
    Hawaii: 1,
    Idaho: 4,
    Illinois: 3,
    Indiana: 3,
    Iowa: 2,
    Kansas: 2,
    Kentucky: 2,
    Louisiana: 1,
    Maine: 5,
    Maryland: 2,
    Massachusetts: 5,
    Michigan: 3,
    Minnesota: 2,
    Mississippi: 1,
    Missouri: 3,
    Montana: 4,
    Nebraska: 2,
    Nevada: 4,
    'New Hampshire': 5,
    'New Jersey': 5,
    'New Mexico': 1,
    'New York': 5,
    'North Carolina': 2,
    'North Dakota': 2,
    Ohio: 6,
    Oklahoma: 2,
    Oregon: 6,
    Pennsylvania: 5,
    'Rhode Island': 5,
    'South Carolina': 2,
    'South Dakota': 2,
    Tennessee: 2,
    Texas: 1,
    Utah: 4,
    Vermont: 5,
    Virginia: 6,
    Washington: 6,
    'West Virginia': 2,
    Wisconsin: 3,
    Wyoming: 4,
    International: 4,
  }

  const stateList = Object.keys(map)

  const repObj = {
    1: 'johnrkyte',
    2: 'jeff-peterson',
    3: 'melissa-rocco',
    4: 'partnership-team-west',
    5: 'jill-macauley',
    6: 'charlenedavies',
  }

  const handleStateChange = (name) => {
    const value = map[name]
    if (value) {
      const calendlyParams = `https://calendly.com/${repObj[value]}/edulastic-walkthrough?utm_source=web&utm_campaign=hp`
      setCalendlyParams(calendlyParams)
    }
    setIsAvailableDatesDisabled(true)
    if (name && name !== 'Select State') {
      setIsAvailableDatesDisabled(false)
    }
  }

  return (
    <SelectInputStyled
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      defaultValue="Select State"
    >
      {stateList.map((state, index) => (
        <SelectInputStyled.Option
          key={index}
          value={state}
          onClick={() => handleStateChange(state)}
        >
          {state}
        </SelectInputStyled.Option>
      ))}
    </SelectInputStyled>
  )
}

export default SelectStates
