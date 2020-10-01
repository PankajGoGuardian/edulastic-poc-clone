import React from 'react'
import PropTypes from 'prop-types'
import { ControlBtnWraper, ControlBtn } from '../../common/ControlBtn'

const ControlTools = ({ controls, setControls, control }) => {
  const onChangeControls = (con) => () => {
    if (setControls) {
      setControls(con)
    }
  }
  return (
    <ControlBtnWraper marginBottom={16} justifyContent="flex-end">
      {controls &&
        controls.map((con, i) => (
          <ControlBtn
            key={`control-btn-${i}`}
            active={con === control}
            control={con}
            onClick={onChangeControls(con)}
          />
        ))}
    </ControlBtnWraper>
  )
}

ControlTools.propTypes = {
  controls: PropTypes.array.isRequired,
  setControls: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
}

export default ControlTools
