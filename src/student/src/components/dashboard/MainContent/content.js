import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { IconClockCircularOutline } from '@edulastic/icons';
import PropTypes from 'prop-types';

import AssignmentsContent from '../common/content';

const Content = ({ flag }) => (
  <AssignmentsContent flag={flag}>
    <AssignmentContentWrapper>
      <Wrapper>
        <ImageWrapper>
          <img src="https://placem.at/things/?w=500&random=cats" alt="" />
        </ImageWrapper>
        <AssignmentSummary>
          <AssignmentSubject>Math MCAS-CALCULATOR</AssignmentSubject>
          <AssignmentDuedate>
            <Icon color="#ee1658" />
            <DueText>Due on Aug 15, 2018 8:00 AM</DueText>
          </AssignmentDuedate>
          <AssignmentStatus>NOT STARTED</AssignmentStatus>
        </AssignmentSummary>
        <StartAssignmentBtn>
          <p>start assignment</p>
        </StartAssignmentBtn>
      </Wrapper>
    </AssignmentContentWrapper>
    <AssignmentContentWrapper>
      <Wrapper>
        <ImageWrapper>
          <img src="https://placem.at/things/?w=500&random=cats" alt="" />
        </ImageWrapper>
        <AssignmentSummary>
          <AssignmentSubject>Math MCAS-CALCULATOR</AssignmentSubject>
          <AssignmentDuedate>
            <Icon color="#ee1658" />
            <DueText>Due on Aug 15, 2018 8:00 AM</DueText>
          </AssignmentDuedate>
          <AssignmentStatus>NOT STARTED</AssignmentStatus>
        </AssignmentSummary>
        <StartAssignmentBtn>
          <p>start assignment</p>
        </StartAssignmentBtn>
      </Wrapper>
    </AssignmentContentWrapper>
  </AssignmentsContent>
);

Content.propTypes = {
  flag: PropTypes.any.isRequired,
};

export default connect(({ ui }) => ({ flag: ui.flag }))(Content);

const Wrapper = styled.div`
  width: 100%;
  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
`;

const AssignmentContentWrapper = styled.div`
  border-radius: 1rem;
  padding: 1.2rem 1.3rem;
  background: #fff;
  margin-bottom: 1rem;
  @media (min-width: 945px) {
    display: flex;
  }
  @media (max-width: 945px) {
    display: flex;
  }
`;

const ImageWrapper = styled.div`
  width: 10.8rem;
  margin-right: 3rem;
  float: left;
  & img {
    width: 100%;
    border-radius: 0.5rem;
    height: 5.8rem;
  }
  @media (max-width: 900px) {
    width: 19rem;
    margin-right: 0rem;
    margin-bottom: 1rem;
    & img {
      height: 7.5rem;
    }
  }
  @media (max-width: 380px) {
    display: flex;
    width: 100%;
  }
`;

const AssignmentSummary = styled.div`
  float: left;
  @media (min-width: 1024px) {
  }
  @media (max-width: 900px) {
    text-align: center;
  }
`;

const AssignmentSubject = styled.p`
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #12a6e8;
  font-size: 1.1rem;
  font-weight: 700;
  & span {
  }
`;

const AssignmentStatus = styled.div`
  background: #ee1658;
  width: 6.8rem;
  height: 1.4rem;
  color: #fff;
  border-radius: 0.4rem;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.01rem;
  line-height: 1.4rem;
  text-align: center;
  text-transform: uppercase;
  @media (max-width: 900px) {
    margin: 0 auto;
    width: 9rem;
    height: 2rem;
    font-size: 0.7rem;
    padding: 0.3rem;
  }
`;

const AssignmentDuedate = styled.p`
  margin-top: 0rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  @media (max-width: 900px) {
    margin-bottom: 1.2rem;
  }
`;

const DueText = styled.span`
  vertical-align: middle;
`;

const Icon = styled(IconClockCircularOutline)`
  margin-right: 0.5rem;
  vertical-align: middle;
`;

const StartAssignmentBtn = styled.div`
  width: 12.3rem;
  float: right;
  & p {
    color: #12a6e8;
    border: 0.08rem solid #12a6e8;
    padding: 1.1rem 1.5rem;
    border-radius: 2rem;
    text-align: center;
    text-transform: uppercase;
    font-size: 0.7rem;
    margin: 1.3rem 0rem;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background: #12a6e8;
      color: #fff;
    }
  }
  @media (max-width: 900px) {
    width: 19rem;
    & p {
      padding: 1.3rem 1.5rem;
      font-size: 1rem;
      margin-bottom: 0rem;
    }
  }
  @media (max-width: 380px) {
    width: 100%;
    & p {
      display: flex;
    }
  }
`;
