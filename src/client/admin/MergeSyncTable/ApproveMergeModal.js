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

  const getCustomName = (obj) => {
    const isZipMatched = obj.zipMatch === 100
    const nameMatched = obj.nameMatch ? obj.nameMatch : ''
    let customStr = `${obj.name}`
    if (isZipMatched && nameMatched) {
      customStr = `${obj.name} (Zip: ${
        obj.zipMatch === 100 ? 'Matched' : 'Not Matched'
      } | Name: ${parseInt(obj.nameMatch, 10)}%)`
    } else if (isZipMatched) {
      customStr = `${obj.name} (Zip: ${
        obj.zipMatch === 100 ? 'Matched' : 'Not Matched'
      })`
    } else if (nameMatched) {
      customStr = `${obj.name} (Zip: Not Matched | Name: ${parseInt(
        obj.nameMatch,
        10
      )}%)`
    }
    return customStr
  }

  const compare = (a, b) => {
    return (
      (b.zipMatch || 0) - (a.zipMatch || 0) ||
      (b.nameMatch || 0) - (a.nameMatch || 0)
    )
  }

  const formatData = (dataSet, masterDataSet) => {
    const resultDataSet = []
    const cleverIdMasterDataMap = masterDataSet.reduce((acc, data) => {
      if (data.cId) {
        acc[data.cId] = data
      }
      return acc
    }, {})
    if (!isEmpty(dataSet)) {
      for (const key of Object.keys(dataSet)) {
        const data = dataSet[key]
        const cId = key
        const cName = data.name
        const listOfMatchedSchools = data.eduSchools
        if (!isEmpty(listOfMatchedSchools)) {
          if (listOfMatchedSchools?.[0]?.cIdMatch === 100) {
            const eduSchoolInfo = cleverIdMasterDataMap[cId]
            resultDataSet.push({
              cId,
              cName,
              data: [
                {
                  eId: eduSchoolInfo._id,
                  eName: eduSchoolInfo.name,
                  cIdMatch: 100,
                },
              ],
            })
          } else {
            const eduSchoolsMap = listOfMatchedSchools.reduce((acc, o) => {
              acc[o.eduId] = o
              return acc
            }, {})
            resultDataSet.push({
              cId,
              cName,
              data: masterDataSet
                .filter((o) => !o.cId)
                .map((o) => {
                  const eduData = eduSchoolsMap[o._id]
                  return {
                    eId: o._id,
                    eName: getCustomName({ name: o.name, ...eduData }),
                    zipMatch: eduData?.zipMatch,
                    nameMatch: eduData?.nameMatch,
                  }
                }),
            })
          }
        } else {
          // loop the master data and populate result set
          resultDataSet.push({
            cId,
            cName,
            data: masterDataSet
              .filter((o) => !o.cId)
              .map((o) => {
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
    resultDataSet.forEach((_obj) => _obj.data.sort(compare))
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

  const handleCloseModal = () => {
    setMapperErrorMessage([])
    setIsModalVisible(false)
  }

  return (
    <>
      <Modal
        title="Review and Approve"
        width="90%"
        visible={isModalVisible}
        centered
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
            rowKey={(record) => record.cId}
            dataSource={formattedData}
            pagination={false}
            scroll={{ y: '60vh' }}
          >
            <Column
              title="S No."
              width="20%"
              dataIndex="cId"
              key="cId"
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
              key="data"
              render={(_data, record) => {
                setInitialMapping(
                  record.cId,
                  _data?.[0]?.zipMatch === 100 || _data?.[0]?.nameMatch > 75
                    ? _data[0].eId
                    : undefined
                )
                return (
                  <Select
                    showSearch
                    defaultValue={
                      _data?.[0]?.zipMatch === 100 ||
                      _data?.[0]?.nameMatch > 75 ||
                      _data?.[0]?.cIdMatch === 100
                        ? _data[0].eId
                        : undefined
                    }
                    dropdownStyle={{ zIndex: 2000 }}
                    style={{ width: '90%' }}
                    bordered={false}
                    onChange={(value) => {
                      handleMappingChange(record.cId, value)
                    }}
                    disabled={_data?.[0]?.cIdMatch === 100}
                    filterOption={(input, option) => {
                      return (
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      )
                    }}
                  >
                    {_data.map((o) => {
                      return (
                        <Option key={o.eId} value={o.eId}>
                          {o.eName}
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
