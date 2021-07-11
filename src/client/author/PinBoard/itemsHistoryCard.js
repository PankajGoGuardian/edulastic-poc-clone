import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Dropdown, Menu, Icon, Tag } from 'antd'
import {
  IconHistoryPin,
  IconBoard,
  IconPlaylist2,
  IconTestBank,
} from '@edulastic/icons'
import { connect } from 'react-redux'
import { getCurrentItemsSelector, slice } from './ducks'
import moment from 'moment'
import { withRouter } from 'react-router-dom'

const typesMapping = {
  link: { icon: <Icon type="link" /> },
  test: { icon: <IconTestBank /> },
  playlist: { icon: <IconPlaylist2 /> },
  testItem: { icon: <Icon type="file-text" />, text: 'test item' },
}

function ItemRow(x) {
  return (
    <Menu.Item
      onItemHover={() => {}}
      onClick={() => {
        x.history.push(x.url)
      }}
    >
      <StyledMenuItemText>
        <div>{typesMapping[x.contentType]?.icon}</div>
        <div>
          <span>
            {typesMapping[x.contentType]?.text || x.contentType?.toUpperCase()}
          </span>
          <StyledParagraph>
            {x.contentType === 'link' ? x?.url?.replace('/', '') : x.title}
          </StyledParagraph>
          <SubInfoText>
            {' '}
            <p>{moment(new Date(x.pinnedTime)).fromNow()}</p>
            {x.status && (
              <p>
                {' '}
                <Tag>{x.status}</Tag>
              </p>
            )}
            {x.showRowPin? (
              <p style={{ alignSelf: 'flex-end' }}>
                {' '}
                <IconHistoryPin
                  style={{ fontSize: '15px', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    x.onPinClick()
                  }}
                />
              </p>
            ):(
              <p style={{ alignSelf: 'flex-end' }}>
                {' '}
                <Icon
                  style={{ fontSize: '15px', cursor: 'pointer' }}
                  type="close-circle"
                  onClick={(e) => {
                    e.stopPropagation()
                    x.onDelete()
                  }}
                />
              </p>
            )}
          </SubInfoText>
        </div>
      </StyledMenuItemText>
    </Menu.Item>
  )
}

const ItemsHistoryCard = ({
  addAutoPin,
  addPin,
  loadPins,
  pinnedItems,
  autoPinnedItems,
  data,
  autoPinItem,
  pinsKeyed,
  removePin,
  history,
  subscription = {},
  user,
  showPinIcon,
  style,
}) => {
  useEffect(() => {
    loadPins()
  }, [])
  const currentUrl = window.location.href.replace(window.location.origin, '')
  useEffect(() => {
    if (autoPinItem && data?.title && data?.contentId) {
      addAutoPin({ ...data, pinnedTime: +new Date(), url: currentUrl })
    }
  }, [autoPinItem, data?.title, data?.contentId])

  const isPremiumUser = user?.features?.premium && subscription?._id

  if (!data) {
    data = {
      contentType: 'link',
      contentId: currentUrl,
      url: currentUrl,
      pinnedTime: +new Date(),
    }
  }
  const alreadyPresent = data?.contentId && data?.contentId in pinsKeyed
  const text = (
    <StyledMenu isPremiumUser={isPremiumUser}>
      <HeaderText>Recent Items</HeaderText>
      {autoPinnedItems.map((x) => (
        <ItemRow
          onPinClick={() => {
            addPin(x)
          }}
          showRowPin
          key={x.contentId}
          history={history}
          {...x}
        />
      ))}
      <HeaderText>Pinned</HeaderText>
      {pinnedItems.map((x) => (
        <ItemRow key={x.contentId} history={history} onDelete={()=>{
          removePin(x.contentId);
        }} {...x} />
      ))}
    </StyledMenu>
  )

  const boardText = (
    <StyledMenu isPremiumUser={isPremiumUser}>
      <Menu.Item>
        <HeaderText onClick={() => history.push('/author/subscription')}>
          Please upgrade to premium user{' '}
        </HeaderText>
      </Menu.Item>
    </StyledMenu>
  )
  return (
    <StyledDiv style={style}>
      <StyledDropdown
        overlayStyle={{ zIndex: 2000 }}
        overlay={isPremiumUser ? text : boardText}
        placement="bottomCenter"
        trigger={['click']}
        onVisibleChange={(visible) => {
          if (visible) {
          }
        }}
      >
        <IconBoard
          style={{
            fontSize: '20px',
            paddingRight: '5px',
            paddingTop: '3px',
            fill: '#2f4151',
          }}
        />
      </StyledDropdown>
      {isPremiumUser && showPinIcon ? (
        <IconHistoryPin
          theme={alreadyPresent ? 'filled' : ''}
          onClick={() => {
            if (alreadyPresent) {
              console.log('removin pins')
              removePin(data?.contentId)
            } else {
              addPin({
                ...data,
                url: window.location.href.replace(window.location.origin, ''),
                pinnedTime: +new Date(),
              })
            }
          }}
          style={{
            fontSize: '24px',
            cursor: 'pointer',
          }}
        />
      ) : null}

      {/* <Icon style={{fontSize:'24px'}} type="folder-open" /> */}
    </StyledDiv>
  )
}

const StyledDiv = styled.div`
  display: flex;
  align-self: center;
`
const StyledSpan = styled.span`
  display: inline-block;
  font-size: 13px;
`

const StyledDropdown = styled(Dropdown)``

const StyledMenu = styled(Menu)`
  width: ${(props) => (props.isPremiumUser ? '400px' : '330px')};
  max-height: 450px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px #a0a0a0;
  padding-bottom: 10px;
  overflow-x: hidden;
  position: relative;
  top: 20px;
  padding-top: ${(props) => (props.isPremiumUser ? ' ' : '10px')};
  &::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #fff;
  }

  ::-webkit-scrollbar-thumb {
    background: #f1f1f1;
    border-radius: 5px;
  }
  & > li {
    margin: auto;
    width: ${(props) => (props.isPremiumUser ? '95%' : '100%')};
    border-radius: 5px;
    margin-top: 5px;
    &:hover {
      background-color: #fff;
    }
  }

  .anticon.anticon-pushpin {
    transition: all 0.3s;
    transform-origin: center center;
    &:active {
      transform: scale(3);
    }
  }
`

const HeaderText = styled.h3`
  font-weight: bold;
  color: #1ab394;
  padding-left: 25px;
`

const StyledMenuItemText = styled.div`
  transition: all 0.6s;
  cursor: pointer;
  display: flex;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  & > div:nth-child(2) {
    margin-left: 5px;
    span {
      font-weight: 550;
      color: #2f4151;
    }
    p {
      line-height: 1.5;
      font-size: 12px;
      text-transform: lowercase;
    }
  }
`
const StyledParagraph = styled.p`
  white-space: nowrap;
  width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
`
const SubInfoText = styled.div`
  display: flex;
  justify-content: space-between;
`

export default connect(
  (state) => ({
    pinnedItems: getCurrentItemsSelector(state),
    pinsKeyed: state?.pinned?.pinsKeyed,
    autoPinnedItems: state.pinned?.autoPins,
    user: state.user.user,
    subscription: state?.subscription?.subscriptionData?.subscription,
  }),
  {
    addPin: slice.actions.addPin,
    addAutoPin: slice.actions.addAutoPins,
    loadPins: slice.actions.loadItems,
    removePin: slice.actions.removePin,
  }
)(withRouter(ItemsHistoryCard))
