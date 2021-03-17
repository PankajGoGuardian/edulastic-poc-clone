/* eslint-disable no-unused-vars */
import React from 'react'
import { EduButton } from '@edulastic/common'
import { FILTERS } from '../ManageContentBlock/ducks'
import SELECT_DATA from '../../../TestPage/components/common/selectsData'
import { StyledModal, StyledSelect, Title } from './styled'

const { Option } = StyledSelect

const PlaylistTestBoxFilter = (props) => {
  const {
    isVisible,
    onCancel,
    collectionsList = [],
    status = '',
    onStatusChange,
    grades = [],
    onGradesChange,
    subject = '',
    onSubjectChange,
    collection = '',
    onCollectionChange,
    authoredList = [],
    filter,
    onFilterChange,
    authoredBy,
    onAuthorChange,
    handleApplyFilters,
  } = props

  const { allGrades, allSubjects, allStatus } = SELECT_DATA

  const Footer = [
    <EduButton
      data-cy="cancelPlaylistContentFilter"
      isGhost
      width="210px"
      height="38px"
      onClick={onCancel}
    >
      No, Cancel
    </EduButton>,
    <EduButton
      data-cy="proceedPlaylistContentFilter"
      width="210px"
      height="38px"
      onClick={handleApplyFilters}
    >
      Search
    </EduButton>,
  ]

  return (
    <StyledModal
      title="Filter"
      visible={isVisible}
      onCancel={onCancel}
      footer={Footer}
      width="521px"
      height="422px"
    >
      <Title>type</Title>
      <StyledSelect
        dropdownClassName="playlist-content-box"
        data-cy="content-type"
        placeholder="Select Filter Type"
        value={filter}
        onChange={onFilterChange}
      >
        {FILTERS.map(({ text, filter: _filter }) => (
          <Option key={_filter} value={_filter}>
            {text}
          </Option>
        ))}
      </StyledSelect>

      <Title>status</Title>
      <StyledSelect
        dropdownClassName="playlist-content-box"
        data-cy="content-status"
        placeholder="Select Status"
        value={status}
        onChange={onStatusChange}
      >
        {allStatus.map(({ text, value }) => (
          <Option key={value} value={value}>
            {text}
          </Option>
        ))}
      </StyledSelect>

      <Title>authored by</Title>
      <StyledSelect
        dropdownClassName="playlist-content-box"
        data-cy="content-authored"
        placeholder="Select Authored"
        style={{ width: '100%', height: 40, lineHeight: 40 }}
        value={authoredBy || undefined}
        onChange={onAuthorChange}
      >
        {authoredList.map(({ text, value }) => (
          <Option key={value} value={value}>
            {text}
          </Option>
        ))}
      </StyledSelect>

      <Title>grade</Title>
      <StyledSelect
        dropdownClassName="playlist-content-box"
        data-cy="content-grade"
        mode="multiple"
        placeholder="Select Grades"
        value={grades}
        onChange={onGradesChange}
      >
        {allGrades?.map(({ text, value }) => (
          <Option key={value} value={value}>
            {text}
          </Option>
        ))}
      </StyledSelect>

      <Title>subject</Title>
      <StyledSelect
        dropdownClassName="playlist-content-box"
        data-cy="content-subject"
        placeholder="Select Subject"
        value={subject}
        onChange={onSubjectChange}
      >
        {allSubjects.map(({ text, value }) => (
          <Option key={value} value={value}>
            {text}
          </Option>
        ))}
      </StyledSelect>

      <Title>collection</Title>
      <StyledSelect
        dropdownClassName="playlist-content-box"
        data-cy="content-collection"
        placeholder="Select Collection"
        value={collection || undefined}
        onChange={onCollectionChange}
      >
        {collectionsList.map(({ text, value }) => (
          <Option key={value} value={value}>
            {text}
          </Option>
        ))}
      </StyledSelect>
    </StyledModal>
  )
}

export default PlaylistTestBoxFilter
