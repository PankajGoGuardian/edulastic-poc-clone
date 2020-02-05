import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { message } from "antd";
import { keyBy } from "lodash";
import { borderGrey2 } from "@edulastic/colors";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";
import { getItemBucketsSelector } from "../../../src/selectors/user";
import {
  getIsAddCollectionModalVisibleSelector,
  setAddCollectionModalVisibleAction,
  saveItemsToBucketAction
} from "../../../ContentBuckets/ducks";
import { getSelectedItemSelector } from "../../../TestPage/components/AddItems/ducks";
import { getSelectedTestsSelector } from "../../../TestList/ducks";
import { getTestEntitySelector } from "../../../TestPage/ducks";

const SelectCollectionModal = ({
  isAddCollectionModalVisible,
  setAddCollectionModalVisible,
  buckets,
  saveItemsToBucket,
  contentType,
  selectedItems,
  selectedTests,
  test
}) => {
  const handleCancel = () => {
    return setAddCollectionModalVisible(false);
  };

  const addedItems = test.itemGroups.flatMap(itemGroup => itemGroup.items || []);
  const itemsKeyed = keyBy(addedItems, "_id");
  const handleAddToCollection = ({ _id, itemBankId, name, collectionName }) => {
    const contents =
      contentType === "TEST"
        ? selectedTests.map(item => ({ versionId: item.versionId, status: item.status }))
        : selectedItems.map(_id => ({ versionId: itemsKeyed[_id]?.versionId, status: itemsKeyed[_id]?.status }));
    if (!contents.length) {
      message.error("Add atleast one item to cart");
      return handleCancel();
    }
    saveItemsToBucket({
      _id,
      contentType,
      contents,
      itemBankId,
      name,
      collectionName
    });
  };
  return (
    <StyledModal
      title="Select Collection"
      visible={isAddCollectionModalVisible}
      onCancel={handleCancel}
      maskClosable={false}
      centered
      footer={[]}
      destroyOnClose
    >
      <BodyStyled>
        {buckets.map(bucket => {
          return (
            <ModuleContainer
              key={bucket.bucketId}
              onClick={() =>
                handleAddToCollection({
                  _id: bucket.bucketId,
                  name: bucket.name,
                  itemBankId: bucket._id,
                  collectionName: bucket.collectionName
                })
              }
            >
              <ModuleLabel>{bucket.collectionName}: </ModuleLabel>
              <ModuleName>{bucket.name}</ModuleName>
            </ModuleContainer>
          );
        })}
      </BodyStyled>
    </StyledModal>
  );
};

export default connect(
  state => ({
    isAddCollectionModalVisible: getIsAddCollectionModalVisibleSelector(state),
    buckets: getItemBucketsSelector(state),
    selectedItems: getSelectedItemSelector(state),
    selectedTests: getSelectedTestsSelector(state),
    test: getTestEntitySelector(state)
  }),
  {
    setAddCollectionModalVisible: setAddCollectionModalVisibleAction,
    saveItemsToBucket: saveItemsToBucketAction
  }
)(SelectCollectionModal);

const StyledModal = styled(ConfirmationModal)`
  .ant-modal-content {
    .ant-modal-body {
      background: transparent;
      box-shadow: none;
      padding: 0;
      min-height: 80px;
    }
  }
`;

const ModuleContainer = styled.div`
  background: #fff;
  border: 1px solid rgba(203, 203, 203, 0.6);
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    background: #f8f8f8;
  }
`;

const BodyStyled = styled.div`
  text-align: left;
  width: 100%;
`;

const ModuleLabel = styled.span`
  color: ${borderGrey2};
`;

const ModuleName = styled.span``;
