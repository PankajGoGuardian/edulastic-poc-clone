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
          <ArchiveText style={{ fontSize: 17, fontWeight: 700, lineHeight: 4 }}>
            No archived classes
          </ArchiveText>
          <ArchiveText style={{ fontSize: 15 }}>
            You have no archived classes available
          </ArchiveText>
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
  background: #efefef;
  border: 2px solid #e9e9e9;
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
  color: #434b5d;
`;
