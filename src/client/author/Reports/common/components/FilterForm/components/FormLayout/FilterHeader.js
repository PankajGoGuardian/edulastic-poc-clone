import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const FilterTitle = styled.span`
  text-align: left;
  font: normal normal bold 16px/22px Open Sans;
  letter-spacing: 0px;
  color: #707070;
`
const FilterDescription = styled.span`
  text-align: left;
  font: normal normal normal 12px/17px Open Sans;
  letter-spacing: 0px;
  color: #707070;
`

const StyledFilterHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  & hr {
    width: 100%;
    border: 0.5px solid #cacaca;
  }
`

function FilterHeader(props) {
  const { title, description } = props
  if (!title && !description) return null
  return (
    <StyledFilterHeader>
      <FilterTitle>{title}</FilterTitle>
      <FilterDescription>{description}</FilterDescription>
      <hr />
    </StyledFilterHeader>
  )
}

FilterHeader.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
}
FilterHeader.defaultProps = {
  title: undefined,
  description: undefined,
}

export default FilterHeader
