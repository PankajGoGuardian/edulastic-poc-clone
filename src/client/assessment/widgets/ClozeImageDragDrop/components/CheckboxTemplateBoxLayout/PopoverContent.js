import React from 'react'
import PropTypes from 'prop-types'
import { response } from '@edulastic/constants'
import { MathSpan } from '@edulastic/common'

export function PopoverContent({ fontSize, answer, className, indexStr }) {
  return (
    <div
      fontSize={fontSize}
      className={className}
      style={{
        position: 'relative',
        'max-width': response.maxWidth,
      }}
    >
      {indexStr}
      <div
        className="text container"
        style={{ overflow: 'unset', width: '100%' }}
      >
        <div>
          <MathSpan dangerouslySetInnerHTML={{ __html: answer }} />
        </div>
      </div>
    </div>
  )
}

PopoverContent.propTypes = {
  fontSize: PropTypes.number,
  className: PropTypes.string.isRequired,
  answer: PropTypes.any.isRequired,
}

PopoverContent.defaultProps = {
  fontSize: 14,
}
