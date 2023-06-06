import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Select, Tooltip } from 'antd'
import { uniqBy } from 'lodash'
import {
  notification,
  FieldLabel,
  SelectInputStyled,
  TextInputStyled,
  TextAreaInputStyled,
} from '@edulastic/common'
import { tagsApi } from '@edulastic/api'
import { Container } from './styled/Container'
import { ItemBody } from './styled/ItemBody'
import { selectsData } from '../../../author/TestPage/components/common'
import { SelectSuffixIcon } from './styled/SelectSuffixIcon'
import RecentCollectionsList from './RecentCollectionsList'

const bloomsTaxonomyOptions = [
  'Remember',
  'Understand',
  'Apply',
  'Analyze',
  'Evaluate',
  'Create',
]

const SecondBlock = ({
  t,
  onChangeTags,
  onQuestionDataSelect,
  onChangeExternalData,
  depthOfKnowledge = '',
  authorDifficulty = '',
  bloomsTaxonomy = '',
  testletQuestionId = '',
  testletResponseIds = '',
  testletAdditionalMetadata = '',
  tags = [],
  allTagsData,
  addNewTag,
  handleCollectionsSelect,
  handleRecentCollectionsSelect,
  collections,
  highlightCollection,
  recentCollectionsList,
  collectionsToShow,
  showAdditionalMeta,
  isDerivedFromPremiumBank = false,
}) => {
  const newAllTagsData = uniqBy([...allTagsData, ...tags], 'tagName')
  const [searchValue, setSearchValue] = useState('')
  const selectTags = async (id) => {
    let newTag = {}
    if (id === searchValue) {
      const tempSearchValue = searchValue
      setSearchValue('')
      try {
        const { _id, tagName } = await tagsApi.create({
          tagName: tempSearchValue,
          tagType: 'testitem',
        })
        newTag = { _id, tagName }
        addNewTag({ tag: newTag, tagType: 'testitem' })
      } catch (e) {
        notification({ messageKey: 'savingTagErr' })
      }
    } else {
      newTag = newAllTagsData.find((tag) => tag._id === id)
    }
    const newTags = [...tags, newTag]
    onChangeTags(newTags)
    setSearchValue('')
  }

  const deselectTags = (id) => {
    const newTags = tags.filter((tag) => tag._id !== id)
    onChangeTags(newTags)
  }

  const searchTags = async (value) => {
    if (
      newAllTagsData.some(
        (tag) => tag.tagName.toLowerCase() === value.toLowerCase()
      )
    ) {
      setSearchValue('')
    } else {
      setSearchValue(value)
    }
  }

  // here we are filtering out the collection which are not from current district.
  const filteredCollections = useMemo(
    () =>
      collections.filter((c) => collectionsToShow.some((o) => o._id === c._id)),
    [collections, collectionsToShow]
  )

  const allowedCollectionIds = useMemo(
    () => collectionsToShow.map(({ _id }) => _id),
    [collectionsToShow]
  )

  const recentCollectionsListAccessible = useMemo(() =>
    recentCollectionsList.filter((r) => allowedCollectionIds.includes(r._id), [
      recentCollectionsList,
      allowedCollectionIds,
    ])
  )

  return (
    <Container padding="20px">
      <Row gutter={24}>
        <Col md={6}>
          <ItemBody>
            <FieldLabel>{t('component.options.depthOfKnowledge')}</FieldLabel>
            <SelectInputStyled
              bg="white"
              data-cy="dokSelect"
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              placeholder={t('component.options.selectDOK')}
              onSelect={onQuestionDataSelect('depthOfKnowledge')}
              value={depthOfKnowledge}
              suffixIcon={<SelectSuffixIcon type="caret-down" />}
            >
              <Select.Option key="Select DOK" value="">
                Select DOK
              </Select.Option>
              {selectsData.allDepthOfKnowledge.map(
                (el) =>
                  el.value && (
                    <Select.Option
                      data-cy={`dok-select-${el.text}`}
                      key={el.value}
                      value={el.value}
                    >
                      {el.text}
                    </Select.Option>
                  )
              )}
            </SelectInputStyled>
          </ItemBody>
          <ItemBody>
            <FieldLabel>{t('component.options.externalQuestionId')}</FieldLabel>
            <TextInputStyled
              data-cy="externalQuestionId"
              value={testletQuestionId}
              onChange={onChangeExternalData('testletQuestionId')}
            />
          </ItemBody>
        </Col>
        <Col md={6}>
          <ItemBody>
            <FieldLabel>{t('component.options.difficultyLevel')}</FieldLabel>
            <SelectInputStyled
              bg="white"
              data-cy="difficultySelect"
              placeholder={t('component.options.selectDifficulty')}
              onSelect={onQuestionDataSelect('authorDifficulty')}
              value={authorDifficulty}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              suffixIcon={<SelectSuffixIcon type="caret-down" />}
            >
              <Select.Option key="Select Difficulty Level" value="">
                Select Difficulty Level
              </Select.Option>
              {selectsData.allAuthorDifficulty.map(
                (el) =>
                  el.value && (
                    <Select.Option
                      data-cy={`difficulty-select-${el.text}`}
                      key={el.value}
                      value={el.value}
                    >
                      {el.text}
                    </Select.Option>
                  )
              )}
            </SelectInputStyled>
          </ItemBody>
          <ItemBody>
            <FieldLabel>
              {t('component.options.externalResponseIds')}
            </FieldLabel>
            <TextInputStyled
              data-cy="externalResponseIds"
              value={testletResponseIds}
              maxLength={250}
              onChange={onChangeExternalData('testletResponseIds')}
            />
          </ItemBody>
        </Col>
        <Col md={6}>
          <ItemBody>
            <FieldLabel>{t('component.options.blooomTaxonomy')}</FieldLabel>
            <SelectInputStyled
              data-cy="bloomsTaxonomy"
              bg="white"
              placeholder={t('component.options.blooomTaxonomy')}
              onSelect={onQuestionDataSelect('bloomsTaxonomy')}
              value={bloomsTaxonomy}
              dropdownClassName="custom-antd-select"
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              suffixIcon={<SelectSuffixIcon type="caret-down" />}
            >
              <Select.Option key={"Select Bloom's Taxonomy"} value="">
                Select Bloom&apos;s Taxonomy
              </Select.Option>
              {bloomsTaxonomyOptions.map((x) => (
                <Select.Option key={x.toLowerCase()} value={x.toLowerCase()}>
                  {x}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </ItemBody>
          {showAdditionalMeta && (
            <ItemBody>
              <FieldLabel>
                {t('component.options.additionalMetadata')}
              </FieldLabel>
              <TextAreaInputStyled
                rows={4}
                padding="6px 15px"
                value={testletAdditionalMetadata}
                onChange={onChangeExternalData('testletAdditionalMetadata')}
              />
            </ItemBody>
          )}
        </Col>

        {(collectionsToShow.length > 0 ||
          recentCollectionsList?.length > 0) && (
          <Col md={6}>
            {collectionsToShow.length > 0 && (
              <ItemBody>
                <FieldLabel>Collections</FieldLabel>
                <Tooltip
                  title={
                    isDerivedFromPremiumBank &&
                    'Action not permitted on clone of a premium content'
                  }
                >
                  <SelectInputStyled
                    mode="multiple"
                    className="tagsSelect"
                    data-cy="collectionsSelect"
                    bg="white"
                    placeholder="Please select"
                    dropdownClassName="custom-antd-select"
                    value={filteredCollections.flatMap((c) => c.bucketIds)}
                    onChange={(value, options) =>
                      handleCollectionsSelect(value, options, collectionsToShow)
                    }
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    disabled={isDerivedFromPremiumBank}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    suffixIcon={<SelectSuffixIcon type="caret-down" />}
                    autoFocus={highlightCollection}
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
                </Tooltip>
              </ItemBody>
            )}
            {recentCollectionsListAccessible?.length > 0 && (
              <RecentCollectionsList
                recentCollectionsList={recentCollectionsListAccessible}
                collections={collections || []}
                handleCollectionsSelect={handleRecentCollectionsSelect}
                isDerivedFromPremiumBank={isDerivedFromPremiumBank}
              />
            )}
          </Col>
        )}
        <Col md={6}>
          <ItemBody>
            <FieldLabel>{t('component.options.tags')}</FieldLabel>
            {searchValue.length && !searchValue.trim().length ? (
              <SelectInputStyled
                mode="multiple"
                bg="white"
                optionLabelProp="title"
                className="tagsSelect"
                placeholder="Please enter"
                filterOption={(input, option) =>
                  option.props.title
                    .toLowerCase()
                    .includes(input.trim().toLowerCase())
                }
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                onSearch={searchTags}
              >
                <Select.Option key={0} value="invalid" title="invalid" disabled>
                  Please enter valid characters
                </Select.Option>
              </SelectInputStyled>
            ) : (
              <SelectInputStyled
                data-cy="tagsSelect"
                mode="multiple"
                className="tagsSelect"
                bg="white"
                optionLabelProp="title"
                placeholder="Please enter"
                value={tags.map((x) => x._id)}
                onSearch={searchTags}
                onSelect={selectTags}
                onDeselect={deselectTags}
                dropdownClassName="custom-antd-select"
                filterOption={(input, option) =>
                  option.props.title.toLowerCase().includes(input.toLowerCase())
                }
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {searchValue.trim() ? (
                  <Select.Option
                    data-cy={`dok-select-${searchValue}`}
                    key={0}
                    value={searchValue}
                    title={searchValue}
                  >
                    {`${searchValue} (Create new Tag)`}
                  </Select.Option>
                ) : (
                  ''
                )}
                {newAllTagsData.map(({ tagName, _id }) => (
                  <Select.Option
                    data-cy={`tags-select-${tagName}`}
                    key={_id}
                    value={_id}
                    title={tagName}
                  >
                    {tagName}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            )}
          </ItemBody>
        </Col>
      </Row>
    </Container>
  )
}

SecondBlock.propTypes = {
  t: PropTypes.func.isRequired,
  onChangeTags: PropTypes.func.isRequired,
  onQuestionDataSelect: PropTypes.func.isRequired,
  depthOfKnowledge: PropTypes.string.isRequired,
  authorDifficulty: PropTypes.string.isRequired,
  tags: PropTypes.array,
}

SecondBlock.defaultProps = {
  tags: [],
}

export default SecondBlock
