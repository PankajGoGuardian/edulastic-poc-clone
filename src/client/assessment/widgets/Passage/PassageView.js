import React, { useState, useEffect } from "react";
import { isArray } from "lodash";
import PropTypes from "prop-types";
import { Pagination } from "antd";
import ReactQuill from "react-quill";

import { InstructorStimulus } from "./styled/InstructorStimulus";
import { Heading } from "./styled/Heading";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";

const ContentsTitle = Heading;

const PassageView = ({ item, preview, showQuestionNumber, qIndex }) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (preview) {
      const editors = document.getElementsByClassName("ql-editor");
      if (isArray(editors) && editors.length) {
        editors[0].contentEditable = false;
      }
    }
  }, []);

  return (
    <div>
      {item.instructor_stimulus && (
        <InstructorStimulus dangerouslySetInnerHTML={{ __html: item.instructor_stimulus }} />
      )}
      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumber>{`Q${qIndex + 1}`}</QuestionNumber>}
        {item.heading && <Heading dangerouslySetInnerHTML={{ __html: item.heading }} />}
      </QuestionTitleWrapper>
      {item.contentsTitle && <ContentsTitle dangerouslySetInnerHTML={{ __html: item.contentsTitle }} />}
      <div
        id="myToolbar"
        style={{
          display: "block",
          position: "relative",
          width: 50,
          top: 0,
          background: "transparent"
        }}
        className="passage_toolbar"
      >
        <span className="ql-formats">
          <select className="ql-background">
            <option value="transparent" />
            <option value="#99c2ff" />
            <option value="#99ff99" />
            <option value="#ff8533" />
            <option value="#ffff80" />
            <option value="#ff99bb" />
          </select>
        </span>
      </div>
      {!item.paginated_content && item.content && (
        <ReactQuill id="mainContents" value={item.content} modules={PassageView.modules} />
      )}
      {item.paginated_content && item.pages && !!item.pages.length && (
        <div>
          <ReactQuill id="paginatedContents" value={item.pages[page - 1]} modules={PassageView.modules} />

          <Pagination
            pageSize={1}
            simple
            hideOnSinglePage
            onChange={pageNum => setPage(pageNum)}
            current={page}
            total={item.pages.length}
          />
        </div>
      )}
    </div>
  );
};

PassageView.propTypes = {
  item: PropTypes.object.isRequired,
  preview: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number
};

PassageView.defaultProps = {
  preview: false,
  showQuestionNumber: false,
  qIndex: null
};

PassageView.modules = {
  toolbar: {
    container: "#myToolbar"
  }
};

PassageView.formats = ["background"];

export default PassageView;
