import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Icon } from 'antd'
import { themeColorLight } from '@edulastic/colors'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import { ReportItemCards } from './ReportItemCard'

const nonPremiumReports = ['standardsGradebook']
export const LinkItem = ({ data, inverse, tiles, premium, history }) => {
  const showPremiumLabel = !premium && !nonPremiumReports.includes(data.key)
  const showGreenBorder = !premium && nonPremiumReports.includes(data.key)
  const ResolvedLink = showPremiumLabel ? Fragment : Link

  if (tiles) {
    return (
      <>
        {data.key === 'standardsGradebook' ? (
          <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <ReportItemCards handleClick={handleClick} data={data} />
            )}
            onClick={() => history.push(data.location)}
          />
        ) : (
          <ResolvedLink data-cy={data.key} to={data.location}>
            <ReportItemCards
              data={data}
              showPremiumLabel={showPremiumLabel}
              showGreenBorder={showGreenBorder}
            />
          </ResolvedLink>
        )}
      </>
    )
  }
  return (
    <Item>
      <ResolvedLink data-cy={data.key} to={!inverse && data.location}>
        {data.title}
        {!inverse && <StyledIcon type="right" />}
      </ResolvedLink>
    </Item>
  )
}

export const LinksWrapper = styled.ul`
  padding: 0px;
  margin: 0px;
  list-style: none;
`

export const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Item = styled.li`
  color: ${themeColorLight};
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 10px;
  margin-bottom: 10px;
  a {
    padding: 12px 20px;
    width: 100%;
    display: inline-block;
    color: #58606f;
    font-weight: 600;
    &:hover {
      background-color: #f8f8f8;
      border-radius: 10px;
    }
  }
`

const StyledIcon = styled(Icon)`
  font-weight: bold;
  float: right;
  color: #8e959e;
  margin-top: 3px;
`
