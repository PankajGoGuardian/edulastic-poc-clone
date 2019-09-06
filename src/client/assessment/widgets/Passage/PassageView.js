import React, { useState, useEffect } from "react";
import { isArray } from "lodash";
import PropTypes from "prop-types";
import { Pagination } from "antd";
import ReactQuill from "react-quill";

import { Stimulus, QuestionNumberLabel } from "@edulastic/common";
import { InstructorStimulus } from "./styled/InstructorStimulus";
import { Heading } from "./styled/Heading";
import { QuestionTitleWrapper } from "./styled/QustionNumber";

const ContentsTitle = Heading;

const PassageView = ({ item, preview, showQuestionNumber, qIndex, flowLayout }) => {
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
      {item.instructorStimulus && !flowLayout && (
        <InstructorStimulus dangerouslySetInnerHTML={{ __html: item.instructorStimulus }} />
      )}
      {!flowLayout && (
        <QuestionTitleWrapper>
          {item.heading && <Heading dangerouslySetInnerHTML={{ __html: item.heading }} />}
        </QuestionTitleWrapper>
      )}

      {item.contentsTitle && !flowLayout && <ContentsTitle dangerouslySetInnerHTML={{ __html: item.contentsTitle }} />}
      {!item.paginated_content && item.content && (
        <Stimulus id="mainContents" dangerouslySetInnerHTML={{ __html: item.content }} />
      )}
      {item.paginated_content && item.pages && !!item.pages.length && !flowLayout && (
        <div>
          <Stimulus id="paginatedContents" dangerouslySetInnerHTML={{ __html: item.pages[page - 1] }} />

          <Pagination
            style={{ justifyContent: "center" }}
            pageSize={1}
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
  qIndex: PropTypes.number,
  flowLayout: PropTypes.bool
};

PassageView.defaultProps = {
  preview: false,
  showQuestionNumber: false,
  qIndex: null,
  flowLayout: false
};

PassageView.modules = {
  toolbar: {
    container: "#myToolbar"
  }
};

PassageView.formats = ["background"];

export default PassageView;
