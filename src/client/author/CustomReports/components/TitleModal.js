import React from 'react'
import { Modal, Input } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { addDashboardItemAction, updateDashboardItemAction } from '../ducks'
import { formatQueryData } from '../util'

const TitleModal = ({
  history,
  itemId,
  titleModalVisible,
  setTitleModalVisible,
  setAddingToDashboard,
  query,
  setTitle,
  finalTitle,
  addDashboardItem,
  updateDashboardItem,
  selectedChartType,
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
            query: { ...formatQueryData(query) },
            name: finalTitle,
          })
        } else {
          addDashboardItem({
            layout: {
              type: selectedChartType,
              options: JSON.stringify({
                x: 0,
                y: 0,
                w: 4,
                h: 8,
              }),
            },
            query: { ...formatQueryData(query) },
            name: finalTitle,
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
  connect(() => ({}), {
    addDashboardItem: addDashboardItemAction,
    updateDashboardItem: updateDashboardItemAction,
  })
)

export default enhance(TitleModal)
