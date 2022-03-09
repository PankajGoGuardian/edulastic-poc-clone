import React, { useEffect, useState } from 'react'
import { IconUpload } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { sumBy, uniq } from 'lodash'

import { Select } from 'antd'
import { notification } from '@edulastic/common'
import tagsApi from '@edulastic/api/src/tags'
import {
  UploadTitle,
  UploadDescription,
  StyledButton,
  StyledUpload,
  uploadIconStyle,
  FlexContainer,
} from './styled'
import { uploadTestRequestAction } from '../ducks'
import {
  getAllTagsAction,
  getAllTagsSelector,
  addNewTagAction,
} from '../../TestPage/ducks'

const UploadTest = ({ t, uploadTest, getAllTags, allTagsData, addNewTag }) => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [contentType, setContentType] = useState('qti')
  useEffect(() => {
    getAllTags({ type: 'testitem' })
  }, [])

  const customRequest = ({ onSuccess }) => {
    // Can check each file for server side validation or response
    setTimeout(() => {
      onSuccess('ok') // fake response
    }, 0)
  }

  const onChange = ({ fileList }) => {
    if (fileList.every(({ status }) => status === 'done')) {
      const tags = allTagsData.filter(({ _id }) => selectedTags.includes(_id))
      uploadTest({ fileList, contentType, tags })
    }
  }

  const beforeUpload = (_, fileList) => {
    // file validation for size and type should be done here
    const totalFileSize = sumBy(fileList, 'size')
    if (totalFileSize / 1024000 > 15) {
      notification({ messageKey: 'fileSizeExceeds' })
      return false
    }
  }

  const props = {
    name: 'file',
    customRequest,
    accept: '.zip',
    onChange,
    multiple: true,
    beforeUpload,
    showUploadList: false,
  }

  const searchTags = async (_value) => {
    if (
      allTagsData?.some(
        (tag) =>
          tag?.tagName?.toLowerCase() === _value?.toLowerCase() ||
          tag?.tagName?.toLowerCase() === _value?.trim().toLowerCase()
      )
    ) {
      setSearchValue('')
    } else {
      setSearchValue(_value)
    }
  }

  const selectTags = async (id) => {
    let newTag = {}
    const tempSearchValue = searchValue
    if (id === searchValue) {
      setSearchValue('')
      try {
        const { _id, tagName } = await tagsApi.create({
          tagName: tempSearchValue.trim(),
          tagType: 'testitem',
        })
        newTag = { _id, tagName }
        addNewTag({ tag: newTag, tagType: 'testitem' })
      } catch (e) {
        notification({ messageKey: 'savingTagFailed' })
      }
    } else {
      newTag = allTagsData.find((tag) => tag._id === id)
    }
    const newTags = uniq([...selectedTags, newTag._id])
    setSelectedTags(newTags)
    setSearchValue('')
  }

  const deselectTags = (id) => {
    const newTags = selectedTags.filter((tag) => tag !== id)
    setSelectedTags([...newTags])
  }

  const handleTypeChange = (value) => setContentType(value)

  return (
    <FlexContainer flexDirection="column" alignItems="center">
      <StyledUpload {...props}>
        <FlexContainer flexDirection="column" alignItems="center">
          <IconUpload style={uploadIconStyle} />
          <UploadTitle>{t('qtiimport.uploadpage.title')}</UploadTitle>
          <UploadDescription>
            {t('qtiimport.uploadpage.description')}
          </UploadDescription>
          <StyledButton position="absolute" bottom="100px">
            {t('qtiimport.uploadpage.importbuttontext')}
          </StyledButton>
        </FlexContainer>
      </StyledUpload>
      <Select
        data-cy="tagsSelect"
        mode="multiple"
        style={{ width: '100%' }}
        optionLabelProp="title"
        placeholder="Select tags"
        onSearch={searchTags}
        onSelect={selectTags}
        onDeselect={deselectTags}
        filterOption={(input, option) =>
          option.props.title.toLowerCase().includes(input.trim().toLowerCase())
        }
      >
        {searchValue.trim() ? (
          <Select.Option key={0} value={searchValue} title={searchValue}>
            {`${searchValue} (Create new Tag)`}
          </Select.Option>
        ) : (
          ''
        )}
        {allTagsData.map(({ tagName, _id }) => (
          <Select.Option key={_id} value={_id} title={tagName}>
            {tagName}
          </Select.Option>
        ))}
      </Select>
      <Select onChange={handleTypeChange} value={contentType}>
        <Select.Option value="qti">QTI</Select.Option>
        <Select.Option value="webct">Webct</Select.Option>
      </Select>
    </FlexContainer>
  )
}

UploadTest.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  uploadTest: PropTypes.func.isRequired,
}

export default withNamespaces('qtiimport')(
  withRouter(
    connect(
      (state) => ({
        allTagsData: getAllTagsSelector(state, 'testitem'),
      }),
      {
        uploadTest: uploadTestRequestAction,
        getAllTags: getAllTagsAction,
        addNewTag: addNewTagAction,
      }
    )(UploadTest)
  )
)
