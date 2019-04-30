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

const Thumbnails = ({ list, onPageChange, url, onReupload, review }) => {
  const [minimized, setMinimized] = React.useState(false);

  const toggleMinimized = () => {
    setMinimized(!minimized);
  };

  const onChangePage = key => () => onPageChange(key + 1);

  return (
    <ThumbnailsWrapper review={review} minimized={minimized}>
      {review && (
        <MinimizeButton onClick={toggleMinimized} minimized={minimized}>
          <IconGraphRightArrow />
        </MinimizeButton>
      )}
      <ThumbnailsList>
        {list.map((item, key) => (
          <ThumbnailsItem key={key} page={key + 1} onClick={onChangePage(key)} url={url} />
        ))}
      </ThumbnailsList>
      {!review && (
        <ReuploadButtonWrapper>
          <Dropdown overlay={menu(onReupload, () => {}, () => {})}>
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
  url: PropTypes.string,
  review: PropTypes.bool
};

Thumbnails.defaultProps = {
  url: undefined,
  review: false
};

export default Thumbnails;
