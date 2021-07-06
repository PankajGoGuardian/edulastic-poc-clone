import React from 'react'
import { useDrag } from 'react-dnd'
import { IconEye, IconMoreVertical, IconWriting } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { uniqBy } from 'lodash'
import { Dropdown, Menu } from 'antd'
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
import { IconActionButton, MenuStyled } from '../styled'

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

const getStandardIdentifiersForTest = (
  summary,
  alignment,
  interestedCurriculums
) => {
  // Get intrested standards by orgType
  let intrestedStandards =
    getInterestedStandards(summary, alignment, interestedCurriculums) || []
  if (!intrestedStandards.length) {
    // fallback to test standards if no equivalent standards found
    intrestedStandards = summary?.standards || []
  }
  return intrestedStandards.map((x) => x.identifier)
}

const getStandardIdentifiersForResource = (
  standards,
  alignment,
  interestedCurriculums
) => {
  if (!standards?.length) return []

  const allStandards = []
  alignment?.forEach((x) =>
    x?.domains?.forEach((y) =>
      y?.standards?.forEach(
        (z) =>
          standards.includes(z?.id) &&
          allStandards.push({ ...z, curriculumId: y.curriculumId })
      )
    )
  )

  const authorStandards = allStandards.filter(
    (item) => !item.isEquivalentStandard && item.curriculumId
  )
  const curriculumIds = interestedCurriculums.map(({ _id }) => _id)

  let interestedStandards = authorStandards.filter((standard) =>
    curriculumIds.includes(standard.curriculumId)
  )

  // If authored standards don't match, pick from multi standard mapping
  if (!interestedStandards?.length && alignment?.length) {
    const equivalentStandards = uniqBy(
      alignment
        .filter(({ isEquivalentStandard }) => !!isEquivalentStandard)
        .flatMap(({ domains }) =>
          domains.flatMap(({ curriculumId, standards: _standards }) =>
            _standards.map(({ name: identifier, key: id }) => ({
              identifier,
              id,
              curriculumId,
            }))
          )
        ),
      'identifier'
    )
    const standardData = Object.values(
      authorStandards.reduce((acc, item) => {
        const standard = acc[item.curriculumId]
        if (!standard) {
          acc[item.curriculumId] = { ...item }
        }
        return acc
      }, {})
    )

    standardData.forEach((standard) => {
      const equivStandards = equivalentStandards.filter((eqSt) =>
        curriculumIds.includes(eqSt.curriculumId)
      )
      if (equivStandards.length) {
        for (const eqSt of equivStandards) {
          interestedStandards.push({
            ...standard,
            identifier: eqSt.identifier,
          })
        }
      }
    })
  }

  // if equivalent standards are not available
  if (!(interestedStandards?.length || alignment?.length)) {
    interestedStandards = authorStandards
  }

  if (interestedStandards?.length) {
    return uniqBy(interestedStandards.map((x) => x?.name)).filter((z) => z)
  }

  // fallback to original if none of equi standards match
  return (
    uniqBy(
      alignment?.flatMap((x) =>
        x?.domains?.flatMap((y) =>
          y?.standards
            ?.map((z) => standards.includes(z?.id) && z?.name)
            .filter((z) => z)
        )
      )
    ) || []
  )
}

const ResourceItem = ({
  contentTitle,
  contentDescription = '',
  contentUrl = '',
  hasStandardsOnCreation,
  standards = [],
  type,
  id,
  contentVersionId,
  summary = {},
  alignment,
  data = undefined,
  isAdded,
  previewTest,
  status,
  testType,
  interestedCurriculums,
  resource,
  editResource,
  deleteResource,
  userId,
}) => {
  let standardIdentifiers = []
  if (type === 'test') {
    standardIdentifiers = getStandardIdentifiersForTest(
      summary,
      alignment,
      interestedCurriculums
    )
  } else {
    standardIdentifiers = getStandardIdentifiersForResource(
      standards,
      alignment,
      interestedCurriculums
    )
  }

  const [, drag] = useDrag({
    item: {
      type: 'item',
      contentType: type,
      id,
      contentVersionId,
      fromPlaylistTestsBox: true,
      contentTitle,
      contentDescription,
      contentUrl,
      standardIdentifiers,
      hasStandardsOnCreation,
      standards,
      data,
      status,
      testType,
    },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  })

  const moreMenu = (
    <MenuStyled data-cy="assessmentItemMoreMenu">
      <Menu.Item
        onClick={() => {
          editResource(type, resource)
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          deleteResource(id)
        }}
      >
        Delete
      </Menu.Item>
    </MenuStyled>
  )

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
          data-cy={type === 'test' ? 'testPreview' : 'resourcePreview'}
        />
        {type !== 'test' && resource?.userId === userId && (
          <Dropdown overlay={moreMenu} trigger={['click']} arrow>
            <IconActionButton>
              <IconMoreVertical
                className="more-action-btn"
                color={themeColor}
              />
            </IconActionButton>
          </Dropdown>
        )}
      </ResourceItemWrapper>
    </Tooltip>
  )
}

export default ResourceItem
