import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { dictionaries } from '@edulastic/constants'
import TagField from '../../../ItemList/components/Fields/TagField'
import { getUserFeatures } from '../../../src/selectors/user'
import { StyledDiv } from '../../../../assessment/containers/QuestionMetadata/styled/ELOList'

const FiltersSidebar = ({
  filterItem,
  onChange,
  search,
  userFeatures,
  isDA,
}) => {
  const isPublishers = !!(
    userFeatures.isPublisherAuthor || userFeatures.isCurator
  )

  const selectRef = React.useRef()

  if (filterItem.title === 'Tags' && filterItem.useElasticSearch) {
    return (
      <>
        <FieldLabel>{filterItem.title}</FieldLabel>
        <TagField
          data-cy={filterItem.title}
          mode={filterItem.mode}
          onChange={(tags) => onChange(filterItem.onChange, tags)}
          placeholder={filterItem.placeholder}
          ref={selectRef}
          size={filterItem.size}
          tagTypes={filterItem.tagTypes || []}
          value={search[filterItem.onChange]}
          valueKey="key"
        />
      </>
    )
  }

  const showMoreButtonEnabled =
    filterItem.onChange === 'standardIds' &&
    filterItem?.data?.length >= dictionaries.STANDARD_DROPDOWN_LIMIT_1000

  return (
    <>
      <FieldLabel>{filterItem.title}</FieldLabel>
      <SelectStyled
        data-cy={filterItem.title}
        showSearch={filterItem.showSearch}
        onSearch={filterItem.onSearch && filterItem.onSearch}
        mode={filterItem.mode}
        size={filterItem.size}
        placeholder={filterItem.placeholder}
        filterOption={filterItem.filterOption}
        optionFilterProp={filterItem.optionFilterProp}
        defaultValue={
          filterItem.mode === 'multiple'
            ? undefined
            : filterItem.data[0] && filterItem.data[0].value
        }
        value={
          filterItem.onChange === 'standardIds'
            ? search[filterItem.onChange].map((item) => item._id)
            : search[filterItem.onChange]
        }
        key={filterItem.title}
        ref={selectRef}
        onChange={(value) => {
          onChange(filterItem.onChange, value)
          selectRef?.current?.blur()
        }}
        disabled={filterItem.disabled}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        margin="0px 0px 15px"
      >
        {filterItem?.data
          ?.filter((cd) =>
            isDA && filterItem.title === 'Collections'
              ? !['School Library'].includes(cd.text)
              : 1
          )
          ?.map(({ value, text, disabled }, index1) => (
            <Select.Option value={value} key={index1} disabled={disabled}>
              {text}
            </Select.Option>
          ))}
        {showMoreButtonEnabled && (
          <Select.Option
            title="Show More"
            value="show"
            style={{ textAlign: 'center', display: 'block' }}
            disabled
          >
            <StyledDiv onClick={filterItem.handleShowBrowseModal}>
              <span>Show More</span>
            </StyledDiv>
          </Select.Option>
        )}
        {isPublishers &&
          filterItem.title === 'Status' &&
          filterItem.publisherOptions.map(({ value, text }) => (
            <Select.Option value={value} key={value}>
              {text}
            </Select.Option>
          ))}
      </SelectStyled>
    </>
  )
}

FiltersSidebar.propTypes = {
  onChange: PropTypes.func,
  search: PropTypes.object.isRequired,
}

FiltersSidebar.defaultProps = {
  onChange: () => null,
}

export default connect(
  (state) => ({
    userFeatures: getUserFeatures(state),
  }),
  null
)(FiltersSidebar)

export const FilterItemWrapper = styled.div`
  position: relative;
`

const SelectStyled = styled(SelectInputStyled)`
  .ant-select-selection__placeholder {
    padding-right: 18px;
  }

  .ant-select-selection {
    cursor: pointer !important;
  }
`
