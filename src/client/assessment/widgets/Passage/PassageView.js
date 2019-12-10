// /* eslint-disable */

import React, { useState, useEffect, useRef } from "react";
import { isArray } from "lodash";
import PropTypes from "prop-types";
import { Pagination } from "antd";
import produce from "immer";
import { Stimulus, highlightSelectedText, WithResources, decodeHTML, rgbToHexc, RefContext } from "@edulastic/common";
import { InstructorStimulus } from "./styled/InstructorStimulus";
import { Heading } from "./styled/Heading";
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import ColorPicker from "./ColorPicker";
import { ColorPickerContainer, Overlay } from "./styled/ColorPicker";
import AppConfig from "../../../../../app-config";

const ContentsTitle = Heading;
let startedSelectingText = false;
const highlightTag = "my-highlight";

const PassageView = ({
  item,
  preview,
  flowLayout,
  setHighlights,
  highlights = [],
  userWork = [],
  saveUserWork,
  clearUserWork
}) => {
  const mainContentsRef = useRef();
  const [page, setPage] = useState(1);
  const [selected, toggleColorPicker] = useState(null);

  // use the userWork in author mode
  const _highlights = setHighlights ? highlights : userWork;

  const onMouseEnter = event => {
    const em = event.target;
    const jQuery = window.$;
    if (!selected && !startedSelectingText) {
      /**
       * top and left will be used to set position of color picker
       */
      const top = em.offsetTop + em.offsetHeight + 1; // 1px is for the arrow point
      const left = em.offsetLeft;

      const id = jQuery(em).attr("id");
      const bg = rgbToHexc(jQuery(em).css("backgroundColor"));
      toggleColorPicker({ top, left, bg, id });
    }
  };

  const everyHeighlight = (_, em) => {
    const jQuery = window.$;
    jQuery(em).on("mouseenter", onMouseEnter);
  };

  const addEventToSelectedText = () => {
    if (window.$) {
      const jQuery = window.$;
      jQuery(".selected-text-heighlight").each(everyHeighlight);
    }
  };

  const handleHighlight = () => {
    startedSelectingText = false;
    highlightSelectedText("selected-text-heighlight unsaved", highlightTag);
    addEventToSelectedText();
  };

  const removeAllHighlight = () => {
    if (window.$) {
      const jQuery = window.$;
      jQuery(".selected-text-heighlight").each((_, em) => {
        jQuery(em).replaceWith(em.innerHTML);
      });
    }
  };

  const getIndexForSameWord = (str, highlightId) => {
    const regex = new RegExp(str, "g");
    let { innerHTML: content } = mainContentsRef.current;
    content = content.replace(/style="(.*?)"/g, "");
    let i = 0;
    let match = regex.exec(content);

    const hStr = `id="${highlightId}"`;
    while (match) {
      const frontStr = content.slice(match.index - (hStr.length + 1), match.index - 1);
      const backStr = content.slice(match.index + str.length, match.index + str.length + `</${highlightTag}>`.length);
      if (backStr === `</${highlightTag}>` && hStr === frontStr) {
        return i;
      }
      i += 1;
      match = regex.exec(content);
    }
  };

  const clickHighligter = color => {
    if (mainContentsRef.current && selected) {
      const { innerHTML: content } = mainContentsRef.current;
      const regex = new RegExp(`<${highlightTag}(.*?)id="(.*?)"(.*?)>(.*?)</${highlightTag}>`, "g");

      const matchs = [];
      let match = regex.exec(content);

      while (match) {
        const text = match.slice(4)[0];
        const id = match.slice(2)[0];
        const index = getIndexForSameWord(text, id);
        matchs.push({ id, text, index });
        match = regex.exec(content);
      }

      const highlightContent = produce(matchs, draft => {
        draft.forEach(element => {
          const exist = _highlights.find(highlight => highlight.id === element.id);
          if (exist) {
            element.color = exist.color;
          }
        });

        draft.forEach((element, index) => {
          if (color === "remove" && element.id === selected.id) {
            draft.splice(index, 1);
          } else if (element.id === selected.id) {
            element.color = color;
          }
        });
      });

      /**
       * if the user selects a text first time and then remove highlight without setting color,
       * we should be removed it using jQuery because React setState does not update in this case
       */
      if (!highlightContent.length) {
        removeAllHighlight();
      }

      if (setHighlights) {
        // this is available only at student side
        setHighlights(highlightContent);
      } else {
        // saving the highlights at author side
        // setHighlights is not available at author side
        saveUserWork({ [item.id]: { resourceId: highlightContent } });
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

    /**
     * we have styles such as font-family, font-size, color from text editor.
     * need to avoid these styles when we replace highlight text
     * stylesArray will be an array of styles from the text editor or v1 question
     */
    const stylesArray = content.match(/style="(.*?)">/g) || [];
    content = content.replace(/style="(.*?)">/g, "<previous-style></previous-style>");

    if (_highlights) {
      for (let i = 0; i < _highlights.length; i++) {
        if (_highlights[i]) {
          const { color, text, id, index } = _highlights[i];

          const highlightStyle = color ? `style="background-color:${color}"` : "";
          const className = color
            ? 'class="selected-text-heighlight active"'
            : 'class="selected-text-heighlight unsaved"';
          const replaceStr = `<${highlightTag} ${highlightStyle} ${className} id="${id}">${text}</${highlightTag}>`;

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

    /**
     * we will add previous styles before return content
     */
    if (stylesArray && content.indexOf("<previous-style></previous-style>") !== -1) {
      for (let i = 0; i < stylesArray.length; i++) {
        content = content.replace("<previous-style></previous-style>", stylesArray[i]);
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
    return () => {
      // clearing the userWork at author side.
      if (!setHighlights) {
        clearUserWork();
      }
    };
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
        <RefContext.Provider value={{ forwardedRef: mainContentsRef }}>
          <Stimulus
            id="mainContents"
            onMouseUp={handleHighlight}
            onMouseDown={handleMouseDown}
            dangerouslySetInnerHTML={{ __html: getContent() }}
            userSelect
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
  item: PropTypes.object.isRequired,
  saveUserWork: PropTypes.func.isRequired,
  clearUserWork: PropTypes.func.isRequired,
  highlights: PropTypes.array,
  userWork: PropTypes.array,
  preview: PropTypes.bool,
  flowLayout: PropTypes.bool
};

PassageView.defaultProps = {
  preview: false,
  flowLayout: false,
  highlights: [],
  userWork: []
};

PassageView.modules = {
  toolbar: {
    container: "#myToolbar"
  }
};

PassageView.formats = ["background"];

export default PassageView;
