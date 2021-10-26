import React from 'react'
import PropTypes from 'prop-types'
import { Popover, Dropdown, Menu } from 'antd'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  ThumbnailsWrapper,
  ReuploadButtonWrapper,
  ReuploadButton,
  ThumbnailsList,
  MenuItemContainer,
  InfoIcon,
} from './styled'
import ThumbnailsItem from '../ThumbnailsItem/ThumbnailsItem'

const menu = (
  onReupload,
  onAddBlank,
  onDeleteBlank,
  pdfPageLength = 1,
  onAddPdf,
  onClearAnnotations
) => (
  <Menu>
    <Menu.Item onClick={onAddBlank} data-cy="addBlankPage">
      <MenuItemContainer>Add Blank Page</MenuItemContainer>
    </Menu.Item>
    <Menu.Item
      disabled={pdfPageLength === 1}
      onClick={onDeleteBlank}
      data-cy="deletePage"
    >
      <MenuItemContainer>Delete Page</MenuItemContainer>
    </Menu.Item>
    <Menu.Item onClick={onAddPdf} data-cy="addAnotherPdf">
      <MenuItemContainer>Add Another PDF</MenuItemContainer>
    </Menu.Item>
    <Menu.Item onClick={onReupload} data-cy="reUploadPdf">
      <MenuItemContainer>
        Reupload PDF
        <Popover
          placement="topRight"
          content="Annotations will be carried to uploaded pdf, you can clear it from Clear All option"
        >
          <InfoIcon />
        </Popover>
      </MenuItemContainer>
    </Menu.Item>
    <Menu.Item onClick={onClearAnnotations} data-cy="clearallannotations">
      <MenuItemContainer>Clear Annotations</MenuItemContainer>
    </Menu.Item>
  </Menu>
)

const Thumbnails = ({
  list,
  minimized,
  onPageChange,
  annotations,
  onReupload,
  onAddBlankPage,
  onClearAnnotations,
  onDeleteSelectedBlankPage,
  onDeletePage,
  onMovePageUp,
  onMovePageDown,
  onInsertBlankPage,
  setDeleteConfirmation,
  onRotate,
  onAddPdf,
  viewMode,
  review,
  testMode,
  reportMode,
  currentPage,
  noCheck,
}) => {
  const onChangePage = (page) => () => onPageChange(page)
  return (
    <ThumbnailsWrapper
      reportMode={reportMode}
      testMode={testMode}
      review={review}
      minimized={minimized}
    >
      <PerfectScrollbar>
        <ThumbnailsList data-cy="thumbnailsList">
          {list.map((item, key) => (
            <ThumbnailsItem
              key={key}
              viewMode={viewMode}
              index={key}
              disableDelete={list.length <= 1}
              page={item.pageNo}
              hasAnnotations={annotations.some(
                (annotation) => annotation.page === item.pageNo + 1
              )}
              setDeleteConfirmation={setDeleteConfirmation}
              onClick={onChangePage(key)}
              onDelete={() => onDeletePage(key)}
              onMoveUp={onMovePageUp(key)}
              onMoveDown={onMovePageDown(key)}
              onInsertBlankPage={onInsertBlankPage(key)}
              onRotate={onRotate(key)}
              url={item.URL !== 'blank' && item.URL}
              current={currentPage}
              total={list.length}
              rotate={item.rotate}
            />
          ))}
        </ThumbnailsList>
        {!review && !testMode && (
          <ReuploadButtonWrapper noCheck={noCheck}>
            <Dropdown
              placement="topCenter"
              overlay={menu(
                onReupload,
                onAddBlankPage,
                onDeleteSelectedBlankPage,
                list.length,
                onAddPdf,
                onClearAnnotations
              )}
            >
              <ReuploadButton data-cy="manageDocument">
                Manage document
              </ReuploadButton>
            </Dropdown>
          </ReuploadButtonWrapper>
        )}
      </PerfectScrollbar>
    </ThumbnailsWrapper>
  )
}

Thumbnails.propTypes = {
  list: PropTypes.array.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onReupload: PropTypes.func.isRequired,
  onAddBlankPage: PropTypes.func.isRequired,
  onDeletePage: PropTypes.func.isRequired,
  onDeleteSelectedBlankPage: PropTypes.func.isRequired,
  setDeleteConfirmation: PropTypes.func.isRequired,
  onMovePageUp: PropTypes.func.isRequired,
  onMovePageDown: PropTypes.func.isRequired,
  onInsertBlankPage: PropTypes.func.isRequired,
  onRotate: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  review: PropTypes.bool,
}

Thumbnails.defaultProps = {
  review: false,
}

export default Thumbnails
