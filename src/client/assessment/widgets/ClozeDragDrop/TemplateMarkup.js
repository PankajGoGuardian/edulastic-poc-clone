import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Icon, Input } from "antd";

import { withTheme } from "styled-components";
import uuid from "uuid/v4";

import { withNamespaces } from "@edulastic/localization";
import { PaddingDiv } from "@edulastic/common";

import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import QuestionTextArea from "../../components/QuestionTextArea";
import QuillSortableList from "../../components/QuillSortableList/index";
import { Subtitle } from "../../styled/Subtitle";
import { AddNewChoiceBtn } from "../../styled/AddNewChoiceBtn";
import { Widget } from "../../styled/Widget";
import { Label, Heading } from "./styled";

class TemplateMarkup extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func
  };

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {}
  };

  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.cloze.dragDrop.templatemarkup"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  constructor(props) {
    super(props);

    this.state = {
      hasGroupResponses: false,
      groupResponses: []
    };
  }

  onChangeQuestion = stimulus => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.stimulus = stimulus;
        updateVariables(draft);
      })
    );
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options = arrayMove(draft.options, oldIndex, newIndex);
      })
    );
  };

  remove = index => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options.splice(index, 1);
        updateVariables(draft);
      })
    );
  };

  editOptions = (index, value) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[index].label = value;
        let maxLength = 0;
        draft.options.forEach(option => {
          maxLength = Math.max(maxLength, option ? option.label.length : 0);
        });
        const finalWidth = 40 + maxLength * 7;
        draft.ui_style.widthpx = finalWidth < 140 ? 140 : finalWidth > 400 ? 400 : finalWidth;
        updateVariables(draft);
      })
    );
  };

  addNewChoiceBtn = () => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options.push({ value: uuid(), label: "" });
      })
    );
  };

  onChangeMarkUp = templateMarkUp => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.templateMarkUp = templateMarkUp;
        updateVariables(draft);
      })
    );
  };

  groupResponsesHandler = e => {
    const { item, setQuestionData } = this.props;
    const { groupResponses } = this.state;
    const hasGroupResponses = e.target.checked;
    if (e.target.checked) {
      this.setState({
        hasGroupResponses,
        groupResponses:
          groupResponses.length === 0 && item.options
            ? [
                {
                  title: "",
                  options: [...item.options]
                }
              ]
            : groupResponses
      });
    } else {
      this.setState({ hasGroupResponses });
    }

    setQuestionData(
      produce(item, draft => {
        draft.hasGroupResponses = hasGroupResponses;
        updateVariables(draft);
      })
    );
  };

  addGroup = () => {
    const { groupResponses } = this.state;
    groupResponses.push({ title: "", options: [{ value: uuid(), label: "" }] });
    const newGroupResponses = groupResponses.slice();
    this.setState({ groupResponses: newGroupResponses });

    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.groupResponses = newGroupResponses;
        updateVariables(draft);
      })
    );
  };

  removeGroup = index => {
    const { groupResponses } = this.state;
    groupResponses.splice(index, 1);
    const newGroupResponses = groupResponses.slice();
    this.setState({ groupResponses: newGroupResponses });

    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.groupResponses = newGroupResponses;
        updateVariables(draft);
      })
    );
  };

  changeGroupRespTitle = (index, e) => {
    const { groupResponses } = this.state;
    const newGroupResponses = groupResponses.slice();
    newGroupResponses[index].title = e.target.value;
    this.setState({ groupResponses: newGroupResponses });

    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.groupResponses = newGroupResponses;
        updateVariables(draft);
      })
    );
  };

  addNewGroupOption = index => {
    const { groupResponses } = this.state;
    const newGroupResponses = groupResponses.slice();
    newGroupResponses[index].options.push({ value: uuid(), label: "" });

    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.groupResponses = newGroupResponses;
        updateVariables(draft);
      })
    );
  };

  editGroupOptions = (index, itemIndex, val) => {
    const { groupResponses } = this.state;

    const newGroupResponses = groupResponses.slice();
    newGroupResponses[index].options[itemIndex].label = val;
    this.setState({ groupResponses: newGroupResponses });

    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.groupResponses = newGroupResponses;
        updateVariables(draft);
      })
    );
  };

  removeGroupOptions = (index, itemIndex) => {
    const { groupResponses } = this.state;
    const newGroupResponses = groupResponses.slice();
    newGroupResponses[index].options.splice(itemIndex, 1);
    this.setState({ groupResponses: newGroupResponses });

    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.groupResponses = newGroupResponses;
        updateVariables(draft);
      })
    );
  };

  onSortEndGroupOptions = () => {};

  render() {
    const { t, item, theme } = this.props;
    const { hasGroupResponses, groupResponses } = this.state;
    return (
      <Widget>
        <Subtitle>{t("component.cloze.dragDrop.templatemarkup")}</Subtitle>
        <QuestionTextArea
          placeholder={t("component.cloze.dragDrop.templatemarkupplaceholder")}
          onChange={this.onChangeMarkUp}
          showResponseBtn
          value={item.templateMarkUp}
        />
        <PaddingDiv>
          <Subtitle>
            <input id="groupResponseCheckbox" type="checkbox" onChange={e => this.groupResponsesHandler(e)} />
            <Label htmlFor="groupResponseCheckbox">{t("component.cloze.dragDrop.grouppossibleresponses")}</Label>
          </Subtitle>
        </PaddingDiv>
        {!hasGroupResponses && (
          <PaddingDiv>
            <Heading>{t("component.cloze.dragDrop.choicesforresponse")}</Heading>
            <QuillSortableList
              items={item.options.map(o => o.label)}
              onSortEnd={this.onSortEnd}
              useDragHandle
              onRemove={this.remove}
              onChange={this.editOptions}
            />
            <div>
              <AddNewChoiceBtn onClick={this.addNewChoiceBtn}>
                {t("component.cloze.dragDrop.addnewchoice")}
              </AddNewChoiceBtn>
            </div>
          </PaddingDiv>
        )}
        {hasGroupResponses &&
          groupResponses.length > 0 &&
          groupResponses.map((group, index) => (
            <div key={index}>
              <fieldset
                style={{
                  borderColor: theme.widgets.clozeDragDrop.groupResponseFieldsetBorderColor,
                  borderRadius: 2,
                  padding: "0 20px",
                  marginBottom: 15,
                  border: "solid 1px"
                }}
              >
                <legend style={{ padding: "0 20px", width: "auto" }}>
                  {t("component.cloze.dragDrop.group")} {index + 1}
                </legend>
                <div style={{ float: "right" }}>
                  <Button onClick={() => this.removeGroup(index)} size="small" type="button">
                    <Icon type="close" />
                  </Button>
                </div>
                <PaddingDiv top={10} bottom={10}>
                  <div>{t("component.cloze.dragDrop.title")}</div>
                </PaddingDiv>
                <div>
                  <Input
                    size="large"
                    style={{ width: "100%" }}
                    onChange={e => this.changeGroupRespTitle(index, e)}
                    value={group.title}
                  />
                </div>
                <PaddingDiv top={20} bottom={10}>
                  <div>{t("component.cloze.dragDrop.choicesforresponse")}</div>
                  {group.options.length > 0 && (
                    <QuillSortableList
                      prefix={`group_${index}`}
                      items={group.options.map(o => o.label)}
                      onSortEnd={params => this.onSortEndGroupOptions(index, ...params)}
                      useDragHandle
                      onRemove={itemIndex => this.removeGroupOptions(index, itemIndex)}
                      onChange={(itemIndex, e) => this.editGroupOptions(index, itemIndex, e)}
                    />
                  )}
                  <PaddingDiv top={10} bottom={10}>
                    <AddNewChoiceBtn onClick={() => this.addNewGroupOption(index)}>
                      {t("component.cloze.dragDrop.addnewchoice")}
                    </AddNewChoiceBtn>
                  </PaddingDiv>
                </PaddingDiv>
              </fieldset>
            </div>
          ))}
        {hasGroupResponses && (
          <Button
            type="primary"
            onClick={this.addGroup}
            style={{
              background: theme.widgets.clozeDragDrop.addGroupButtonBgColor
            }}
          >
            {t("component.cloze.dragDrop.addgroup")}
          </Button>
        )}
      </Widget>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  withTheme,
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(TemplateMarkup);
