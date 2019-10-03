import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Breadcrumb, Icon } from "antd";
import styled from "styled-components";
import { extraDesktopWidthMax, mediumDesktopWidth, smallDesktopWidth } from "@edulastic/colors";

const BreadCrumb = props => {
  const { data, style } = props;
  return (
    <Container style={style}>
      <Breadcrumb>
        {Array.isArray(data) &&
          data.map((breadCrumb, index) => (
            <Breadcrumb.Item key={`bread${index}`}>
              {index === 0 && <Icon key={index} type="left" />}
              {index !== data.length - 1 ? <Link to={breadCrumb.to}>{breadCrumb.title}</Link> : breadCrumb.title}
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
  position: static;
  text-transform: uppercase;

  .ant-breadcrumb-link,
  .ant-breadcrumb-separator {
    font-weight: bold !important;
    font-size: ${props => props.theme.breadcrumbs.breadcrumbTextSizeLarge};
    color: ${props => props.theme.breadcrumbs.breadcrumbTextColor};

    a {
      color: ${props => props.theme.breadcrumbs.breadcrumbLinkColor};
    }
  }

  @media (max-width: ${extraDesktopWidthMax}) {
    .ant-breadcrumb-link,
    .ant-breadcrumb-separator {
      font-size: ${props => props.theme.breadcrumbs.breadcrumbTextSizeLarge} !important;
    }
  }

  @media (max-width: ${mediumDesktopWidth}) {
    .ant-breadcrumb-link,
    .ant-breadcrumb-separator {
      font-size: ${props => props.theme.breadcrumbs.breadcrumbTextSizeRegular} !important;
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    .ant-breadcrumb-link,
    .ant-breadcrumb-separator {
      font-size: ${props => props.theme.breadcrumbs.breadcrumbTextSizeSmall} !important;
    }
  }

  .anticon-left {
    margin-right: 5px;
    font-size: ${props => props.theme.breadcrumbs.breadcrumbTextSize};
  }
`;
