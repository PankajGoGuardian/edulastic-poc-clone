import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import produce from "immer";
import AceEditor from "react-ace";
import { Select } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { compose } from "redux";
import "../ace";

import { Subtitle } from "../../../styled/Subtitle";
import { StyledButton } from "../styled";
import { StyledCodeEditorWrapper, SubtitleContainer, StyledActionWrapper } from "../styled";
import { updateVariables } from "../../../utils/variables";
import { loadModeSpecificfiles } from "../ace";

const CodeEditor = ({
  item,
  type,
  onChange,
  setQuestionData,
  onChangeLang,
  focus,
  style = {},
  headerStyle = {},
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

  const renderButtons = () => {
    if (renderActions) {
      return renderActions();
    }
    return [
      <CodeStubStyledButton>{t("component.coding.codeStubClearAllBtntext")}</CodeStubStyledButton>,
      <CodeStubStyledButton>{t("component.coding.codeStubReadOnlyBtnText")}</CodeStubStyledButton>,
      <CodeStubStyledButton>{t("component.coding.codeStubRunCodeBtnText")}</CodeStubStyledButton>,
      <CodeStubStyledButton>{t("component.coding.codeStubRunAllTestBtnText")}</CodeStubStyledButton>
    ];
  };

  const settings = {
    ...item.editorConfig,
    mode: selectedLang
  };

  const codeStubForSpecificLang = item[type].find(cs => cs.lang.toLowerCase() === selectedLang?.label?.toLowerCase());

  return (
    <StyledCodeEditorWrapper style={style}>
      <SubtitleContainer style={headerStyle}>
        <Subtitle textStyles={{ margin: "0", width: "100%" }} showIcon={false}>
          <Select
            value={selectedLang.label}
            data-cy="math-keyboard-dropdown"
            className="keyboard__header__select"
            size="large"
            onSelect={onLangChange}
            style={{
              width: 200
            }}
          >
            {item.languages.map((lang, index) => (
              <Select.Option value={lang} key={index} data-cy={`math-keyboard-dropdown-list-${index}`}>
                {lang.label}
              </Select.Option>
            ))}
          </Select>
          <StyledActionWrapper>{renderButtons()}</StyledActionWrapper>
        </Subtitle>
      </SubtitleContainer>
      <AceEditor
        mode={settings.mode.lang}
        theme={settings.theme}
        name="aceEditor"
        onChange={value => onEditorChange(settings.mode.label, value)}
        value={codeStubForSpecificLang?.code}
        fontSize={parseInt(settings.fontSize, 10)}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        readOnly={settings.readOnly}
        width="100%"
        height="400px"
        debounceChangePeriod={2000}
        enableBasicAutocompletion={settings.autoComplete}
        enableLiveAutocompletion={settings.autoComplete}
        enableSnippets={true}
        keyboardHandler={settings.keyboardHandler}
        enableEmmet={true}
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

const CodeStubStyledButton = styled(StyledButton)`
  margin-left: 5px;
  float: none;
`;

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
