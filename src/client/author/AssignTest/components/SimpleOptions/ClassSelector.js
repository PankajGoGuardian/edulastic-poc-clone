/* eslint-disable react/prop-types */
import React from 'react'
import { Select, Tooltip } from 'antd'
import styled from 'styled-components'
import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import { IconGroup, IconClass, IconPlus } from '@edulastic/icons'
import {
  lightGrey10,
  themeColorBlue,
  themeColorHoverBlue,
  white,
} from '@edulastic/colors'
import { StyledRow, StyledCol } from './styled'

const dropdownStyle = {
  boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 0.1)',
}

const CreateNewClassBtn = ({ createClassHandler }) => (
  <CreateNewClassButtonWrapper
    data-cy="createNewClass"
    onMouseDown={(e) => e.preventDefault()}
    onClick={createClassHandler}
  >
    <IconPlus /> <span>Create New Class</span>
  </CreateNewClassButtonWrapper>
)

const ClassSelector = ({
  onChange,
  fetchStudents,
  selectedGroups,
  group,
  createClassHandler,
}) => (
  <StyledRow gutter={16}>
    <StyledCol span={10}>
      <FieldLabel>CLASS/GROUP</FieldLabel>
    </StyledCol>
    <StyledCol span={14}>
      <SelectInputStyled
        showSearch
        data-cy="selectClass"
        placeholder="Select a class to assign"
        mode="multiple"
        optionFilterProp="children"
        cache="false"
        onChange={onChange}
        onSelect={(classId) => {
          fetchStudents({ classId })
        }}
        filterOption={(input, option) =>
          option?.props?.name?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
        }
        value={selectedGroups}
        getPopupContainer={(trigger) => trigger.parentNode}
        dropdownStyle={dropdownStyle}
        dropdownRender={(menu) =>
          group?.length > 0 ? (
            menu
          ) : (
            <CreateNewClassBtn createClassHandler={createClassHandler} />
          )
        }
      >
        {group.map((data) => (
          <Select.Option
            data-cy="class"
            key={data._id}
            value={data._id}
            name={data.name}
          >
            <Tooltip
              placement="left"
              title={data.type === 'class' ? 'Class' : 'Group'}
            >
              <OptionWrapper>
                {data.type === 'custom' ? (
                  <IconGroup
                    width={20}
                    height={19}
                    color={lightGrey10}
                    margin="0 10px 0 0"
                  />
                ) : (
                  <IconClass
                    width={13}
                    height={14}
                    color={lightGrey10}
                    margin="0 13px 0 3px"
                  />
                )}
                <span>{data.name}</span>
              </OptionWrapper>
            </Tooltip>
          </Select.Option>
        ))}
      </SelectInputStyled>
    </StyledCol>
  </StyledRow>
)

export default ClassSelector

const OptionWrapper = styled.div`
  display: inline-flex;
  width: 100%;
  align-items: center;
`
const CreateNewClassButtonWrapper = styled.div`
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${themeColorBlue};

  svg {
    fill: ${themeColorBlue};
  }

  span {
    display: block;
    font-weight: 600;
    padding-left: 10px;
  }

  &:hover {
    color: ${white};
    background: ${themeColorHoverBlue};

    svg {
      fill: ${white};
    }
  }
`
