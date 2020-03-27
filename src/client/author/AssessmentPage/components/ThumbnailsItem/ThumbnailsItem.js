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
  disableDelete,
  hasAnnotations,
  setRotateDirection,
  setConfirmRotate,
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
    <Menu.Item
      onClick={
        hasAnnotations
          ? () => {
              setConfirmRotate(true);
              setRotateDirection("clockwise");
            }
          : onRotate("clockwise")
      }
    >
      Rotate clockwise
    </Menu.Item>
    <Menu.Item
      onClick={
        hasAnnotations
          ? () => {
              setConfirmRotate(true);
              setRotateDirection("counterclockwise");
            }
          : onRotate("counterclockwise")
      }
    >
      Rotate counterclockwise
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item
      disabled={disableDelete}
      onClick={url || hasAnnotations ? () => setDeleteConfirmation(true, index) : onDelete}
    >
      Delete
    </Menu.Item>
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
  viewMode,
  current,
  disableDelete = false,
  hasAnnotations,
  setDeleteConfirmation,
  rotate,
  total
}) => {
  const [confirmRotate, setConfirmRotate] = useState(false);
  const [rotateDirection, setRotateDirection] = useState("clockwise");
  const contextMenu = createContextMenu({
    index,
    viewMode,
    onDelete,
    onMoveUp,
    onMoveDown,
    onInsertBlankPage,
    onRotate,
    disableDelete,
    total,
    hasAnnotations,
    setConfirmRotate,
    setRotateDirection,
    setDeleteConfirmation,
    url
  });

  return (
    <>
      <Modal
        visible={confirmRotate}
        onOk={() => {
          onRotate(rotateDirection)();
          setConfirmRotate(false);
        }}
        onCancel={() => setConfirmRotate(false)}
      >
        {
          "These pages contain one or more questions or annotations. Rotating the page may result this content positioned incorrectly."
        }
      </Modal>
      <Dropdown
        overlayClassName="pdfContextMenuDocBased"
        overlay={contextMenu}
        disabled={viewMode !== "edit"}
        trigger={["contextMenu"]}
      >
        <ThumbnailsItemWrapper onClick={onClick} active={current === index}>
          <PagePreview rotate={rotate}>
            {url && (
              <Document file={url} renderMode="canvas">
                <Page pageNumber={page} renderTextLayer={false} />
              </Document>
            )}
          </PagePreview>
          <PageNumber active={current === index}>{index + 1}</PageNumber>
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
  setDeleteConfirmation: PropTypes.func.isRequired,
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
