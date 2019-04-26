import React, { useState } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { FlexContainer, Button } from "@edulastic/common";
import { videoTypes } from "@edulastic/constants";
import { Col, Select } from "antd";

import { updateVariables } from "../../../utils/variables";

import { Label } from "../../../styled/WidgetOptions/Label";

import { StyledRow } from "../styled/StyledRow";
import { StyledInput } from "../styled/StyledInput";
import { IconPlus } from "../styled/IconPlus";
import { IconEdit } from "../styled/IconEdit";

import FileSelectModal from "./FileSelectModal";

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
      <StyledRow gutter={32}>
        <Col span={24}>
          <Label>{t("component.video.videoType")}</Label>
          <Select
            size="large"
            style={{ width: "100%" }}
            value={item.videoType}
            onChange={value => handleChange("videoType", value)}
          >
            {rendererOptions.map(({ value: val, label }) => (
              <Select.Option key={val} value={val}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </StyledRow>
      <StyledRow gutter={32}>
        <Col span={24}>
          <Label>{t("component.video.sourceURL")}</Label>
          {item.videoType === videoTypes.HOSTED ? (
            <FlexContainer>
              <StyledInput size="large" value={item.sourceURL} disabled />
              <Button
                icon={!!item.sourceURL ? <IconEdit /> : <IconPlus />}
                color="primary"
                onClick={() => setModalSettings({ editMode: !!item.sourceURL ? true : false, modalName: "sourceURL" })}
              >
                {!!item.sourceURL ? "Edit" : "Add"}
              </Button>
            </FlexContainer>
          ) : (
            <StyledInput
              size="large"
              value={item.sourceURL || ""}
              onChange={e => handleChange("sourceURL", e.target.value)}
            />
          )}
        </Col>
      </StyledRow>
      <StyledRow gutter={32}>
        <Col span={24}>
          <Label>{t("component.video.heading")}</Label>
          <StyledInput
            size="large"
            value={item.heading || ""}
            onChange={e => handleChange("heading", e.target.value)}
          />
        </Col>
      </StyledRow>
      <StyledRow gutter={32}>
        <Col span={24}>
          <Label>{t("component.video.summary")}</Label>
          <StyledInput
            size="large"
            value={item.summary || ""}
            onChange={e => handleChange("summary", e.target.value)}
          />
        </Col>
      </StyledRow>
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
    ui_style: PropTypes.shape({
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
