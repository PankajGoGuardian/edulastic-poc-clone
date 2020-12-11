import React from 'react'
import Collapse from "antd/es/Collapse";
import Icon from "antd/es/Icon";
import styled from 'styled-components'

const { Panel } = Collapse

export const Collapsable = ({
  header,
  key,
  defaultActiveKey = null,
  children,
}) => (
  <CollapseContainer>
    <Collapse
      bordered={false}
      defaultActiveKey={defaultActiveKey}
      expandIconPosition="right"
      expandIcon={({ isActive }) => <Icon type={isActive ? 'minus' : 'plus'} />}
    >
      <StyledPanel key={key} header={<StyledH3>{header}</StyledH3>}>
        {children}
      </StyledPanel>
    </Collapse>
  </CollapseContainer>
)

const StyledH3 = styled.h3`
  font-size: 10px;
  font-weight: 700;
  color: #97a4c1;
  background: #fff;
  text-transform: uppercase;
`

const StyledPanel = styled(Panel)`
  background: #fff;
  margin: 0px;
  padding: 0px;
`
const CollapseContainer = styled.div`
  .ant-collapse-item {
    border: none;

    .ant-collapse-header {
      background-color: #fff;
      padding: 0;
      width: calc(100% - 15px);
    }

    .ant-collapse-content-box {
      background-color: #fff;
      padding: 0;
    }
  }
`
