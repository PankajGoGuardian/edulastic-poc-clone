/* eslint-disable no-useless-escape */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FlexContainer } from '@edulastic/common'
import styled from 'styled-components'
import { title, lightGrey4, themeColor } from '@edulastic/colors'
import EdulasticResourceModal from '../../../../../../../CurriculumSequence/components/ManageContentBlock/components/common/EdulasticResourceModal'
import { isPearDomain } from '../../../../../../../../../utils/pear'
import { pearAssessmentText } from '../../../../../../../../common/utils/helpers'

const getEmbedCodeWithParams = (url) => {
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
  const match = url.match(regExp)
  const embedCode = match[1]

  const params = new URLSearchParams(url)
  const utm_source = params.get('utm_source') || 'Application'
  const utm_medium = params.get('utm_medium') || 'Clicks'
  const utm_campaign =
    params.get('utm_campaign') || 'Dashboard_Quick_Start_Overview'
  return `${embedCode}?utm_source=${utm_source}&utm_medium=${utm_medium}&utm_campaign=${utm_campaign}`
}

const EmbeddedSplitPaneModal = (props) => {
  const { isVisible: data, windowWidth } = props
  const { sections = [] } = data || {}

  const menuItems = sections.map((x) => x.title)

  const [activeItem, setActiveItem] = useState({ ...sections[0], index: 0 })

  return (
    <EdulasticResourceModal headerText={data?.title} {...props} hideFooter>
      <FlexContainer padding="10px 0px">
        <LeftPane>
          {menuItems.map((label, i) => (
            <LeftPaneItem
              data-cy={label}
              key={i}
              onClick={() => setActiveItem({ ...sections[i], index: i })}
              active={i === activeItem.index}
            >
              {label === 'Track Student Performance Data'
                ? 'Track Student Performance'
                : label}
            </LeftPaneItem>
          ))}
        </LeftPane>
        <RightPane>
          {activeItem.renderType === 'video' ? (
            // Only youtube links supported for now as per requirement
            <iframe
              data-cy="videoLink"
              title="Edulastic Overview"
              width={windowWidth <= 1024 ? '625' : '750'}
              height={windowWidth <= 1024 ? '352' : '422'}
              src={`https://www.youtube.com/embed/${getEmbedCodeWithParams(
                activeItem.url
              )}`}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              style={{ margin: 'auto' }}
              allowFullScreen
            />
          ) : (
            <ListItems>
              {activeItem.links.map((content, i) => (
                <a
                  data-cy={content.title}
                  key={i}
                  href={content.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {isPearDomain &&
                  activeItem.title.toLowerCase() === 'extra resources'
                    ? content.title.replace(/Edulastic/g, pearAssessmentText)
                    : content.title}
                </a>
              ))}
            </ListItems>
          )}
        </RightPane>
      </FlexContainer>
    </EdulasticResourceModal>
  )
}

EmbeddedSplitPaneModal.propTypes = {
  closeCallback: PropTypes.func.isRequired,
  modalWidth: PropTypes.string.isRequired,
  titleFontSize: PropTypes.string.isRequired,
  padding: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
}

export default EmbeddedSplitPaneModal

const LeftPaneItem = styled.div`
  border-left: ${(props) =>
    props.active ? `4px solid ${themeColor}` : 'none'};
  color: ${(props) => (props.active ? themeColor : title)};
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding-left: ${(props) => (props.active ? '16px' : '20px')};
  font-size: 15px;
  font-weight: 600;
  margin-top: 12px;
  cursor: pointer;
`

const LeftPane = styled.div`
  width: 330px;
  border-right: 1px solid ${lightGrey4};
`

const RightPane = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0px 25px 20px 25px;
`

const ListItems = styled.div`
  width: 100%;
  min-height: 293px;
  text-align: left;
  padding-left: 70px;

  a {
    display: block;
    width: 100%;
    color: ${themeColor};
    font-size: 16px;
    font-weight: 600;
    margin-top: 15px;
  }
`
