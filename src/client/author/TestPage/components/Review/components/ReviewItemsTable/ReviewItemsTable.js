/* eslint-disable react/prop-types */
import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'
import { helpers } from '@edulastic/common'
import { ReviewTableWrapper } from './styled'

import MainInfoCell from './MainInfoCell/MainInfoCell'
import MetaInfoCell from './MetaInfoCell/MetaInfoCell'
import { getStandardsSelector } from '../../ducks'
import { getQuestionType, isPremiumContent } from '../../../../../dataUtils'
import ListItem from '../List/ListItem'

const ItemsTable = ({
  items,
  mobile,
  standards,
  questions,
  scoring = {},
  rows,
  selected,
  setSelected,
  handlePreview,
  isEditable,
  owner,
  onChangePoints,
  isCollapse,
  passagesKeyed = {},
  gradingRubricsFeature,
}) => {
  const [expandedRows, setExpandedRows] = useState(-1)

  const handleCheckboxChange = (index, checked) => {
    if (checked) {
      setSelected([...selected, index])
    } else {
      const newSelected = selected.filter((item) => item !== index)
      setSelected(newSelected)
    }
  }

  const columns = [
    {
      title: 'Main info',
      dataIndex: 'data',
      key: 'main',
      render: (data) =>
        expandedRows === data.key ? (
          <ListItem
            key={data.key}
            metaInfoData={data.meta}
            index={data.key}
            owner={owner}
            indx={data.key}
            isEditable={isEditable}
            item={rows[data.key]}
            testItem={data.meta.item}
            points={data.main.points}
            onCheck={handleCheckboxChange}
            onChangePoints={onChangePoints}
            onPreview={handlePreview}
            selected={selected}
            collapseView
            questions={questions}
            mobile={mobile}
            passagesKeyed={passagesKeyed}
            isScoringDisabled={data.main.isScoringDisabled}
          />
        ) : (
          <>
            <MainInfoCell
              data={data.main}
              handlePreview={handlePreview}
              isEditable={isEditable}
              owner={owner}
              index={data.key}
              setExpandedRows={setExpandedRows}
              onChangePoints={onChangePoints}
              isCollapse={isCollapse}
              isScoringDisabled={data.main.isScoringDisabled}
            />
            <MetaInfoCell data={data.meta} />
          </>
        ),
    },
  ]

  const audioStatus = (item) => {
    const _questions = get(item, 'data.questions', [])
    const getAllTTS = _questions.filter((ite) => ite.tts).map((ite) => ite.tts)
    const audio = {}
    if (getAllTTS.length) {
      const ttsSuccess =
        getAllTTS.filter((ite) => ite.taskStatus !== 'COMPLETED').length === 0
      audio.ttsSuccess = ttsSuccess
    }
    return audio
  }

  const data = items.map((item, i) => {
    const isScoringDisabled =
      (!!item?.data?.questions?.find((q) => q.rubrics) &&
        gradingRubricsFeature) ||
      item.autoselectedItem ||
      item.isLimitedDeliveryType
    const main = {
      id: item._id,
      points: item.isLimitedDeliveryType
        ? item.itemsDefaultMaxScore
        : scoring[item._id] || helpers.getPoints(item),
      title: item._id,
      isScoringDisabled,
    }

    const meta = {
      id: item._id,
      by: get(item, ['createdBy', 'name'], ''),
      shared: 0,
      likes: 0,
      type: getQuestionType(item),
      points: scoring[item._id] || helpers.getPoints(item),
      item,
      isPremium: isPremiumContent(item?.collections),
      standards: standards[item._id],
      audio: audioStatus(item),
      tags: item.tags,
      dok:
        item.data &&
        item.data.questions &&
        (item.data.questions.find((e) => e.depthOfKnowledge) || {})
          .depthOfKnowledge,
    }

    if (item.data && item.data.questions && item.data.questions.length) {
      main.stimulus = item.data.questions[0].stimulus
    }

    return {
      data: {
        key: i,
        main,
        meta,
      },
    }
  })

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelected(selectedRowKeys)
    },
    selectedRowKeys: selected,
  }
  return (
    <ReviewTableWrapper
      rowSelection={isEditable ? rowSelection : ''}
      columns={columns}
      dataSource={data}
      showHeader={false}
      pagination={false}
    />
  )
}

ItemsTable.propTypes = {
  items: PropTypes.array.isRequired,
  isEditable: PropTypes.bool.isRequired,
  handlePreview: PropTypes.func.isRequired,
  standards: PropTypes.object.isRequired,
  gradingRubricsFeature: PropTypes.bool.isRequired,
}

const enhance = compose(
  memo,
  connect((state) => ({
    standards: getStandardsSelector(state),
  }))
)

export default enhance(ItemsTable)
