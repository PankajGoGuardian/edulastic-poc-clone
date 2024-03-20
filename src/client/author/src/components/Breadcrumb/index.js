import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Breadcrumb } from 'antd'
import styled, { css } from 'styled-components'

import { linkColor, themeColorBlue } from '@edulastic/colors'

const BreadCrumb = (props) => {
  const { data, style, ellipsis, hasStickyHeader } = props

  return (
    <Container
      ellipsis={ellipsis}
      style={style}
      hasStickyHeader={hasStickyHeader}
    >
      <Breadcrumb>
        {Array.isArray(data) &&
          data.map((breadCrumb = {}, index) => (
            <Breadcrumb.Item key={`bread${index}`}>
              {index !== data.length - 1 &&
              breadCrumb.state &&
              breadCrumb.to ? (
                <Link
                  to={{
                    pathname: breadCrumb.to,
                    state: breadCrumb.state,
                    ...(breadCrumb.search ? { search: breadCrumb.search } : {}),
                  }}
                  onClick={breadCrumb.onClick}
                >
                  {/* pass search here after processing the string or process string here by calling a helper function in utils, currently no such requirement */}
                  <span>{breadCrumb.title?.toLowerCase()}</span>
                </Link>
              ) : index !== data.length - 1 &&
                !breadCrumb.state &&
                breadCrumb.to ? (
                <Link to={breadCrumb.to} onClick={breadCrumb.onClick}>
                  <span>{breadCrumb.title?.toLowerCase()}</span>
                </Link>
              ) : (
                <span>{breadCrumb.title?.toLowerCase()}</span>
              )}
            </Breadcrumb.Item>
          ))}
      </Breadcrumb>
    </Container>
  )
}

BreadCrumb.propTypes = {
  data: PropTypes.array.isRequired,
  style: PropTypes.object,
}

BreadCrumb.defaultProps = {
  style: {},
}

export default BreadCrumb

const EllipsisStyle = css`
  max-width: ${(props) => props.ellipsis || ''};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
`

const Container = styled.div`
  position: fixed;
  top: 80px;
  display: ${(props) => (props.hasStickyHeader ? 'none' : 'intial')};
  .ant-breadcrumb {
    > span:first-child {
      &:before {
        position: relative;
        display: inline-block;
        margin-right: 5px;
        content: '<';
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
    ${(props) => props.ellipsis && EllipsisStyle}
    a {
      font-size: 11px;
      text-transform: uppercase;
      color: ${linkColor};
      font-weight: 600;
      &:hover {
        color: ${themeColorBlue};
      }
    }
  }

  .anticon-left {
    margin-right: 5px;
  }

  .ant-breadcrumb-link {
    cursor: pointer;
    &:hover {
      color: ${themeColorBlue};
    }
  }
`
