import {
  EduButton,
  notification,
  CustomModalStyled,
  FieldLabel,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Icon, Input, Row } from 'antd'
import { get, upperFirst } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { IconPlusCircle } from '@edulastic/icons'
import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/SettingSubHeader'
import {
  getUserId,
  getUserOrgId,
  getUserRole,
} from '../../../src/selectors/user'
import {
  createStandardsProficiencyAction,
  deleteStandardsProficiencyAction,
  receiveStandardsProficiencyAction,
  setEDitableAction,
  setEditingIndexAction,
  setStandardsProficiencyProfileNameAction,
  updateStandardsProficiencyAction,
  setConflitAction,
} from '../../ducks'
import StandardsProficiencyTable from '../StandardsProficiencyTable/StandardsProficiencyTable'
import {
  ListItemStyled,
  RowStyled,
  StyledList,
  StyledProfileCol,
  StyledProfileRow,
} from './styled'
import {
  SettingsWrapper,
  StyledCol,
  StyledContent,
  StyledLayout,
  StyledRow,
} from '../../../../admin/Common/StyledComponents/settingsContent'
import {
  SpinContainer,
  StyledSpin,
} from '../../../../admin/Common/StyledComponents'
import { TableContainer } from '../../../../common/styled'

const BlueBold = styled.b`
  color: #1774f0;
`
const title = 'Manage District'

const defaultData = {
  calcAttribute: 5,
  calcType: 'MOVING_AVERAGE',
  decay: 30,
  noOfAssessments: 5,
  scale: [
    {
      score: 4,
      shortName: 'E',
      threshold: 90,
      masteryLevel: 'Exceeds Mastery',
      color: '#60B14F',
      domainMastery: true,
    },
    {
      score: 3,
      shortName: 'M',
      threshold: 80,
      masteryLevel: 'Mastered',
      color: '#7CE37A',
      domainMastery: true,
    },
    {
      score: 2,
      shortName: 'A',
      threshold: 70,
      masteryLevel: 'Almost Mastered',
      color: '#EBDD54',
      domainMastery: false,
    },
    {
      score: 1,
      shortName: 'N',
      threshold: 0,
      masteryLevel: 'Not Mastered',
      color: '#EF9202',
      domainMastery: false,
    },
  ],
}

function ProfileRow(props) {
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [deleteText, setDeleteText] = useState('')
  const proficiencyTableInstance = useRef()
  const {
    _id,
    index,
    deleteRow,
    setEditing,
    active,
    readOnly,
    setName,
    onDuplicate,
    decay,
    noOfAssessments,
    setDeleteProficiencyName,
    conflict,
  } = props
  const profileName = get(props, 'profile.name', '')

  useEffect(() => {
    if (conflict) {
      setConfirmVisible(false)
    }
  }, [conflict])

  return (
    <ListItemStyled>
      <CustomModalStyled
        title="Delete Profile"
        onCancel={() => setConfirmVisible(false)}
        visible={confirmVisible}
        centered
        footer={[
          <EduButton isGhost onClick={() => setConfirmVisible(false)}>
            NO, CANCEL
          </EduButton>,
          <EduButton
            disabled={deleteText.toUpperCase() != 'DELETE'}
            loading={props.loading}
            onClick={() => {
              deleteRow(_id)
              setDeleteProficiencyName(profileName)
            }}
            data-cy="deleteProfile"
          >
            YES, DELETE
          </EduButton>,
        ]}
      >
        <Row className="content">
          <Col span={24}>
            <BlueBold>{props.profile.name}</BlueBold> will be removed
            permanently and can’t be used in future tests. This action can NOT
            be undone. If you are sure, please type <BlueBold>DELETE</BlueBold>{' '}
            in the space below.
          </Col>
          <Col span={24}>
            <TextInputStyled
              style={{ marginTop: '10px' }}
              align="center"
              data-cy="typeDelete"
              autoFocus
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
            />
          </Col>
        </Row>
      </CustomModalStyled>

      <StyledProfileRow onClick={() => setEditing(index)} type="flex">
        <Col span={12}>
          {active && !readOnly ? (
            <Input
              value={profileName}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                setName({ _id, name: e.target.value })
                if (proficiencyTableInstance.current) {
                  proficiencyTableInstance.current.setChanged(true)
                }
              }}
              data-cy="editProfile"
            />
          ) : (
            <h3>{profileName}</h3>
          )}
        </Col>
        <StyledProfileCol span={12}>
          {props.hideEdit ? null : (
            <Icon
              type="edit"
              theme="filled"
              title="edit"
              onClick={(e) => {
                e.stopPropagation()
                props.setEditable({ index, value: true })
              }}
              data-cy={`${profileName}-edit`}
            />
          )}
          <Icon
            type="copy"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate()
            }}
            data-cy={`${profileName}-clone`}
          />
          {props.hideEdit ? null : (
            <Icon
              type="delete"
              theme="filled"
              onClick={(e) => {
                e.stopPropagation()
                setConfirmVisible(true)
              }}
              data-cy={`${profileName}-delete`}
            />
          )}
          {
            <Icon
              type={active ? 'up' : 'down'}
              theme="outlined"
              onClick={(e) => {
                e.stopPropagation()
                setEditing(index)
              }}
            />
          }
        </StyledProfileCol>
      </StyledProfileRow>

      {active && (
        <RowStyled>
          <Col span={24}>
            <StandardsProficiencyTable
              wrappedComponentRef={proficiencyTableInstance}
              readOnly={readOnly}
              name={get(props, 'profile.name', 'Untitled')}
              index={index}
              _id={_id}
              decay={decay}
              noOfAssessments={noOfAssessments}
            />
          </Col>
        </RowStyled>
      )}
    </ListItemStyled>
  )
}

function StandardsProficiency(props) {
  const {
    loading,
    updating,
    creating,
    history,
    list,
    create,
    remove,
    editingIndex,
    setEditingIndex,
    setName,
    setEditable,
    editable,
    conflict,
    error,
  } = props
  const showSpin = loading || updating || creating
  const menuActive = { mainMenu: 'Settings', subMenu: 'Standards Proficiency' }

  const [confirmVisible, setConfirmVisible] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [conflictModalVisible, setConflictModalVisible] = useState(false)
  const [deleteProficiencyName, setDeleteProficiencyName] = useState('')

  useEffect(() => {
    setConflictModalVisible(conflict)
  }, [conflict])

  const handleProfileLimit = () => {
    const canCreateProfile =
      props.profiles.filter((x) => x.createdBy?._id === props.userId).length <
      10
    if (!canCreateProfile) {
      notification({ messageKey: 'maximumTenProfilesPerUser' })
      return false
    }
    return true
  }

  const createStandardProficiency = () => {
    const name = profileName
    if (name === '') {
      notification({ messageKey: 'nameCannotBeEmpty' })
    } else if (name) {
      // needed for unicode aware length
      if ([...name].length > 150) {
        notification({ messageKey: 'maximumLengthForProifleName150' })
        return
      }

      if (
        props.profiles.find(
          (p) => (p.name || '').toLowerCase() === name.toLowerCase()
        )
      ) {
        notification({
          msg: `Profile with name "${name}" already exists. Please try with a different name`,
        })
        return
      }
      create({ ...defaultData, name, orgId: props.orgId, orgType: 'district' })
      setConfirmVisible(false)
      setProfileName('')
    }
  }

  const duplicateProfile = ({ _id, name }) => {
    if (!handleProfileLimit()) {
      return
    }
    const {
      _id: profileId,
      createdBy,
      institutionIds,
      createdAt,
      updatedAt,
      __v,
      v1OrgId,
      ...profile
    } = props.profiles.find((x) => x._id === _id) || {}
    let lastVersion = 0
    if (/#[0-9]*$/.test(name)) {
      lastVersion = parseInt(name.split('#').slice(-1)[0] || 0)
    }
    create({
      noOfAssessments: 5,
      ...profile,
      name: `${name.replace(/#[0-9]*$/, '')}#${lastVersion + 1}`,
      orgId: props.orgId,
      orgType: 'district',
      scale: profile.scale.map(({ key, ...x }) => ({ ...x })),
    })
  }

  useEffect(() => {
    list()
  }, [])

  return (
    <SettingsWrapper>
      <CustomModalStyled
        title="Delete Profile"
        visible={conflictModalVisible}
        centered
        onCancel={() => {
          setConflictModalVisible(false)
          props.setConflitAction(false)
        }}
        footer={[
          <EduButton
            isGhost
            onClick={() => {
              props.setConflitAction(false)
              setConflictModalVisible(false)
            }}
          >
            OK
          </EduButton>,
        ]}
      >
        <Row className="content">
          <Col span={24}>
            <BlueBold>{deleteProficiencyName}</BlueBold> is set as the default
            value for <BlueBold>{upperFirst(error?.type)} Tests</BlueBold>.
            Please change the Test Setting before deleting.
          </Col>
        </Row>
      </CustomModalStyled>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <StyledLayout loading={showSpin ? 'true' : 'false'}>
          <AdminSubHeader active={menuActive} history={history} />
          {showSpin && (
            <SpinContainer>
              <StyledSpin size="large" />
            </SpinContainer>
          )}
          <TableContainer>
            <StyledList
              dataSource={props.profiles}
              bordered
              rowKey="_id"
              renderItem={(profile, index) => (
                <ProfileRow
                  readOnly={
                    (props.role === 'school-admin' &&
                      get(profile, 'createdBy._id') != props.userId) ||
                    !editable
                  }
                  hideEdit={
                    props.role === 'school-admin' &&
                    get(profile, 'createdBy._id') != props.userId
                  }
                  setEditable={setEditable}
                  onDuplicate={() => duplicateProfile(profile)}
                  setName={setName}
                  setEditing={setEditingIndex}
                  index={index}
                  profile={profile}
                  _id={profile._id}
                  active={index === editingIndex}
                  deleteRow={remove}
                  loading={showSpin}
                  decay={get(profile, 'decay', '')}
                  setDeleteProficiencyName={setDeleteProficiencyName}
                  conflict={conflict}
                  noOfAssessments={get(profile, 'noOfAssessments', '')}
                />
              )}
            />

            <StyledRow type="flex" justify="start">
              <CustomModalStyled
                destroyOnClose
                title="Create New Profile"
                visible={confirmVisible}
                onCancel={() => setConfirmVisible(false)}
                centered
                footer={[
                  <EduButton isGhost onClick={() => setConfirmVisible(false)}>
                    CANCEL
                  </EduButton>,
                  <EduButton
                    disabled={profileName === ''}
                    loading={loading}
                    onClick={() => createStandardProficiency()}
                  >
                    CREATE
                  </EduButton>,
                ]}
              >
                <Row>
                  <Col span={24}>
                    <FieldLabel>
                      PLEASE ENTER THE NAME OF THE STANDARD PROFICIENCY
                    </FieldLabel>
                    <TextInputStyled
                      value={profileName}
                      data-cy="enterStandardProficiencyName"
                      onChange={(e) => setProfileName(e.target.value)}
                    />
                  </Col>
                </Row>
              </CustomModalStyled>
              <StyledCol mt="10px">
                <EduButton
                  ml="0px"
                  type="primary"
                  data-cy="createNewProfile"
                  onClick={() =>
                    handleProfileLimit() && setConfirmVisible(true)
                  }
                >
                  <IconPlusCircle width={19} height={19} /> Create new Profile
                </EduButton>
              </StyledCol>
            </StyledRow>
          </TableContainer>
        </StyledLayout>
      </StyledContent>
    </SettingsWrapper>
  )
}

const enhance = connect(
  (state) => ({
    loading: get(state, ['standardsProficiencyReducer', 'loading'], false),
    updating: get(state, ['standardsProficiencyReducer', 'updating'], false),
    creating: get(state, ['standardsProficiencyReducer', 'creating'], false),
    profiles: get(state, ['standardsProficiencyReducer', 'data'], []),
    editable: state?.standardsProficiencyReducer?.editable,
    orgId: getUserOrgId(state),
    role: getUserRole(state),
    userId: getUserId(state),
    editingIndex: get(state, 'standardsProficiencyReducer.editingIndex'),
    conflict: get(state, ['standardsProficiencyReducer', 'conflict'], false),
    error: get(state, ['standardsProficiencyReducer', 'error'], {}),
  }),
  {
    create: createStandardsProficiencyAction,
    update: updateStandardsProficiencyAction,
    list: receiveStandardsProficiencyAction,
    remove: deleteStandardsProficiencyAction,
    setEditingIndex: setEditingIndexAction,
    setName: setStandardsProficiencyProfileNameAction,
    setEditable: setEDitableAction,
    setConflitAction,
  }
)

export default enhance(StandardsProficiency)

StandardsProficiency.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired,
  profiles: PropTypes.array.isRequired,
}
