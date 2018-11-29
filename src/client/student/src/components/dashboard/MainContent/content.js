import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { loadDashboardtestAction } from '../../../actions/dashboard';
import AssignmentCard from '../common/assignmentCard';

const Content = ({ flag, loadDashboardtest, tests }) => {
  useEffect(() => {
    loadDashboardtest();
  }, []);
  return (
    <LayoutContent flag={flag}>
      <Wrapper>
        <ContainerRow>
          <ContainerCell>
            <Container>
              <InnerContent>
                {tests.map((item, index) => (
                  <AssignmentCard key={index} data={item} />
                ))}
              </InnerContent>
            </Container>
          </ContainerCell>
        </ContainerRow>
      </Wrapper>
    </LayoutContent>
  );
};

export default React.memo(
  connect(
    ({ ui, studentTest }) => ({ flag: ui.flag, tests: studentTest.tests }),
    { loadDashboardtest: loadDashboardtestAction }
  )(Content)
);

Content.propTypes = {
  flag: PropTypes.bool.isRequired,
  tests: PropTypes.array.isRequired,
  loadDashboardtest: PropTypes.func.isRequired
};

const LayoutContent = styled(Layout.Content)`
  display: table;
  height: 100vh;
  padding-bottom: 150px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: table-cell;
  height: 100%;
`;

const ContainerRow = styled.div`
  height: 100%;
  position: relative;
`;

const ContainerCell = styled.div`
  height: 100%;
  width: 100%;
`;

const Container = styled.div`
  margin: 30px 40px;
  border-radius: 10px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  min-height: 550px;

  @media screen and (max-width: 767px) {
    margin: 16px 26px;
  }
`;

const InnerContent = styled.div`
  padding: 5px 46px;

  @media screen and (max-width: 1300px) {
    padding: 5px 15px;
  }

  @media screen and (max-width: 767px) {
    padding: 5px 30px;
  }
`;
