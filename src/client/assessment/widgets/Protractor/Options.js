import { beforeUpload } from "@edulastic/common";
import { aws } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { Upload } from "antd";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { uploadToS3 } from "../../../author/src/utils/upload";
import { CustomStyleBtn } from "../../styled/ButtonStyles";
import { CheckboxLabel } from "../../styled/CheckboxWithLabel";
import { TextInputStyled } from "../../styled/InputStyles";
import { Col } from "../../styled/WidgetOptions/Col";
import { Label } from "../../styled/WidgetOptions/Label";
import { Row } from "../../styled/WidgetOptions/Row";

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
      <Row gutter={24}>
        <Col span={12}>
          <Label>{t("component.protractor.imageAlternativeText")}</Label>
          <TextInputStyled size="large" value={item.alt} onChange={e => onChange("alt", e.target.value)} />
        </Col>
        <Col span={12}>
          <Label>{t("component.protractor.label")}</Label>
          <TextInputStyled value={item.label} onChange={e => onChange("label", e.target.value)} />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Label>{t("component.protractor.widthpx")}</Label>
          <TextInputStyled
            size="large"
            value={item.width}
            type="number"
            onChange={e => onChange("width", +e.target.value)}
          />
        </Col>
        <Col span={12}>
          <Label>{t("component.protractor.heightpx")}</Label>
          <TextInputStyled
            size="large"
            value={item.height}
            type="number"
            onChange={e => onChange("height", +e.target.value)}
          />
        </Col>
      </Row>
      <Row gutter={24} type="flex" align="middle">
        <Col span={12}>
          <Label>{t("component.protractor.buttonIcon")}</Label>
          <Row type="flex" justify="space-between">
            <TextInputStyled
              width="calc(100% - 110px)"
              size="large"
              value={item.image}
              onChange={e => onChange("image", e.target.value)}
            />
            <Upload showUploadList={false} customRequest={customRequest}>
              <CustomStyleBtn width="100px" padding="0px 10px" margin="0px" loading={uploading} size="large">
                {t("component.protractor.browse")}
              </CustomStyleBtn>
            </Upload>
          </Row>
        </Col>
        <Col span={12} marginBottom="0px">
          <CheckboxLabel size="large" checked={item.button} onChange={e => onChange("button", e.target.checked)}>
            {t("component.protractor.showButton")}
          </CheckboxLabel>
          <CheckboxLabel size="large" checked={item.rotate} onChange={e => onChange("rotate", e.target.checked)}>
            {t("component.protractor.showRotate")}
          </CheckboxLabel>
        </Col>
      </Row>
    </div>
  );
}

Options.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(Options);
