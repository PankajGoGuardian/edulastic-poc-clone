import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconPhotoCamera } from '@edulastic/icons';
import { blue, white } from '@edulastic/colors';

const Photo = ({ url }) => (
  <Container>
    <Image src={url} alt="Test" />
    <Camera>
      <IconPhotoCamera color={white} />
    </Camera>
  </Container>
);

Photo.propTypes = {
  url: PropTypes.string,
};

Photo.defaultProps = {
  url: 'https://fakeimg.pl/500x135/',
};

export default Photo;

const Container = styled.div`
  height: 135px;
  width: 100%;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 5px;
`;

const Camera = styled.div`
  background: ${blue};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: absolute;
  right: 40px;
  bottom: -20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
