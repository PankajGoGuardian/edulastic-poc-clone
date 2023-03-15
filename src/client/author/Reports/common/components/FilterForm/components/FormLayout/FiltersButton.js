import React from 'react'
import PropTypes from 'prop-types'
import { IconFilter } from '@edulastic/icons'
import { StyledEduButton } from '../../../../styled'

function FiltersButton(props) {
  const { selected, onClick } = props
  return (
    <StyledEduButton
      data-cy="filters"
      isGhost={!selected}
      onClick={onClick}
      style={{ height: '24px' }}
    >
      <IconFilter width={15} height={15} />
      FILTERS
    </StyledEduButton>
  )
}

FiltersButton.propTypes = {
  selected: PropTypes.bool,
  onClick: PropTypes.func,
}
FiltersButton.defaultProps = {
  selected: false,
  onClick: () => {},
}

export default FiltersButton
