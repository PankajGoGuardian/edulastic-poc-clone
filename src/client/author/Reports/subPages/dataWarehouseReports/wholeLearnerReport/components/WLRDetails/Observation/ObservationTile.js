import { EduElse, EduIf, EduThen, FlexContainer } from '@edulastic/common'
import React from 'react'
import { formatName } from '@edulastic/constants/reportUtils/common'
import { ROLE_LABEL } from '@edulastic/constants/const/roleType'
import moment from 'moment'
import { themeColor } from '@edulastic/colors'
import {
  IconCalendarLight,
  IconEmptyProfile,
  IconEye,
  IconInfo,
  IconPencilEdit,
  IconTrash,
} from '@edulastic/icons'
import { Tooltip } from 'antd'
import {
  ActionButton,
  InfoContainer,
  ObservationTypeContainer,
  Separator,
  StyledFeedbackText,
  StyledImg,
  StyledName,
  TeacherInfoContainer,
  TileContainer,
  TileLowerContainer,
  TileUpperContainer,
} from './styled'
import {
  SHARE_TYPES_DISPLAY_TEXT,
  SHARE_TYPES_VALUES,
  SHARE_TYPES_VALUE_TO_KEY_MAP,
} from '../../../../../../../Student/components/StudentTable/FeedbackModal/constants'
import { appendIfMultiple } from '../../../../../../../../common/utils/helpers'

function ObservationTile(props) {
  const {
    observation,
    currentUserId,
    handleEdit,
    handleDelete,
    isModal,
  } = props
  const {
    givenBy: { role, thumbnail, _id: givenByUserId },
    feedback,
    type: feedbackType,
    sharedWith: { type, users },
    class: { name: className = '' } = {},
    updatedAt,
  } = observation

  const authorName =
    formatName(observation.givenBy, {
      lastNameFirst: false,
    }) || 'Anonymous'

  const date = moment(parseInt(updatedAt, 10)).format("[Added on] Do MMM'YY")
  return (
    <TileContainer $isModal={isModal}>
      <TileUpperContainer>
        <FlexContainer flexDirection="column" width="100%;">
          <FlexContainer justifyContent="space-between">
            <FlexContainer
              justifyContent="flex-start"
              alignItems="center"
              marginBottom="20px"
              style={{ gap: '20px', width: '100%' }}
              maxWidth="65%"
            >
              <EduIf condition={thumbnail}>
                <EduThen>
                  <StyledImg src={thumbnail} />
                </EduThen>
                <EduElse>
                  <IconEmptyProfile height="50" width="50" />
                </EduElse>
              </EduIf>
              <div style={{ width: '90%' }}>
                <Tooltip title={authorName}>
                  <StyledName>{authorName}</StyledName>
                </Tooltip>
                <Tooltip title={className} placement="bottom">
                  <TeacherInfoContainer>
                    {ROLE_LABEL[role]} <Separator /> {className}
                  </TeacherInfoContainer>
                </Tooltip>
              </div>
            </FlexContainer>
            <div>
              <ObservationTypeContainer>
                {feedbackType}
              </ObservationTypeContainer>
            </div>
          </FlexContainer>
          <StyledFeedbackText
            dangerouslySetInnerHTML={{
              __html: feedback,
            }}
          />
        </FlexContainer>
      </TileUpperContainer>
      <TileLowerContainer>
        <FlexContainer justifyContent="space-between" style={{ gap: '15px' }}>
          <InfoContainer>
            <IconCalendarLight color="#555" />
            {date}
          </InfoContainer>
          <InfoContainer>
            <IconEye color="#555" />
            {SHARE_TYPES_DISPLAY_TEXT[SHARE_TYPES_VALUE_TO_KEY_MAP[type]]}
            <EduIf condition={SHARE_TYPES_VALUES.INDIVIDUAL === type}>
              <Tooltip title={appendIfMultiple(users.map((o) => o.email))}>
                <IconInfo
                  height="11px"
                  style={{ marginLeft: '-3px', cursor: 'pointer' }}
                />
              </Tooltip>
            </EduIf>
          </InfoContainer>
        </FlexContainer>
        <EduIf condition={givenByUserId === currentUserId}>
          <FlexContainer justifyContent="space-between" style={{ gap: '15px' }}>
            <ActionButton onClick={() => handleEdit(observation)}>
              <IconPencilEdit height="12px" color={themeColor} />
              Edit
            </ActionButton>
            <ActionButton onClick={() => handleDelete(observation)}>
              <IconTrash height="12px" color={themeColor} />
              Delete
            </ActionButton>
          </FlexContainer>
        </EduIf>
      </TileLowerContainer>
    </TileContainer>
  )
}

export default ObservationTile
