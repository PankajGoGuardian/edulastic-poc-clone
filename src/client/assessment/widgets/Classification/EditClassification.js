import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { arrayMove } from "react-sortable-hoc";
import { connect } from "react-redux";

import { withTheme } from "styled-components";
import { compose } from "redux";
import { uniq } from "lodash";
import produce from "immer";

import { Paper, Checkbox, EduButton, FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { message, Upload } from "antd";
import { TokenStorage, API_CONFIG } from "@edulastic/api";
import CorrectAnswers from "../../components/CorrectAnswers";

import withPoints from "../../components/HOC/withPoints";

import { EDIT } from "../../constants/constantsForQuestions";

import { updateVariables } from "../../utils/variables";

import { setQuestionDataAction, setFirstMountAction } from "../../../author/QuestionEditor/ducks";

import GroupPossibleResponses from "./components/GroupPossibleResponses";
import ClassificationPreview from "./ClassificationPreview";
import Options from "./components/Options";
import { Widget } from "../../styled/Widget";

import ComposeQuestion from "./ComposeQuestion";
import RowColumn from "./RowColumn";

const OptionsList = withPoints(ClassificationPreview);

const { Dragger } = Upload;

const actions = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  SORTEND: "SORTEND"
};

const EditClassification = ({
  item,
  setQuestionData,
  setFirstMount,
  theme,
  t,
  advancedAreOpen,
  fillSections,
  cleanSections
}) => {
  const {
    firstMount,
    shuffle_options,
    transparent_possible_responses,
    duplicate_responses,
    ui_style: { show_drag_handle }
  } = item;

  const [correctTab, setCorrectTab] = useState(0);

  useEffect(
    () => () => {
      setFirstMount(item.id);
    },
    []
  );

  const getImageWidth = url => {
    const img = new Image();
    const that = this;
    img.addEventListener("load", function() {
      const width = this.naturalWidth >= 700 ? 700 : this.naturalWidth;
      (wid => {
        that.onItemPropChange("imageWidth", wid);
      })(width);
    });
    img.src = url;
  };

  const handleItemChangeChange = (prop, uiStyle) => {
    setQuestionData(
      produce(item, draft => {
        draft[prop] = uiStyle;
        if (prop === "duplicate_responses" && uiStyle === false) {
          const colCount = draft.ui_style.column_count;
          const rowCount = draft.ui_style.row_count;
          const initialLength = (colCount || 2) * (rowCount || 1);
          draft.validation.valid_response.value = Array(...Array(initialLength)).map(() => []);

          draft.validation.alt_responses.forEach(ite => {
            ite.value = Array(...Array(initialLength)).map(() => []);
          });
        }
        updateVariables(draft);
      })
    );
  };

  const onGroupPossibleResp = e => {
    setQuestionData(
      produce(item, draft => {
        draft.group_possible_responses = e.target.checked;
        updateVariables(draft);
      })
    );
  };

  const handleGroupAdd = () => {
    setQuestionData(
      produce(item, draft => {
        draft.possible_response_groups.push({ title: "", responses: [] });
        updateVariables(draft);
      })
    );
  };

  const handleGroupRemove = index => () => {
    setQuestionData(
      produce(item, draft => {
        const colCount = draft.ui_style.column_count;
        const rowCount = draft.ui_style.row_count;

        const initialLength = (colCount || 2) * (rowCount || 1);
        draft.validation.valid_response.value = Array(...Array(initialLength)).map(() => []);

        draft.validation.alt_responses.forEach(ite => {
          ite.value = Array(...Array(initialLength)).map(() => []);
        });

        draft.possible_response_groups.splice(index, 1);
        updateVariables(draft);
      })
    );
  };

  const onAddInner = index => () => {
    setQuestionData(
      produce(item, draft => {
        draft.possible_response_groups[index].responses.push("");
        updateVariables(draft);
      })
    );
  };

  const onRemoveInner = ind => index => {
    setQuestionData(
      produce(item, draft => {
        const colCount = draft.ui_style.column_count;
        const rowCount = draft.ui_style.row_count;

        const initialLength = (colCount || 2) * (rowCount || 1);
        draft.validation.valid_response.value = Array(...Array(initialLength)).map(() => []);

        draft.validation.alt_responses.forEach(ite => {
          ite.value = Array(...Array(initialLength)).map(() => []);
        });

        draft.possible_response_groups[ind].responses.splice(index, 1);
        updateVariables(draft);
      })
    );
  };

  const onGroupTitleChange = (index, value) => {
    setQuestionData(
      produce(item, draft => {
        draft.possible_response_groups[index].title = value;
        updateVariables(draft);
      })
    );
  };

  const handleGroupSortEnd = index => ({ oldIndex, newIndex }) => {
    setQuestionData(
      produce(item, draft => {
        draft.possible_response_groups[index].responses = arrayMove(
          draft.possible_response_groups[index].responses,
          oldIndex,
          newIndex
        );
        updateVariables(draft);
      })
    );
  };

  const handleGroupChange = ind => (index, value) => {
    setQuestionData(
      produce(item, draft => {
        draft.possible_response_groups[ind].responses[index] = value;
        updateVariables(draft);
      })
    );
  };

  const handleMainPossible = action => restProp => {
    setQuestionData(
      produce(item, draft => {
        switch (action) {
          case actions.ADD:
            draft.possible_responses.push("");
            break;

          case actions.REMOVE:
            draft.validation.valid_response.value.forEach(arr => {
              if (arr.includes(restProp)) {
                arr.splice(arr.indexOf(restProp), 1);
              }
            });
            draft.validation.alt_responses.forEach(arrs => {
              arrs.value.forEach(arr => {
                if (arr.includes(restProp)) {
                  arr.splice(arr.indexOf(restProp), 1);
                }
              });
            });
            draft.possible_responses.splice(restProp, 1);
            break;

          case actions.SORTEND:
            draft.possible_responses = arrayMove(item.possible_responses, restProp.oldIndex, restProp.newIndex);
            break;

          default:
            return;
        }
        updateVariables(draft);
      })
    );
  };

  const handleChangePossible = () => (index, value) => {
    setQuestionData(
      produce(item, draft => {
        draft.possible_responses[index] = value;
        updateVariables(draft);
      })
    );
  };

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.validation.alt_responses) {
          draft.validation.alt_responses = [];
        }
        draft.validation.alt_responses.push({
          score: 1,
          value: item.validation.valid_response.value
        });

        updateVariables(draft);
      })
    );
    setCorrectTab(correctTab + 1);
  };

  const handleCloseTab = tabIndex => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.alt_responses.splice(tabIndex, 1);
        updateVariables(draft);
      })
    );
    setCorrectTab(0);
  };

  const handlePointsChange = val => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.valid_response.score = val;
        } else {
          draft.validation.alt_responses[correctTab - 1].score = val;
        }
        updateVariables(draft);
      })
    );
  };

  const handleAnswerChange = answer => {
    setQuestionData(
      produce(item, draft => {
        let groupArray = item.group_possible_responses ? [] : item.possible_responses;

        if (item.group_possible_responses) {
          item.possible_response_groups.forEach(group => {
            groupArray = uniq([...groupArray, ...group.responses].map(ans => uniq(ans)));
          });
        }

        if (correctTab === 0) {
          if (draft.validation && draft.validation.valid_response) {
            draft.validation.valid_response.value = uniq([...answer].map(ans => uniq(ans)));
          }
        } else if (draft.validation && draft.validation.alt_responses && draft.validation.alt_responses[correctTab - 1])
          draft.validation.alt_responses[correctTab - 1].value = uniq([...answer].map(ans => uniq(ans)));

        updateVariables(draft);
      })
    );
  };

  const onUiChange = prop => val => {
    setQuestionData(
      produce(item, draft => {
        draft.ui_style[prop] = val;

        const colCount = draft.ui_style.column_count;
        const rowCount = draft.ui_style.row_count;

        const initialLength = (colCount || 2) * (rowCount || 1);

        if (prop === "column_count" || prop === "row_count") {
          draft.validation.valid_response.value = Array(...Array(initialLength)).map(() => []);

          draft.validation.alt_responses.forEach(ite => {
            ite.value = Array(...Array(initialLength)).map(() => []);
          });
        }

        updateVariables(draft);
      })
    );
  };

  const renderOptions = () => (
    <OptionsList
      item={item}
      points={
        correctTab === 0 ? item.validation.valid_response.score : item.validation.alt_responses[correctTab - 1].score
      }
      onChangePoints={handlePointsChange}
      saveAnswer={handleAnswerChange}
      editCorrectAnswers={
        correctTab === 0 ? item.validation.valid_response.value : item.validation.alt_responses[correctTab - 1].value
      }
      view={EDIT}
    />
  );

  const handleImageUpload = info => {
    const { status, response } = info.file;
    if (status === "done") {
      message.success(`${info.file.name} ${t("component.cloze.imageText.fileUploadedSuccessfully")}.`);
      const imageUrl = response.result.fileUri;
      getImageWidth(imageUrl);
      handleItemChangeChange("imageUrl", imageUrl);
    } else if (status === "error") {
      message.error(`${info.file.name} ${t("component.cloze.imageText.fileUploadFailed")}.`);
    }
  };
  const draggerProps = {
    name: "file",
    action: `${API_CONFIG.api}/file/upload`,
    headers: {
      "X-Requested-With": null,
      authorization: TokenStorage.getAccessToken()
    }
  };

  return (
    <Fragment>
      <Paper padding="0px" boxShadow="none">
        <ComposeQuestion item={item} fillSections={fillSections} cleanSections={cleanSections} />
        <Widget>
          {item.imageUrl ? (
            <FlexContainer flexDirection="column">
              <img src={item.imageUrl} alt="backgroundImage" />
              <EduButton
                onClick={() => handleItemChangeChange("imageUrl", "")}
                style={{ marginTop: 20 }}
                type="primary"
              >
                {t("component.classification.deleteBackImage")}
              </EduButton>
            </FlexContainer>
          ) : (
            <Dragger
              className="super-dragger styled-dragger"
              {...draggerProps}
              style={{ padding: 0, marginTop: 20, background: "transparent" }}
              onChange={handleImageUpload}
              showUploadList={false}
            >
              <EduButton type="primary">{t("component.classification.addBackImage")}</EduButton>
            </Dragger>
          )}
        </Widget>
        <RowColumn item={item} theme={theme} fillSections={fillSections} cleanSections={cleanSections} />
        <Widget>
          <GroupPossibleResponses
            checkboxChange={onGroupPossibleResp}
            checkboxVal={item.group_possible_responses}
            items={
              item.group_possible_responses ? item.possible_response_groups : item.possible_responses.map(ite => ite)
            }
            onAddInner={onAddInner}
            onTitleChange={onGroupTitleChange}
            onAdd={item.group_possible_responses ? handleGroupAdd : handleMainPossible(actions.ADD)}
            onSortEnd={item.group_possible_responses ? handleGroupSortEnd : handleMainPossible(actions.SORTEND)}
            firstFocus={firstMount}
            onChange={item.group_possible_responses ? handleGroupChange : handleChangePossible()}
            onRemoveInner={onRemoveInner}
            onRemove={item.group_possible_responses ? handleGroupRemove : handleMainPossible(actions.REMOVE)}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
        </Widget>
        <Widget>
          <div style={{ marginTop: 20 }}>
            <Checkbox
              className="additional-options"
              onChange={() => onUiChange("show_drag_handle")(!show_drag_handle)}
              label={t("component.cloze.imageDragDrop.showdraghandle")}
              checked={!!show_drag_handle}
            />
            <Checkbox
              className="additional-options"
              onChange={() => handleItemChangeChange("duplicate_responses", !duplicate_responses)}
              label={t("component.cloze.imageDragDrop.duplicatedresponses")}
              checked={!!duplicate_responses}
            />
            <Checkbox
              className="additional-options"
              onChange={() => handleItemChangeChange("shuffle_options", !shuffle_options)}
              label={t("component.cloze.imageDragDrop.shuffleoptions")}
              checked={!!shuffle_options}
            />
            <Checkbox
              className="additional-options"
              onChange={() => handleItemChangeChange("transparent_possible_responses", !transparent_possible_responses)}
              label={t("component.cloze.imageDragDrop.transparentpossibleresponses")}
              checked={!!transparent_possible_responses}
            />
          </div>
        </Widget>
        <Widget>
          <CorrectAnswers
            onTabChange={setCorrectTab}
            correctTab={correctTab}
            onAdd={handleAddAnswer}
            validation={item.validation}
            options={renderOptions()}
            onCloseTab={handleCloseTab}
            fillSections={fillSections}
            cleanSections={cleanSections}
            marginBottom="-50px"
          />
        </Widget>
      </Paper>
      <Options advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections} />
    </Fragment>
  );
};

EditClassification.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  setFirstMount: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

EditClassification.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme,
  connect(
    null,
    { setQuestionData: setQuestionDataAction, setFirstMount: setFirstMountAction }
  )
);

export default enhance(EditClassification);
