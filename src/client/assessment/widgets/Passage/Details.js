import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { arrayMove } from "react-sortable-hoc";
import produce from "immer";
import { Checkbox, Select } from "antd";
import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import QuestionTextArea from "../../components/QuestionTextArea";
import { updateVariables } from "../../utils/variables";
import Question from "../../components/Question";
import withAddButton from "../../components/HOC/withAddButton";
import QuillSortableList from "../../components/QuillSortableList";

import { StyledInput } from "./styled/StyledInput";
import { Subtitle } from "../../styled/Subtitle";
import { WidgetFRInput } from "../../styled/Widget";
import { Label } from "../../styled/WidgetOptions/Label";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";

const List = withAddButton(QuillSortableList);

const Details = ({ item, setQuestionData, fillSections, cleanSections, t }) => {
  const handleChange = (prop, value) => {
    setQuestionData(
      produce(item, draft => {
        if (prop === "paginated_content" && value) {
          draft.pages = [draft.content];
          delete draft.content;
        }
        if (prop === "paginated_content" && !value) {
          if (draft.pages && draft.pages.length) {
            draft.content = draft.pages.join("");
          }

          delete draft.pages;
        }

        draft[prop] = value;
        updateVariables(draft);
      })
    );
  };

  const handleSortPagesEnd = ({ oldIndex, newIndex }) => {
    setQuestionData(
      produce(item, draft => {
        draft.pages = arrayMove(draft.pages, oldIndex, newIndex);
      })
    );
  };

  const handleRemovePage = index => {
    setQuestionData(
      produce(item, draft => {
        draft.pages.splice(index, 1);
        updateVariables(draft);
      })
    );
  };

  const handleChangePage = (index, value) => {
    setQuestionData(
      produce(item, draft => {
        draft.pages[index] = value;
        updateVariables(draft);
      })
    );
  };

  const handleAddPage = () => {
    setQuestionData(
      produce(item, draft => {
        draft.pages.push("");
      })
    );
  };

  const rendererOptions = [
    { value: "", label: t("component.passage.mathJax") },
    { value: "mathquill", label: t("component.passage.mathQuill") }
  ];

  return (
    <div>
      <Question
        section="main"
        label={t("component.passage.details")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.passage.details")}</Subtitle>
        <Row gutter={30}>
          <Col marginBottom="20px" span={24}>
            <Label>{t("component.passage.heading")}</Label>
            <WidgetFRInput>
              <QuestionTextArea
                onChange={value => handleChange("heading", value)}
                value={item.heading || ""}
                border="border"
                toolbarId="heading"
              />
            </WidgetFRInput>
          </Col>
          <Col marginBottom="20px" span={24}>
            <Label>{t("component.passage.contentsTitle")}</Label>
            <WidgetFRInput>
              <QuestionTextArea
                onChange={value => handleChange("contentsTitle", value)}
                value={item.contentsTitle || ""}
                border="border"
                toolbarId="contents_title"
              />
            </WidgetFRInput>
          </Col>

          <Col marginBottom="20px" span={24}>
            {!item.paginated_content && (
              <div>
                <Label>{t("component.passage.contents")}</Label>
                <QuestionTextArea
                  placeholder={t("component.passage.enterPassageContentHere")}
                  onChange={value => handleChange("content", value)}
                  value={item.content}
                  additionalToolbarOptions={["paragraphNumber"]}
                  border="border"
                  toolbarId="passage_content"
                />
              </div>
            )}
            {item.paginated_content && item.pages && !!item.pages.length && (
              <div>
                <Label>{t("component.passage.contentPages")}</Label>
                <List
                  items={item.pages}
                  buttonText={t("component.passage.add")}
                  onAdd={handleAddPage}
                  onSortEnd={handleSortPagesEnd}
                  useDragHandle
                  onRemove={handleRemovePage}
                  onChange={handleChangePage}
                />
              </div>
            )}
          </Col>

          <Col marginBottom="20px" span={12}>
            <Label>{t("component.passage.fleschKincaid")}</Label>
            <StyledInput
              size="large"
              value={item.flesch_kincaid || ""}
              onChange={e => handleChange("flesch_kincaid", e.target.value)}
            />
          </Col>
          <Col marginBottom="20px" span={12}>
            <Label>{t("component.passage.lexile")}</Label>
            <StyledInput
              size="large"
              value={item.lexile || ""}
              onChange={e => handleChange("lexile", e.target.value)}
            />
          </Col>

          <Col marginBottom="20px" span={12}>
            <Label>{t("component.passage.instructorStimulus")}</Label>
            <WidgetFRInput>
              <QuestionTextArea
                onChange={value => handleChange("instructorStimulus", value)}
                value={item.instructorStimulus || ""}
                border="border"
                toolbarId="instructor_stimulus"
              />
            </WidgetFRInput>
          </Col>
          <Col marginBottom="20px" span={24}>
            <Checkbox
              checked={item.paginated_content}
              onChange={e => handleChange("paginated_content", e.target.checked)}
              tabIndex={1}
            >
              <b>{t("component.passage.enablePaginatedContent")}</b>
            </Checkbox>
          </Col>

          {item.isMath && (
            <Col marginBottom="20px" span={12}>
              <Label>{t("component.passage.mathRenderer")}</Label>
              <Select
                size="large"
                value={item.math_renderer}
                style={{ width: "100%" }}
                onChange={value => handleChange("math_renderer", value)}
                tabIndex={1}
              >
                {rendererOptions.map(({ value: val, label }) => (
                  <Select.Option key={val} value={val}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          )}
        </Row>
      </Question>
    </div>
  );
};

Details.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Details.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default compose(
  withNamespaces("assessment"),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    }
  )
)(Details);
