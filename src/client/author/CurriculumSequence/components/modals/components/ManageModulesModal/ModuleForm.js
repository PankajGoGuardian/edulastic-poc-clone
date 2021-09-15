import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import {
  notification,
  TextInputStyled,
  FlexContainer,
  FroalaEditor,
  FieldLabel,
} from '@edulastic/common'
import {
  AddNewModuleContainer,
  AddNewModuleForm,
  AddBtnsWrapper,
  StyledButton,
  InfoIcon,
} from '../styled'

const ModuleForm = ({ module, isEdit, onCancel, onSave }) => {
  const [moduleData, setModuleData] = useState(module || {})

  const handleChangeModuleData = (prop) => ({ target: { value } }) => {
    setModuleData({ ...moduleData, [prop]: value })
  }

  const handleChangeDescription = (desc) => {
    if (desc) {
      setModuleData({ ...moduleData, description: desc })
    }
  }

  const handleModuleSave = () => {
    const { moduleGroupName, moduleId, title, description } = moduleData
    if (!moduleGroupName?.trim()) {
      return notification({
        type: 'warning',
        messageKey: 'manageModalGroupNameEmpty',
      })
    }

    if (!moduleId?.trim()) {
      return notification({
        type: 'warning',
        messageKey: 'manageModalModuleIDEmpty',
      })
    }

    if (!title?.trim()) {
      return notification({
        type: 'warning',
        messageKey: 'manageModalModuleNameEmpty',
      })
    }

    onSave({ moduleGroupName, moduleId, title, description })
    if (!isEdit) {
      setModuleData({})
    }
    onCancel()
  }

  const fieldContatinerProp = {
    flexDirection: 'column',
    alignItems: 'flex-start',
  }

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    marginRight: '4px',
  }

  //
  return (
    <AddNewModuleContainer data-cy="create-new-module-form">
      <AddNewModuleForm>
        <FlexContainer {...fieldContatinerProp} width="100%">
          <FlexContainer alignItems="center">
            <FieldLabel style={labelStyle} isRequired>
              Module Or Chapter Name
            </FieldLabel>
            <Tooltip
              overlayClassName="createModuleTooltip"
              placement="bottom"
              color="#2db7f5"
              title="Module or Chapter Name is a general category within the playlist (e.g. an Earth Science playlist may have Space and Rock modules)."
            >
              <InfoIcon />
            </Tooltip>
          </FlexContainer>
          <TextInputStyled
            data-cy="module-group-name"
            onChange={handleChangeModuleData('moduleGroupName')}
            value={moduleData.moduleGroupName}
            maxLength={24}
          />
        </FlexContainer>
        <FlexContainer width="100%">
          <FlexContainer flex={1} {...fieldContatinerProp}>
            <FlexContainer alignItems="center">
              <FieldLabel style={labelStyle} isRequired>
                Unit Number
              </FieldLabel>
              <Tooltip
                overlayClassName="createModuleTooltip"
                placement="bottom"
                title="Unit Number represents the placement of the module in the playlist."
              >
                <InfoIcon />
              </Tooltip>
            </FlexContainer>
            <TextInputStyled
              data-cy="module-id"
              maxLength={4}
              value={moduleData.moduleId}
              onChange={handleChangeModuleData('moduleId')}
            />
          </FlexContainer>
          <FlexContainer flex={3} {...fieldContatinerProp} marginLeft="16px">
            <FlexContainer alignItems="center">
              <FieldLabel style={labelStyle} isRequired>
                Unit Name
              </FieldLabel>
              <Tooltip
                overlayClassName="createModuleTooltip"
                placement="bottom"
                title="Unit Name is the title of the module."
              >
                <InfoIcon />
              </Tooltip>
            </FlexContainer>
            <TextInputStyled
              data-cy="module-name"
              value={moduleData.title}
              maxLength={100}
              onChange={handleChangeModuleData('title')}
            />
          </FlexContainer>
        </FlexContainer>
        <FlexContainer {...fieldContatinerProp} width="100%">
          <FlexContainer alignItems="center">
            <FieldLabel style={labelStyle}>Description</FieldLabel>
            <Tooltip
              overlayClassName="createModuleTooltip"
              placement="bottom"
              title="The description is a short summary of the tests contained in the module."
            >
              <InfoIcon />
            </Tooltip>
          </FlexContainer>
          <FroalaEditor
            value={moduleData.description || ''}
            border="border"
            onChange={handleChangeDescription}
            toolbarId="module-description"
          />
        </FlexContainer>
      </AddNewModuleForm>
      <AddBtnsWrapper>
        <StyledButton isGhost key="cancel" onClick={onCancel}>
          CANCEL
        </StyledButton>
        <StyledButton key="submit" onClick={handleModuleSave}>
          {isEdit ? 'UPDATE' : 'ADD'}
        </StyledButton>
      </AddBtnsWrapper>
    </AddNewModuleContainer>
  )
}

ModuleForm.propTypes = {
  module: PropTypes.object,
}

ModuleForm.defaultProps = {
  module: {},
}

export default ModuleForm
