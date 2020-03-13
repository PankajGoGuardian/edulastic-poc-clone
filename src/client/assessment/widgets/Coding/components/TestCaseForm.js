import React, { useState } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { StyledModal, StyledForm, StyledRadio, StyledRadioGroup } from "../styled";
import TextArea from "./common/TextArea";
import InputText from "./common/InputText";
import Dropdown from "./common/Dropdown";
import OptionGroup from "./common/OptionGroup";

import { Row, Col } from "../../../styled/Grid";

import { TestCaseCategories, visibilityOptions } from "../StaticData";

const TestCaseForm = ({ item, onSave, onClose, t }) => {
  const [option, setOption] = useState(item.type || "self");
  const [input, setInput] = useState(item.input);
  const [output, setOutput] = useState(item.output);
  const [description, setDescription] = useState(item.description);
  const [category, setCategory] = useState(item.category);
  const [timeLimits, setTimeLimits] = useState(item.timeLimits);
  const [weightage, setWeightage] = useState(item.weightage);
  const [visibility, setVisibility] = useState(item.visibility || "open");
  const onChange = e => setOption(e.target.value);
  const onChangeInputArea = e => setInput(e.target.value);
  const onChangeOutputArea = e => setOutput(e.target.value);
  const onChangeDesc = e => setDescription(e.target.value);
  const onChangeCategory = value => setCategory(value);
  const onChangeTimeLimit = e => setTimeLimits(e.target.value);
  const onChangeWeightage = e => setWeightage(e.target.value);
  const onChangeVisibility = e => setVisibility(e.target.value);

  const handleOnSave = e => {
    e.preventDefault();
    onSave({
      ...item,
      type: option,
      input,
      output,
      description,
      category,
      timeLimits,
      weightage,
      visibility
    });
  };

  const renderTextArea = () => {
    if (option === "self") {
      return [
        <Col md={12} style={{ textAlign: "left" }} key="1">
          <TextArea
            placeholder="Enter input data"
            onChange={onChangeInputArea}
            value={input}
            title="input"
            showUpload={false}
          />
        </Col>,
        <Col md={12} style={{ textAlign: "left" }} key="2">
          <TextArea
            placeholder="Enter output data"
            onChange={onChangeOutputArea}
            value={output}
            title="output"
            showUpload={false}
          />
        </Col>
      ];
    } else {
      return (
        <Col md={24} style={{ textAlign: "left" }}>
          <TextArea placeholder="Enter input data" onChange={onChangeInputArea} value={input} />
        </Col>
      );
    }
  };
  const okButtonProps = {
    type: "primary",
    htmlType: "submit"
  };

  const cancelButtonProps = {
    type: "secondary"
  };
  const title = item?.id
    ? t("component.coding.testCases.form.edit.title")
    : t("component.coding.testCases.form.new.title");
  return (
    <StyledModal
      visible
      title={title}
      maskClosable={false}
      onOk={handleOnSave}
      onCancel={onClose}
      maskClosable
      className="wrapClassName"
      width={1000}
      okText={title}
      okButtonProps={okButtonProps}
      cancelButtonProps={cancelButtonProps}
    >
      <StyledForm onSubmit={onSave}>
        <StyledRadioGroup
          onChange={onChange}
          value={option}
          style={{
            marginBottom: "20px",
            display: "none"
          }}
        >
          <StyledRadio value="self">{t("component.coding.testCases.form.new.options.self")}</StyledRadio>
          <StyledRadio value="mocha">{t("component.coding.testCases.form.new.options.mocha")}</StyledRadio>
        </StyledRadioGroup>
        <Row gutter={30}>{renderTextArea()}</Row>
        <Row gutter={30}>
          <Col md={12} style={{ textAlign: "left" }}>
            <InputText
              placeholder="Enter short description of test case"
              title="description"
              onChange={onChangeDesc}
              value={description}
            />
          </Col>
          <Col md={12} style={{ textAlign: "left" }}>
            <Dropdown
              options={TestCaseCategories}
              value={category}
              placeholder="Select category"
              onChange={onChangeCategory}
              title="category"
            />
          </Col>
        </Row>
        <Row gutter={30}>
          <Col md={12} style={{ textAlign: "left" }}>
            <Row gutter={20}>
              <Col md={12} style={{ textAlign: "left" }}>
                <InputText title="time limit (sec)" onChange={onChangeTimeLimit} value={timeLimits} />
              </Col>
              <Col md={12} style={{ textAlign: "left" }}>
                <InputText title="weightage" onChange={onChangeWeightage} value={weightage} />
              </Col>
            </Row>
          </Col>
          <Col md={12} style={{ textAlign: "left" }}>
            <OptionGroup
              options={visibilityOptions}
              value={visibility}
              onChange={onChangeVisibility}
              title="visibility"
            />
          </Col>
        </Row>
      </StyledForm>
    </StyledModal>
  );
};

TestCaseForm.propTypes = {
  item: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

TestCaseForm.defaultProps = {
  item: {}
};

export default withNamespaces("assessment")(TestCaseForm);
