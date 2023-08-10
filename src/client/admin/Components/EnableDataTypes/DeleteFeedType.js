import React, { useState } from 'react'
import adminTool from '@edulastic/api/src/adminTool'
import { Button } from 'antd'
import { TrashIcon } from './styled'

const DeleteFeedType = ({ feedTypeDetails, districtId, fetchFeedTypes }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    await adminTool.deleteFeedType({
      feedType: feedTypeDetails?.key,
      districtId,
    })
    fetchFeedTypes()
    setLoading(false)
  }
  return (
    <Button loading={loading} onClick={handleDelete} size="large">
      {!loading ? <TrashIcon /> : ''}
    </Button>
  )
}

export default DeleteFeedType
