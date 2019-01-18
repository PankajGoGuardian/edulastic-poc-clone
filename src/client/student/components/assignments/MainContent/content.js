import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { fetchReportAction } from '../../../actions/report';
import { loadAssignmentsAction } from '../../../actions/dashboard';
import AssignmentCard from '../common/assignmentCard';

const Content = ({
  flag,
  loadAssignments,
  assignments,
  fetchReports,
  reports
}) => {
  useEffect(() => {
    loadAssignments();
    fetchReports();
  }, []);

  return (
    <LayoutContent flag={flag}>
      <Wrapper>
        <ContainerRow>
          <ContainerCell>
            <Container>
              <InnerContent>
                {assignments.map((item, index) => {
                  const systemDate = new Date();
                  const assignmentDate = new Date(item.endDate);
                  if (systemDate <= assignmentDate) {
                    return (
                      <AssignmentCard
                        key={index}
                        data={item}
                        reports={reports}
                      />
                    );
                  }
                })}
              </InnerContent>
            </Container>
          </ContainerCell>
        </ContainerRow>
      </Wrapper>
    </LayoutContent>
  );
};

export default connect(
  ({ ui, assignments, reports }) => ({
    flag: ui.flag,
    reports: reports.reports,
    assignments
  }),
  {
    fetchReports: fetchReportAction,
    loadAssignments: loadAssignmentsAction
  }
)(Content);

Content.propTypes = {
  flag: PropTypes.bool.isRequired,
  assignments: PropTypes.array,
  loadAssignments: PropTypes.func.isRequired,
  fetchReports: PropTypes.func.isRequired,
  reports: PropTypes.array
};

Content.defaultProps = {
  assignments: [],
  reports: []
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
  margin: 30px 30px;
  border-radius: 10px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  background-color: ${props => props.theme.assignment.cardContainerBgColor};
  min-height: 550px;

  @media screen and (max-width: 767px) {
    margin: 16px 26px;
  }
`;

const InnerContent = styled.div`
  padding: 5px 30px;

  @media screen and (max-width: 1300px) {
    padding: 5px 15px;
  }

  @media screen and (max-width: 767px) {
    padding: 5px 30px;
  }
`;
