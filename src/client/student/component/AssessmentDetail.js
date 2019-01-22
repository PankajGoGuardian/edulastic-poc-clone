import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Col, Icon } from 'antd';
import { formatTime } from '../utils';

const AssessmentDetails = ({
  test,
  theme,
  t,
  started,
  dueDate,
  type,
  startDate
}) => (
  <Wrapper>
    <Col>
      <ImageWrapper>
        <img src={test && test.thumbnail} alt="" />
      </ImageWrapper>
    </Col>
    <CardDetails>
      <CardTitle>{test && test.title}</CardTitle>
      <CardDate>
        <Icon type={theme.assignment.cardTimeIconType} />
        <span>
          <StrongText>
            {type === 'assignment'
              ? new Date(startDate) > new Date()
                ? `${t('common.opensIn')} ${formatTime(startDate)} and ${t(
                    'common.dueOn'
                  )}`
                : t('common.dueOn')
              : t('common.finishedIn')}{' '}
          </StrongText>
          {formatTime(dueDate)}
        </span>
      </CardDate>
      <div>
        {type === 'assignment' ? (
          <StatusButton isSubmitted={started}>
            <span>
              {started ? t('common.inProgress') : t('common.notStartedTag')}
            </span>
          </StatusButton>
        ) : (
          ''
        )}
      </div>
    </CardDetails>
  </Wrapper>
);

AssessmentDetails.propTypes = {
  test: PropTypes.object,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  dueDate: PropTypes.string.isRequired,
  started: PropTypes.bool.isRequired
};

AssessmentDetails.defaultProps = {
  test: {}
};

export default AssessmentDetails;

const Wrapper = styled(Col)`
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ImageWrapper = styled.div`
  max-width: 168.5px;
  max-height: 90.5px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 20px;
  @media screen and (max-width: 767px) {
    max-width: 100%;
    margin: 0;
    img {
      max-width: 100%;
      height: 120px;
    }
  }
`;

const CardDetails = styled(Col)`
  @media screen and (max-width: 767px) {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    margin-top: 20px;
  }
`;

const CardTitle = styled.div`
  font-family: ${props => props.theme.assignment.cardTitleFontFamily};
  font-size: ${props => props.theme.assignment.cardTitleFontSize};
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.assignment.cardTitleColor};
  padding-bottom: 6px;
`;

const CardDate = styled.div`
  display: flex;
  font-family: ${props => props.theme.assignment.cardTitleFontFamily};
  font-size: ${props => props.theme.assignment.cardTimeTextFontSize};
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.assignment.cardTimeTextColor};
  padding-bottom: 8px;
  i {
    color: ${props => props.theme.assignment.cardTimeIconColor};
  }

  .anticon-clock-circle {
    svg {
      width: 17px;
      height: 17px;
    }
  }
`;

const StrongText = styled.span`
  font-weight: 600;
  padding-left: 5px;
`;

const StatusButton = styled.div`
  width: 135px;
  height: 23.5px;
  border-radius: 5px;
  background-color: ${props =>
    props.isSubmitted
      ? props.theme.assignment.cardSubmitLabelBgColor
      : props.theme.assignment.cardNotStartedLabelBgColor};
  font-size: ${props => props.theme.assignment.cardSubmitLabelFontSize};
  font-weight: bold;
  line-height: 1.38;
  letter-spacing: 0.2px;
  text-align: center;
  padding: 6px 24px;
  span {
    position: relative;
    top: -1px;
    color: ${props =>
      props.isSubmitted
        ? props.theme.assignment.cardSubmitLabelTextColor
        : props.theme.assignment.cardNotStartedLabelTextColor};
  }
  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;
