import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'styled-components'
import { themes } from '../../../../theme'

import SummaryHeader from '../../../../student/TestAttemptReview/components/SummaryHeader'
import { itemsToDeliverInGroupSelector } from '../../../../assessment/sharedDucks/previewTest'
import {
  MainContainer,
  ContentArea,
} from '../../../../student/SectionsStart/styled-components'
import SectionsInfo from '../../../../student/SectionsStart/components/SectionsInfo'
import TestSectionsContainer from '../../../../student/SectionsStart/components/TestSectionsContainer'

const SectionsTestStartPage = (props) => {
  const {
    itemsToDeliverInGroup = [],
    title,
    thumbnail,
    preventSectionNavigation = false,
    closeTestPreviewModal,
    setShowPreviewModeSectionStartPage,
    allItems = [],
    setCurrentItem,
  } = props
  const handleStartSection = (index) => () => {
    if (typeof setShowPreviewModeSectionStartPage === 'function') {
      setShowPreviewModeSectionStartPage(false)
    }

    const targetItem = itemsToDeliverInGroup?.[index]?.items?.[0]
    const itemIndex = allItems.findIndex((ele) => ele._id === targetItem)
    if (itemIndex !== -1) {
      setCurrentItem(itemIndex)
      return
    }
    setCurrentItem(0)
  }

  const exitSectionsPage = () => {
    closeTestPreviewModal()
  }

  return (
    <ThemeProvider theme={themes.default}>
      <SummaryHeader
        showExit
        isTestPreviewModal
        hidePause={false}
        onExitClick={exitSectionsPage}
      />
      <MainContainer isTestPreviewModal>
        <ContentArea>
          <SectionsInfo title={title} thumbnail={thumbnail} />
          <TestSectionsContainer
            itemsToDeliverInGroup={itemsToDeliverInGroup}
            preventSectionNavigation={preventSectionNavigation}
            handleStartSection={handleStartSection}
            isTestPreviewModal
          />
        </ContentArea>
      </MainContainer>
    </ThemeProvider>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      itemsToDeliverInGroup: itemsToDeliverInGroupSelector(state),
    }),
    {}
  )
)

export default enhance(SectionsTestStartPage)

SectionsTestStartPage.propTypes = {
  closeTestPreviewModal: PropTypes.func,
  setShowPreviewModeSectionStartPage: PropTypes.func,
  setCurrentItem: PropTypes.func,
  itemsToDeliverInGroup: PropTypes.array,
  allItems: PropTypes.array,
}

SectionsTestStartPage.defaultProps = {
  closeTestPreviewModal: () => {},
  setShowPreviewModeSectionStartPage: () => {},
  setCurrentItem: () => {},
  itemsToDeliverInGroup: [],
  allItems: [],
}
