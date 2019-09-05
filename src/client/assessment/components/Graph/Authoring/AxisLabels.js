import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { PaddingDiv, Button } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { arrayMove } from "react-sortable-hoc";
import { cloneDeep, clone } from "lodash";
import { StyledTextField, TitleTextInput } from "../common/styled_components";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../styled/Subtitle";
import { setQuestionDataAction } from "../../../../author/QuestionEditor/ducks";
import QuestionTextArea from "../../QuestionTextArea";
import QuillSortableList from "../../QuillSortableList";
import Question from "../../Question";

class GraphAxisLabels extends Component {
  onChangeQuestion = stimulus => {
    const { graphData, setQuestionData } = this.props;
    setQuestionData({ ...graphData, stimulus });
  };

  onSortOrderListEnd = ({ oldIndex, newIndex }) => {
    const { graphData, setQuestionData } = this.props;

    setQuestionData({
      ...graphData,
      list: arrayMove(graphData.list, oldIndex, newIndex)
    });
  };

  handleQuestionsChange = (index, value) => {
    const { setQuestionData, graphData } = this.props;
    const list = cloneDeep(graphData.list);

    list[index].text = value;

    const responses = [graphData.validation.validResponse, ...graphData.validation.altResponses];
    responses.forEach(response => {
      const responseValue = response.value.find(el => el.id === list[index].id);
      if (responseValue) {
        responseValue.point = value;
      }
    });

    setQuestionData({ ...graphData, list });
  };

  handleDeleteQuestion = index => {
    const { setQuestionData, graphData } = this.props;

    const filteredItems = cloneDeep(graphData.list).filter((q, i) => i !== index);

    const responses = [graphData.validation.validResponse, ...graphData.validation.altResponses];
    responses.forEach(response => {
      response.value = response.value.filter(el => el.id !== graphData.list[index].id);
    });

    setQuestionData({ ...graphData, list: filteredItems });
  };

  handleAddQuestion = () => {
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

  handleCanvasChange = event => {
    const { value, name } = event.target;
    const { graphData, setQuestionData } = this.props;
    const { canvas } = graphData;

    canvas[name] = value;
    setQuestionData({ ...graphData, canvas });
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

  render() {
    const { t, graphData, cleanSections, fillSections } = this.props;
    const { canvas, stimulus, firstMount } = graphData;

    return (
      <div>
        <Question
          section="main"
          label="Compose Question"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={true}
        >
          <Subtitle>{t("component.graphing.question.composequestion")}</Subtitle>

          <QuestionTextArea
            placeholder={t("component.graphing.question.enteryourquestion")}
            onChange={this.onChangeQuestion}
            value={stimulus}
            firstFocus={firstMount}
            border="border"
            fontSize={graphData.numberlineAxis.fontSize + "px"}
          />
        </Question>

        <Question
          section="main"
          label="Line"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={true}
        >
          <Subtitle>{t("component.graphing.graphline")}</Subtitle>
          <Row gutter={60}>
            <Col md={12}>
              <Label>Minimum value</Label>
              <StyledTextField
                type="number"
                value={canvas.xMin}
                name="xMin"
                onChange={this.handleCanvasChange}
                onBlur={event => this.handleCanvasBlur(event, 0)}
                step={1}
                disabled={false}
                marginBottom="0px"
                marginRight="0px"
                width="100%"
              />
            </Col>
            <Col md={12}>
              <Label>Maximum value</Label>
              <StyledTextField
                type="number"
                value={canvas.xMax}
                name="xMax"
                onChange={this.handleCanvasChange}
                onBlur={event => this.handleCanvasBlur(event, 10)}
                step={1}
                disabled={false}
                marginBottom="0px"
                marginRight="0px"
                width="100%"
              />
            </Col>
          </Row>
        </Question>

        <Question
          section="main"
          label="Title"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={true}
        >
          <PaddingDiv>
            <Subtitle>{t("component.graphing.title")}</Subtitle>
            <TitleTextInput type="text" name="title" value={canvas.title} onChange={this.handleCanvasChange} />
          </PaddingDiv>
        </Question>

        <Question
          section="main"
          label="Possible Responses"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={true}
        >
          <PaddingDiv>
            <Subtitle>{t("component.graphing.possibleresponses")}</Subtitle>
            <QuillSortableList
              items={graphData.list.map(o => o.text)}
              onSortEnd={this.onSortOrderListEnd}
              useDragHandle
              onRemove={this.handleDeleteQuestion}
              onChange={this.handleQuestionsChange}
            />
            <Button
              style={{ minWidth: 130, marginTop: 10 }}
              onClick={this.handleAddQuestion}
              variant="extendedFab"
              outlined
              type="button"
              color="primary"
            >
              {t("component.graphing.addnewpossibleresponsebtn")}
            </Button>
          </PaddingDiv>
        </Question>
      </div>
    );
  }
}

GraphAxisLabels.propTypes = {
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

export default enhance(GraphAxisLabels);
