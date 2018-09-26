import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { grey } from '../../utils/css';

const TextField = ({
  icon, height, style, ...restProps
}) => (
  <Container height={height} style={style}>
    <Field type="text" {...restProps} />
    {icon && <Icon>{icon}</Icon>}
  </Container>
);

TextField.propTypes = {
  icon: PropTypes.any,
  height: PropTypes.string,
  style: PropTypes.object,
};

TextField.defaultProps = {
  icon: null,
  height: '45px',
  style: {},
};

export default TextField;

const Container = styled.span`
  position: relative;
  height: ${({ height }) => height};
  width: 100%;
`;

const Icon = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
`;

const Field = styled.input`
  border: 1px solid ${grey};
  border-radius: 10px;
  min-height: 100%;
  width: 100%;
  padding: 0 40px 0 10px;
`;
