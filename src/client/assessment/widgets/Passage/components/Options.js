import React from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { arrayMove } from "react-sortable-hoc";
import { Col, Checkbox, Select } from "antd";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";

import QuestionTextArea from "../../../components/QuestionTextArea";
import { updateVariables } from "../../../utils/variables";

import withAddButton from "../../../components/HOC/withAddButton";
import QuillSortableList from "../../../components/QuillSortableList";
import { Label } from "../../../styled/WidgetOptions/Label";

import { StyledRow } from "../styled/StyledRow";
import { StyledInput } from "../styled/StyledInput";

const List = withAddButton(QuillSortableList);

const Opt = ({ setQuestionData, item, t, theme }) => {
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
      <StyledRow gutter={32}>
        <Col span={24}>
          <Label>{t("component.passage.heading")}</Label>
          <QuestionTextArea
            onChange={value => handleChange("heading", value)}
            value={item.heading || ""}
            style={{
              border: `1px solid ${theme.widgets.passage.quillBorderColor}`,
              height: "auto",
              padding: "6px 11px",
              borderRadius: 5
            }}
          />
        </Col>
      </StyledRow>
      <StyledRow gutter={32}>
        <Col span={24}>
          <Label>{t("component.passage.contentsTitle")}</Label>
          <QuestionTextArea
            onChange={value => handleChange("contentsTitle", value)}
            value={item.contentsTitle || ""}
            style={{
              border: `1px solid ${theme.widgets.passage.quillBorderColor}`,
              height: "auto",
              padding: "6px 11px",
              borderRadius: 5
            }}
          />
        </Col>
      </StyledRow>
      <StyledRow gutter={32}>
        {!item.paginated_content && (
          <Col span={24}>
            <Label>{t("component.passage.contents")}</Label>
            <QuestionTextArea
              placeholder={t("component.passage.enterPassageContentHere")}
              onChange={value => handleChange("content", value)}
              value={item.content}
            />
          </Col>
        )}
        {item.paginated_content && item.pages && !!item.pages.length && (
          <Col span={24}>
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
          </Col>
        )}
      </StyledRow>

      <StyledRow gutter={32}>
        <Col span={12}>
          <Label>{t("component.passage.fleschKincaid")}</Label>
          <StyledInput
            size="large"
            value={item.flesch_kincaid || ""}
            onChange={e => handleChange("flesch_kincaid", e.target.value)}
          />
        </Col>
        <Col span={12}>
          <Label>{t("component.passage.lexile")}</Label>
          <StyledInput size="large" value={item.lexile || ""} onChange={e => handleChange("lexile", e.target.value)} />
        </Col>
      </StyledRow>

      <StyledRow gutter={32}>
        <Col span={12}>
          <Label>{t("component.passage.instructorStimulus")}</Label>
          <QuestionTextArea
            onChange={value => handleChange("instructor_stimulus", value)}
            value={item.instructor_stimulus || ""}
            style={{
              border: `1px solid ${theme.widgets.passage.quillBorderColor}`,
              height: "auto",
              padding: "6px 11px",
              borderRadius: 5
            }}
          />
        </Col>
      </StyledRow>

      <StyledRow gutter={32}>
        <Col span={12}>
          <Checkbox
            checked={item.paginated_content}
            onChange={e => handleChange("paginated_content", e.target.checked)}
            tabIndex={1}
          >
            <b>{t("component.passage.enablePaginatedContent")}</b>
          </Checkbox>
        </Col>
      </StyledRow>

      <StyledRow gutter={32}>
        {item.is_math && (
          <Col span={12}>
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
      </StyledRow>
    </div>
  );
};

Opt.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(Opt);
