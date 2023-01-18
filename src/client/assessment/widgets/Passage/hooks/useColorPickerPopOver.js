import { useCallback, useState } from 'react'

const useColorPickerPopOver = () => {
  const [isOpen, toggleOpen] = useState(false)

  const closePopover = useCallback(() => {
    toggleOpen(false)
  }, [])

  const openPopover = useCallback(() => {
    toggleOpen(true)
  }, [])

  return { closePopover, openPopover, isOpen, toggleOpen }
}

export default useColorPickerPopOver
