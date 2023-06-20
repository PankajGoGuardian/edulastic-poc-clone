import React, { useState, useMemo } from 'react'
import { Spin, Tabs } from 'antd'
import {
  StyledTabs,
  TableContainer,
} from '../common/components/StyledComponents'
import ManageExternalData from './components/ManageExternalData'
import UploadLog from './components/UploadLog'

const MANAGE_EXTERNAL_DATA_TAB = {
  key: 'manageExternalData',
  label: 'MANAGE EXTERNAL DATA',
}

const UPLOAD_LOG_TAB = {
  key: 'uploadLog',
  label: 'UPLOAD LOG',
}

const { TabPane } = Tabs

const ImportHistory = ({
  loading,
  terms,
  uploadsStatusList,
  uploadResponse,
  uploadProgress,
  uploading,
  uploadFile,
  deleteFile,
  handleUploadProgress,
  setCancelUpload,
  abortUpload,
}) => {
  const [activeTabKey, setActiveTabKey] = useState(MANAGE_EXTERNAL_DATA_TAB.key)
  const termsMap = useMemo(
    () =>
      new Map(
        terms.map(({ _id, name, startDate }) => [_id, { name, startDate }])
      ),
    [terms]
  )
  return (
    <StyledTabs
      mode="horizontal"
      activeKey={activeTabKey}
      onTabClick={setActiveTabKey}
    >
      <TabPane
        tab={MANAGE_EXTERNAL_DATA_TAB.label}
        key={MANAGE_EXTERNAL_DATA_TAB.key}
      >
        <TableContainer>
          <Spin spinning={loading}>
            <ManageExternalData
              loading={loading}
              termsMap={termsMap}
              uploadsStatusList={uploadsStatusList}
              uploadResponse={uploadResponse}
              uploadProgress={uploadProgress}
              uploading={uploading}
              uploadFile={uploadFile}
              deleteFile={deleteFile}
              handleUploadProgress={handleUploadProgress}
              setCancelUpload={setCancelUpload}
              abortUpload={abortUpload}
            />
          </Spin>
        </TableContainer>
      </TabPane>
      <TabPane tab={UPLOAD_LOG_TAB.label} key={UPLOAD_LOG_TAB.key}>
        <TableContainer>
          <Spin spinning={loading}>
            <UploadLog
              loading={loading}
              termsMap={termsMap}
              uploadsStatusList={uploadsStatusList}
            />
          </Spin>
        </TableContainer>
      </TabPane>
    </StyledTabs>
  )
}

export default ImportHistory
