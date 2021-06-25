import { CheckboxLabel, CustomModalStyled, EduButton } from '@edulastic/common'
import { IconClose } from '@edulastic/icons'
import { Pagination } from 'antd'
import React, { useState } from 'react'
import {
  AddResourcesLink,
  CardBox,
  CardImage,
  CloseIconWrapper,
  ResourceCardContainer,
  ResourceTags,
  RowOne,
  PaginationContainer,
} from '../SimpleOptions/styled'

const pageSize = 8
const cardsData = [
  { title: 'Resources Name 01', value: 'Resources Name 01' },
  { title: 'Resources Name 02', value: 'Resources Name 02' },
  { title: 'Resources Name 03', value: 'Resources Name 03' },
  { title: 'Resources Name 04', value: 'Resources Name 04' },
  { title: 'Resources Name 05', value: 'Resources Name 05' },
  { title: 'Resources Name 06', value: 'Resources Name 06' },
  { title: 'Resources Name 07', value: 'Resources Name 07' },
  { title: 'Resources Name 08', value: 'Resources Name 08' },
  { title: 'Resources Name 09', value: 'Resources Name 09' },
  { title: 'Resources Name 10', value: 'Resources Name 10' },
  { title: 'Resources Name 11', value: 'Resources Name 11' },
  { title: 'Resources Name 12', value: 'Resources Name 12' },
  { title: 'Resources Name 13', value: 'Resources Name 13' },
  { title: 'Resources Name 14', value: 'Resources Name 14' },
  { title: 'Resources Name 15', value: 'Resources Name 15' },
  { title: 'Resources Name 16', value: 'Resources Name 16' },
  { title: 'Resources Name 17', value: 'Resources Name 17' },
  { title: 'Resources Name 18', value: 'Resources Name 18' },
  { title: 'Resources Name 19', value: 'Resources Name 19' },
]
const firstPage = cardsData.slice(0, pageSize)

const AddResources = () => {
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [pageContent, setPageContent] = useState(firstPage)

  const onCloseModal = () => {
    setShowResourceModal(false)
    setPageContent(firstPage)
  }

  const onConfirm = () => {}

  const openResourceModal = () => {
    setShowResourceModal(true)
  }

  const handlePagination = (value) => {
    setPageContent(cardsData.slice((value - 1) * pageSize, value * pageSize))
  }

  const footer = [
    <EduButton
      width="180px"
      height="40px"
      isGhost
      data-cy="closeResourcesModal"
      onClick={onCloseModal}
    >
      CANCEL
    </EduButton>,
    <EduButton
      width="180px"
      height="40px"
      data-cy="confirmResources"
      onClick={onConfirm}
    >
      Confirm
    </EduButton>,
  ]

  return (
    <>
      <AddResourcesLink data-cy="addResourcesLink" onClick={openResourceModal}>
        Add Resources
      </AddResourcesLink>
      <ResourceTags>
        <li>
          <span>Resource Name</span>
          <CloseIconWrapper data-cy="cancelResource">
            <IconClose />
          </CloseIconWrapper>
        </li>
      </ResourceTags>
      <CustomModalStyled
        visible={showResourceModal}
        title="Recommended Resources"
        onCancel={onCloseModal}
        centered
        footer={footer}
        modalWidth="900px"
        destroyOnClose
      >
        <ResourceCardContainer>
          {pageContent.map((x) => (
            <CardBox>
              <CardImage />
              <RowOne>
                <span>{x.title}</span>
                <CheckboxLabel value={x.value} />
              </RowOne>
            </CardBox>
          ))}
          {cardsData.length > pageSize && (
            <PaginationContainer>
              <Pagination
                defaultCurrent={1}
                defaultPageSize={8}
                onChange={handlePagination}
                total={cardsData.length}
              />
            </PaginationContainer>
          )}
        </ResourceCardContainer>
      </CustomModalStyled>
    </>
  )
}

export default AddResources
