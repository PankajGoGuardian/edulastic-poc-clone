import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import { IconShare, IconHeart } from '@edulastic/icons';
import { greenDark, textColor, grey, white } from '@edulastic/colors';
import styled from 'styled-components';
import Tags from '../../../common/Tags';

const MetaInfoCell = ({ data }) => (
  <FlexContainer style={{ fontWeight: 600, color: textColor, flexWrap: 'wrap' }}>
    {data.standards &&
      !!data.standards.length && (
        <FlexContainer>
          <Tags tags={data.standards} labelStyle={{ color: greenDark, background: white, border: `1px solid ${grey}` }} />
        </FlexContainer>
    )}
    {data.types &&
      !!data.types.length && (
        <FlexContainer>
          <span>Type: </span>
          <Tags tags={data.types} />
        </FlexContainer>
    )}
    <FlexContainer>
      <div>
        <span>By:</span> <FirstText>{data.by}</FirstText>
      </div>
      <div>
        <span>ID:</span> <FirstText>{data._id}</FirstText>
      </div>
      <FlexContainer>
        <IconShare color={greenDark} /> <span>{data.shared}</span>
      </FlexContainer>
      <FlexContainer>
        <IconHeart color={greenDark} /> <span>{data.likes}</span>
      </FlexContainer>
    </FlexContainer>
  </FlexContainer>
);

MetaInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
};

export default MetaInfoCell;

const FirstText = styled.span`
  color: ${greenDark};
`;
