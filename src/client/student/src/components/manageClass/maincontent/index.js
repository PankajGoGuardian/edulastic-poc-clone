import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { IconManageClass } from '@edulastic/icons';
import AssignmentsContent from '../../commonStyle/assignmentContent';
import AssignmentContentWrapper from '../../commonStyle/assignmentContentWrapper';

const ManageClassContent = ({ flag }) => (
  <AssignmentsContent flag={flag}>
    <ManageWrapper>
      <Wrapper>
        <Content>
          <IconManage />
          <ArchiveText>No archived classes</ArchiveText>
          <ArchiveSubText>You have no archived classes available</ArchiveSubText>
        </Content>
      </Wrapper>
    </ManageWrapper>
  </AssignmentsContent>
);

export default React.memo(ManageClassContent);

ManageClassContent.propTypes = {
  flag: PropTypes.bool.isRequired
};

const Wrapper = styled.div`
  padding: 2rem 5rem;
`;

const ManageWrapper = styled(AssignmentContentWrapper)`
  background: ${props => props.theme.manageClass.manageClassBgColor};
  border: 2px solid ${props => props.theme.manageClass.manageClassBgBorderColor};
  padding: 0rem;
`;

const Content = styled.div`
  text-align: center;
`;

const IconManage = styled(IconManageClass)`
  fill: #0eb08d !important;
  width: 60px !important;
  height: 80px !important;
`;

const ArchiveText = styled.div`
  color: ${props => props.theme.manageClass.NoDataArchiveTextColor};
  font-size: ${props => props.theme.manageClass.NoDataArchiveTextSize};
  font-weight: 700;
  line-height: 4;
`;

const ArchiveSubText = styled.div`
  font-size: ${props => props.theme.manageClass.NoDataArchiveSubTextSize};
  color: ${props => props.theme.manageClass.NoDataArchiveSubTextColor};
`;
