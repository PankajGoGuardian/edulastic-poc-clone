import {
  CheckBoxGrp,
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  EduSwitchStyled,
  FieldLabel,
  SelectInputStyled,
  TextAreaInputStyled,
  TextInputStyled
} from "@edulastic/common";
import { Col, Form, Row, Select } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { ButtonsContainer, ModalFormItem } from "../../../../../common/styled";

const CreateBucketModal = ({ form, createBucket, closeModal, bucket, collections, onCollectionSearch, t }) => {
  const [status, setStatus] = useState(bucket.status === 1);

  const onDropdownVisibleChange = () => {
    const elm = document.querySelector(`.dropdown-custom-menu`);
    if (elm && !elm.style.zIndex) {
      elm.style.zIndex = 10000;
    }
  };

  useEffect(() => {
    document.addEventListener("click", onDropdownVisibleChange);
    return () => {
      document.removeEventListener("click", onDropdownVisibleChange);
    };
  });


  const onChangeStatus = value => setStatus(value);

  const onCreateBucket = () => {
    form.validateFields((err, row) => {
      if (!err) {
        const data = {
          _id: bucket._id,
          name: row.name.trim(),
          collectionId: row.collectionId,
          description: row.description,
          status: status ? 1 : 0
        };
        row.allowToDuplicate.forEach(ad => {
          data[`canDuplicate${ad}`] = true;
        });
        row.allowToSee.forEach(ad => {
          data[`is${ad}Visible`] = true;
        });
        createBucket(data);
      }
    });
  };

  const { getFieldDecorator } = form;
  const allowToDuplicate = [
    bucket.canDuplicateItem && "Item",
    bucket.canDuplicateTest && "Test",
    bucket.canDuplicatePlayList && "PlayList"
  ].filter(item => item);
  const allowToSee = [bucket.isItemVisible && "Item", bucket.isTestVisible && "Test"].filter(item => item);

  return (
    <CustomModalStyled
      visible
      title={bucket._id ? t("content.buckets.upsertModal.updateTitle") : t("content.buckets.upsertModal.createTitle")}
      onOk={onCreateBucket}
      onCancel={closeModal}
      maskClosable={false}
      centered
      footer={[
        <ButtonsContainer key="1">
          <EduButton isGhost onClick={closeModal}>{t("content.buckets.upsertModal.cancelBtn")}</EduButton>
          <EduButton onClick={onCreateBucket}>{t("content.buckets.upsertModal.okBtn")}</EduButton>
        </ButtonsContainer>
      ]}
    >
      <Row>
        <Col span={24}>
          <ModalFormItem label={t("content.buckets.upsertModal.name")}>
            {getFieldDecorator("name", {
              initialValue: bucket.name,
              rules: [
                {
                  required: true,
                  message: t("content.buckets.upsertModal.validations.name")
                }
              ]
            })(<TextInputStyled placeholder={t("content.buckets.upsertModal.enterName")} />)}
          </ModalFormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ModalFormItem label={t("content.buckets.upsertModal.collectionName")}>
            {getFieldDecorator("collectionId", {
              initialValue: bucket.collection?._id,
              rules: [
                {
                  required: true,
                  message: t("content.buckets.upsertModal.validations.collectionName")
                }
              ]
            })(
              <SelectInputStyled
                placeholder={t("content.buckets.upsertModal.enterCollectionName")}
                dropdownClassName="dropdown-custom-menu"
                onSearch={onCollectionSearch}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {[...collections].map(c => (
                  <Select.Option key={c._id} value={c._id}>
                    {c.name}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            )}
          </ModalFormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ModalFormItem label={t("content.buckets.upsertModal.description")}>
            {getFieldDecorator("description", {
              initialValue: bucket.description
            })(<TextAreaInputStyled height="80px" placeholder={t("content.buckets.upsertModal.enterDescription")} rows={3} />)}
          </ModalFormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ModalFormItem
            label={t("content.buckets.upsertModal.allowDuplicate.title")}
            className="content-bucket-item-no-margin"
          >
            {getFieldDecorator("allowToDuplicate", {
              initialValue: allowToDuplicate
            })(
              <CheckBoxGrp style={{ width: "100%" }}>
                <Row>
                  <Col span={8}>
                    <CheckboxLabel value="Item">
                      {t("content.buckets.upsertModal.allowDuplicate.scopes.item")}
                    </CheckboxLabel>
                  </Col>
                  <Col span={8}>
                    <CheckboxLabel value="Test">
                      {t("content.buckets.upsertModal.allowDuplicate.scopes.test")}
                    </CheckboxLabel>
                  </Col>
                  <Col span={8}>
                    <CheckboxLabel value="PlayList">
                      {t("content.buckets.upsertModal.allowDuplicate.scopes.playlist")}
                    </CheckboxLabel>
                  </Col>
                </Row>
              </CheckBoxGrp>
            )}
          </ModalFormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ModalFormItem
            label={t("content.buckets.upsertModal.allowToSee.title")}
            className="content-bucket-item-no-margin"
          >
            {getFieldDecorator("allowToSee", {
              initialValue: allowToSee
            })(
              <CheckBoxGrp style={{ width: "100%" }}>
                <Row>
                  <Col span={8}>
                    <CheckboxLabel value="Item">
                      {t("content.buckets.upsertModal.allowToSee.scopes.item")}
                    </CheckboxLabel>
                  </Col>
                  <Col span={8}>
                    <CheckboxLabel value="Test">
                      {t("content.buckets.upsertModal.allowToSee.scopes.test")}
                    </CheckboxLabel>
                  </Col>
                </Row>
              </CheckBoxGrp>
            )}
          </ModalFormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ModalFormItem className="content-bucket-status">
            <FieldLabel>
              <span style={{ marginRight: "15px" }}>{t("content.buckets.upsertModal.bucketActive")}</span>
              <EduSwitchStyled checked={status} onChange={onChangeStatus} size="small" />
            </FieldLabel>
          </ModalFormItem>
        </Col>
      </Row>
    </CustomModalStyled>
  );
};

CreateBucketModal.propTypes = {
  form: PropTypes.object.isRequired,
  createBucket: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  bucket: PropTypes.object,
  collections: PropTypes.arrayOf(PropTypes.object),
  t: PropTypes.func.isRequired
};

CreateBucketModal.defaultProps = {
  bucket: {},
  collections: []
};

const CreateBucketModalForm = Form.create()(CreateBucketModal);
export default CreateBucketModalForm;
