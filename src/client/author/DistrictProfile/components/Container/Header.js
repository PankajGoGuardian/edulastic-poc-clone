import { MainHeader } from '@edulastic/common'
import React, { memo } from 'react'
import { IconProfileHighlight } from '@edulastic/icons'
import { withNamespaces } from 'react-i18next'
import ItemsHistoryCard from '../../../PinBoard/itemsHistoryCard'

const ProfileHeader = ({ t }) => (
  <MainHeader
    Icon={IconProfileHighlight}
    headingText={t('common.profileTitle')}
  >
    <ItemsHistoryCard showPinIcon />
  </MainHeader>
)

export default memo(withNamespaces('header')(ProfileHeader))
