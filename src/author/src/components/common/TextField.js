import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { grey } from '../../../../assessment/src/utils/css';

const TextField = ({ icon, height, style, containerStyle, ...restProps }) => (
  <Container height={height} style={containerStyle}>
    <Field type="text" style={style} {...restProps} />
    {icon && <Icon>{icon}</Icon>}
  </Container>
);

TextField.propTypes = {
  icon: PropTypes.any,
  height: PropTypes.string,
  style: PropTypes.object,
  containerStyle: PropTypes.object,
};

TextField.defaultProps = {
  icon: null,
  height: '45px',
  style: {},
  containerStyle: {},
};

export default TextField;

const Container = styled.span`
  position: relative;
  height: ${({ height }) => height};
  width: 100%;
`;

const Icon = styled.span`
    position: absolute;
    right: 8px;
    height: 100%;
    display: flex;
    align-items: center;
    top: 0;
`;

const Field = styled.input`
  border: 1px solid ${grey};
  border-radius: 10px;
  min-height: 100%;
  width: 100%;
  padding: 10px 35px;
  color: #7a7a7a;
  font-size: 14px;
  letter-spacing: 0.5px;
`;
