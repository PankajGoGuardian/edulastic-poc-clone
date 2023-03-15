import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'

import Question from '../../../components/Question'
import { Subtitle } from '../../../styled/Subtitle'

const PassageSection = ({
  children,
  fillSections,
  cleanSections,
  label,
  title,
}) => {
  const sectionId = useMemo(() => {
    return getFormattedAttrId(`${title}-${label}`)
  }, [label, title])

  return (
    <Question
      section="main"
      label={label}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle id={sectionId}>{label}</Subtitle>
      {children}
    </Question>
  )
}

PassageSection.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

PassageSection.defaultProps = {
  title: '',
  fillSections: () => {},
  cleanSections: () => {},
}

export default PassageSection
