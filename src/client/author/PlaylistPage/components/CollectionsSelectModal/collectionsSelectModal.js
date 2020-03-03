import React, { useRef, useMemo } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Select } from "antd";

import {
  ModalWrapper,
  ModalFooter,
  StyledButton,
  InitOptions,
  StyledDiv
} from "../../../../common/components/ConfirmationModal/styled";
import { StyledSelect } from "../../../../common/styled";
import { EduButton } from "@edulastic/common";

import { getCollectionsSelector, getItemBucketsSelector } from "../../../src/selectors/user";

const CollectionsSelectModal = ({
  isVisible,
  title,
  onCancel,
  onOk,
  onChange,
  bodyStyle = {},
  collections,
  orgCollections = [],
  selectedCollections = [],
  className,
  okText = ""
}) => {
  const modalRef = useRef(null);

  const onCollectionsChange = (_, options) => {
    let data = {};
    options.forEach(o => {
      if (data[o.props._id]) {
        data[o.props._id].push(o.props.value);
      } else {
        data[o.props._id] = [o.props.value];
      }
    });

    const collectionArray = [];
    for (const [key, value] of Object.entries(data)) {
      collectionArray.push({
        _id: key,
        bucketIds: value
      });
    }
    const orgCollectionIds = orgCollections.map(o => o._id);
    const extraCollections = selectedCollections.filter(c => !orgCollectionIds.includes(c._id));
    onChange([...collectionArray, ...extraCollections]);
  };

  const filteredCollections = useMemo(
    () => selectedCollections.filter(c => orgCollections.some(o => o._id === c._id)),
    [selectedCollections, orgCollections]
  );

  return (
    <ModalWrapper
      className={className}
      centered
      visible={isVisible}
      width="750px"
      title={title}
      onCancel={onCancel}
      destroyOnClose={true}
      maskClosable={true}
      footer={[
        <ModalFooter>
          <EduButton isGhost key={"1"} onClick={onCancel}>
            CANCEL
          </EduButton>
          <EduButton key={"2"} onClick={() => onOk("published", selectedCollections)}>
            {okText.toUpperCase()}
          </EduButton>
        </ModalFooter>
      ]}
    >
      <InitOptions bodyStyle={bodyStyle}>
        <StyledDiv>Please Select Collections.</StyledDiv>
        <StyledDiv ref={modalRef}>
          <StyledSelect
            mode="multiple"
            size="medium"
            style={{ width: "100%" }}
            value={filteredCollections.flatMap(c => c.bucketIds)}
            filterOption={(input, option) => option.props.title.toLowerCase().includes(input.toLowerCase())}
            getPopupContainer={() => modalRef.current}
            onChange={onCollectionsChange}
          >
            {orgCollections.map(o => (
              <Select.Option key={o.bucketId} value={o.bucketId} _id={o._id}>
                {`${o.collectionName} - ${o.name}`}
              </Select.Option>
            ))}
          </StyledSelect>
        </StyledDiv>
      </InitOptions>
    </ModalWrapper>
  );
};

const StyledCollectionsSelectModal = styled(CollectionsSelectModal)`
  .ant-select-selection {
    height: auto;
  }
`;

const ConnectedStyledCollectionsSelectModal = connect(
  state => ({
    collections: getCollectionsSelector(state),
    orgCollections: getItemBucketsSelector(state)
  }),
  {}
)(StyledCollectionsSelectModal);

export { ConnectedStyledCollectionsSelectModal as CollectionsSelectModal };
