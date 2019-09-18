import React from "react";
import PropTypes from "prop-types";
import { Dropdown, Menu } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";

import { IconGraphRightArrow } from "@edulastic/icons";

import ThumbnailsItem from "../ThumbnailsItem/ThumbnailsItem";
import { ThumbnailsWrapper, ReuploadButtonWrapper, ReuploadButton, ThumbnailsList, MinimizeButton } from "./styled";

const menu = (onReupload, onAddBlank, onDeleteBlank) => (
  <Menu>
    <Menu.Item onClick={onAddBlank}>Add Blank Page</Menu.Item>
    <Menu.Item onClick={onDeleteBlank}>Delete Blank Page</Menu.Item>
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
  viewMode,
  review,
  currentPage
}) => {
  const [minimized, setMinimized] = React.useState(false);

  const toggleMinimized = () => {
    setMinimized(!minimized);
  };

  const onChangePage = page => () => onPageChange(page);

  return (
    <ThumbnailsWrapper review={review} minimized={minimized}>
      <PerfectScrollbar>
        {review && (
          <MinimizeButton onClick={toggleMinimized} minimized={minimized}>
            <IconGraphRightArrow />
          </MinimizeButton>
        )}
        <ThumbnailsList>
          {list.map((item, key) => (
            <ThumbnailsItem
              key={key}
              viewMode={viewMode}
              index={key}
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
            <Dropdown overlay={menu(onReupload, onAddBlankPage, onDeleteSelectedBlankPage)}>
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
