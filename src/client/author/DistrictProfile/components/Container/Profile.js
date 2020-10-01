import React from 'react'
import styled from 'styled-components'
import { Layout } from 'antd'
// components
import ProfileHeader from './Header'
import ProfileBody from './ProfileBody'

const Wrapper = styled(Layout)`
  width: 100%;
`

const Profile = () => (
  <Wrapper>
    <ProfileHeader />
    <ProfileBody />
  </Wrapper>
)
export default Profile
