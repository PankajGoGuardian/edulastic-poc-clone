import { EduButton, MainContentWrapper, MainHeader } from '@edulastic/common'
import { IconNewFile, IconTestBank } from '@edulastic/icons'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'redux'
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

    const { t } = this.props

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
  t: PropTypes.func.isRequired,
}

const enhance = compose(withRouter, withNamespaces('header'))
export default enhance(Container)
