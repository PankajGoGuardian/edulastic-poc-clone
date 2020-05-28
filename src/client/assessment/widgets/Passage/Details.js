import React, { useRef } from "react";
import PropTypes from "prop-types";
import { arrayMove } from "react-sortable-hoc";
import produce from "immer";
import { Select } from "antd";
import { withNamespaces } from "@edulastic/localization";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import QuestionTextArea from "../../components/QuestionTextArea";
import { updateVariables } from "../../utils/variables";
import Question from "../../components/Question";
import QuillSortableList from "../../components/QuillSortableList";

import { Subtitle } from "../../styled/Subtitle";
import { CheckboxLabel } from "../../styled/CheckboxWithLabel";
import { CustomStyleBtn } from "../../styled/ButtonStyles";
import { WidgetFRInput } from "../../styled/Widget";
import { Label } from "../../styled/WidgetOptions/Label";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";
import { TextInputStyled, SelectInputStyled } from "../../styled/InputStyles";

const Details = ({ item, setQuestionData, fillSections, cleanSections, t }) => {
  const updated = useRef(false);
  const handleChange = (prop, value) => {
    const updatedByUser = updated.current;

    const newItem = produce(item, draft => {
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
    });
    setQuestionData({ ...newItem, updated: updatedByUser });

    // content is being set in passage type question
    // updating at the end of first run
    updated.current = true;
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
        label={t("component.passage.heading")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.passage.heading")}`)}>
          {t("component.passage.heading")}
        </Subtitle>
        <WidgetFRInput>
          <QuestionTextArea
            onChange={value => handleChange("heading", value)}
            value={item.heading || ""}
            border="border"
            toolbarId="heading"
          />
        </WidgetFRInput>
      </Question>
      <Question
        section="main"
        label={t("component.passage.contentsTitle")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.passage.contentsTitle")}`)}>
          {t("component.passage.contentsTitle")}
        </Subtitle>
        <WidgetFRInput>
          <QuestionTextArea
            placeholder={t("component.passage.enterPassageTitleHere")}
            onChange={value => handleChange("contentsTitle", value)}
            value={item.contentsTitle || ""}
            border="border"
            toolbarId="contents_title"
          />
        </WidgetFRInput>
      </Question>
      <Question
        section="main"
        label={t("component.passage.contents")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        {!item.paginated_content && (
          <div>
            <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.passage.contents")}`)}>
              {t("component.passage.contents")}
            </Subtitle>
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
        {item.paginated_content && (
          <div>
            <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.passage.contentPages")}`)}>
              {t("component.passage.contentPages")}
            </Subtitle>
            {item?.pages?.length ? (
              <QuillSortableList
                items={item.pages}
                onSortEnd={handleSortPagesEnd}
                useDragHandle
                onRemove={handleRemovePage}
                onChange={handleChangePage}
              />
            ) : null}
            <CustomStyleBtn onClick={handleAddPage}>{t("component.passage.add")}</CustomStyleBtn>
          </div>
        )}
      </Question>
      <Question
        section="main"
        label={t("component.passage.details")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.passage.details")}`)}>
          {t("component.passage.details")}
        </Subtitle>
        <Row gutter={24}>
          <Col span={12}>
            <Label>{t("component.passage.fleschKincaid")}</Label>
            <TextInputStyled
              size="large"
              value={item.flesch_kincaid || ""}
              onChange={e => handleChange("flesch_kincaid", e.target.value)}
            />
          </Col>
          <Col span={12}>
            <Label>{t("component.passage.lexile")}</Label>
            <TextInputStyled
              size="large"
              value={item.lexile || ""}
              onChange={e => handleChange("lexile", e.target.value)}
            />
          </Col>
        </Row>
      </Question>
      <Question
        section="main"
        label={t("component.passage.instructorStimulus")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.passage.instructorStimulus")}`)}>
          {t("component.passage.instructorStimulus")}
        </Subtitle>

        <Row gutter={24}>
          <Col span={24}>
            <WidgetFRInput>
              <QuestionTextArea
                onChange={value => handleChange("instructorStimulus", value)}
                value={item.instructorStimulus || ""}
                border="border"
                toolbarId="instructor_stimulus"
              />
            </WidgetFRInput>
          </Col>
          <Col span={24}>
            <CheckboxLabel
              checked={item.paginated_content}
              onChange={e => handleChange("paginated_content", e.target.checked)}
              tabIndex={1}
            >
              {t("component.passage.enablePaginatedContent")}
            </CheckboxLabel>
          </Col>
        </Row>
      </Question>

      {item.isMath && (
        <Question
          section="main"
          label={t("component.passage.mathRenderer")}
          fillSections={fillSections}
          cleanSections={cleanSections}
        >
          <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.passage.mathRenderer")}`)}>
            {t("component.passage.mathRenderer")}
          </Subtitle>
          <SelectInputStyled
            size="large"
            value={item.math_renderer}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            onChange={value => handleChange("math_renderer", value)}
            tabIndex={1}
          >
            {rendererOptions.map(({ value: val, label }) => (
              <Select.Option key={val} value={val} getPopupContainer={triggerNode => triggerNode.parentNode}>
                {label}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </Question>
      )}
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

export default withNamespaces("assessment")(Details);
