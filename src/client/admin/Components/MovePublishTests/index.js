import React, { useState, useEffect } from 'react'
import { Form, Col, Input, Select } from 'antd'
import {
  notification,
  EduButton,
  CheckboxLabel,
  beforeUpload,
  uploadToS3,
} from '@edulastic/common'
import { collectionsApi, adminApi } from '@edulastic/api'

import { dragDropUploadText } from '@edulastic/colors'
import { IconUpload } from '@edulastic/icons'
import { aws } from '@edulastic/constants'

import {
  Row,
  LeftButtonsContainer,
  SecondDiv,
  StyledSelect,
  StyledDragger,
} from './styled'

import DistrictSearchForm from '../../Common/Form/DistrictSearchForm'

const Option = Select.Option
const { TextArea } = Input

const MovePublishTests = ({ form }) => {
  const [districtId, setDistrictId] = useState()
  const [collectionsList, setCollectionsList] = useState([])
  const [collectionSelected, setCollectionSelected] = useState([])
  const [authorId, setAuthorId] = useState()
  const [coAuthorIds, setCoAuthorIds] = useState([])
  const [thumbnailULR, setThumbnailULR] = useState()

  const [collectionDisabled, setCollectionDisabled] = useState(true)
  const [isPublishContent, setIsPublishContent] = useState(false)
  const [isAddingItems, setIsAddingItems] = useState(true)
  const [isCrosswalkEnabled, setIsCrossWalkEnabled] = useState(false)

  const resetFields = () => {
    form.resetFields()
  }

  const processCollectionDataForDropdown = (collections) => {
    const bucketWiseCollectionData = []
    collections.forEach(
      ({ _id: collectionId, name: collectionName, buckets }) => {
        if (buckets.length > 0) {
          buckets.forEach(({ _id, name: bucketName }) => {
            const name = `${collectionName}--${bucketName}`
            const value = `${collectionId}--${_id}`
            bucketWiseCollectionData.push({ name, value })
          })
        }
      }
    )
    return bucketWiseCollectionData
  }

  const getDistrictCollections = async () => {
    if (!districtId) {
      notification({
        msg: 'Please select district before selecting collection',
        messageKey: 'apiFormErr',
      })
      return false
    }
    const collectionListData = await collectionsApi.getDistrictCollections({
      districtId,
    })
    const processedCollectionData = processCollectionDataForDropdown(
      collectionListData
    )
    setCollectionsList(processedCollectionData)
    setCollectionDisabled(false)
  }

  useEffect(() => {
    // Example of using the updated state in a callback
    if (districtId) {
      setCollectionSelected([])
      setCollectionsList([])
      getDistrictCollections()
    }
  }, [districtId])

  const onMoveTests = async () => {
    form.validateFields((err, row) => {
      if (collectionSelected.length < 1) {
        notification({
          type: 'warning',
          msg: 'Please select atleast one collection to move',
        })
        return false
      }

      if (!err) {
        let selectedCollectionId
        const bucketIds = []
        if (collectionSelected.length > 0) {
          collectionSelected.forEach((collectionBucketId) => {
            selectedCollectionId = collectionBucketId.split('--')[0]
            const bucketId = collectionBucketId.split('--')[1]
            bucketIds.push(bucketId)
          })
        }
        const testIds = row.testIds.split(',').map((value) => value.trim())

        console.log(`selectedCollectionId: ${selectedCollectionId}`)
        console.log(`bucketIds: ${bucketIds}`)
        console.log(`testIds: ${testIds}`)
        console.log(`authorId: ${authorId}`)
        console.log(`coAuthorIds: ${coAuthorIds}`)
        console.log(`thumbnailULR: ${thumbnailULR}`)
        console.log(`isPublishContent: ${isPublishContent}`)
        console.log(`isAddingItems: ${isAddingItems}`)
        console.log(`isCrossWalkEnabled: ${isCrossWalkEnabled}`)
        console.log('call function to backend for move tests...')
        const payload = {
          testIds,
          collectionId: selectedCollectionId,
          bucketIds,
          authorId,
          coAuthorIds,
          isPublishContent,
          isAddingItems,
          isCrosswalkEnabled,
          thumbnail: thumbnailULR,
          // language: 'english',
        }
        console.log(payload)
        adminApi.moveAndPublishTests(payload)
      }
    })
  }

  const getSelectedDistrict = (district) => {
    if (district) {
      setDistrictId(district._id, () => {
        // Do something after state has been updated
        getDistrictCollections()
      })
    }
  }

  const changeAuthorId = (event) => {
    const idRegex = new RegExp(/^[0-9a-fA-F]{24}$/)
    if (event.target.value) {
      if (!idRegex.test(event.target.value)) {
        notification({ msg: 'Invalid Author Id', messageKey: 'apiFormErr' })
      }
      setAuthorId(event.target.value)
    } else {
      setAuthorId('')
    }
  }

  const changeCoAuthorIds = (event) => {
    const coauthorIdsValue = event.target.value
    // Use the split method to create an array
    const coauthorIds = coauthorIdsValue.split(',')
    const idRegex = new RegExp(/^[0-9a-fA-F]{24}$/)
    const filteredCoAuthorIds = coauthorIds.filter((id) => idRegex.test(id))
    if (filteredCoAuthorIds.length > 0) {
      setCoAuthorIds(filteredCoAuthorIds)
    }
  }
  const handleThumbnailChange = async (info) => {
    try {
      const { file } = info
      if (!file.type.match(/image/g)) {
        notification({ messageKey: 'pleaseUploadFileInImageFormat' })
        return
      }
      if (!beforeUpload(file)) {
        return
      }
      const uploadedThumbnailULR = await uploadToS3(file, aws.s3Folders.DEFAULT)
      setThumbnailULR(uploadedThumbnailULR)
    } catch (e) {
      console.log(e)
    }
  }

  const thumbnailUploadProps = {
    beforeUpload: () => {
      // Check if there's already a file in the list
      if (thumbnailULR) {
        notification({
          messageKey: 'pleaseUploadFileInImageFormat',
          msg: 'Please upload only one file as thumbnail',
        })
        return false
      }
      return false // Return false to prevent automatic upload
    },
    onChange: handleThumbnailChange,
    accept: 'image/*',
    multiple: false,
    showUploadList: true,
    onRemove: () => {
      setThumbnailULR('')
    },
  }

  const changePublishContent = (event) => {
    if (event.target.checked) {
      setIsPublishContent(true)
    } else {
      setIsPublishContent(false)
    }
  }

  const changeIsAddingItems = (event) => {
    if (event.target.checked) {
      setIsAddingItems(true)
    } else {
      setIsAddingItems(false)
    }
  }

  const changeCrossWalk = (e) => {
    if (e.target.checked) {
      setIsCrossWalkEnabled(true)
    } else {
      setIsCrossWalkEnabled(false)
    }
  }

  const { getFieldDecorator } = form
  return (
    <>
      <SecondDiv>
        <DistrictSearchForm getCustomReport={getSelectedDistrict} />
      </SecondDiv>
      <SecondDiv>
        <Row>
          <Col span={24}>
            <div>
              <label>Collections</label>
              <StyledSelect
                placeholder="Collections"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                width="170px"
                mode="multiple"
                value={collectionSelected}
                disabled={collectionDisabled}
                onChange={(data) => setCollectionSelected(data)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.props?.children
                    ?.toLowerCase()
                    ?.indexOf(input.toLowerCase()) >= 0
                }
              >
                {collectionsList.map(({ name, value }) => (
                  <Option value={value}>{name}</Option>
                ))}
              </StyledSelect>
            </div>
          </Col>
        </Row>
      </SecondDiv>
      <SecondDiv>
        <Row>
          <Col span={24}>
            <Form.Item label="Test Ids">
              {getFieldDecorator('testIds', {
                rules: [{ required: true }],
                initialValue: '',
              })(
                <TextArea
                  data-cy="testIdsInput"
                  rows={4}
                  placeholder="Enter Comma separated Test IDs..."
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </SecondDiv>
      <SecondDiv>
        <Row>
          <Col span={24}>
            <label>
              Do you want to change the author? If yes, please enter the user id
              below.(optional)
            </label>
            <Input
              data-cy="authorIdInput"
              onBlur={changeAuthorId}
              placeholder="Enetr author user Id"
            />
          </Col>
        </Row>
      </SecondDiv>
      <SecondDiv>
        <Row>
          <Col span={24}>
            <label>Add Co-authors(optional)</label>
            <Form.Item>
              {getFieldDecorator('coauthorIds', {
                rules: [{ required: false }],
                initialValue: '',
              })(
                <TextArea
                  data-cy="coauthorIdsInput"
                  onBlur={changeCoAuthorIds}
                  rows={4}
                  placeholder="Enter Comma separated user ids"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </SecondDiv>
      <SecondDiv>
        <Row>
          <Col span={24}>
            <label>Upload Thumbnail(optional)</label>
            <StyledDragger {...thumbnailUploadProps}>
              <div className="ant-upload-drag-icon">
                <IconUpload width="36" height="36" color={dragDropUploadText} />
              </div>
              <div className="ant-upload-text">DRAG &amp; DROP YOUR FILE</div>
              <div className="ant-upload-hint" data-cy="uploadPOBrowseBtn">
                OR <span>BROWSE</span> PNG, JPG, GIF (TOTAL 10MB MAX.)
              </div>
            </StyledDragger>
          </Col>
        </Row>
      </SecondDiv>
      <SecondDiv>
        <Row>
          <Col span={24}>
            <CheckboxLabel onChange={changePublishContent}>
              Do you want to Publish Content ?
            </CheckboxLabel>
          </Col>
        </Row>
      </SecondDiv>
      <SecondDiv>
        <Row>
          <Col span={24}>
            <CheckboxLabel
              checked={isAddingItems}
              onChange={changeIsAddingItems}
            >
              Do you want to add a collection of items?
            </CheckboxLabel>
          </Col>
        </Row>
      </SecondDiv>
      <SecondDiv>
        <Row>
          <Col span={24}>
            <CheckboxLabel onChange={changeCrossWalk}>
              Cross-walk for Standards
            </CheckboxLabel>
          </Col>
        </Row>
      </SecondDiv>
      <SecondDiv>
        <LeftButtonsContainer>
          <EduButton onClick={onMoveTests}>Submit</EduButton>
        </LeftButtonsContainer>
      </SecondDiv>
    </>
  )
}

export default Form.create()(MovePublishTests)
