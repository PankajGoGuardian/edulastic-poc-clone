import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { arrayMove } from "react-sortable-hoc";
import { cloneDeep } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { Button, PaddingDiv } from "@edulastic/common";
import { setQuestionDataAction } from "../../../../../author/QuestionEditor/ducks";
import QuestionTextArea from "../../../QuestionTextArea";
import { Subtitle } from "../../../../styled/Subtitle";
import Question from "../../../Question";
import QuillSortableList from "../../../QuillSortableList";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

class GraphQuadrants extends Component {
  isQuadrantsPlacement = () => {
    const { graphData } = this.props;
    const { graphType } = graphData;
    return graphType === "quadrantsPlacement";
  };

  onChangeQuestion = stimulus => {
    const { graphData, setQuestionData } = this.props;
    setQuestionData({ ...graphData, stimulus });
  };

  handleCanvasBlur = (event, defaultValue) => {
    const { value, name } = event.target;
    const { graphData, setQuestionData } = this.props;
    const { canvas } = graphData;

    if (!value) {
      canvas[name] = defaultValue;
      setQuestionData({ ...graphData, canvas });
    }
  };

  onSortOrderListEnd = ({ oldIndex, newIndex }) => {
    const { graphData, setQuestionData } = this.props;

    setQuestionData({
      ...graphData,
      list: arrayMove(graphData.list, oldIndex, newIndex)
    });
  };

  handleChangeListItem = (index, value) => {
    const { setQuestionData, graphData } = this.props;
    const list = cloneDeep(graphData.list);

    list[index].text = value;

    const responses = [graphData.validation.validResponse, ...graphData.validation.altResponses];
    responses.forEach(response => {
      const responseValue = response.value.find(el => el.id === list[index].id);
      if (responseValue) {
        responseValue.text = value;
      }
    });

    setQuestionData({ ...graphData, list });
  };

  handleDeleteListItem = index => {
    const { setQuestionData, graphData } = this.props;

    const filteredItems = cloneDeep(graphData.list).filter((q, i) => i !== index);

    const responses = [graphData.validation.validResponse, ...graphData.validation.altResponses];
    responses.forEach(response => {
      response.value = response.value.filter(el => el.id !== graphData.list[index].id);
    });

    setQuestionData({ ...graphData, list: filteredItems });
  };

  handleAddListItem = () => {
    const { setQuestionData, graphData } = this.props;
    const newItem = cloneDeep(graphData);

    newItem.list = newItem.list.concat({
      text: "New Option",
      id: `list-item-${Math.random()
        .toString(36)
        .substr(2, 9)}`
    });

    setQuestionData({ ...graphData, list: newItem.list });
  };

  render() {
    const { t, graphData, fillSections, cleanSections, fontSize } = this.props;

    return (
      <div>
        <Question
          section="main"
          label="Compose Question"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen
        >
          <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.question.composequestion")}`)}>
            {t("component.graphing.question.composequestion")}
          </Subtitle>

          <QuestionTextArea
            onChange={this.onChangeQuestion}
            value={graphData.stimulus}
            firstFocus={graphData.firstMount}
            placeholder={t("component.graphing.question.enteryourquestion")}
            border="border"
            fontSize={fontSize}
          />
        </Question>
        {this.isQuadrantsPlacement() && (
          <Question
            section="main"
            label="Possible Responses"
            cleanSections={cleanSections}
            fillSections={fillSections}
            advancedAreOpen
          >
            <PaddingDiv>
              <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.possibleresponses")}`)}>
                {t("component.graphing.possibleresponses")}
              </Subtitle>
              <QuillSortableList
                items={graphData.list.map(o => o.text)}
                onSortEnd={this.onSortOrderListEnd}
                useDragHandle
                onRemove={this.handleDeleteListItem}
                onChange={this.handleChangeListItem}
              />
              <Button
                style={{ minWidth: 130, marginTop: 10 }}
                onClick={this.handleAddListItem}
                variant="extendedFab"
                outlined
                type="button"
                color="primary"
              >
                {t("component.graphing.addnewpossibleresponsebtn")}
              </Button>
            </PaddingDiv>
          </Question>
        )}
      </div>
    );
  }
}

GraphQuadrants.propTypes = {
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(GraphQuadrants);
