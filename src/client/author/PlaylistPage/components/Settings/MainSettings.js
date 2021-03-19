import { themeColor } from '@edulastic/colors'
import { EduSwitchStyled } from '@edulastic/common'
import { playlists } from '@edulastic/constants'
import { Anchor, Col, Row, Radio } from 'antd'
import React from 'react'
import styled from 'styled-components'
import {
  Block,
  Body,
  Container,
  Description,
  StyledAnchor,
  Title,
} from '../../../TestPage/components/Setting/components/Container/styled'

const { settingCategories } = playlists

const radioStyle = {
  display: 'block',
  fontWeight: 600,
  marginBottom: 20,
  fontSize: '10px',
}

const Settings = ({
  history,
  windowWidth,
  customize,
  handleUserCustomize,
  playlistMode,
  setPlaylistMode,
}) => {
  const isSmallSize = windowWidth < 993 ? 1 : 0
  return (
    <Container>
      <Row style={{ padding: 0 }}>
        <Col span={isSmallSize ? 0 : 6}>
          <CustomStyledAnchor affix={false} offsetTop={125}>
            {settingCategories.map((category, index) => (
              <Anchor.Link
                key={category.id}
                href={`${history.location.pathname}#${category.id}`}
                title={category.title.toLowerCase()}
                className={index === 0 && 'active-link'}
              />
            ))}
          </CustomStyledAnchor>
        </Col>
        <Col span={isSmallSize ? 24 : 18}>
          <StyledBlock id="user-customization" smallSize={isSmallSize}>
            <Title>
              <span>User Customization</span>
              <EduSwitchStyled
                data-cy="customization"
                defaultChecked={customize}
                onChange={handleUserCustomize}
              />
            </Title>
            <Body smallSize={isSmallSize}>
              <Description>
                If set to ON, other members of the Edulastic community who want
                to use this playlist can customize it as per their requirements
                i.e., add/remove test or resources in the Playlist. Note that
                this will not affect the original playlist in any way.
              </Description>
            </Body>
          </StyledBlock>
        </Col>
        <Col span={isSmallSize ? 24 : 18}>
          <StyledBlock id="set-playlist-mode" smallSize={isSmallSize}>
            <Title>
              <span>Playlist Mode</span>
            </Title>
            <Body smallSize={isSmallSize}>
              <Radio.Group
                value={playlistMode}
                onChange={(e) => {
                  setPlaylistMode(e.target.value)
                }}
              >
                <Radio style={radioStyle} value="teacher">
                  TEACHER EDITION
                </Radio>
                <Radio style={radioStyle} value="student">
                  STUDENT EDITION
                </Radio>
              </Radio.Group>
            </Body>
          </StyledBlock>
        </Col>
      </Row>
    </Container>
  )
}

export default Settings

const CustomStyledAnchor = styled(StyledAnchor)`
  margin-left: 0px;
  padding-left: 25px;
  .ant-anchor-link {
    margin: 20px 12px;
  }
  .active-link {
    &.ant-anchor-link {
      &:after {
        opacity: 1;
      }
      a {
        color: ${themeColor};
      }
    }
  }
`
const StyledBlock = styled(Block)`
  margin: 0px;
`
