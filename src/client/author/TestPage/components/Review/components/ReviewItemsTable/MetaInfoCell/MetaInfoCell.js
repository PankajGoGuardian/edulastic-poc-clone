import React from 'react'
import PropTypes from 'prop-types'

import { FlexContainer, PremiumTag } from '@edulastic/common'
import {
  IconUser,
  IconHash,
  IconVolumeUp,
  IconNoVolume,
} from '@edulastic/icons'

import CollectionTag from '@edulastic/common/src/components/CollectionTag/CollectionTag'
import Tags from '../../../../../../src/components/common/Tags'
import Standards from '../../../../../../ItemList/components/Item/Standards'
import { renderAnalytics } from '../../../../Summary/components/Sidebar/Sidebar'
import { MetaTag, DokStyled } from './styled'

const MetaInfoCell = ({
  data: { item, type, by, id, audio = {}, isPremium = false, dok, tags },
}) => (
  <FlexContainer
    justifyContent="space-between"
    style={{ width: '100%', paddingTop: '15px' }}
  >
    <FlexContainer>
      {item && item.data && (
        <Standards item={item} search={{ curriculumId: '' }} reviewpage />
      )}
      <Tags tags={tags} show={1} />
      {type && (
        <FlexContainer>
          {type.map((t) => (
            <MetaTag key={t} marginLeft="0px">
              {t}
            </MetaTag>
          ))}
          {isPremium ? <PremiumTag key="premium">Premium</PremiumTag> : null}
        </FlexContainer>
      )}
      <CollectionTag collectionName={item?.collectionName} />
    </FlexContainer>
    <FlexContainer justifyContent="flex-end">
      {dok && <DokStyled>{`DOK:${dok}`}</DokStyled>}
      {renderAnalytics(by, IconUser)}
      {renderAnalytics(id && id.substring(18), IconHash)}
      {audio && audio.hasOwnProperty('ttsSuccess') ? (
        audio.ttsSuccess ? (
          <IconVolumeUp margin="0px 0px 0px 20px" />
        ) : (
          <IconNoVolume margin="0px 0px 0px 20px" />
        )
      ) : (
        ''
      )}
    </FlexContainer>
  </FlexContainer>
)

MetaInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
}

export default MetaInfoCell
