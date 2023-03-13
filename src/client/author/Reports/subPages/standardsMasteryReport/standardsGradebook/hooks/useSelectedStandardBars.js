import { useState } from 'react'

const useSelectedStandardBars = () => {
  const [selectedStandardBars, setSelectedStandardBars] = useState({})

  const onBarClickCB = (key) => {
    const _selectedStandardBars = { ...selectedStandardBars }
    if (_selectedStandardBars[key]) {
      delete _selectedStandardBars[key]
    } else {
      _selectedStandardBars[key] = true
    }
    setSelectedStandardBars(_selectedStandardBars)
  }

  const onBarResetClickCB = () => setSelectedStandardBars({})

  return { selectedStandardBars, onBarClickCB, onBarResetClickCB }
}

export default useSelectedStandardBars
