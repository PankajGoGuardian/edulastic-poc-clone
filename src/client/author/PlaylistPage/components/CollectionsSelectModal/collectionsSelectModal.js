import React, { useRef, useState } from "react";
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

import { getCollectionsSelector } from "../../../src/selectors/user";

const CollectionsSelectModal = ({
  isVisible,
  title,
  onCancel,
  onOk,
  onChange,
  bodyStyle = {},
  collections,
  selectedCollections = [],
  className,
  okText = ""
}) => {
  const modalRef = useRef(null);

  const onCollectionsChange = (value, option) => {
    const _coll = option.map(o => ({ _id: o.props.value, name: o.props.title }));
    onChange(_coll);
  };

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
          <StyledButton cancel={true} type="primary" key={"1"} onClick={onCancel}>
            CANCEl
          </StyledButton>
          <StyledButton type="primary" key={"2"} onClick={() => onOk("published", selectedCollections)}>
            {okText.toUpperCase()}
          </StyledButton>
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
            value={selectedCollections.map(o => o._id)}
            filterOption={(input, option) => option.props.title.toLowerCase().includes(input.toLowerCase())}
            getPopupContainer={() => modalRef.current}
            onChange={onCollectionsChange}
          >
            {collections.map(o => (
              <Select.Option key={o._id} value={o._id} title={o.name}>
                {o.name}
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
    collections: getCollectionsSelector(state)
  }),
  {}
)(StyledCollectionsSelectModal);

export { ConnectedStyledCollectionsSelectModal as CollectionsSelectModal };
