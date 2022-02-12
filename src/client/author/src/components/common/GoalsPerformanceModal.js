import React from 'react'
import { CustomModalStyled, EduTableStyled } from '@edulastic/common'
import styled from 'styled-components'
import { Progress } from 'antd'
import { title } from '@edulastic/colors'

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
]

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    align: 'left',
  },
  {
    title: 'Recommended',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Frequency',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Links',
    dataIndex: 'address',
    key: 'address',
  },
]

const GoalsPerformanceModal = ({
  showGoalsModal,
  closeModal,
  percentage = '80',
}) => {
  const header = (
    <HeaderTitleWrapper>
      <h2>Performance Goals</h2>
      <div>
        <Progress
          strokeWidth="12px"
          strokeColor={
            percentage < 30
              ? 'rgb(255, 230, 192)'
              : percentage < 60
              ? 'rgb(235, 123, 101)'
              : 'rgb(153, 203, 118)'
          }
          percent={percentage}
          trailColor="#e1e1e1"
          size="large"
        />
      </div>
    </HeaderTitleWrapper>
  )
  return (
    <CustomModalStyled
      visible={showGoalsModal}
      title={header}
      onCancel={closeModal}
      footer={null}
      modalWidth="900px"
      centered
    >
      <Container>
        <EduTableStyled
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
        />
      </Container>
    </CustomModalStyled>
  )
}

export default GoalsPerformanceModal

const Container = styled.div`
  .ant-pagination {
    position: relative;
    padding: 0px;
    margin: 0px;
    bottom: 0;
    right: 0;
    top: 15px;
  }
`
const HeaderTitleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 15px;
  h2 {
    font-size: 22px;
    color: ${title};
    margin: 0px;
    font-weight: bold;
    margin-right: 30px;
  }
  & > div {
    width: 200px;
  }
`
