import React, { useState } from 'react'
import { Modal, Pagination, Table } from 'antd'
import { EduElse, EduIf, EduThen } from '@edulastic/common'

export default function HintOrResourcesModal({
  title,
  resources,
  hints,
  setTitle,
  hintExhausted,
  setHintExhausted,
}) {
  const onOk = () => setTitle('')

  const [currentPage, setCurrentPage] = useState(1)
  const [alertModal, setAlertModal] = useState(false)

  const onOkAlertModal = () => {
    setAlertModal(false)
    setHintExhausted(true)
    setCurrentPage(2)
  }
  const onCancelAlertModal = () => setAlertModal(false)
  const pageSize = 1
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = hints.slice(startIndex, endIndex)
  const columns = [
    {
      title: 'Hint',
      dataIndex: 'hint',
      key: 'hint',
    },
  ]

  const handlePageChange = (page) => {
    if (page == 2 && !hintExhausted) {
      setAlertModal(true)
      return
    }
    setCurrentPage(page)
  }

  return (
    <>
      <Modal
        title={title === 'HINT' ? null : title}
        visible={!!title}
        onCancel={onOk}
        onOk={onOk}
        zIndex={10099}
      >
        <EduIf condition={title === 'HINT'}>
          <EduThen>
            <br />
            <Table
              dataSource={currentData.map((hint, index) => ({
                key: index,
                hint,
              }))}
              columns={columns}
              pagination={false}
            />
            <br />
            <Pagination
              current={currentPage}
              total={hints.length}
              pageSize={pageSize}
              onChange={handlePageChange}
            />
          </EduThen>
          <EduElse>
            {resources.map((url) => {
              return (
                <li>
                  <ul>
                    <a href={url} target="_blank" rel="noreferrer">
                      {url}
                    </a>
                  </ul>
                </li>
              )
            })}
          </EduElse>
        </EduIf>
      </Modal>
      <Modal
        visible={alertModal}
        title={<h1 style={{ color: 'red' }}>Alert</h1>}
        onOk={onOkAlertModal}
        onCancel={onCancelAlertModal}
        zIndex={11099}
      >
        <div>Want to use second hint ?</div>
      </Modal>
    </>
  )
}
