import React, { useEffect, useState } from 'react'
import { Button, Modal, Pagination, Select, Spin, Typography } from 'antd'
import { notification } from '@edulastic/common'
import { isEmpty } from 'lodash'
import { lightFadedBlack } from '@edulastic/colors'
import styled from 'styled-components'
import { Table } from '../Common/StyledComponents'

const { Column } = Table
const { Option } = Select
const { Text } = Typography

const PAGE_SIZE = 100

const ApproveMergeModal = ({
  setIsModalVisible,
  isModalVisible,
  handleApprove,
  mapperFieldName,
  mapperErrorMessage = '',
  districtMappedData,
  setMapperErrorMessage,
  getPayload,
  getMappingData,
  mappedDataLoading,
  currentPage = 1,
  setCurrentPage,
}) => {
  const [formattedData, setFormattedData] = useState([])
  const [mappedResult, setMappedResult] = useState({})
  const [totalRecordsCount, setTotalRecordsCount] = useState(0)
  const setInitialMapping = (cleverId, edulasticId) => {
    mappedResult[cleverId] = edulasticId
  }

  const getCustomClassNameAndScore = (classData) => {
    let customName = classData.name
    let score = 0
    const gm = classData?.gm || 0
    const sm = classData?.sm || 0
    const scm = classData?.scm || 0
    const cIdMatch = classData.idMatch || 0
    // if cleverId matched, disable the dropdown with existing clever class
    // G: match | S: match | Count: match
    // It will be an exact match which is explained above.
    // G: match | S: match | Count: no match
    // We need to look for students present and if it matches 60% or more then merge
    // G: match | S: no match | Count: match
    // We need to look for students present and if it matches 80% or more then merge
    // G: no match | S: match | Count: match
    // We need to look for students present and if it matches 80% or more then merge
    // G: no match | S: no match | Count: match
    // We need to look for students present and if it matches 80% or more then merge
    // G: no match | S: no match | Count: no match
    // ignore and let it be blank which will result in the creation of a new class during sync
    if (cIdMatch === 100) {
      score = 0
    } else if (gm === 100 && sm === 100 && scm === 100) {
      customName = `${customName} (Grade - Matched | Subject - Matched | Student count - ${scm}%)`
      score = 1
    } else if (gm === 100 && sm === 100 && scm >= 60) {
      customName = `${customName} (Grade - Matched | Subject - Matched | Student count - ${scm}%)`
      score = 2
    } else if (gm === 100 && scm >= 80) {
      customName = `${customName} (Grade - Matched | Subject - Not Matched | Student count - ${scm}%)`
      score = 3
    } else if (sm === 100 && scm >= 80) {
      customName = `${customName} (Grade - Not Matched | Subject - Matched | Student count - ${scm}%)`
      score = 4
    } else if (scm >= 80) {
      customName = `${customName} (Student count - ${scm}%)`
      score = 4
    } else {
      customName = `${customName} (Grade - ${
        gm ? 'Matched' : 'Not Matched'
      } | Subject - ${sm ? 'Matched' : 'Not Matched'} | Student count - ${
        scm || 0
      }%)`
      score = 5
    }
    return {
      customName,
      score,
    }
  }
  const compareClass = (a, b) => {
    return a.score - b.score
  }
  const formatClassData = (dataSet) => {
    const resultDataSet = []
    if (!isEmpty(dataSet)) {
      for (const data of dataSet) {
        const cId = data.lmsClassId
        const cName = data.lmsClassName
        const listOfMatchedClasses = data.matchedClasses
        if (
          listOfMatchedClasses?.length === 1 &&
          listOfMatchedClasses?.[0]?.idMatch
        ) {
          const { score, customName } = getCustomClassNameAndScore(
            listOfMatchedClasses?.[0]
          )
          resultDataSet.push({
            cId,
            cName,
            data: [
              {
                eId: listOfMatchedClasses?.[0]?.id,
                eName: customName,
                cIdMatch: 100,
                score,
              },
            ],
          })
        } else {
          resultDataSet.push({
            cId,
            cName,
            data: listOfMatchedClasses.map((_class) => {
              const { score, customName } = getCustomClassNameAndScore({
                _class,
              })
              return {
                eId: _class.id,
                eName: customName,
                score,
              }
            }),
          })
        }
      }
    }
    resultDataSet.forEach((_class) => {
      _class.data.sort(compareClass)
      if (_class.data?.[0]?.score < 5) {
        setInitialMapping(_class.cId, _class.data?.[0]?.eId)
      }
    })
    return resultDataSet
  }

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
  const formatData = (dataSet) => {
    const resultDataSet = []
    if (!isEmpty(dataSet)) {
      for (const data of dataSet) {
        const cId = data.lmsSchoolId
        const cName = data.lmsSchoolName
        const listOfMatchedSchools = data.mappedSchools
        if (!isEmpty(listOfMatchedSchools)) {
          if (listOfMatchedSchools?.[0]?.idMatch) {
            const eduSchoolInfo = listOfMatchedSchools[0]
            resultDataSet.push({
              cId,
              cName,
              data: [
                {
                  eId: eduSchoolInfo.id,
                  eName: eduSchoolInfo.name,
                  cIdMatch: 100,
                },
              ],
            })
          } else {
            resultDataSet.push({
              cId,
              cName,
              data: listOfMatchedSchools.map((eduData) => {
                return {
                  eId: eduData.id,
                  eName: getCustomName(eduData),
                  zipMatch: eduData?.zipMatch,
                  nameMatch: eduData?.nameMatch,
                }
              }),
            })
          }
        }
      }
    }
    resultDataSet.forEach((_obj) => {
      _obj.data.sort(compare)
      setInitialMapping(
        _obj.cId,
        _obj.data?.[0]?.zipMatch === 100 ||
          _obj.data?.[0]?.nameMatch > 75 ||
          _obj.data?.[0]?.cIdMatch === 100
          ? _obj.data[0].eId
          : undefined
      )
    })
    console.log(resultDataSet)
    return resultDataSet
  }

  useEffect(() => {
    if (!isEmpty(mapperErrorMessage)) {
      notification({ msg: mapperErrorMessage })
    }
  }, [mapperErrorMessage])

  const renderReviewContent = () => {
    // format data to display in review table
    const { mappedData, totalCount } = districtMappedData[mapperFieldName] || {}
    // loop through all mappedSchools
    if (mapperFieldName === 'Schools') {
      const data = formatData(mappedData[currentPage])
      setFormattedData(data)
    }
    if (mapperFieldName === 'Classes') {
      setFormattedData(formatClassData(mappedData[currentPage]))
    }
    setTotalRecordsCount(totalCount)
  }

  useEffect(() => {
    if (!mappedDataLoading) {
      renderReviewContent()
    }
  }, [districtMappedData, currentPage])

  const handleMappingChange = (cleverId, edulasticId) => {
    mappedResult[cleverId] = edulasticId
    setMappedResult(mappedResult)
  }

  const handleCloseModal = () => {
    setMapperErrorMessage([])
    setIsModalVisible(false)
  }

  const handlePageChange = (pageNumber) => {
    const mappedData = districtMappedData[mapperFieldName]
    if (!mappedData[pageNumber]) {
      // call api with this page number and get new data
      const { payload } = getPayload(mapperFieldName, pageNumber)
      getMappingData({ ...payload, page: pageNumber })
    }
    setCurrentPage(pageNumber)
  }

  return (
    <>
      <Modal
        title={[
          <div key="0">
            <Text>Review and Approve </Text>
            <Text type="danger" strong>
              (Once mapping is done, it cannot be changed again)
            </Text>
          </div>,
        ]}
        width="95%"
        visible={isModalVisible}
        centered
        onCancel={handleCloseModal}
        footer={[
          <Button key="back" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => handleApprove(mappedResult)}
          >
            Approve
          </Button>,
        ]}
      >
        {formattedData ? (
          <>
            <Pagination
              showQuickJumper
              defaultCurrent={currentPage}
              total={totalRecordsCount}
              pageSize={PAGE_SIZE}
              onChange={handlePageChange}
            />
            {mappedDataLoading ? (
              <StyledSpinner>
                <Spin />
              </StyledSpinner>
            ) : (
              <Table
                rowKey={(record) => record.cId}
                dataSource={formattedData}
                pagination={false}
                scroll={{ y: '60vh' }}
              >
                <Column
                  title="S No."
                  width="15%"
                  dataIndex="cId"
                  key="cId"
                  render={(_, __, idx) => idx + 1 + 25 * (currentPage - 1)}
                />
                <Column
                  title={`Clever ${mapperFieldName}`}
                  width="30%"
                  dataIndex="cName"
                  key="cName"
                  render={(_data) => _data}
                />
                <Column
                  title={`Edulastic ${mapperFieldName}`}
                  dataIndex="data"
                  key="data"
                  render={(_data, record) => {
                    return (
                      <Select
                        showSearch
                        allowClear
                        defaultValue={mappedResult[record.cId]}
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
            )}
          </>
        ) : (
          <h1>loading...</h1>
        )}
      </Modal>
    </>
  )
}

export default ApproveMergeModal

const StyledSpinner = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 9999;
  background: ${lightFadedBlack};
`
