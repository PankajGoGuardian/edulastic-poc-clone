import React from 'react'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { Row, Col, Select, Icon } from 'antd'
import Styled from 'styled-components'
import { IconPencilEdit } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'

const QueryBuilder = ({ showAdvanceSearch, setShowAdvanceSearch }) => {
  const handleChange = () => {}
  return (
    <CustomModalStyled
      width="900px"
      visible={showAdvanceSearch}
      title="Advanced Search"
      onCancel={() => {
        setShowAdvanceSearch(false)
      }}
      footer={null}
      destroyOnClose
      centered
    >
      <ModalBody>
        <Title>Select Search criteria</Title>
        <Row gutter={[48, 16]}>
          <Col span={8}>
            <Row gutter={[10, 16]}>
              <Col>
                <Select
                  style={{ width: '100%' }}
                  onChange={handleChange}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  defaultValue="school"
                >
                  <Select.Option value="school">School</Select.Option>
                  <Select.Option value="course">Course</Select.Option>
                  <Select.Option value="grade">Grade</Select.Option>
                </Select>
              </Col>
            </Row>
            <Row gutter={[10, 16]}>
              <Col>
                <Select
                  defaultValue="is"
                  style={{ width: '100%' }}
                  onChange={handleChange}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  <Select.Option value="is">Is</Select.Option>
                  <Select.Option value="isNot">Is Not</Select.Option>
                </Select>
              </Col>
            </Row>
            <Row gutter={[10, 16]}>
              <Col>
                <Select
                  style={{ width: '100%' }}
                  onChange={handleChange}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  mode="multiple"
                  placeholder="Type To Search Schools"
                >
                  <Select.Option value="school">School1</Select.Option>
                  <Select.Option value="course">School2</Select.Option>
                  <Select.Option value="grade">School3</Select.Option>
                </Select>
              </Col>
            </Row>
            <Row gutter={[10, 16]}>
              <Col>
                <Select
                  defaultValue="or"
                  style={{ width: '100%' }}
                  onChange={handleChange}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  <Select.Option value="or">Any Criteria</Select.Option>
                  <Select.Option value="and">All Criteria</Select.Option>
                </Select>
              </Col>
            </Row>
            <Row gutter={[10, 16]}>
              <Col xs={12}>
                <EduButton isGhost style={{ width: '100%', marginLeft: '0' }}>
                  CLEAR
                </EduButton>
              </Col>
              <Col xs={12}>
                <EduButton primary style={{ width: '100%', marginLeft: '0' }}>
                  ADD
                </EduButton>
              </Col>
            </Row>
          </Col>
          <Col span={16}>
            <Filter>
              <div>
                <TagName>School is</TagName> Xaviours institute for Higher
                Learning
              </div>
              <div>
                <IconWrapper>
                  <IconPencilEdit color={themeColor} />
                </IconWrapper>
                <IconWrapper>
                  {/* <IconRemove color={themeColor} /> */}
                  <Icon type="delete" theme="twoTone" />
                </IconWrapper>
              </div>
            </Filter>
            <Filter>
              <div>
                <Conjuction>and</Conjuction> <TagName>Course</TagName> is
                Mathematics G5
              </div>
              <div>
                <IconWrapper>
                  <IconPencilEdit color={themeColor} />
                </IconWrapper>
                <IconWrapper>
                  {/* <IconRemove color={themeColor} /> */}
                  <Icon type="delete" theme="twoTone" />
                </IconWrapper>
              </div>
              {/* </div> */}
            </Filter>
            <Filter>
              <div>
                <Conjuction>and</Conjuction> <TagName>Tag</TagName> is not
                &quot;high cap&quot;
              </div>
              <div>
                <IconWrapper>
                  <IconPencilEdit color={themeColor} />
                </IconWrapper>
                <IconWrapper>
                  {/* <IconRemove color={themeColor} /> */}
                  <Icon type="delete" theme="twoTone" />
                </IconWrapper>
              </div>
            </Filter>
          </Col>
        </Row>
        <Row gutter={[10, 16]}>
          <Col
            offset="8"
            xs="16"
            order="flex"
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <EduButton isGhost>SAVE AS QUICK FILTER</EduButton>
            <EduButton
              isGhost
              onClick={() => {
                setShowAdvanceSearch(false)
              }}
            >
              CANCEL
            </EduButton>
            <EduButton primary>FIND CLASSES</EduButton>
          </Col>
        </Row>
      </ModalBody>
    </CustomModalStyled>
  )
}

export default QueryBuilder

const TagName = Styled.span`
  color: #3f85e5;
  font-weight: 600;
`

const Conjuction = Styled.span`
  display: inline-block;
  padding: 1px 6px;
  background: #b6cbe4;
  color: #5e7ca2;
  border-radius: 15px;
`

const Filter = Styled.div`
  background: #f5f5f5;
  color: #6b737f;
  padding: 6px 10px;
  border-radius: 4px;
  margin-bottom:3px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
`

const ModalBody = Styled.div`
  .ant-select-selection {
    border: 1px solid #b9b9b9;
    border-radius: 0;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .ant-select-dropdown-menu-item {
    font-size: 12px;
  }
`
const Title = Styled.p`
  color: #434b5d !important;
  font-size: 12px !important;
  margin-bottom: 18px !important;
`

const IconWrapper = Styled.span`
  display: inline-block;
  svg {
    cursor: pointer;
  }

`
