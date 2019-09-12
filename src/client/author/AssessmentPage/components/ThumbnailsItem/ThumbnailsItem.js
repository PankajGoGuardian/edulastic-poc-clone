import React, { useState } from "react";
import PropTypes from "prop-types";
import { Document, Page } from "react-pdf";
import { Dropdown, Menu, Modal } from "antd";

import { ThumbnailsItemWrapper, PageNumber, PagePreview } from "./styled";

const createContextMenu = ({
  index,
  total,
  onDelete,
  onMoveUp,
  onMoveDown,
  onInsertBlankPage,
  onRotate,
  url,
  setDeleteConfirmation
}) => (
  <Menu>
    <Menu.Item onClick={onInsertBlankPage}>Insert Blank Page</Menu.Item>
    <Menu.Divider />
    <Menu.Item onClick={onMoveUp} disabled={index === 0}>
      Move Up
    </Menu.Item>
    <Menu.Item onClick={onMoveDown} disabled={index === total - 1}>
      Move Down
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item onClick={onRotate("clockwise")}>Rotate clockwise</Menu.Item>
    <Menu.Item onClick={onRotate("counterclockwise")}>Rotate counterclockwise</Menu.Item>
    <Menu.Divider />
    <Menu.Item onClick={url ? () => setDeleteConfirmation(true) : onDelete}>Delete</Menu.Item>
  </Menu>
);

const ThumbnailsItem = ({
  page,
  index,
  onClick,
  onDelete,
  onMoveUp,
  onMoveDown,
  onInsertBlankPage,
  onRotate,
  url,
  current,
  rotate,
  total
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const contextMenu = createContextMenu({
    index,
    onDelete,
    onMoveUp,
    onMoveDown,
    onInsertBlankPage,
    onRotate,
    total,
    setDeleteConfirmation,
    url
  });

  return (
    <>
      <Modal
        visible={deleteConfirmation}
        onOk={() => {
          onDelete();
          setDeleteConfirmation(false);
        }}
        onCancel={() => setDeleteConfirmation(false)}
        title="Confirm Page Deletion"
        okText="Yes"
        cancelText="No"
      >
        {"Are you sure that you want to delete this page?"}
      </Modal>
      <Dropdown overlay={contextMenu} trigger={["contextMenu"]}>
        <ThumbnailsItemWrapper onClick={onClick} active={current === index}>
          <PagePreview rotate={rotate}>
            {url && (
              <Document file={url} renderMode="canvas">
                <Page pageNumber={page} renderTextLayer={false} />
              </Document>
            )}
          </PagePreview>
          <PageNumber>{index + 1}</PageNumber>
        </ThumbnailsItemWrapper>
      </Dropdown>
    </>
  );
};

ThumbnailsItem.propTypes = {
  page: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  rotate: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  onInsertBlankPage: PropTypes.func.isRequired,
  onRotate: PropTypes.func.isRequired
};

ThumbnailsItem.defaulProps = {
  rotate: 0
};

export default ThumbnailsItem;
