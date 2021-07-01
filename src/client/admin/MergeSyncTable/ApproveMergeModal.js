import React, { useEffect, useState } from 'react'
import { Button, Modal, Select } from 'antd'
import { notification } from '@edulastic/common'
import { isEmpty } from 'lodash'
import { Table } from '../Common/StyledComponents'

const { Column } = Table
const { Option } = Select

const ApproveMergeModal = ({
  mappedResult = {},
  setMappedResult,
  setIsModalVisible,
  isModalVisible,
  handleApprove,
  mapperFieldName,
  mapperErrorMessage = '',
  districtMappedData,
  setMapperErrorMessage,
}) => {
  const [formattedData, setFormattedData] = useState([])
  const formatData = (dataSet, masterDataSet) => {
    const resultDataSet = []
    if (!isEmpty(dataSet)) {
      for (const key of Object.keys(dataSet)) {
        const data = dataSet[key]
        const cId = key
        const cName = data.name
        const listOfMatchedSchools = data.eduSchools
        if (!isEmpty(listOfMatchedSchools)) {
          const eduSchoolsMap = listOfMatchedSchools.reduce((acc, o) => {
            acc[o.eduId] = o
            return acc
          }, {})
          resultDataSet.push({
            cId,
            cName,
            data: masterDataSet.map((o) => {
              const eduData = eduSchoolsMap[o._id]
              return {
                eId: o._id,
                eName: o.name,
                zipMatch: eduData?.zipMatch,
                nameMatch: eduData?.nameMatch,
              }
            }),
          })
        } else {
          // loop the master data and populate result set
          resultDataSet.push({
            cId,
            cName,
            data: masterDataSet.map((o) => {
              return {
                cId,
                cName,
                eId: o._id,
                eName: o.name,
              }
            }),
          })
        }
      }
    }
    return resultDataSet
  }
  useEffect(() => {
    if (!isEmpty(mapperErrorMessage)) {
      notification({ msg: mapperErrorMessage })
    }
  }, [mapperErrorMessage])

  useEffect(() => {
    // format data to display in review table
    const { Schools, Classes } = districtMappedData
    const { mappedSchools, edulasticSchools } = Schools || {}
    const { mappedClasses, edulasticClasses } = Classes || {}
    // loop through all mappedSchools
    if (mapperFieldName === 'Schools') {
      const data = formatData(mappedSchools, edulasticSchools)
      setFormattedData(data)
    }
    if (mapperFieldName === 'Classes') {
      setFormattedData(formatData(mappedClasses, edulasticClasses))
    }
  }, [])

  const handleMappingChange = (cleverId, edulasticId) => {
    mappedResult[cleverId] = edulasticId
    setMappedResult(mappedResult)
  }

  const setInitialMapping = (cleverId, edulasticId) => {
    mappedResult[cleverId] = edulasticId
  }

  const compare = (a, b) => {
    return (
      (b.zipMatch || 0) - (a.zipMatch || 0) ||
      (b.nameMatch || 0) - (a.nameMatch || 0)
    )
  }

  const handleCloseModal = () => {
    setMapperErrorMessage([])
    setIsModalVisible(false)
  }

  return (
    <>
      <Modal
        title="Review and Approve"
        width="90%"
        height="50%"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="back" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleApprove}>
            Approve
          </Button>,
        ]}
      >
        {formattedData ? (
          <Table
            rowKey={(record) => record.id}
            dataSource={formattedData}
            pagination={false}
            scroll={{ y: 600 }}
          >
            <Column
              title="S No."
              width="20%"
              render={(_, __, idx) => idx + 1}
            />
            <Column
              title={`Clever ${mapperFieldName}`}
              dataIndex="cName"
              key="cName"
              render={(_data) => _data}
            />
            <Column
              title={`Edulastic ${mapperFieldName}`}
              dataIndex="data"
              render={(_data, record) => {
                _data.sort(compare)
                setInitialMapping(record.cId, _data[0].eId)
                return (
                  <Select
                    showSearch
                    defaultValue={_data[0].eId}
                    dropdownStyle={{ zIndex: 2000 }}
                    style={{ width: '90%' }}
                    bordered={false}
                    onChange={(value) => {
                      handleMappingChange(record.cId, value)
                    }}
                    filterOption={(input, option) => {
                      return (
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      )
                    }}
                  >
                    {_data.map((o) => {
                      const isZipMatched = o.zipMatch === 100
                      const nameMatched = o.nameMatch ? o.nameMatch : ''
                      let customStr = `${o.eName}`
                      if (isZipMatched && nameMatched) {
                        customStr = `${o.eName} (Zip: ${
                          o.zipMatch === 100 ? 'matched' : 'not matched'
                        } | Name: ${parseInt(o.nameMatch, 10)}%)`
                      } else if (isZipMatched) {
                        customStr = `${o.eName} (Zip: ${
                          o.zipMatch === 100 ? 'matched' : 'not matched'
                        })`
                      } else if (nameMatched) {
                        customStr = `${o.eName} (Name: ${parseInt(
                          o.nameMatch,
                          10
                        )}%)`
                      }
                      return (
                        <Option key={o.eId} value={o.eId}>
                          {customStr}
                        </Option>
                      )
                    })}
                  </Select>
                )
              }}
            />
          </Table>
        ) : (
          <h1>loading...</h1>
        )}
      </Modal>
    </>
  )
}

export default ApproveMergeModal
