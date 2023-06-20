import React from 'react'

import { getUploadLogColumns } from '../utils'
import Table from './Table'

const UploadLog = ({ uploadsStatusList = [], termsMap }) => {
  const columns = getUploadLogColumns(termsMap)

  return <Table data={uploadsStatusList} columns={columns} />
}

export default UploadLog
