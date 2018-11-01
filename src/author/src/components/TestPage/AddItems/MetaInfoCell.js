import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import { IconShare, IconHeart } from '@edulastic/icons';
import { greenDark, textColor } from '@edulastic/colors';
import styled from 'styled-components';

import Tags from '../../common/Tags';

const MetaInfoCell = ({ data }) => (
  <FlexContainer
    flexDirection="column"
    alignItems="flex-start"
    style={{ fontWeight: 600, color: textColor }}
  >
    <FlexContainer style={{ marginBottom: 15 }}>
      <div>
        <span>By:</span> <FirstText>{data.by}</FirstText>
      </div>
      <div>
        <span>ID:</span> <FirstText>{data.id}</FirstText>
      </div>
      <FlexContainer>
        <IconShare color={greenDark} /> <span>{data.shared}</span>
      </FlexContainer>
      <FlexContainer>
        <IconHeart color={greenDark} /> <span>{data.likes}</span>
      </FlexContainer>
    </FlexContainer>
    {data.types &&
      !!data.types.length && (
        <FlexContainer style={{ marginLeft: 0 }}>
          <span>Type: </span>
          <Tags tags={data.types} />
        </FlexContainer>
    )}
  </FlexContainer>
);

MetaInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
};

export default MetaInfoCell;

const FirstText = styled.span`
  color: ${greenDark};
`;
