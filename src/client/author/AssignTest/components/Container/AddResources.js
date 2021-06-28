import {
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  notification,
} from '@edulastic/common'
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
  { id: '01', title: 'Resources Name 01', value: 'Resources Name 01' },
  { id: '02', title: 'Resources Name 02', value: 'Resources Name 02' },
  { id: '03', title: 'Resources Name 03', value: 'Resources Name 03' },
  { id: '04', title: 'Resources Name 04', value: 'Resources Name 04' },
  { id: '05', title: 'Resources Name 05', value: 'Resources Name 05' },
  { id: '06', title: 'Resources Name 06', value: 'Resources Name 06' },
  { id: '07', title: 'Resources Name 07', value: 'Resources Name 07' },
  { id: '08', title: 'Resources Name 08', value: 'Resources Name 08' },
  { id: '09', title: 'Resources Name 09', value: 'Resources Name 09' },
  { id: '10', title: 'Resources Name 10', value: 'Resources Name 10' },
  { id: '11', title: 'Resources Name 11', value: 'Resources Name 11' },
  { id: '12', title: 'Resources Name 12', value: 'Resources Name 12' },
  { id: '13', title: 'Resources Name 13', value: 'Resources Name 13' },
  { id: '14', title: 'Resources Name 14', value: 'Resources Name 14' },
  { id: '15', title: 'Resources Name 15', value: 'Resources Name 15' },
  { id: '16', title: 'Resources Name 16', value: 'Resources Name 16' },
  { id: '17', title: 'Resources Name 17', value: 'Resources Name 17' },
  { id: '18', title: 'Resources Name 18', value: 'Resources Name 18' },
  { id: '19', title: 'Resources Name 19', value: 'Resources Name 19' },
]
const firstPage = cardsData.slice(0, pageSize)

const AddResources = () => {
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [pageContent, setPageContent] = useState(firstPage)
  const [selectedResources, setSelectedResources] = useState([])
  const [showTags, setShowtags] = useState([])

  const onCloseModal = () => {
    setShowResourceModal(false)
    setPageContent(firstPage)
  }

  const onConfirm = () => {
    setShowtags(cardsData.filter((x) => selectedResources.includes(x.id)))
    setShowResourceModal(false)
  }

  const openResourceModal = () => {
    setShowResourceModal(true)
  }

  const handlePagination = (value) => {
    setPageContent(cardsData.slice((value - 1) * pageSize, value * pageSize))
  }

  const handleResourceCheck = (value) => {
    if (!selectedResources.includes(value)) {
      if (selectedResources.length >= 5) {
        notification({ type: 'info', msg: 'Max limit reached' })
        return
      }
      setSelectedResources([...selectedResources, value])
    } else {
      setSelectedResources(selectedResources.filter((x) => x !== value))
    }
  }

  const handleCancelresource = (resourceId) => {
    setShowtags(showTags.filter((x) => x.id !== resourceId))
    setSelectedResources(selectedResources.filter((x) => x !== resourceId))
  }

  console.log('selectedResources', selectedResources)

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
        {showTags.map((tag) => (
          <li key={tag.id}>
            <span>{tag.title}</span>
            <CloseIconWrapper
              onClick={() => handleCancelresource(tag.id)}
              data-cy="cancelResource"
            >
              <IconClose />
            </CloseIconWrapper>
          </li>
        ))}
      </ResourceTags>
      <CustomModalStyled
        visible={showResourceModal}
        title="Recommended Resources"
        onCancel={onCloseModal}
        centered
        footer={footer}
        modalWidth="900px"
      >
        <ResourceCardContainer>
          {pageContent.map((x) => (
            <CardBox>
              <CardImage />
              <RowOne>
                <span>{x.title}</span>
                <CheckboxLabel
                  onChange={() => handleResourceCheck(x.id)}
                  checked={selectedResources.includes(x.id)}
                />
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
