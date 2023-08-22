import { themeColor, white } from '@edulastic/colors'
import {
  CheckboxLabel,
  EduButton,
  EduElse,
  EduIf,
  EduThen,
  notification,
} from '@edulastic/common'
import { test as testContatns } from '@edulastic/constants'
import {
  IconClose,
  IconCollapse,
  IconDescription,
  IconExpand,
  IconEye,
  IconMoveTo,
  IconPlusCircle,
  IconMinusRounded,
} from '@edulastic/icons'
import { get, isArray } from 'lodash'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { createNewStaticGroup } from '../../../../ducks'
import Prompt from '../Prompt/Prompt'
import RemoveSectionsModal from './RemoveSectionsModal'
import { Container, Item, MobileButtomContainer } from './styled'

const { ITEM_GROUP_TYPES, sectionTestActions } = testContatns
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
  setData,
  handleNavChange,
  handleSave,
  setSectionsState,
  testId,
  setCurrentGroupDetails,
  hasSections,
  isDefaultTest,
}) => {
  const hasUnsavedItems = get(itemGroups, '0.items', []).some(
    ({ unsavedItem }) => unsavedItem
  )
  const [showPrompt, setShowPrompt] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
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

  /*
    When the Add new Sections button is clicked, we will set the hasSections flag to true. 
    As a result, the Add Items tab will be replaced by Add Sections. Also in order to navigate 
    to the Add Sections, we are using the handleNavChange method.
  */
  const handleAddSections = () => {
    setData({ hasSections: true })
    handleNavChange()
    setSectionsState(true)
    if (testId) handleSave(sectionTestActions.ADD)
    setCurrentGroupDetails()
  }

  /*
    This method is called when the user clicks on the Okay button in the Remove modal. As a result, 
    the has sections flag is set to false and the previously selected items are removed and a new 
    static group will be created. The Add Sections tab will be replaced by Add Items tab and the 
    remove modal will be closed.
  */
  const handleRemoveSections = () => {
    setData({
      hasSections: false,
      itemGroups: [createNewStaticGroup()],
    })
    setSectionsState(false)
    if (testId) handleSave(sectionTestActions.REMOVE)
    setShowRemoveModal(false)
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
      {showRemoveModal && (
        <RemoveSectionsModal
          isVisible={showRemoveModal}
          closeModal={() => setShowRemoveModal(false)}
          removeSections={handleRemoveSections}
        />
      )}
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
        {/* 
          The Add new sections and Remove New Section buttons are displayed for default test. 
            Add new sections --> displayed if default test does not have section. 
            Remove new sections --> displayed if default test has sections. 
        */}
        {owner && isEditable && isDefaultTest && (
          <EduIf condition={!hasSections}>
            <EduThen>
              <EduButton
                height="20px"
                fontSize="9px"
                isGhost
                data-cy="addNewSections"
                disabled={disableRMbtns}
                onClick={!disableRMbtns ? handleAddSections : () => null}
                color="primary"
              >
                <IconPlusCircle color={themeColor} width={9} height={9} />
                {windowWidth > 767 && <span>Add New Sections</span>}
              </EduButton>
            </EduThen>
            <EduElse>
              <EduButton
                height="20px"
                fontSize="9px"
                isGhost
                data-cy="removeNewSections"
                disabled={disableRMbtns}
                onClick={
                  !disableRMbtns ? () => setShowRemoveModal(true) : () => null
                }
                color="primary"
              >
                <IconMinusRounded color={themeColor} width={9} height={9} />
                {windowWidth > 767 && <span>Remove All Sections</span>}
              </EduButton>
            </EduElse>
          </EduIf>
        )}
        <EduButton
          height="20px"
          data-cy="viewAsStudent"
          fontSize="9px"
          isBlue
          onClick={onShowTestPreview}
          color="primary"
          disabled={hasUnsavedItems}
          title={
            hasUnsavedItems ? 'Please save the Test to View as student' : ''
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

export default HeaderBar
