import React from 'react'
import { Modal, Input } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { addDashboardItemAction, updateDashboardItemAction } from '../ducks'

const TitleModal = ({
  history,
  itemId,
  titleModalVisible,
  setTitleModalVisible,
  setAddingToDashboard,
  finalVizState,
  setTitle,
  finalTitle,
  addDashboardItem,
  updateDashboardItem,
}) => {
  return (
    <Modal
      key="modal"
      title="Save Chart"
      visible={titleModalVisible}
      onOk={async () => {
        setTitleModalVisible(false)
        setAddingToDashboard(true)
        if (itemId) {
          updateDashboardItem({
            itemId,
            updateDoc: {
              vizState: JSON.stringify(finalVizState),
              name: finalTitle,
            },
          })
        } else {
          addDashboardItem({
            updateDoc: {
              layout: JSON.stringify({
                x: 0,
                y: 0,
                w: 4,
                h: 8,
              }),
              vizState: JSON.stringify(finalVizState),
              name: finalTitle,
            },
          })
        }
        setAddingToDashboard(false)
        history.push('/author/customReports')
      }}
      onCancel={() => setTitleModalVisible(false)}
    >
      <Input
        placeholder="Dashboard Item Name"
        value={finalTitle}
        onChange={(e) => setTitle(e.target.value)}
      />
    </Modal>
  )
}

const enhance = compose(
  connect((state) => ({}), {
    addDashboardItem: addDashboardItemAction,
    updateDashboardItem: updateDashboardItemAction,
  })
)

export default enhance(TitleModal)
