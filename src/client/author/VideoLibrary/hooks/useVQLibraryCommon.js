import { useEffect } from 'react'

const useVQLibraryCommon = ({ resetVQLibrary }) => {
  useEffect(() => {
    return () => {
      resetVQLibrary()
    }
  }, [])
}

export default useVQLibraryCommon
