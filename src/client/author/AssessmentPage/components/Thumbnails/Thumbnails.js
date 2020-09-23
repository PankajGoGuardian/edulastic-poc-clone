import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Dropdown, Menu } from "antd";
import { last, isEmpty } from "lodash";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Document } from "react-pdf";
import { ThumbnailsWrapper, ReuploadButtonWrapper, ReuploadButton, ThumbnailsList } from "./styled";
import ThumbnailsItem from "../ThumbnailsItem/ThumbnailsItem";

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

const transformPageStructure = (pages = []) => {
  const pdfs = [];
  pages.forEach((page, key) => {
    const lastPdf = last(pdfs);
    const _page = {
      ...page,
      pageIndex: key
    };
    delete _page.URL;

    if (!lastPdf || (lastPdf && lastPdf.URL !== page.URL)) {
      pdfs.push({
        URL: page.URL,
        pages: [_page]
      });
    } else {
      lastPdf.pages.push(_page);
    }
  });
  return pdfs;
};

const Thumbnails = ({
  list,
  minimized,
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
  noCheck
}) => {
  const onChangePage = page => () => onPageChange(page);
  const docs = useMemo(() => transformPageStructure(list), [list]);

  return (
    <ThumbnailsWrapper reportMode={reportMode} testMode={testMode} review={review} minimized={minimized}>
      <PerfectScrollbar>
        <ThumbnailsList>
          {docs.map((doc, docIndex) => {
            if (doc.URL && !isEmpty(doc.pages)) {
              return (
                <Document file={doc.URL} renderMode="canvas" key={docIndex} loading="">
                  {doc.pages.map(page => (
                    <ThumbnailsItem
                      key={page.pageIndex}
                      index={page.pageIndex}
                      viewMode={viewMode}
                      disableDelete={list.length <= 1}
                      page={page.pageNo}
                      hasAnnotations={annotations.some(annotation => annotation.page === page.pageNo + 1)}
                      setDeleteConfirmation={setDeleteConfirmation}
                      onClick={onChangePage(page.pageIndex)}
                      onDelete={() => onDeletePage(page.pageIndex)}
                      onMoveUp={onMovePageUp(page.pageIndex)}
                      onMoveDown={onMovePageDown(page.pageIndex)}
                      onInsertBlankPage={onInsertBlankPage(page.pageIndex)}
                      onRotate={onRotate(page.pageIndex)}
                      url={doc.URL !== "blank" && doc.URL}
                      current={currentPage}
                      total={list.length}
                      rotate={page.rotate}
                    />
                  ))}
                </Document>
              );
            }
            return null;
          })}
        </ThumbnailsList>
        {!review && !testMode && (
          <ReuploadButtonWrapper noCheck={noCheck}>
            <Dropdown
              placement="topCenter"
              overlay={menu(onReupload, onAddBlankPage, onDeleteSelectedBlankPage, list.length, onAddPdf)}
            >
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
