/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

import React, { useState, useEffect, useRef } from "react";
import { isArray, isEmpty } from "lodash";
import PropTypes from "prop-types";
import { Pagination } from "antd";
import { Stimulus, highlightSelectedText, WithResources, decodeHTML, RefContext } from "@edulastic/common";
import { InstructorStimulus } from "./styled/InstructorStimulus";
import { Heading } from "./styled/Heading";
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import ColorPicker from "./ColorPicker";
import { ColorPickerContainer, Overlay } from "./styled/ColorPicker";
import AppConfig from "../../../../../app-config";
import { CLEAR } from "../../constants/constantsForQuestions";

const ContentsTitle = Heading;
let startedSelectingText = false;
const highlightTag = "my-highlight";

const PassageView = ({
  item,
  preview,
  flowLayout,
  setHighlights,
  highlights,
  disableResponse,
  userWork,
  saveUserWork,
  clearUserWork,
  previewTab,
  passageTestItemID
}) => {
  const mainContentsRef = useRef();
  const [page, setPage] = useState(1);
  const [selected, toggleColorPicker] = useState(null);
  // use the userWork in author mode
  const _highlights = setHighlights ? highlights : userWork;

  const everyHeighlight = (_, em) => {
    const jQuery = window.$;
    jQuery(em).on("mouseenter", function() {
      if (!selected && !startedSelectingText) {
        let deltaTop = 0;
        let deltaLeft = 0;

        if (
          jQuery(em)
            .parent()
            .prop("tagName") === "TD"
        ) {
          jQuery(em).css("position", "relative");
        }

        jQuery(em)
          .parents()
          .each((i, parent) => {
            if (jQuery(parent).attr("id") === "passage-wrapper") {
              return false;
            }
            const p = jQuery(parent).css("position");
            if (p === "relative") {
              const offest = jQuery(parent).position();
              deltaTop += offest.top;
              deltaLeft += offest.left;
            }
          });

        // top and left will be used to set position of color picker
        const top = em.offsetTop + deltaTop + em.offsetHeight + 1; // 1px is for the arrow point
        const left = em.offsetLeft + deltaLeft;
        toggleColorPicker({ top, left, em });
      }
    });
  };

  const addEventToSelectedText = () => {
    if (!disableResponse && window.$) {
      const jQuery = window.$;
      jQuery(highlightTag).each(everyHeighlight);
    }
  };

  const handleHighlight = () => {
    startedSelectingText = false;
    highlightSelectedText("selected-text-heighlight", highlightTag);
    addEventToSelectedText();
  };

  const clickHighligter = color => {
    if (mainContentsRef.current && selected) {
      const jQuery = window.$;
      const element = jQuery(selected.em);
      if (color === "remove") {
        element.replaceWith(element.html());
      } else {
        element.css("background-color", color);
      }

      let { innerHTML: highlightContent } = mainContentsRef.current;

      if (highlightContent.search(new RegExp(`<${highlightTag}(.*?)>`, "g")) === -1) {
        highlightContent = null;
      } else {
        highlightContent = highlightContent.replace(/input__math/g, "");
      }

      if (setHighlights) {
        // this is available only at student side
        setHighlights(highlightContent);
      } else {
        // saving the highlights at author side
        // setHighlights is not available at author side
        saveUserWork({ [passageTestItemID]: { resourceId: highlightContent } });
      }

      toggleColorPicker(null);
    }
  };

  const handleMouseDown = () => {
    startedSelectingText = true;
  };

  const getContent = () => {
    let { content } = item;
    content = decodeHTML(content);
    if (isEmpty(_highlights)) {
      return content
        .replace(/(<p>)/g, "")
        .replace(/(<\/p>)/g, "<br/>")
        .replace(/background-color: (.*?);/g, "");
    }
    return _highlights;
  };

  const loadInit = () => {
    // need to wait for rendering content at first time.
    setTimeout(() => {
      addEventToSelectedText();
    }, 10);
  };

  useEffect(() => {
    if (preview) {
      const editors = document.getElementsByClassName("ql-editor");
      if (isArray(editors) && editors.length) {
        editors[0].contentEditable = false;
      }
    }
  });

  useEffect(() => {
    if (!setHighlights && previewTab === CLEAR) {
      // clearing the userWork at author side.
      clearUserWork();
    }
  }, [previewTab]); // run everytime the previewTab is changed

  return (
    <WithResources resources={[`${AppConfig.jqueryPath}/jquery.min.js`]} fallBack={<div />} onLoaded={loadInit}>
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
        <RefContext.Provider value={{ forwardedRef: mainContentsRef }}>
          <Stimulus
            id="mainContents"
            onMouseUp={disableResponse ? null : handleHighlight}
            onMouseDown={disableResponse ? null : handleMouseDown}
            dangerouslySetInnerHTML={{ __html: getContent() }}
            userSelect={!disableResponse}
          />
        </RefContext.Provider>
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
      {!disableResponse && selected && (
        <>
          <ColorPickerContainer style={{ ...selected }}>
            <ColorPicker selectColor={clickHighligter} bg={selected.bg} />
          </ColorPickerContainer>
          <Overlay onClick={() => toggleColorPicker(null)} />
        </>
      )}
    </WithResources>
  );
};

PassageView.propTypes = {
  setHighlights: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  saveUserWork: PropTypes.func.isRequired,
  clearUserWork: PropTypes.func.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  highlights: PropTypes.array.isRequired,
  userWork: PropTypes.array.isRequired,
  preview: PropTypes.bool,
  flowLayout: PropTypes.bool
};

PassageView.defaultProps = {
  preview: false,
  flowLayout: false
};

PassageView.modules = {
  toolbar: {
    container: "#myToolbar"
  }
};

PassageView.formats = ["background"];

export default PassageView;
