import { EduButton, MainContentWrapper, MainHeader } from '@edulastic/common'
import { IconNewFile, IconPlaylist, IconTestBank } from '@edulastic/icons'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'redux'
import FeaturesSwitch from '../../../features/components/FeaturesSwitch'
import { getLastPlayListSelector } from '../../Playlist/ducks'
import BreadCrumb from '../../src/components/Breadcrumb'
import { SecondHeader } from '../../TestPage/components/Summary/components/Container/styled'
import BodyWrapper from '../common/BodyWrapper'
import CardComponent from '../common/CardComponent'
import CountWrapper from '../common/CountWrapper'
import FlexWrapper from '../common/FlexWrapper'
import IconWrapper from '../common/IconWrapper'
import TextWrapper from '../common/TextWrapper'
import TextWrapperBold from '../common/TextWrapperBold'
import { AlignMiddle } from '../common/Title'
import TitleWrapper from '../common/TitleWrapper'

class Container extends Component {
  render() {
    const breadcrumbData = [
      {
        title: 'RECENT ASSIGNMENTS',
        to: '/author/assignments',
      },
      {
        title: 'NEW ASSIGNMENT',
        to: '',
      },
    ]

    const { lastPlayList = {}, t } = this.props
    let toLinkForPlaylist = '/author/playlists'
    let from = 'playlistLibrary'
    if (lastPlayList && lastPlayList.value && lastPlayList.value._id) {
      toLinkForPlaylist = `/author/playlists/playlist/${lastPlayList.value._id}/use-this`
      from = 'myPlaylist'
    }

    return (
      <div>
        <MainHeader headingText={t('common.newAssignment')}>
          <AlignMiddle>SELECT A TEST</AlignMiddle>
        </MainHeader>
        <MainContentWrapper>
          <SecondHeader>
            <BreadCrumb data={breadcrumbData} style={{ position: 'unset' }} />
          </SecondHeader>
          <BodyWrapper height="calc(100% - 30px)">
            <FlexWrapper>
              <FeaturesSwitch
                inputFeatures="playlist"
                actionOnInaccessible="hidden"
                key="playlist"
              >
                <CardComponent>
                  <IconWrapper marginBottom="0px">
                    <IconPlaylist height="20" width="20" />
                  </IconWrapper>
                  <TitleWrapper>Choose From Playlist</TitleWrapper>
                  <TextWrapper>
                    Select pre built tests from the Curriculum <br /> aligned
                    assessment playlist
                  </TextWrapper>
                  <CountWrapper>191</CountWrapper>
                  <TextWrapperBold>
                    Pre-built Assessment in Playlist
                  </TextWrapperBold>
                  <Link to={{ pathname: toLinkForPlaylist, state: { from } }}>
                    <EduButton isGhost width="180px">
                      PLAYLIST
                    </EduButton>
                  </Link>
                </CardComponent>
              </FeaturesSwitch>
              <CardComponent>
                <IconWrapper marginBottom="0px">
                  <IconTestBank height="20" width="20" />
                </IconWrapper>
                <TitleWrapper>Choose From Library</TitleWrapper>
                <TextWrapper>
                  Select pre built assessment from the <br /> Edulastic Library
                </TextWrapper>
                <CountWrapper>191211</CountWrapper>
                <TextWrapperBold>
                  Pre-built assessment in Library
                </TextWrapperBold>
                <Link to="/author/tests">
                  <EduButton data-cy="browseAll" isGhost width="180px">
                    BROWSE ALL
                  </EduButton>
                </Link>
              </CardComponent>
              <CardComponent>
                <IconWrapper marginBottom="0px">
                  <IconNewFile height="22" width="18" />
                </IconWrapper>
                <TitleWrapper>Author a Test</TitleWrapper>
                <TextWrapper>
                  Create test using questions from the <br /> library or author
                  your own.
                </TextWrapper>
                <Link to="/author/tests/select">
                  <EduButton data-cy="createNew" isGhost width="180px">
                    Create Test
                  </EduButton>
                </Link>
              </CardComponent>
            </FlexWrapper>
          </BodyWrapper>
        </MainContentWrapper>
      </div>
    )
  }
}

Container.propTypes = {
  lastPlayList: PropTypes.object.isRequired,
}

const enhance = compose(
  withRouter,
  withNamespaces('header'),
  connect((state) => ({
    lastPlayList: getLastPlayListSelector(state),
  }))
)
export default enhance(Container)
