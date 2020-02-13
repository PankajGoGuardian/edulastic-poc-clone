import React, { useState } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { videoTypes } from "@edulastic/constants";
import { Select } from "antd";

import { IconEdit, IconPlus } from "@edulastic/icons";
import { updateVariables } from "../../../utils/variables";

import { CustomStyleBtn } from "../../../styled/ButtonStyles";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";

import FileSelectModal from "./FileSelectModal";
import { SelectInputStyled, TextInputStyled } from "../../../styled/InputStyles";

const Options = ({ setQuestionData, item, t }) => {
  const [modalSettings, setModalSettings] = useState({
    editMode: false,
    modalName: ""
  });

  const handleChange = (prop, value) => {
    setQuestionData(
      produce(item, draft => {
        draft[prop] = value;
        if (prop === "videoType") draft["sourceURL"] = "";
        updateVariables(draft);
      })
    );
  };

  const cancelModal = () => {
    const newModalSettings = { editMode: false, modalName: "" };
    if (modalSettings.editMode) newModalSettings.modalName = modalSettings.modalName;
    else handleChange(modalSettings.modalName, "");
    setModalSettings(newModalSettings);
  };

  const rendererOptions = [
    { value: videoTypes.YOUTUBE, label: "YouTube" },
    { value: videoTypes.HOSTED, label: t("component.video.hostedVideo") }
  ];
  return (
    <div>
      {!!modalSettings.modalName && (
        <FileSelectModal
          t={t}
          item={item}
          modalSettings={modalSettings}
          setQuestionData={handleChange}
          onCancel={() => setModalSettings({ editMode: false, modalName: "" })}
        />
      )}
      <Row gutter={24}>
        <Col span={24}>
          <Label>{t("component.video.videoType")}</Label>
          <SelectInputStyled
            size="large"
            value={item.videoType}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            onChange={value => handleChange("videoType", value)}
          >
            {rendererOptions.map(({ value: val, label }) => (
              <Select.Option key={val} value={val}>
                {label}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Label>{t("component.video.sourceURL")}</Label>
          {item.videoType === videoTypes.HOSTED ? (
            <Row gutter={24}>
              <Col span={18} marginBottom="0px">
                <TextInputStyled size="large" value={item.sourceURL} disabled />
              </Col>
              <Col span={6} marginBottom="0px">
                <CustomStyleBtn
                  margin="0px"
                  width="100%"
                  onClick={() =>
                    setModalSettings({ editMode: !!item.sourceURL ? true : false, modalName: "sourceURL" })
                  }
                >
                  {!!item.sourceURL ? <IconEdit width={12} height={12} /> : <IconPlus width={12} height={12} />}
                  {!!item.sourceURL ? "Edit" : "Add"}
                </CustomStyleBtn>
              </Col>
            </Row>
          ) : (
            <TextInputStyled
              size="large"
              value={item.sourceURL || ""}
              onChange={e => handleChange("sourceURL", e.target.value)}
            />
          )}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Label>{t("component.video.heading")}</Label>
          <TextInputStyled
            size="large"
            value={item.heading || ""}
            onChange={e => handleChange("heading", e.target.value)}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Label>{t("component.video.summary")}</Label>
          <TextInputStyled
            size="large"
            value={item.summary || ""}
            onChange={e => handleChange("summary", e.target.value)}
          />
        </Col>
      </Row>
    </div>
  );
};

Options.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    videoType: PropTypes.string.isRequired,
    sourceURL: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    transcript: PropTypes.string.isRequired,
    uiStyle: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      posterImage: PropTypes.string.isRequired,
      captionURL: PropTypes.string.isRequired,
      hideControls: PropTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

const enhance = compose(withTheme);

export default enhance(Options);
