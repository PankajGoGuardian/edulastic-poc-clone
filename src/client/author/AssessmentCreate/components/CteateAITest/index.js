import { CustomModalStyled } from '@edulastic/common'
import React from 'react'
import { Spin } from 'antd'
import { FormFields } from './FormFields'

export const CreateAiTestModal = ({
  onCancel,
  isVisible,
  handleFieldDataChange,
  handleAiFormSubmit,
  createItems,
}) => {
  return (
    <CustomModalStyled
      visible={isVisible}
      title="Auto-generated items"
      footer={null}
      width="50%"
      onCancel={onCancel}
      centered
      padding="30px 60px"
      bodyPadding="0px"
      borderRadius="10px"
      closeTopAlign="14px"
      closeRightAlign="10px"
      closeIconColor="black"
    >
      <Spin spinning={false}>
        <FormFields
          handleFieldDataChange={handleFieldDataChange}
          handleAiFormSubmit={handleAiFormSubmit}
          onCancel={onCancel}
          createItems={createItems}
        />
      </Spin>
    </CustomModalStyled>
  )
}
