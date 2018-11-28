import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Affix } from 'antd';
import { Link } from 'react-router-dom';
import { IconChevronLeft } from '@edulastic/icons';
import { FlexContainer } from '@edulastic/common';
import { mobileWidth, darkBlueSecondary, white, blue } from '@edulastic/colors';

const ItemHeader = ({ title, children, link, reference, windowWidth }) => {
  const width = windowWidth;
  return (
    width > 468 ? (
      <Affix>
        <Container>
          <FlexContainer alignItems="center" style={{ flex: 1 }}>
            <LeftSide>
              <Title>{title}</Title>
              {reference !== null && (
                <FlexContainer>
                  <ReferenceText>
                    Reference
                  </ReferenceText>
                  <ReferenceValue>
                    {reference}
                  </ReferenceValue>
                </FlexContainer>
              )}
            </LeftSide>
            <RightSide>{children}</RightSide>
          </FlexContainer>
          <LeftSide>
            {link && (
              <Back to={link.url}>
                <IconChevronLeft color={white} width={10} height={10} /> {link.text}
              </Back>
            )}
          </LeftSide>
        </Container>
      </Affix>)
      : (
        <Affix>
          <MobileContainer>
            <FlexContainer alignItems="center" style={{ flex: 1, paddingBottom: 20 }}>
              <LeftSide>
                <Title>{title}</Title>
                {reference !== null && (
                  <FlexContainer>
                    <ReferenceText>
                      Reference
                    </ReferenceText>
                    <ReferenceValue>
                      {reference}
                    </ReferenceValue>
                  </FlexContainer>
                )}
              </LeftSide>
            </FlexContainer>
            <RightSide>{children}</RightSide>
            <LeftSide>
              {link && (
                <Back to={link.url}>
                  <IconChevronLeft color={white} width={10} height={10} /> {link.text}
                </Back>
              )}
            </LeftSide>
          </MobileContainer>
        </Affix>)
  );
};

ItemHeader.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  link: PropTypes.any,
  windowWidth: PropTypes.number.isRequired,
  reference: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ItemHeader.defaultProps = {
  children: null,
  title: '',
  link: null,
  reference: null,
};

export default ItemHeader;

const Container = styled.div`
  display: flex;
  align-items: center;
  background: ${darkBlueSecondary};
  padding: 0px 40px;
  height: 62px;

  @media (max-width: ${mobileWidth}) {
    margin-bottom: 30px;
  }
`;

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 10px 0px 40px;
  background: ${darkBlueSecondary};
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
`;

const RightSide = styled.div`
  text-align: right;
  flex: 1;
  position: relative;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  line-height: 1.36;
  color: ${white};
`;

const Back = styled(Link)`
  color: ${white};
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;

  :hover {
    color: ${blue};
  }
`;

const ReferenceText = styled.div`
  margin-left: 94.5px;
  color: ${white};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
`;

const ReferenceValue = styled.div`
  margin-left: 11px;
  font-size: 13px;
  font-style: italic;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${white};
`;
