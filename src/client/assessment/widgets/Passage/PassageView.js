/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

import React, { useState, useEffect, useRef } from "react";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import { Pagination } from "antd";
import {
  Stimulus,
  WithResources,
  decodeHTML,
  RefContext,
  rgbToHexc,
  clearSelection,
  highlightSelectedText
} from "@edulastic/common";

import { InstructorStimulus } from "./styled/InstructorStimulus";
import { Heading } from "./styled/Heading";
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import ColorPicker from "./ColorPicker";
import { ColorPickerContainer, Overlay } from "./styled/ColorPicker";
import AppConfig from "../../../../../app-config";
import { CLEAR } from "../../constants/constantsForQuestions";

import HighlightPopover from "./HighlightPopover";

const ContentsTitle = Heading;
const highlightTag = "my-highlight";

const getPostionOfEelement = em => {
  let deltaTop = 0;
  let deltaLeft = 0;
  if (
    $(em)
      .parent()
      .prop("tagName") === "TD"
  ) {
    $(em).css("position", "relative");
  }

  $(em)
    .parents()
    .each((i, parent) => {
      if ($(parent).attr("id") === "passage-wrapper") {
        return false;
      }
      const p = $(parent).css("position");
      if (p === "relative") {
        const offest = $(parent).position();
        deltaTop += offest.top;
        deltaLeft += offest.left;
      }
    });

  // top and left will be used to set position of color picker
  const top = em.offsetTop + deltaTop + em.offsetHeight - 70; // -70 is height of picker
  const left = $(em).width() / 2 + em.offsetLeft + deltaLeft - 106; // -106 is half of width of picker;

  const bg = rgbToHexc($(em).css("backgroundColor"));
  return { top, left, bg };
};

const PassageView = ({
  item,
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
  const [isOpen, toggleOpen] = useState(false);
  const [selectHighlight, setSelectedHighlight] = useState(null);
  // use the userWork in author mode
  const _highlights = setHighlights ? highlights : userWork;

  const saveHistory = () => {
    let { innerHTML: highlightContent = "" } = mainContentsRef.current;

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
  };

  const addEventToSelectedText = () => {
    if (!disableResponse && window.$) {
      $(highlightTag).each(function(index) {
        const newId = `highlight-text-${index}`;
        $(this).attr("id", newId);
        $(this)
          .off()
          .on("mousedown", function() {
            const pos = getPostionOfEelement(this);
            setSelectedHighlight({ ...pos, id: newId });
          });
      });
    }
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
      if (!disableResponse) {
        addEventToSelectedText();
      }
    }, 10);
  };

  const closePopover = () => toggleOpen(false);

  const openPopover = () => toggleOpen(true);

  const handleClickBackdrop = () => setSelectedHighlight(null);

  const onChangeColor = color => {
    if (color !== "remove") {
      highlightSelectedText("text-heighlight", highlightTag, { background: color });
      addEventToSelectedText();
      saveHistory();
    }
    clearSelection();
    toggleOpen(false);
  };

  const updateColor = color => {
    if (mainContentsRef.current && selectHighlight) {
      const element = $(`#${selectHighlight.id}`);
      if (color === "remove") {
        element.replaceWith(element.html());
      } else {
        element.css("background-color", color);
      }
      clearSelection();
      setSelectedHighlight(null);
      saveHistory();
    }
  };

  useEffect(() => {
    if (!setHighlights && previewTab === CLEAR) {
      clearUserWork(); // clearing the userWork at author side.
    }
  }, [previewTab]); // run everytime the previewTab is changed
  console.log(previewTab);
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
      {/* when the user is selecting text, 
      will show color picker within a Popover. */}
      {previewTab === CLEAR && (
        <HighlightPopover
          selectionEl={mainContentsRef.current}
          isOpen={isOpen && !selectHighlight && !disableResponse}
          onTextSelect={openPopover}
          onTextUnselect={closePopover}
        >
          <ColorPickerContainer>
            <ColorPicker selectColor={onChangeColor} />
          </ColorPickerContainer>
        </HighlightPopover>
      )}
      {/* when the user clicks exsiting highlights, 
      will show colorPicker without Popover  */}
      {selectHighlight && !disableResponse && (
        <>
          <ColorPickerContainer style={{ ...selectHighlight, position: "absolute" }}>
            <ColorPicker selectColor={updateColor} bg={selectHighlight.bg} />
          </ColorPickerContainer>
          <Overlay onClick={handleClickBackdrop} />
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
  userWork: PropTypes.string.isRequired,
  flowLayout: PropTypes.bool
};

PassageView.defaultProps = {
  flowLayout: false
};

PassageView.modules = {
  toolbar: {
    container: "#myToolbar"
  }
};

PassageView.formats = ["background"];

export default PassageView;
