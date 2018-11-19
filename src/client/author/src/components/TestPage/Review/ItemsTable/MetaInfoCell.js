import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { FlexContainer } from '@edulastic/common';
import { IconShare, IconHeart } from '@edulastic/icons';
import { greenDark, textColor, grey, white } from '@edulastic/colors';
import styled from 'styled-components';
import Tags from '../../../common/Tags';

const MetaInfoCell = ({ data }) => (
  <FlexContainer justifyContent="space-between" style={{ fontWeight: 600, color: textColor, flexWrap: 'wrap' }}>
    <div>
      <FlexContainer>
        <TypeContainer>
          {data.standards &&
            !!data.standards.length && (
              <FlexContainer>
                <Tags tags={data.standards} labelStyle={{ color: greenDark, background: white, border: `1px solid ${grey}` }} />
              </FlexContainer>
          )}
          {data.types &&
            !!data.types.length && (
              <FlexContainer>
                <CategoryTitle>Type: </CategoryTitle>
                {
                  data.types.map(type => (
                    <Tag color="cyan" key={type} style={{ marginTop: 3 }}>{type}</Tag>
                  ))
                }
              </FlexContainer>
          )}
        </TypeContainer>
        <div>
          <CategoryTitle>By:</CategoryTitle> <FirstText>{data.by}</FirstText>
        </div>
        <div>
          <CategoryTitle>ID:</CategoryTitle> <FirstText>{data._id}</FirstText>
        </div>
        <FlexContainer style={{ marginTop: 2 }}>
          <IconShare color={greenDark} /> <SecondText>{data.shared}</SecondText>
        </FlexContainer>
        <FlexContainer style={{ marginTop: 2 }}>
          <IconHeart color={greenDark} /> <SecondText>{data.likes}</SecondText>
        </FlexContainer>
      </FlexContainer>
    </div>
  </FlexContainer>
);

MetaInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
};

export default MetaInfoCell;

const FirstText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${greenDark};
`;

const SecondText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #444444;
`;

const CategoryTitle = styled.span`
  font-size: 13px;
  color: #444444;
`;

const TypeContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 15px;
`;
