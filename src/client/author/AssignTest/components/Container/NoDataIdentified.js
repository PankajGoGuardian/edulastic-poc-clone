import { EduButton } from '@edulastic/common'
import React from 'react'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'
import { Paragraph } from './styled'

export const NoDataIdentifiedText = ({
  onClick,
  noSearchDataFound,
  searchTextKey,
}) => (
  <a
    onClick={() => {
      onClick(true, searchTextKey)
    }}
  >
    ({noSearchDataFound?.total - noSearchDataFound?.missingData}/
    {noSearchDataFound?.total} identified)
  </a>
)

export const NoDataIdentifiedModal = ({ closeModal, noDataFound, title }) => {
  const Footer = [
    <EduButton
      isGhost
      key="cancel"
      onClick={() => {
        closeModal(false, '')
      }}
    >
      Cancel
    </EduButton>,
  ]

  return (
    <ConfirmationModal
      maskClosable={true}
      textAlign="left"
      title={`Select ${title}`}
      centered
      visible
      onCancel={() => {
        closeModal(false, '')
      }}
      footer={Footer}
      modalWidth="650px"
      bodyHeight="75px"
    >
      <Paragraph>
        {noDataFound?.missingData}/{noDataFound?.total} items were not found.
        Details below. Please correct and add them.
      </Paragraph>
      <Paragraph>{noDataFound?.data?.join(', ')}</Paragraph>
      <Paragraph>
        Tip: You can search for the {title} name in the dropdown.
      </Paragraph>
    </ConfirmationModal>
  )
}
