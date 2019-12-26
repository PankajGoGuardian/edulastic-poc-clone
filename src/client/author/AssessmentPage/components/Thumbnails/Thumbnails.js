import React from "react";
import PropTypes from "prop-types";
import { Dropdown, Menu } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";

import ThumbnailsItem from "../ThumbnailsItem/ThumbnailsItem";
import { ThumbnailsWrapper, ReuploadButtonWrapper, ReuploadButton, ThumbnailsList, ToolBarToggleBtn } from "./styled";
import { IconPencilEdit } from "@edulastic/icons";
import { white, themeColor } from "@edulastic/colors";
import { IconGraphRightArrow } from "@edulastic/icons";
import { MinimizeButton } from "../Worksheet/styled";

const menu = (onReupload, onAddBlank, onDeleteBlank, pdfPageLength = 1, onAddPdf) => (
  <Menu>
    <Menu.Item onClick={onAddBlank}>Add Blank Page</Menu.Item>
    <Menu.Item disabled={pdfPageLength === 1} onClick={onDeleteBlank}>
      Delete Page
    </Menu.Item>
    <Menu.Item onClick={onAddPdf}>Add Another PDF</Menu.Item>
    <Menu.Item onClick={onReupload}>Reupload PDF</Menu.Item>
  </Menu>
);

const Thumbnails = ({
  list,
  onPageChange,
  annotations,
  onReupload,
  onAddBlankPage,
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
  isToolBarVisible,
  toggleToolBarVisiblity,
  noCheck,
  toggleMinimized,
  minimized
}) => {
  const onChangePage = page => () => onPageChange(page);
  return (
    <ThumbnailsWrapper reportMode={reportMode} testMode={testMode} review={review}>
      <MinimizeButton onClick={toggleMinimized} minimized={minimized}>
        <IconGraphRightArrow />
      </MinimizeButton>
      <PerfectScrollbar>
        <ThumbnailsList>
          {list.map((item, key) => (
            <ThumbnailsItem
              key={key}
              viewMode={viewMode}
              index={key}
              disableDelete={list.length <= 1}
              page={item.pageNo}
              hasAnnotations={annotations.some(annotation => annotation.page === item.pageNo + 1)}
              setDeleteConfirmation={setDeleteConfirmation}
              onClick={onChangePage(key)}
              onDelete={() => onDeletePage(key)}
              onMoveUp={onMovePageUp(key)}
              onMoveDown={onMovePageDown(key)}
              onInsertBlankPage={onInsertBlankPage(key)}
              onRotate={onRotate(key)}
              url={item.URL !== "blank" && item.URL}
              current={currentPage}
              total={list.length}
              rotate={item.rotate}
            />
          ))}
        </ThumbnailsList>
        {!review && (
          <ReuploadButtonWrapper>
            <Dropdown overlay={menu(onReupload, onAddBlankPage, onDeleteSelectedBlankPage, list.length, onAddPdf)}>
              <ReuploadButton>Manage document</ReuploadButton>
            </Dropdown>
          </ReuploadButtonWrapper>
        )}
      </PerfectScrollbar>
    </ThumbnailsWrapper>
  );
};

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
  review: PropTypes.bool
};

Thumbnails.defaultProps = {
  review: false
};

export default Thumbnails;
