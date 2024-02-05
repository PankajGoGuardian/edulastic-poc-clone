import React from 'react'
import { List, Modal } from 'antd'

export default function HintOrResourcesModal({
  title,
  currentQuestionData,
  setQuestionData,
}) {
  const closeModal = () => {
    setQuestionData({
      questionIndex: '',
      selectedField: '',
      title: '',
    })
  }

  const modalContent = Array.isArray(currentQuestionData) ? (
    <List
      dataSource={currentQuestionData}
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
  ) : (
    currentQuestionData
  )

  return (
    <>
      <Modal
        cancelButtonProps={{ hidden: true }}
        onOk={closeModal}
        title={title}
        visible={!!title}
        zIndex={10099}
      >
        {modalContent}
      </Modal>
    </>
  )
}
