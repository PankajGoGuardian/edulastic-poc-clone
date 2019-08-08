import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { connect } from "react-redux";
import { arrayMove } from "react-sortable-hoc";

import { Paper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import withPoints from "../../components/HOC/withPoints";
import CorrectAnswers from "../../components/CorrectAnswers";

import { EDIT } from "../../constants/constantsForQuestions";

import GroupPossibleResponses from "./components/GroupPossibleResponses";
import MatchListPreview from "./MatchListPreview";
import Options from "./components/Options";
import Question from "../../components/Question";
import { ContentArea } from "../../styled/ContentArea";
import { updateVariables } from "../../utils/variables";

import ComposeQuestion from "./ComposeQuestion";
import ListComponent from "./ListComponent";

const OptionsList = withPoints(MatchListPreview);

const MatchListEdit = ({ isNew, item: itemProp, setQuestionData, advancedAreOpen, fillSections, cleanSections, t }) => {
  const [correctTab, setCorrectTab] = useState(0);
  const [item, setItem] = useState(itemProp);

  useEffect(() => {
    setItem(itemProp);
    if (!itemProp.groupPossibleResponses !== item.groupPossibleResponses) {
      setItem(
        produce(itemProp, draft => {
          draft.possibleResponseGroups[0].responses = draft.possibleResponses;
        })
      );
    }
  }, [itemProp, item.possibleResponses]);

  const _setQuestionData = questionData => {
    setQuestionData(
      produce(questionData, draft => {
        updateVariables(draft);
      })
    );
  };

  const handleAddResp = () => {
    _setQuestionData(
      produce(item, draft => {
        draft.possibleResponses.push("");
      })
    );
  };

  const handleRemoveResp = index => {
    _setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse.value.splice(
          draft.validation.validResponse.value.indexOf(draft.possibleResponses[index]),
          1
        );

        draft.validation.altResponses.forEach(ite => {
          ite.value.splice(ite.value.indexOf(draft.possibleResponses[index]), 1);
        });

        draft.possibleResponses.splice(index, 1);
      })
    );
  };

  const handleSortEndResp = ({ oldIndex, newIndex }) => {
    _setQuestionData(
      produce(item, draft => {
        draft.possibleResponses = arrayMove(item.possibleResponses, oldIndex, newIndex);
      })
    );
  };

  const handleChangeResp = (index, value) => {
    _setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse.value[
          draft.validation.validResponse.value.indexOf(draft.possibleResponses[index])
        ] = value;
        draft.validation.altResponses.forEach(ite => {
          ite.value[ite.value.indexOf(draft.possibleResponses[index])] = value;
        });

        draft.possibleResponses[index] = value;
      })
    );
  };

  const handleAddAnswer = () => {
    _setQuestionData(
      produce(item, draft => {
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = [];
        }
        draft.validation.altResponses.push({
          score: 1,
          value: Array.from({
            length: item.validation.validResponse.value.length
          }).fill(null)
        });
      })
    );
    setCorrectTab(correctTab + 1);
  };

  const handleCloseTab = tabIndex => {
    _setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.splice(tabIndex, 1);

        setCorrectTab(0);
      })
    );
  };

  const handlePointsChange = val => {
    _setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.validResponse.score = val;
        } else {
          draft.validation.altResponses[correctTab - 1].score = val;
        }
      })
    );
  };

  const handleAnswerChange = ans => {
    _setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.validResponse.value = ans;
        } else {
          draft.validation.altResponses[correctTab - 1].value = ans;
        }
      })
    );
  };

  const onGroupPossibleResp = e => {
    _setQuestionData(
      produce(item, draft => {
        draft.groupPossibleResponses = e.target.checked;
      })
    );
  };

  const onGroupTitleChange = (index, value) => {
    _setQuestionData(
      produce(item, draft => {
        draft.possibleResponseGroups[index].title = value;
      })
    );
  };

  const renderOptions = () => (
    <OptionsList
      item={item}
      points={
        correctTab === 0 ? item.validation.validResponse.score : item.validation.altResponses[correctTab - 1].score
      }
      onChangePoints={handlePointsChange}
      saveAnswer={handleAnswerChange}
      editCorrectAnswers={
        correctTab === 0 ? item.validation.validResponse.value : item.validation.altResponses[correctTab - 1].value
      }
      view={EDIT}
    />
  );

  const onAddInner = index => () => {
    _setQuestionData(
      produce(item, draft => {
        draft.possibleResponseGroups[index].responses.push("");
      })
    );
  };

  const onRemoveInner = ind => index => {
    _setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse.value = Array.from({
          length: item.validation.validResponse.value.length
        }).fill(null);

        draft.validation.altResponses.forEach(ite => {
          ite.value = Array.from({
            length: item.validation.validResponse.value.length
          }).fill(null);
        });

        draft.possibleResponseGroups[ind].responses.splice(index, 1);
      })
    );
  };

  const handleGroupAdd = () => {
    _setQuestionData(
      produce(item, draft => {
        draft.possibleResponseGroups.push({ title: "", responses: [] });
      })
    );
  };

  const handleGroupRemove = index => () => {
    _setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse.value = Array.from({
          length: item.validation.validResponse.value.length
        }).fill(null);

        draft.validation.altResponses.forEach(ite => {
          ite.value = Array.from({
            length: item.validation.validResponse.value.length
          }).fill(null);
        });

        draft.possibleResponseGroups.splice(index, 1);
      })
    );
  };

  const handleGroupSortEnd = index => ({ oldIndex, newIndex }) => {
    _setQuestionData(
      produce(item, draft => {
        draft.possibleResponseGroups[index].responses = arrayMove(
          draft.possibleResponseGroups[index].responses,
          oldIndex,
          newIndex
        );
      })
    );
  };

  const handleGroupChange = ind => (index, value) => {
    _setQuestionData(
      produce(item, draft => {
        draft.possibleResponseGroups[ind].responses[index] = value;
      })
    );
  };

  return (
    <ContentArea>
      <Paper padding="0px" boxShadow="none">
        <ComposeQuestion item={item} fillSections={fillSections} cleanSections={cleanSections} />
        <ListComponent item={item} fillSections={fillSections} cleanSections={cleanSections} />
        <Question
          section="main"
          label={t("component.matchList.possibleRespTitle")}
          fillSections={fillSections}
          cleanSections={cleanSections}
        >
          <GroupPossibleResponses
            checkboxChange={onGroupPossibleResp}
            checkboxVal={item.groupPossibleResponses}
            items={item.groupPossibleResponses ? item.possibleResponseGroups : item.possibleResponses}
            firstFocus={item.firstMount}
            onAddInner={onAddInner}
            onTitleChange={onGroupTitleChange}
            onAdd={item.groupPossibleResponses ? handleGroupAdd : handleAddResp}
            onSortEnd={item.groupPossibleResponses ? handleGroupSortEnd : handleSortEndResp}
            onChange={item.groupPossibleResponses ? handleGroupChange : handleChangeResp}
            onRemoveInner={onRemoveInner}
            onRemove={item.groupPossibleResponses ? handleGroupRemove : handleRemoveResp}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
        </Question>
        <CorrectAnswers
          onTabChange={setCorrectTab}
          correctTab={correctTab}
          onAdd={handleAddAnswer}
          validation={item.validation}
          options={renderOptions()}
          onCloseTab={handleCloseTab}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />
      </Paper>
      <Options advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections} />
    </ContentArea>
  );
};

MatchListEdit.propTypes = {
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

MatchListEdit.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )(MatchListEdit)
);
