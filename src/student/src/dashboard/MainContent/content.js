import React from 'react';
import styled from 'styled-components';
import { IconClockCircularOutline } from '@edulastic/icons';
import AssignmentsContent from '../common/content';

class Content extends React.Component {
  render() {
    return (
      <AssignmentsContent>
        <AssignmentContentWrapper>
          <Wrapper>
            <ImageWrapper>
              <img src="https://placem.at/things/?w=500&random=cats" />
            </ImageWrapper>
            <AssignmentSummary>
              <AssignmentSubject>Math MCAS-CALCULATOR</AssignmentSubject>
              <AssignmentDuedate>
                <Icon color="#ee1658" />
                <span>Due on Aug 15, 2018 8:00 AM</span>
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
              <img src="https://placem.at/things/?w=500&random=cats" />
            </ImageWrapper>
            <AssignmentSummary>
              <AssignmentSubject>Math MCAS-CALCULATOR</AssignmentSubject>
              <AssignmentDuedate>
                <Icon color="#ee1658" />
                <span>Due on Aug 15, 2018 8:00 AM</span>
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
  }
}

export default Content;
const Wrapper = styled.div`
  width: 100%;
  @media (max-width: 875px) {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
`;

const AssignmentContentWrapper = styled.div`
  border-radius: 1rem;
  padding: 1rem 1rem;
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
  width: 11rem;
  margin-right: 3rem;
  float: left;
  & img {
    width: 100%;
    border-radius: 1rem;
    height: 6rem;
  }
  @media (max-width: 875px) {
    width: 11rem;
    margin-right: 0rem;
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
  font-size: 1.3rem;
  font-weight: 700;
  & span {
  }
`;

const AssignmentStatus = styled.div`
  background: #ee1658;
  width: 8.8rem;
  height: 2.2rem;
  color: #fff;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.01rem;
  line-height: 2.4rem;
  text-align: center;
  text-transform: uppercase;
  @media (max-width: 875px) {
    margin: 0 auto;
  }
`;

const AssignmentDuedate = styled.p`
  margin-top: 0rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Icon = styled(IconClockCircularOutline)`
  margin-right: 0.5rem;
`;

const StartAssignmentBtn = styled.div`
  width: 12.8rem;
  float: right;
  & p {
    color: #12a6e8;
    border: 0.08rem solid #12a6e8;
    padding: 1.3rem 2rem;
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
`;
