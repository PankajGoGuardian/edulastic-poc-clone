import React, { useState } from "react";
import PropTypes from "prop-types";
import { Upload, Button, Col, Checkbox } from "antd";

import { aws } from "@edulastic/constants";
import { FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { uploadToS3 } from "../../../author/src/utils/upload";

import { Label } from "../../styled/WidgetOptions/Label";
import { StyledRow } from "./styled/StyledRow";
import { StyledInput } from "./styled/StyledInput";
import { beforeUpload } from "@edulastic/common/src/helpers";

function Options({ onChange, item, t }) {
  const [uploading, setUploading] = useState(false);

  const customRequest = async ({ file }) => {
    setUploading(true);
    try {
      if (!beforeUpload(file)) return;
      const fileUri = await uploadToS3(file, aws.s3Folders.DEFAULT);
      onChange("image", fileUri);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <StyledRow gutter={32}>
        <Col span={12}>
          <Label>{t("component.protractor.imageAlternativeText")}</Label>
          <StyledInput size="large" value={item.alt} onChange={e => onChange("alt", e.target.value)} />
        </Col>
        <Col span={12}>
          <Label>{t("component.protractor.label")}</Label>
          <StyledInput value={item.label} onChange={e => onChange("label", e.target.value)} />
        </Col>
      </StyledRow>

      <StyledRow gutter={32}>
        <Col span={12}>
          <Label>{t("component.protractor.widthpx")}</Label>
          <StyledInput
            size="large"
            value={item.width}
            type="number"
            onChange={e => onChange("width", +e.target.value)}
          />
        </Col>
        <Col span={12}>
          <Label>{t("component.protractor.heightpx")}</Label>
          <StyledInput
            size="large"
            value={item.height}
            type="number"
            onChange={e => onChange("height", +e.target.value)}
          />
        </Col>
      </StyledRow>
      <StyledRow gutter={32} align="middle" type="flex">
        <Col span={12}>
          <Label>{t("component.protractor.buttonIcon")}</Label>
          <FlexContainer>
            <StyledInput size="large" value={item.image} onChange={e => onChange("image", e.target.value)} />
            <Upload showUploadList={false} customRequest={customRequest}>
              <Button loading={uploading} size="large">
                {t("component.protractor.browse")}
              </Button>
            </Upload>
          </FlexContainer>
        </Col>
        <Col span={12}>
          <Label>&nbsp;</Label>
          <FlexContainer>
            <Checkbox size="large" checked={item.button} onChange={e => onChange("button", e.target.checked)}>
              {t("component.protractor.showButton")}
            </Checkbox>
            <Checkbox size="large" checked={item.rotate} onChange={e => onChange("rotate", e.target.checked)}>
              {t("component.protractor.showRotate")}
            </Checkbox>
          </FlexContainer>
        </Col>
      </StyledRow>
    </div>
  );
}

Options.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(Options);
