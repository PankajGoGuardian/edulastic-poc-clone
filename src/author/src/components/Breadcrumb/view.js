import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Icon } from 'antd';
import styled from 'styled-components';

class BreadCrumb extends Component {
  render() {
    const { data } = this.props;
    return (
      <Container>
        <Breadcrumb>
          {
            data && data.map((breadCrumb, index) => (
              <Breadcrumb.Item>
                {
                  index === 0 && <Icon type="left" style={{ fontSize: 11 }} />
                }
                {breadCrumb}
              </Breadcrumb.Item>
            ))
          }
        </Breadcrumb>
      </Container>
    );
  }
}

BreadCrumb.propTypes = {
  data: PropTypes.array.isRequired,
};

export default BreadCrumb;

const Container = styled.div`
  position: fixed;
  top: 88px;

  .ant-breadcrumb-link, .ant-breadcrumb-separator {
    font-size: 11px;
    font-weight: 600;
    color: #00b0ff;
  }

  .anticon-left {
    margin-right: 5px;
  }
`;
