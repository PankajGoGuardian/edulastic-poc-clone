import React from 'react'
import { Modal } from 'antd'

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
  return (
    <>
      <Modal
        cancelButtonProps={{ hidden: true }}
        onOk={closeModal}
        title={title}
        visible={!!title}
        zIndex={10099}
      >
        {currentQuestionData}
      </Modal>
    </>
  )
}
