import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Button from "antd/es/button";
import { connect } from 'react-redux'
import { compose } from 'redux'
import { uniq as _uniq } from 'lodash'
import { IconSource } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { withWindowSizes, MainContentWrapper } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'

import { getItemsSubjectAndGradeSelector } from '../../../AddItems/ducks'
import { ButtonLink } from '../../../../../src/components/common'
import SummaryCard from '../Sidebar/SideBarSwitch'
import Breadcrumb from '../../../../../src/components/Breadcrumb'
import { SecondHeader } from './styled'
import { getSummarySelector } from '../../ducks'
import { getUserFeatures } from '../../../../../../student/Login/ducks'
import {
  getUser,
  getCollectionsToAddContent,
} from '../../../../../src/selectors/user'
import {
  getlastUsedCollectionListSelector,
  getDefaultThumbnailSelector,
  updateDefaultThumbnailAction,
  getAllTagsAction,
  getAllTagsSelector,
  addNewTagAction,
  toggleTestLikeAction,
} from '../../../../ducks'

const Summary = ({
  setData,
  currentUser,
  test,
  current,
  owner,
  t,
  defaultThumbnail,
  onShowSource,
  windowWidth,
  itemsSubjectAndGrade,
  isPlaylist,
  onChangeGrade,
  onChangeCollection,
  features,
  backgroundColor,
  textColor,
  getAllTags,
  allTagsData,
  allPlaylistTagsData,
  lastUsedCollections,
  collectionsToShow,
  updateDefaultThumbnail,
  isTextColorPickerVisible,
  isBackgroundColorPickerVisible,
  onChangeColor,
  addNewTag,
  onChangeSubjects,
  isEditable = true,
  showCancelButton,
  toggleTestLikeRequest,
}) => {
  const handleChangeField = (field, value) => {
    if (field === 'thumbnail') {
      updateDefaultThumbnail('')
    }
    setData({ ...test, [field]: value })
  }

  useEffect(() => {
    getAllTags({ type: isPlaylist ? 'playlist' : 'test' })
  }, [])

  useEffect(() => {
    // pre-populate collections initially
    const bucketIds = lastUsedCollections.flatMap((c) => c.bucketIds)
    const populatedCollections = collectionsToShow
      .filter((item) => bucketIds.includes(item.bucketId))
      .map(({ _id, bucketId }) => ({ props: { _id, value: bucketId } }))
    if (!test.title && !test.collections?.length) {
      onChangeCollection(null, populatedCollections, collectionsToShow)
    }
  }, [lastUsedCollections, collectionsToShow])

  const breadcrumbData = [
    {
      title: showCancelButton ? 'ASSIGNMENTS / EDIT TEST' : 'TESTS',
      to: showCancelButton ? '/author/assignments' : '/author/tests',
    },
    {
      title: current,
      to: '',
    },
  ]
  const playlistBreadcrumbData = [
    {
      title: 'PLAYLIST',
      to: '/author/playlists',
    },
    {
      title: 'SUMMARY',
      to: '',
    },
  ]
  const grades = _uniq([...test.grades, ...itemsSubjectAndGrade.grades])
  const subjects = _uniq([...test.subjects, ...itemsSubjectAndGrade.subjects])

  return (
    <MainContentWrapper>
      <SecondHeader>
        <Breadcrumb
          data={isPlaylist ? playlistBreadcrumbData : breadcrumbData}
          style={{ position: 'unset' }}
        />
        {!isPlaylist && false && (
          <Button>
            <ButtonLink
              onClick={onShowSource}
              color="primary"
              icon={<IconSource color={themeColor} width={16} height={16} />}
            >
              {t('component.questioneditor.buttonbar.source')}
            </ButtonLink>
          </Button>
        )}
      </SecondHeader>
      <SummaryCard
        title={test.title}
        alignmentInfo={test.alignmentInfo}
        description={test.description}
        tags={test.tags}
        analytics={test.analytics}
        collections={test.collections}
        collectionsToShow={collectionsToShow}
        onChangeField={handleChangeField}
        windowWidth={windowWidth}
        grades={grades}
        addNewTag={addNewTag}
        owner={owner}
        allTagsData={allTagsData}
        allPlaylistTagsData={allPlaylistTagsData}
        isPlaylist={isPlaylist}
        subjects={subjects}
        onChangeGrade={onChangeGrade}
        features={features}
        onChangeCollection={onChangeCollection}
        onChangeSubjects={onChangeSubjects}
        textColor={textColor}
        createdBy={
          test.createdBy && test.createdBy._id ? test.createdBy : currentUser
        }
        thumbnail={defaultThumbnail || test.thumbnail}
        backgroundColor={backgroundColor}
        onChangeColor={onChangeColor}
        isTextColorPickerVisible={isTextColorPickerVisible}
        isBackgroundColorPickerVisible={isBackgroundColorPickerVisible}
        isEditable={isEditable}
        test={test}
        toggleTestLikeRequest={toggleTestLikeRequest}
      />
    </MainContentWrapper>
  )
}

Summary.defaultProps = {
  owner: false,
  isPlaylist: false,
  isBackgroundColorPickerVisible: false,
  isTextColorPickerVisible: false,
}
Summary.propTypes = {
  setData: PropTypes.func.isRequired,
  test: PropTypes.object.isRequired,
  owner: PropTypes.bool,
  t: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  onShowSource: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  itemsSubjectAndGrade: PropTypes.object.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  onChangeCollection: PropTypes.func.isRequired,
  isPlaylist: PropTypes.bool,
  onChangeSubjects: PropTypes.func.isRequired,
  textColor: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  isBackgroundColorPickerVisible: PropTypes.bool,
  isTextColorPickerVisible: PropTypes.bool,
  onChangeColor: PropTypes.func.isRequired,
}

const enhance = compose(
  withWindowSizes,
  withNamespaces('author'),
  connect(
    (state) => ({
      summary: getSummarySelector(state),
      currentUser: getUser(state),
      defaultThumbnail: getDefaultThumbnailSelector(state),
      allTagsData: getAllTagsSelector(state, 'test'),
      allPlaylistTagsData: getAllTagsSelector(state, 'playlist'),
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state),
      features: getUserFeatures(state),
      lastUsedCollections: getlastUsedCollectionListSelector(state),
      collectionsToShow: getCollectionsToAddContent(state),
    }),
    {
      getAllTags: getAllTagsAction,
      addNewTag: addNewTagAction,
      updateDefaultThumbnail: updateDefaultThumbnailAction,
      toggleTestLikeRequest: toggleTestLikeAction,
    }
  )
)

export default enhance(Summary)
