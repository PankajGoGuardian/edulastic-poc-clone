import React from 'react'
import { useDrag } from 'react-dnd'
import { IconEye, IconWriting } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import {
  ResourceItemWrapper,
  IconWrapper,
  ResourceTitle,
  TitleText,
} from './styled'
import Tags from '../../../src/components/common/Tags'
import WebsiteIcon from './static/WebsiteIcon'
import VideoIcon from './static/VideoIcon'
import LTIResourceIcon from './static/LTIResourceIcon'
import { Tooltip } from '../../../../common/utils/helpers'
import { getInterestedStandards } from '../../../dataUtils'

export const ICONS_BY_TYPE = {
  test: <IconWriting />,
  video_resource: <VideoIcon />, // Update once standard svg is available
  lti_resource: <LTIResourceIcon />,
  website_resource: <WebsiteIcon />,
}

export const ResouceIcon = ({ type, isAdded, ...rest }) => (
  <IconWrapper isAdded={isAdded} {...rest}>
    {ICONS_BY_TYPE[type]}
  </IconWrapper>
)

const getStandardIdentifiers = (summary, alignment, interestedCurriculums) => {
  // Get intrested standards by orgType
  let intrestedStandards =
    getInterestedStandards(summary, alignment, interestedCurriculums) || []
  if (!intrestedStandards.length) {
    // fallback to test standards if no equivalent standards found
    intrestedStandards = summary?.standards || []
  }
  return intrestedStandards.map((x) => x.identifier)
}

const ResourceItem = ({
  contentTitle,
  contentDescription = '',
  contentUrl = '',
  type,
  id,
  summary,
  alignment,
  data = undefined,
  isAdded,
  previewTest,
  status,
  testType,
  interestedCurriculums,
}) => {
  const standardIdentifiers = getStandardIdentifiers(
    summary,
    alignment,
    interestedCurriculums
  )

  const [, drag] = useDrag({
    item: {
      type: 'item',
      contentType: type,
      id,
      fromPlaylistTestsBox: true,
      contentTitle,
      contentDescription,
      contentUrl,
      standardIdentifiers,
      data,
      status,
      testType,
    },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  })

  return (
    <Tooltip title={contentTitle} placement="left">
      <ResourceItemWrapper data-cy={`${id}`} ref={drag}>
        <ResouceIcon type={type} isAdded={isAdded} />
        <ResourceTitle isAdded={isAdded}>
          <TitleText
            noStandards={standardIdentifiers.length === 0}
            title={contentTitle}
          >
            {contentTitle}
          </TitleText>
          <Tags
            margin="0px"
            tags={standardIdentifiers}
            show={1}
            showTitle
            flexWrap="nowrap"
          />
        </ResourceTitle>
        <IconEye
          className="preview-btn"
          color={themeColor}
          width={18}
          height={16}
          onClick={previewTest}
        />
      </ResourceItemWrapper>
    </Tooltip>
  )
}

export default ResourceItem
