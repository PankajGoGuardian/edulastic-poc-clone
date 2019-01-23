import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import { IconManageClass } from '@edulastic/icons';
import AssignmentsContent from '../../components/commonStyle/assignmentContent';
import AssignmentContentWrapper from '../../components/commonStyle/assignmentContentWrapper';

const ManageContainer = ({ flag, t }) => (
  <AssignmentsContent flag={flag}>
    <ManageWrapper>
      <Wrapper>
        <Content>
          <IconManage />
          <ArchiveText>{t('common.noClassesTitle')}</ArchiveText>
          <ArchiveSubText>{t('common.noClassesSubTitle')}</ArchiveSubText>
        </Content>
      </Wrapper>
    </ManageWrapper>
  </AssignmentsContent>
);

const enhance = compose(
  withNamespaces('manageClass'),
  React.memo
);

export default enhance(ManageContainer);

ManageContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
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
