import { useEffect, useState } from 'react'

const useUploadProgress = () => {
  const [uploadProgressPercent, setUploadProgressPercent] = useState(0)

  /**
   * Currently it is a dummy representation of upload percentage
   * Need to fix this later
   */
  const updatePercent = () => {
    setUploadProgressPercent(
      (_uploadProgressPercent) => _uploadProgressPercent + 30
    )
  }

  useEffect(() => {
    if (uploadProgressPercent < 80) {
      setTimeout(updatePercent, 1000)
    }
  }, [uploadProgressPercent])

  return { uploadProgressPercent }
}

export default useUploadProgress
