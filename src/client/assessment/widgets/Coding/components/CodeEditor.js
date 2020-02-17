import { themeColor, white } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import produce from "immer";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { compose } from "redux";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";
import { SelectInputStyled } from "../../../styled/InputStyles";
import { updateVariables } from "../../../utils/variables";
import { loadModeSpecificfiles } from "../ace";
import { EditorHeader, StyledCodeEditorWrapper } from "../styled";

const CodeEditor = ({
  item,
  type,
  onChange,
  setQuestionData,
  onChangeLang,
  focus,
  style = {},
  editorStyle = {},
  renderActions,
  t
}) => {
  const [selectedLang, setSelectedLang] = useState({});

  useEffect(() => {
    const selectedLang = { label: "JAVASCRIPT", lang: "javascript" };
    loadModeSpecificfiles(selectedLang)
      .then(() => {
        onLangChange(selectedLang);
      })
      .catch(() => onLangChange(selectedLang));
  }, []);

  const onEditorChange = (lang, value) => {
    if (onChange) {
      return onChange(lang, value);
    }

    setQuestionData(
      produce(item, draft => {
        const selected = draft[type].find(stub => stub.lang === lang);
        if (selected) {
          draft[type] = draft[type].map(cs => {
            if (cs.lang === lang) {
              cs.code = value;
            }
            return cs;
          });
        } else {
          draft[type].push({
            code: value,
            lang
          });
        }
        updateVariables(draft);
      })
    );
  };

  const onLangChange = value => {
    setSelectedLang(value);

    if (onChangeLang) {
      return onChangeLang(value.label, null);
    }
    setQuestionData(
      produce(item, draft => {
        const isSelected = draft[type].find(stub => stub.lang === value);
        if (!isSelected) {
          draft[type].push({
            lang: value.label
          });
        }
        updateVariables(draft);
      })
    );
  };

  const buttonStyle = {
    width: "auto",
    height: "30px",
    margin: "0px 0px 0px 10px",
    padding: "0px 15px",
    display: "inline-block",
    border: `1px solid ${themeColor} !important`
  };

  const renderButtons = () => {
    if (renderActions) {
      return renderActions();
    }
    return [
      <CustomStyleBtn style={buttonStyle} bg="transparent" color={themeColor}>
        {t("component.coding.codeStubClearAllBtntext")}
      </CustomStyleBtn>,
      <CustomStyleBtn style={buttonStyle} bg="transparent" color={themeColor}>
        {t("component.coding.codeStubReadOnlyBtnText")}
      </CustomStyleBtn>,
      <CustomStyleBtn style={buttonStyle} bg={themeColor}>
        {t("component.coding.codeStubRunCodeBtnText")}
      </CustomStyleBtn>,
      <CustomStyleBtn style={buttonStyle} bg={themeColor}>
        {t("component.coding.codeStubRunAllTestBtnText")}
      </CustomStyleBtn>
    ];
  };

  const settings = {
    ...item.editorConfig,
    mode: selectedLang
  };

  const codeStubForSpecificLang = item[type].find(cs => cs.lang.toLowerCase() === selectedLang?.label?.toLowerCase());

  return (
    <StyledCodeEditorWrapper style={style}>
      <EditorHeader>
        <SelectInputStyled
          value={selectedLang.label}
          data-cy="math-keyboard-dropdown"
          className="keyboard__header__select"
          size="large"
          onSelect={onLangChange}
          width="200px"
          bg={white}
        >
          {item.languages.map((lang, index) => (
            <SelectInputStyled.Option value={lang} key={index} data-cy={`math-keyboard-dropdown-list-${index}`}>
              {lang.label}
            </SelectInputStyled.Option>
          ))}
        </SelectInputStyled>
        <div>{renderButtons()}</div>
      </EditorHeader>
      <AceEditor
        mode={settings.mode.lang}
        theme={settings.theme}
        name="aceEditor"
        onChange={value => onEditorChange(settings.mode.label, value)}
        value={codeStubForSpecificLang?.code}
        fontSize={parseInt(settings.fontSize, 10)}
        showPrintMargin
        showGutter
        highlightActiveLine
        readOnly={settings.readOnly}
        width="100%"
        height="400px"
        debounceChangePeriod={2000}
        enableBasicAutocompletion={settings.autoComplete}
        enableLiveAutocompletion={settings.autoComplete}
        enableSnippets
        keyboardHandler={settings.keyboardHandler}
        enableEmmet
        tabSize={parseInt(settings.tabSize, 10)}
        focus={!!focus}
        setOptions={{
          useWorker: true
        }}
        style={editorStyle}
      />
    </StyledCodeEditorWrapper>
  );
};

CodeEditor.propTypes = {
  item: PropTypes.object,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  onChangeLang: PropTypes.func.isRequired,
  focus: PropTypes.bool
};

const enhance = compose(withNamespaces("assessment"));
export default enhance(CodeEditor);
