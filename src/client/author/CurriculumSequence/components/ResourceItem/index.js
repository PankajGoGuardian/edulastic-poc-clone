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
  PopupContainer,
  StyledPopOver,
  TitleWrapper,
} from './styled'
import Tags, { Label } from '../../../src/components/common/Tags'
import WebsiteIcon from './static/WebsiteIcon'
import VideoIcon from './static/VideoIcon'
import LTIResourceIcon from './static/LTIResourceIcon'
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
  isReviewModal,
  history,
  closeReviewModal,
  closeModal,
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

  const handleClick = (id) => {
    history.push(`/author/tests/tab/review/id/${id}`)
    closeReviewModal()
    closeModal()
  }

  const moreMenu = (
    <MenuStyled data-cy="assessmentItemMoreMenu">
      <Menu.Item
        data-cy="editResource"
        onClick={() => {
          editResource(type, resource)
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        data-cy="deleteResource"
        onClick={() => {
          deleteResource(id)
        }}
      >
        Delete
      </Menu.Item>
    </MenuStyled>
  )

  const popup = (
    <PopupContainer>
      <ResourceTitle>
        <TitleText data-cy="titleInPopup" isPopup>
          {contentTitle}
        </TitleText>
      </ResourceTitle>
      <div>
        {standardIdentifiers.map((tag, i) => (
          <Label data-cy={tag} type="primary" key={i}>
            {tag}
          </Label>
        ))}
      </div>
    </PopupContainer>
  )

  return (
    <ResourceItemWrapper data-cy={`${id}`} ref={drag}>
      <TitleWrapper>
        <StyledPopOver
          placement="bottomLeft"
          content={popup}
          onClick={(e) => e.stopPropagation()}
        >
          <ResouceIcon type={type} isAdded={isAdded} />
          <ResourceTitle isAdded={isAdded}>
            {isReviewModal ? (
              <TitleText
                data-cy="resourceItemTitle"
                noStandards={standardIdentifiers.length === 0}
                onClick={() => handleClick(id)}
              >
                {contentTitle}
              </TitleText>
            ) : (
              <TitleText
                data-cy="resourceItemTitle"
                noStandards={standardIdentifiers.length === 0}
              >
                {contentTitle}
              </TitleText>
            )}
          </ResourceTitle>
          <Tags
            margin="0px"
            tags={
              standardIdentifiers.length
                ? [`${standardIdentifiers.length} +`]
                : []
            }
            show={1}
            flexWrap="nowrap"
          />
        </StyledPopOver>
      </TitleWrapper>
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
          <IconActionButton data-cy="moreActions">
            <IconMoreVertical
              className="more-action-btn"
              color={themeColor}
              viewBox="0 0 3.8 14"
            />
          </IconActionButton>
        </Dropdown>
      )}
    </ResourceItemWrapper>
  )
}

export default ResourceItem
