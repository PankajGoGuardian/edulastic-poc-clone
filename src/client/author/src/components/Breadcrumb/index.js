import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Breadcrumb } from "antd";
import styled from "styled-components";

import { secondaryTextColor, linkColor, themeColor } from "@edulastic/colors";

const BreadCrumb = props => {
  const { data, style } = props;
  return (
    <Container style={style} hasStickyHeader={props.hasStickyHeader}>
      <Breadcrumb>
        {Array.isArray(data) &&
          data.map((breadCrumb, index) => (
            <Breadcrumb.Item key={`bread${index}`}>
              {index !== data.length - 1 ? (
                <Link to={breadCrumb.to} onClick={breadCrumb.onClick}>
                  <span dangerouslySetInnerHTML={{ __html: breadCrumb.title.toLowerCase() }} />
                </Link>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: breadCrumb.title.toLowerCase() }} />
              )}
            </Breadcrumb.Item>
          ))}
      </Breadcrumb>
    </Container>
  );
};

BreadCrumb.propTypes = {
  data: PropTypes.array.isRequired,
  style: PropTypes.object
};

BreadCrumb.defaultProps = {
  style: {}
};

export default BreadCrumb;

const Container = styled.div`
  position: fixed;
  top: 80px;
  display: ${props => (props.hasStickyHeader ? "none" : "intial")};
  .ant-breadcrumb {
    > span:first-child {
      &:before {
        position: relative;
        display: inline-block;
        margin-right: 5px;
        content: "<";
        font-size: 11px;
        color: ${linkColor};
      }
    }
  }

  .ant-breadcrumb-link,
  .ant-breadcrumb-separator {
    font-size: 11px;
    color: ${linkColor};
    text-transform: uppercase;
    font-weight: 700;
    a {
      font-size: 11px;
      text-transform: uppercase;
      color: ${linkColor};
      font-weight: 600;
      &:hover {
        color: ${themeColor};
      }
    }
  }

  .anticon-left {
    margin-right: 5px;
  }

  .ant-breadcrumb-link {
    cursor: pointer;
    &:hover {
      color: ${themeColor};
    }
  }
`;
