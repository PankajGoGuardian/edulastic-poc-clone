/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

import React, { useState, useEffect, useRef } from "react";
import { isArray } from "lodash";
import PropTypes from "prop-types";
import { Pagination } from "antd";
// import produce from "immer";
import { Stimulus, QuestionNumberLabel, highlightSelectedText, WithResources } from "@edulastic/common";
import { InstructorStimulus } from "./styled/InstructorStimulus";
import { Heading } from "./styled/Heading";
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import ColorPicker from "./ColorPicker";
import { ColorPickerContainer, Overlay } from "./styled/ColorPicker";

const ContentsTitle = Heading;

const hexc = orig => {
  const rgb = orig.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+)/i);
  return rgb && rgb.length === 4
    ? `#${`0${parseInt(rgb[1], 10).toString(16)}`.slice(-2)}${`0${parseInt(rgb[2], 10).toString(16)}`.slice(
        -2
      )}${`0${parseInt(rgb[3], 10).toString(16)}`.slice(-2)}`
    : orig;
};

let startedSelectingText = false;

const PassageView = ({ item, preview, showQuestionNumber, flowLayout, setHighlights, highlights }) => {
  const mainContentsRef = useRef();
  const [page, setPage] = useState(1);
  const [selected, toggleColorPicker] = useState(null);
  console.log(highlights);
  useEffect(() => {
    if (preview) {
      const editors = document.getElementsByClassName("ql-editor");
      if (isArray(editors) && editors.length) {
        editors[0].contentEditable = false;
      }
    }
  }, []);

  const addEventToSelectedText = () => {
    if (window.$) {
      const jQuery = window.$;
      jQuery(".selected-text-heighlight").each(function(index) {
        jQuery(this).on("mouseenter", function() {
          if (!selected && !startedSelectingText) {
            const top = this.offsetTop + this.offsetHeight + 1; // 1px is for the arrow point
            const left = this.offsetLeft;
            const bg = hexc(jQuery(this).css("backgroundColor"));
            toggleColorPicker({ top, left, bg, index });
          }
        });
      });
    }
  };

  const handleHighlight = () => {
    startedSelectingText = false;
    highlightSelectedText("selected-text-heighlight unsaved");
    addEventToSelectedText();
  };

  const clickHighligter = color => {
    if (mainContentsRef.current) {
      let { innerHTML: updatedContent } = mainContentsRef.current;
      const regex = new RegExp('<span(.*?)class="selected-text-heighlight(.*?)"(.*?)>(.*?)</span>', "g");
      let matchs = updatedContent.match(regex);
      if (matchs && matchs[selected.index]) {
        const matchString = matchs[selected.index];
        matchs = regex.exec(matchString);
        if (matchs) {
          const highlightStyle = `style="background-color:${color}"`;
          const replaceStr = color
            ? `<span ${highlightStyle} class="selected-text-heighlight active">${matchs.slice(4)}</span>`
            : matchs.slice(4);
          updatedContent = updatedContent.replace(new RegExp(matchString, "g"), replaceStr);
        }
        if (!color) {
          toggleColorPicker(null);
        }
        if (setHighlights) {
          setHighlights([{ value: "asdfasdf", color: "#33333" }]);
        }
      }
    }
  };

  const handleMouseDown = () => {
    startedSelectingText = true;
  };

  return (
    <WithResources
      resources={["https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"]}
      fallBack={<div />}
      onLoaded={addEventToSelectedText}
    >
      {item.instructorStimulus && !flowLayout && (
        <InstructorStimulus dangerouslySetInnerHTML={{ __html: item.instructorStimulus }} />
      )}
      {!flowLayout && (
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
          {item.heading && <Heading dangerouslySetInnerHTML={{ __html: item.heading }} />}
        </QuestionTitleWrapper>
      )}

      {item.contentsTitle && !flowLayout && <ContentsTitle dangerouslySetInnerHTML={{ __html: item.contentsTitle }} />}
      {!item.paginated_content && item.content && (
        <Stimulus
          id="mainContents-ooooo"
          innerRef={mainContentsRef}
          onMouseUp={handleHighlight}
          onMouseDown={handleMouseDown}
          dangerouslySetInnerHTML={{ __html: item.content }}
          userSelect
        />
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
      {selected && (
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
  highlights: PropTypes.any.isRequired,
  item: PropTypes.object.isRequired,
  preview: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  flowLayout: PropTypes.bool
};

PassageView.defaultProps = {
  preview: false,
  showQuestionNumber: false,
  flowLayout: false
};

PassageView.modules = {
  toolbar: {
    container: "#myToolbar"
  }
};

PassageView.formats = ["background"];

export default PassageView;
