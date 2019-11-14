/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

import React, { useState, useEffect, useRef } from "react";
import { isArray } from "lodash";
import PropTypes from "prop-types";
import { Pagination } from "antd";
import produce from "immer";
import { Stimulus, highlightSelectedText, WithResources, decodeHTML, rgbToHexc } from "@edulastic/common";
import { InstructorStimulus } from "./styled/InstructorStimulus";
import { Heading } from "./styled/Heading";
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import ColorPicker from "./ColorPicker";
import { ColorPickerContainer, Overlay } from "./styled/ColorPicker";
import AppConfig from "../../../../../app-config";

const ContentsTitle = Heading;
let startedSelectingText = false;

const PassageView = ({ item, preview, flowLayout, setHighlights, highlights = [] }) => {
  const mainContentsRef = useRef();
  const [page, setPage] = useState(1);
  const [selected, toggleColorPicker] = useState(null);

  const addEventToSelectedText = () => {
    if (window.$) {
      const jQuery = window.$;
      jQuery(".selected-text-heighlight").each(function(index) {
        this.setAttribute("heighlight-index", index);
        jQuery(this).on("mouseenter", function() {
          if (!selected && !startedSelectingText) {
            const top = this.offsetTop + this.offsetHeight + 1; // 1px is for the arrow point
            const left = this.offsetLeft;
            const bg = rgbToHexc(jQuery(this).css("backgroundColor"));
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

  const getIndexForSameWord = (str, highlightIndex) => {
    const regex = new RegExp(str, "g");
    const { innerHTML: content } = mainContentsRef.current;
    let i = 0;
    let match = regex.exec(content);

    const hStr = `heighlight-index="${highlightIndex}"`;

    while (match) {
      const frontStr = content.slice(match.index - (hStr.length + 1), match.index - 1);
      const backStr = content.slice(match.index + str.length, match.index + str.length + 7);
      if (backStr === "</span>" && hStr === frontStr) {
        return i;
      }
      i += 1;
      match = regex.exec(content);
    }
  };

  const clickHighligter = color => {
    if (mainContentsRef.current) {
      const { innerHTML: content } = mainContentsRef.current;
      const regex = new RegExp('<span(.*?)class="selected-text-heighlight(.*?)">(.*?)</span>', "g");
      const matchs = [];
      let match = regex.exec(content);

      while (match) {
        matchs.push({
          text: match.slice(3)[0],
          style: match.slice(1)[0]
        });
        const index = getIndexForSameWord(matchs[matchs.length - 1].text, matchs.length - 1);
        matchs[matchs.length - 1].index = index;
        match = regex.exec(content);
      }

      if (setHighlights) {
        setHighlights(
          produce(matchs, draft => {
            if (color === "remove") {
              draft = draft.splice(selected.index, 1);
            } else {
              draft[selected.index].color = color;
              if (!color) {
                delete draft[selected.index].color;
              }
            }
          })
        );
      }

      if (color === "remove") {
        toggleColorPicker(null);
      }
    }
  };

  const handleMouseDown = () => {
    startedSelectingText = true;
  };

  const getContent = () => {
    let { content } = item;
    content = decodeHTML(content);
    if (highlights) {
      for (let i = 0; i < highlights.length; i++) {
        if (highlights[i]) {
          const { color, style, text, index } = highlights[i];
          const highlightStyle = color ? `style="background-color:${color}"` : style;
          const className = color
            ? 'class="selected-text-heighlight active"'
            : 'class="selected-text-heighlight unsaved"';
          const replaceStr = `<span ${highlightStyle} ${className}>${text}</span>`;
          if (!index) {
            content = content.replace(new RegExp(text), replaceStr);
          } else {
            const regex = new RegExp(text, "g");
            let wordIndex = 0;
            let match = regex.exec(content);
            while (match) {
              if (wordIndex === index) {
                content = content.substr(0, match.index) + replaceStr + content.substr(match.index + text.length);
              }
              wordIndex += 1;
              match = regex.exec(content);
            }
          }
        }
      }
    }
    return content;
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
  }, []);

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
        <Stimulus
          id="mainContents"
          ref={mainContentsRef}
          onMouseUp={handleHighlight}
          onMouseDown={handleMouseDown}
          dangerouslySetInnerHTML={{ __html: getContent() }}
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
  highlights: PropTypes.array.isRequired,
  item: PropTypes.object.isRequired,
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
