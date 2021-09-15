import { tagsApi } from '@edulastic/api'
import {
  FieldLabel,
  SelectInputStyled,
  TextInputStyled,
  FroalaEditor,
  notification,
  CheckboxLabel,
} from '@edulastic/common'
import { Col, Row, Select } from 'antd'
import { uniqBy } from 'lodash'
import PropTypes from 'prop-types'
import React, { createRef, useEffect, useMemo, useState } from 'react'
import { ChromePicker } from 'react-color'
import connect from 'react-redux/lib/connect/connect'
import { IPAD_LANDSCAPE_WIDTH } from '../../../../../../assessment/constants/others'
import { ColorPickerContainer } from '../../../../../../assessment/widgets/ClozeImageText/styled/ColorPickerContainer'
import { ColorPickerWrapper } from '../../../../../../assessment/widgets/ClozeImageText/styled/ColorPickerWrapper'
import { changePlaylistThemeAction } from '../../../../../PlaylistPage/ducks'
import { selectsData } from '../../../common'
import { ColorBox, SummaryButton, SummaryDiv } from '../../common/SummaryForm'
import SummaryHeader from '../SummaryHeader/SummaryHeader'
import { AnalyticsItem, Block, ErrorWrapper, MetaTitle } from './styled'
import { sortGrades } from '../../../../utils'
import {
  isPublisherUserSelector,
  isCuratorRoleSelector,
} from '../../../../../src/selectors/user'

export const renderAnalytics = (title, Icon) => (
  <AnalyticsItem>
    <Icon color="#bbbfc4" width={20} height={20} />
    <MetaTitle>{title}</MetaTitle>
  </AnalyticsItem>
)

const PlayListDescription = ({ onChangeField, description }) => (
  <>
    <FieldLabel>Description</FieldLabel>
    <FroalaEditor
      value={description || ''}
      border="border"
      onChange={(dec) => onChangeField('description', dec)}
      toolbarId="playlist-description"
      editorHeight={187}
    />
  </>
)

const Sidebar = ({
  title,
  alignmentInfo,
  subjects,
  onChangeSubjects,
  onChangeField,
  tags = [],
  owner,
  analytics,
  grades,
  onChangeGrade,
  description,
  createdBy,
  thumbnail,
  textColor,
  addNewTag,
  backgroundColor,
  onChangeColor,
  allPlaylistTagsData,
  isTextColorPickerVisible,
  isBackgroundColorPickerVisible,
  windowWidth,
  isEditable,
  changePlayListTheme,
  collectionsToShow = [],
  onChangeCollection,
  collections = [],
  skin,
  isPublisher,
  isCurator,
}) => {
  const newAllTagsData = uniqBy([...allPlaylistTagsData, ...tags], 'tagName')
  const subjectsList = selectsData.allSubjects
  const [searchValue, setSearchValue] = useState('')
  const playListTitleInput = createRef()

  useEffect(() => {
    if (playListTitleInput.current) {
      playListTitleInput.current.input.focus()
    }
  }, [])

  const filteredCollections = useMemo(
    () =>
      collections.filter((c) => collectionsToShow.some((o) => o._id === c._id)),
    [collections, collectionsToShow]
  )

  const selectTags = async (id) => {
    let newTag = {}
    if (id === searchValue) {
      const tempSearchValue = searchValue
      setSearchValue('')
      try {
        const { _id, tagName } = await tagsApi.create({
          tagName: tempSearchValue,
          tagType: 'playlist',
        })
        newTag = { _id, tagName }
        addNewTag({ tag: newTag, tagType: 'playlist' })
      } catch (e) {
        notification({ messageKey: 'savingTagErr' })
      }
    } else {
      newTag = newAllTagsData.find((tag) => tag._id === id)
    }
    const newTags = [...tags, newTag]
    onChangeField('tags', newTags)
    setSearchValue('')
  }

  const deselectTags = (id) => {
    const newTags = tags.filter((tag) => tag._id !== id)
    onChangeField('tags', newTags)
  }

  const searchTags = async (value) => {
    if (
      newAllTagsData.some(
        (tag) =>
          tag.tagName.toLowerCase() === value.toLowerCase() ||
          tag.tagName.toLowerCase() === value.trim().toLowerCase()
      )
    ) {
      setSearchValue('')
    } else {
      setSearchValue(value)
    }
  }

  const handleChangeSkin = (e) => {
    if (e.target.checked) {
      onChangeField('skin', 'FULL_SIZE')
    } else {
      onChangeField('skin', null)
    }
  }

  return (
    <Block>
      <Col span={24}>
        <SummaryHeader
          createdBy={createdBy}
          thumbnail={thumbnail}
          owner={owner}
          windowWidth={windowWidth}
          analytics={analytics}
          onChangeField={onChangeField}
          isEditable={isEditable}
          backgroundColor={backgroundColor}
          textColor={textColor}
          isPlaylist
        />
      </Col>
      <Row gutter={16}>
        <Col xl={12}>
          <FieldLabel isRequired>Playlist Name</FieldLabel>
          <TextInputStyled
            value={title}
            data-cy="testname"
            onChange={(e) => onChangeField('title', e.target.value)}
            size="large"
            placeholder="Enter a playlist name"
            ref={playListTitleInput}
            margin="0px 0px 15px"
          />
          {title !== undefined && !title.trim().length && (
            <ErrorWrapper>Playlist should have title</ErrorWrapper>
          )}
          <FieldLabel>Alignment Info</FieldLabel>
          <TextInputStyled
            value={alignmentInfo}
            data-cy="alignmentInfo"
            onChange={(e) => onChangeField('alignmentInfo', e.target.value)}
            size="large"
            placeholder="Insert the alignment info"
            margin="0px 0px 15px"
          />
          {windowWidth <= IPAD_LANDSCAPE_WIDTH && (
            <PlayListDescription
              onChangeField={onChangeField}
              description={description}
            />
          )}
          <FieldLabel isRequired>Grade</FieldLabel>
          <SelectInputStyled
            showArrow
            data-cy="gradeSelect"
            mode="multiple"
            size="large"
            placeholder="Please select"
            value={sortGrades(grades)}
            onChange={onChangeGrade}
            optionFilterProp="children"
            margin="0px 0px 15px"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {selectsData.allGrades.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>

          <FieldLabel isRequired>Subject</FieldLabel>
          <SelectInputStyled
            showArrow
            data-cy="subjectSelect"
            mode="multiple"
            size="large"
            margin="0px 0px 15px"
            placeholder="Please select"
            defaultValue={subjects}
            onChange={onChangeSubjects}
            optionFilterProp="children"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {subjectsList.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>

          {collectionsToShow.length > 0 && (
            <>
              <FieldLabel>Collections</FieldLabel>
              <SelectInputStyled
                showArrow
                data-cy="collectionsSelect"
                mode="multiple"
                size="large"
                margin="0px 0px 15px"
                placeholder="Please select"
                value={filteredCollections.flatMap((c) => c.bucketIds)}
                onChange={(input, option) => onChangeCollection(input, option)}
                optionFilterProp="children"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {collectionsToShow.map((o) => (
                  <Select.Option
                    key={o.bucketId}
                    value={o.bucketId}
                    _id={o._id}
                    type={o.type}
                    collectionName={o.collectionName}
                  >
                    {`${o.collectionName} - ${o.name}`}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </>
          )}

          <FieldLabel>Tags</FieldLabel>
          <SelectInputStyled
            showArrow
            data-cy="tagsSelect"
            className="tagsSelect"
            mode="multiple"
            size="large"
            margin="0px 0px 15px"
            optionLabelProp="title"
            placeholder="Please enter"
            value={tags.map((t) => t._id)}
            onSearch={searchTags}
            onSelect={selectTags}
            onDeselect={deselectTags}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            filterOption={(input, option) =>
              option.props.title
                .toLowerCase()
                .includes(input.trim().toLowerCase())
            }
          >
            {searchValue.trim() ? (
              <Select.Option key={0} value={searchValue} title={searchValue}>
                {`${searchValue} (Create new Tag)`}
              </Select.Option>
            ) : (
              ''
            )}
            {newAllTagsData.map(({ tagName, _id }) => (
              <Select.Option key={_id} value={_id} title={tagName}>
                {tagName}
              </Select.Option>
            ))}
          </SelectInputStyled>
          {!!searchValue.length && !searchValue.trim().length && (
            <p style={{ color: 'red' }}>Please enter valid characters.</p>
          )}
        </Col>
        <Col xl={12}>
          <Row>
            <Col xs={12}>
              <FieldLabel>TEXT COLOR</FieldLabel>
              <SummaryDiv>
                <ColorBox
                  data-cy="image-text-box-color-picker"
                  background={textColor}
                />
                <SummaryButton
                  onClick={() =>
                    onChangeColor('isTextColorPickerVisible', true)
                  }
                >
                  CHOOSE
                </SummaryButton>
                {isTextColorPickerVisible && (
                  <ColorPickerContainer data-cy="image-text-box-color-panel">
                    <ColorPickerWrapper
                      onClick={() =>
                        onChangeColor('isTextColorPickerVisible', false)
                      }
                    />
                    <ChromePicker
                      color={textColor}
                      onChangeComplete={(color) =>
                        changePlayListTheme({
                          textColor: color.hex,
                          bgColor: backgroundColor || '',
                        })
                      }
                    />
                  </ColorPickerContainer>
                )}
              </SummaryDiv>
            </Col>
            <Col xs={12}>
              <FieldLabel>BACKGROUND COLOR</FieldLabel>
              <SummaryDiv>
                <ColorBox
                  data-cy="image-text-box-color-picker"
                  background={backgroundColor}
                />
                <SummaryButton
                  onClick={() =>
                    onChangeColor('isBackgroundColorPickerVisible', true)
                  }
                >
                  CHOOSE
                </SummaryButton>
                {isBackgroundColorPickerVisible && (
                  <ColorPickerContainer data-cy="image-text-box-color-panel">
                    <ColorPickerWrapper
                      onClick={() =>
                        onChangeColor('isBackgroundColorPickerVisible', false)
                      }
                    />
                    <ChromePicker
                      color={backgroundColor}
                      onChangeComplete={(color) =>
                        changePlayListTheme({
                          bgColor: color.hex,
                          textColor: textColor || '',
                        })
                      }
                    />
                  </ColorPickerContainer>
                )}
              </SummaryDiv>
            </Col>
          </Row>
          {windowWidth > IPAD_LANDSCAPE_WIDTH && (
            <Row>
              <Col xs={24}>
                <PlayListDescription
                  onChangeField={onChangeField}
                  description={description}
                />
              </Col>
              {(isPublisher || isCurator) && (
                <Col xs={24}>
                  <CheckboxLabel
                    mt="16px"
                    data-cy="useFullSizeTile"
                    name="useFullSizeTile"
                    onChange={handleChangeSkin}
                    checked={skin === 'FULL_SIZE'}
                  >
                    use full size tile image
                  </CheckboxLabel>
                </Col>
              )}
            </Row>
          )}
        </Col>
      </Row>
    </Block>
  )
}

Sidebar.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  onChangeField: PropTypes.func.isRequired,
  analytics: PropTypes.array.isRequired,
  grades: PropTypes.array.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  subjects: PropTypes.array.isRequired,
  owner: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  createdBy: PropTypes.object.isRequired,
  thumbnail: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  onChangeColor: PropTypes.func.isRequired,
  isTextColorPickerVisible: PropTypes.bool.isRequired,
  isBackgroundColorPickerVisible: PropTypes.bool.isRequired,
  onChangeSubjects: PropTypes.func.isRequired,
}

export default connect(
  (state) => ({
    isCurator: isCuratorRoleSelector(state),
    isPublisher: isPublisherUserSelector(state),
  }),
  {
    changePlayListTheme: changePlaylistThemeAction,
  }
)(Sidebar)
