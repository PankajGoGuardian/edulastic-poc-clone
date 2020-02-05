import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Row, Col, Select, Checkbox, Switch } from "antd";

import { ButtonsContainer, ModalFormItem } from "../../../../../common/styled";
import { StyledUpsertModal, StyledCheckbox, StyledOkBtn, StyledCancelBtn } from "../styled";

const CreateBucketModal = ({ form, createBucket, closeModal, bucket, collections, onCollectionSearch, t }) => {
  const [status, setStatus] = useState(bucket.status === 1 ? true : false);

  useEffect(() => {
    document.addEventListener("click", onDropdownVisibleChange);
    return () => {
      document.removeEventListener("click", onDropdownVisibleChange);
    };
  });

  const onDropdownVisibleChange = () => {
    const elm = document.querySelector(`.dropdown-custom-menu`);
    if (elm && !elm.style.zIndex) {
      elm.style.zIndex = 10000;
    }
  };

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
    <StyledUpsertModal
      visible
      title={bucket._id ? t("content.buckets.upsertModal.updateTitle") : t("content.buckets.upsertModal.createTitle")}
      onOk={onCreateBucket}
      onCancel={closeModal}
      maskClosable={false}
      centered
      footer={[
        <ButtonsContainer key="1">
          <StyledCancelBtn onClick={closeModal}>{t("content.buckets.upsertModal.cancelBtn")}</StyledCancelBtn>
          <StyledOkBtn onClick={onCreateBucket}>{t("content.buckets.upsertModal.okBtn")}</StyledOkBtn>
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
            })(<Input placeholder={t("content.buckets.upsertModal.enterName")} />)}
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
              <Select
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
              </Select>
            )}
          </ModalFormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ModalFormItem label={t("content.buckets.upsertModal.description")}>
            {getFieldDecorator("description", {
              initialValue: bucket.description
            })(<Input.TextArea placeholder={t("content.buckets.upsertModal.enterDescription")} rows={3} />)}
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
              <Checkbox.Group style={{ width: "100%" }}>
                <Row>
                  <Col span={8}>
                    <StyledCheckbox value="Item">
                      {t("content.buckets.upsertModal.allowDuplicate.scopes.item")}
                    </StyledCheckbox>
                  </Col>
                  <Col span={8}>
                    <StyledCheckbox value="Test">
                      {t("content.buckets.upsertModal.allowDuplicate.scopes.test")}
                    </StyledCheckbox>
                  </Col>
                  <Col span={8}>
                    <StyledCheckbox value="PlayList">
                      {t("content.buckets.upsertModal.allowDuplicate.scopes.playlist")}
                    </StyledCheckbox>
                  </Col>
                </Row>
              </Checkbox.Group>
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
              <Checkbox.Group style={{ width: "100%" }}>
                <Row>
                  <Col span={8}>
                    <StyledCheckbox value="Item">
                      {t("content.buckets.upsertModal.allowToSee.scopes.item")}
                    </StyledCheckbox>
                  </Col>
                  <Col span={8}>
                    <StyledCheckbox value="Test">
                      {t("content.buckets.upsertModal.allowToSee.scopes.test")}
                    </StyledCheckbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            )}
          </ModalFormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ModalFormItem label={t("content.buckets.upsertModal.bucketActive")} className="content-bucket-status">
            <Switch checked={status} onChange={onChangeStatus} size="small" />
          </ModalFormItem>
        </Col>
      </Row>
    </StyledUpsertModal>
  );
};

CreateBucketModal.propTypes = {
  form: PropTypes.object,
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
