import { themeColor, white } from '@edulastic/colors'
import { CheckboxLabel, EduButton, notification } from '@edulastic/common'
import { test as testContatns } from '@edulastic/constants'
import {
  IconClose,
  IconCollapse,
  IconDescription,
  IconExpand,
  IconEye,
  IconMoveTo,
} from '@edulastic/icons'
import { isArray } from 'lodash'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { sectionsEnabledDistrictSelector } from '../../../../ducks'
import Prompt from '../Prompt/Prompt'
import { Container, Item, MobileButtomContainer } from './styled'
import { hasUnsavedAiItems } from '../../../../../../assessment/utils/helpers'
import { isPremiumUserSelector } from '../../../../../src/selectors/user'

const { ITEM_GROUP_TYPES } = testContatns

const HeaderBar = ({
  onSelectAll,
  onRemoveSelected,
  onCollapse,
  toggleSummary,
  owner,
  isEditable,
  itemTotal,
  selectedItems,
  onMoveTo,
  windowWidth,
  setCollapse,
  isShowSummary,
  onShowTestPreview,
  itemGroups,
}) => {
  const _hasUnsavedAiItems = hasUnsavedAiItems(itemGroups)
  const [showPrompt, setShowPrompt] = useState(false)
  const [minimum, setMinimum] = useState(1)
  const [maximum, setMaximum] = useState(1)

  const disableRMbtns = itemGroups.some(
    (group) => group.type === ITEM_GROUP_TYPES.AUTOSELECT
  )

  const handleSuccess = (position) => {
    const post = position - 1
    if (post > itemTotal - 1) {
      notification({ type: 'info', messageKey: 'valueMoreThanQuestions' })
    } else if (post < 0) {
      notification({ type: 'info', messageKey: 'valueLessThanQuestions' })
    } else {
      onMoveTo(post)
      setShowPrompt(false)
    }
  }

  const setMinAndMaxRange = () => {
    let selectedGrpLength = 0
    let groupIndex = 0
    itemGroups.forEach((itemGroup) => {
      const selectedItemIndex = itemGroup.items.findIndex((item) => {
        if (isArray(item)) {
          return item.some((ite) => ite.selected)
        }
        return item.selected
      })
      if (selectedItemIndex > -1) {
        selectedGrpLength = itemGroup.items.length
        groupIndex = itemGroup.index
      }
    })

    const totalItemsInAboveGrp = itemGroups.reduce((acc, curr) => {
      if (curr.index < groupIndex) {
        return acc + curr.items.length
      }
      return acc + 0
    }, 0)

    setMinimum(totalItemsInAboveGrp + 1)
    setMaximum(totalItemsInAboveGrp + selectedGrpLength)
  }

  const handleMoveTo = () => {
    if (disableRMbtns) return

    setMinAndMaxRange()

    if (selectedItems.length === 1) {
      setShowPrompt(!showPrompt)
    } else {
      notification({ type: 'info', messageKey: 'selectQuestionOne' })
      setShowPrompt(false)
    }
  }

  return (
    <Container windowWidth={windowWidth}>
      {owner && isEditable ? (
        <Item>
          <CheckboxLabel
            data-cy="selectAllCh"
            onChange={onSelectAll}
            labelFontSize="9px"
          >
            Select All
          </CheckboxLabel>
        </Item>
      ) : (
        // this empty span can fix some
        // alignment issues when there is no select all button exists. dont remove it.
        <span />
      )}
      <MobileButtomContainer style={{ display: 'flex' }}>
        <EduButton
          height="20px"
          data-cy="viewAsStudent"
          fontSize="9px"
          isBlue
          onClick={onShowTestPreview}
          color="primary"
          disabled={_hasUnsavedAiItems}
          title={
            _hasUnsavedAiItems ? 'Please save the Test to View as student' : ''
          }
        >
          <IconEye width={12} height={12} />
          {windowWidth > 767 && <span>View as Student</span>}
        </EduButton>
        {owner && isEditable && (
          <EduButton
            height="20px"
            fontSize="9px"
            isGhost
            data-cy="removeSelected"
            disabled={disableRMbtns}
            onClick={!disableRMbtns ? onRemoveSelected : () => null}
            color="primary"
          >
            <IconClose color={themeColor} width={9} height={9} />
            {windowWidth > 767 && <span>Remove Selected</span>}
          </EduButton>
        )}
        {owner && isEditable && (
          <div style={{ position: 'relative', marginLeft: '5px' }}>
            <EduButton
              data-cy="moveto"
              disabled={disableRMbtns}
              height="20px"
              fontSize="9px"
              isGhost
              onClick={!disableRMbtns ? handleMoveTo : () => null}
              color="primary"
            >
              <IconMoveTo color={themeColor} width={12} height={12} />
              {windowWidth > 767 && <span>Move to</span>}
            </EduButton>
            {showPrompt && (
              <Prompt
                style={{ position: 'absolute', left: 0, top: 32, zIndex: 2 }}
                minValue={minimum}
                maxValue={maximum}
                onSuccess={handleSuccess}
                setShowPrompt={setShowPrompt}
              />
            )}
          </div>
        )}
        <EduButton
          data-cy={setCollapse ? 'expand-rows' : 'collapse-rows'}
          height="20px"
          fontSize="9px"
          isGhost
          onClick={onCollapse}
          color="primary"
        >
          {setCollapse ? (
            <IconExpand color={themeColor} width={12} height={12} />
          ) : (
            <IconCollapse color={themeColor} width={12} height={12} />
          )}
          {windowWidth > 767 && (
            <span>{setCollapse ? 'Expand Rows' : 'Collapse Rows'}</span>
          )}
        </EduButton>
        {windowWidth < 1200 && (
          <EduButton
            height="20px"
            isGhost
            style={{
              background: !isShowSummary ? themeColor : '',
              color: !isShowSummary ? white : '',
              borderRadius: '4px',
              maxHeight: '32px',
            }}
            onClick={toggleSummary}
            color="primary"
            fontSize="9px"
          >
            <IconDescription
              color={isShowSummary ? themeColor : white}
              width={13}
              height={13}
            />
            {windowWidth > 767 && (
              <span>{isShowSummary ? 'Show Summary' : 'Hide Summary'}</span>
            )}
          </EduButton>
        )}
      </MobileButtomContainer>
    </Container>
  )
}

HeaderBar.propTypes = {
  onSelectAll: PropTypes.func.isRequired,
  onMoveTo: PropTypes.func.isRequired,
  onRemoveSelected: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired,
  owner: PropTypes.bool.isRequired,
  isEditable: PropTypes.bool.isRequired,
  itemTotal: PropTypes.number.isRequired,
  selectedItems: PropTypes.array.isRequired,
  windowWidth: PropTypes.number.isRequired,
  setCollapse: PropTypes.bool.isRequired,
  isShowSummary: PropTypes.bool.isRequired,
  toggleSummary: PropTypes.func.isRequired,
}

const enhance = compose(
  connect((state) => ({
    isPremiumUser: isPremiumUserSelector(state),
    isSectionsEnabledDistrict: sectionsEnabledDistrictSelector(state),
  }))
)

export default enhance(HeaderBar)
