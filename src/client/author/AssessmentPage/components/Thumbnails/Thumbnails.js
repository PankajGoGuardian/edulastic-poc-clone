import React from "react";
import PropTypes from "prop-types";
import { Dropdown, Menu } from "antd";

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

const Thumbnails = ({ list, onPageChange, onReupload, onAddBlankPage, onDeleteBlankPage, review, currentPage }) => {
  const [minimized, setMinimized] = React.useState(false);

  const toggleMinimized = () => {
    setMinimized(!minimized);
  };

  const onChangePage = page => () => onPageChange(page);

  return (
    <ThumbnailsWrapper review={review} minimized={minimized}>
      {review && (
        <MinimizeButton onClick={toggleMinimized} minimized={minimized}>
          <IconGraphRightArrow />
        </MinimizeButton>
      )}
      <ThumbnailsList>
        {list.map((item, key) => (
          <ThumbnailsItem
            key={key}
            index={key}
            page={item.pageNo}
            onClick={onChangePage(key)}
            url={item.URL !== "blank" && item.URL}
            current={currentPage}
          />
        ))}
      </ThumbnailsList>
      {!review && (
        <ReuploadButtonWrapper>
          <Dropdown overlay={menu(onReupload, onAddBlankPage, onDeleteBlankPage)}>
            <ReuploadButton>Manage document</ReuploadButton>
          </Dropdown>
        </ReuploadButtonWrapper>
      )}
    </ThumbnailsWrapper>
  );
};

Thumbnails.propTypes = {
  list: PropTypes.array.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onReupload: PropTypes.func.isRequired,
  onAddBlankPage: PropTypes.func.isRequired,
  onDeleteBlankPage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  review: PropTypes.bool
};

Thumbnails.defaultProps = {
  review: false
};

export default Thumbnails;
