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

const PAGE_SIZE = 25

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
  const [filterField, setFilterField] = useState('')

  const isSchool = mapperFieldName === 'Schools'

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

  const handleMappingChange = (cleverId, edulasticId) => {
    const map = mappedResult
    map[cleverId] = edulasticId
    setMappedResult(map)
  }

  const formatFilterData = (filterValue) => {
    setFilterField(filterValue)
    setCurrentPage(1)
    let data = districtMappedData[mapperFieldName].mappedData
    if (filterValue === 'equal') {
      data = data.filter((_data) => {
        const fullMatchData = _data.mappedSchools.filter(
          (o) => o.zipMatch && o.nameMatch === 100
        )
        return fullMatchData.length === 1
      })
      data.forEach((_data) =>
        _data.mappedSchools.sort((a, b) => b.nameMatch - a.nameMatch)
      )
    } else if (filterValue === 'less') {
      data = data.filter((_data) => {
        const map = {}
        for (const o of _data.mappedSchools) {
          if (o.zipMatch) {
            if (o.nameMatch === 100) return false
            if (o.nameMatch >= 75) {
              if (!map[o.nameMatch]) map[o.nameMatch] = []
              map[o.nameMatch].push(o)
            }
          }
        }
        return (
          !isEmpty(map) &&
          map[Object.keys(map).sort((a, b) => b - a)[0]].length === 1
        )
      })
      data.forEach((_data) =>
        _data.mappedSchools.sort((a, b) => b.nameMatch - a.nameMatch)
      )
    } else if (filterValue === 'blank') {
      // let containsZipNotMatch = false
      data = data.filter((_data) => {
        const map = {}
        _data.mappedSchools.forEach((o) => {
          // if (!o.zipMatch && o.nameMatch >= 75) containsZipNotMatch = true
          if (!map[o.nameMatch]) map[o.nameMatch] = []
          map[o.nameMatch].push(o)
        })
        return (
          !isEmpty(map) &&
          (map[Object.keys(map).sort((a, b) => b - a)[0]].length > 2 ||
            // eslint-disable-next-line radix
            parseInt(Object.keys(map).sort((a, b) => b - a)[0]) < 75)
        )
      })
      data.forEach((_data) =>
        _data.mappedSchools.sort((a, b) => b.nameMatch - a.nameMatch)
      )
    }
    setMappedResult({})
    data.forEach((_data) => {
      const o = _data?.mappedSchools?.[0] ? _data?.mappedSchools?.[0] : null
      handleMappingChange(
        _data.lmsSchoolId,
        o && o.zipMatch && o.nameMatch >= 75 ? o.id : null
      )
    })
    setFormattedData(data)
    setTotalRecordsCount(data.length)
  }

  const getCustomName = (obj) => {
    const isZipMatched = obj.zipMatch
    const nameMatched = obj.nameMatch ? obj.nameMatch : 0
    let customStr = `${obj.name}`
    if (isZipMatched && nameMatched) {
      customStr = `${obj.name} (Zip: ${
        obj.zipMatch ? 'Matched' : 'Not Matched'
      } | Name: ${parseInt(obj.nameMatch, 10)}%)`
    } else if (isZipMatched) {
      customStr = `${obj.name} (Zip: ${
        obj.zipMatch ? 'Matched' : 'Not Matched'
      })`
    } else if (nameMatched) {
      customStr = `${obj.name} (Zip: Not Matched | Name: ${parseInt(
        obj.nameMatch,
        10
      )}%)`
    }
    return customStr
  }

  useEffect(() => {
    if (!isEmpty(mapperErrorMessage)) {
      notification({ msg: mapperErrorMessage })
    }
  }, [mapperErrorMessage])

  const compare = (a, b) => {
    if (a.zipMatch && b.zipMatch) return b.nameMatch - a.nameMatch
    if (a.zipMatch) return -1
    if (b.zipMatch) return 1
    return 0
  }

  const renderReviewContent = () => {
    const { mappedData, totalCount } = districtMappedData[mapperFieldName] || {}
    let data = []
    if (mapperFieldName === 'Schools') {
      data = mappedData
    }
    if (mapperFieldName === 'Classes') {
      data = mappedData[currentPage]
    }
    setMappedResult({})
    mapperFieldName === 'Schools' &&
      data.forEach((_data) => {
        _data?.mappedSchools?.sort(compare)
        const o = _data?.mappedSchools?.[0] ? _data?.mappedSchools?.[0] : null
        handleMappingChange(
          _data.lmsSchoolId,
          o && o.zipMatch && o.nameMatch >= 75 ? o.id : null
        )
      })
    setFormattedData(data)
    setTotalRecordsCount(totalCount)
  }

  useEffect(() => {
    if (
      !mappedDataLoading &&
      ((mapperFieldName === 'Schools' &&
        currentPage === 1 &&
        filterField === '') ||
        mapperFieldName === 'Classes')
    ) {
      renderReviewContent()
    }
  }, [districtMappedData, currentPage, formattedData])

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
            Approve all pages
          </Button>,
        ]}
      >
        {formattedData ? (
          <>
            {!isSchool && (
              <Pagination
                showQuickJumper
                defaultCurrent={currentPage}
                total={totalRecordsCount}
                pageSize={PAGE_SIZE}
                onChange={handlePageChange}
              />
            )}
            {isSchool && (
              <>
                <Button key="equal" onClick={() => formatFilterData('equal')}>
                  (Select 100%)
                </Button>
                <Button key="less" onClick={() => formatFilterData('less')}>
                  {'Select < 100%'}
                </Button>
                <Button key="blank" onClick={() => formatFilterData('blank')}>
                  (Select Blank)
                </Button>
                <Button key="all" onClick={() => formatFilterData('')}>
                  (Select All)
                </Button>
              </>
            )}
            {mappedDataLoading ? (
              <StyledSpinner>
                <Spin />
              </StyledSpinner>
            ) : (
              <Table
                rowKey={(record) =>
                  isSchool ? record.lmsSchoolId : record.lmsClassId
                }
                dataSource={formattedData}
                pagination={
                  isSchool
                    ? {
                        defaultCurrent: 1,
                        total: formattedData?.length,
                        pageSize: 25,
                        position: 'top',
                        onChange: (page) => setCurrentPage(page),
                        current: currentPage,
                      }
                    : null
                }
                scroll={{ y: '60vh' }}
              >
                <Column
                  title="S No."
                  width="15%"
                  dataIndex={isSchool ? 'lmsSchoolId' : 'lmsClassId'}
                  key={isSchool ? 'lmsSchoolId' : 'lmsClassId'}
                  render={(_, __, idx) => idx + 1 + 25 * (currentPage - 1)}
                />
                <Column
                  title={`Clever ${mapperFieldName}`}
                  width="30%"
                  dataIndex={isSchool ? 'lmsSchoolName' : 'lmsClassName'}
                  key={isSchool ? 'lmsSchoolName' : 'lmsClassName'}
                  render={(_data) => _data}
                />
                <Column
                  title={`Edulastic ${mapperFieldName}`}
                  dataIndex={isSchool ? 'mappedSchools' : 'mappedClasses'}
                  key={isSchool ? 'mappedSchools' : 'mappedClasses'}
                  render={(_data, record) => {
                    return (
                      <Select
                        showSearch
                        allowClear
                        defaultValue={mappedResult[record.lmsSchoolId]}
                        dropdownStyle={{ zIndex: 2000 }}
                        style={{ width: '90%' }}
                        bordered={false}
                        onChange={(value) => {
                          handleMappingChange(
                            record.lmsSchoolId || record.lmsClassId,
                            value
                          )
                        }}
                        disabled={_data.idMatch}
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
                            <Option key={o.id} value={o.id}>
                              {isSchool
                                ? getCustomName(o)
                                : getCustomClassNameAndScore(o)}
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
