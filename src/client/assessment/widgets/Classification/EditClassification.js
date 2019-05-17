import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { arrayMove } from "react-sortable-hoc";
import { connect } from "react-redux";

import { withTheme } from "styled-components";
import { compose } from "redux";
import produce from "immer";

import { Paper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import CorrectAnswers from "../../components/CorrectAnswers";

import withPoints from "../../components/HOC/withPoints";

import { EDIT } from "../../constants/constantsForQuestions";

import { updateVariables } from "../../utils/variables";

import { setQuestionDataAction, setFirstMountAction } from "../../../author/QuestionEditor/ducks";

import GroupPossibleResponses from "./components/GroupPossibleResponses";
import ClassificationPreview from "./ClassificationPreview";
import Options from "./components/Options";
import ComposeQuestion from "./ComposeQuestion";
import RowColumn from "./RowColumn";

const OptionsList = withPoints(ClassificationPreview);

const actions = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  SORTEND: "SORTEND"
};

const EditClassification = ({ item, setQuestionData, setFirstMount, theme, t, fillSections, cleanSections }) => {
  const { firstMount } = item;

  const [correctTab, setCorrectTab] = useState(0);

  useEffect(
    () => () => {
      setFirstMount(item.id);
    },
    []
  );

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
            groupArray = [...groupArray, ...group.responses];
          });
        }

        if (correctTab === 0) {
          if (draft.validation && draft.validation.valid_response) {
            draft.validation.valid_response.value = [...answer];
          }
        } else if (draft.validation && draft.validation.alt_responses && draft.validation.alt_responses[correctTab - 1])
          draft.validation.alt_responses[correctTab - 1].value = [...answer];

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

  return (
    <Fragment>
      <Paper padding="0px" boxShadow="none">
        <ComposeQuestion item={item} fillSections={fillSections} cleanSections={cleanSections} />
        <RowColumn item={item} theme={theme} fillSections={fillSections} cleanSections={cleanSections} />

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
      </Paper>
      <Options fillSections={fillSections} cleanSections={cleanSections} />
    </Fragment>
  );
};

EditClassification.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  setFirstMount: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

EditClassification.defaultProps = {
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
