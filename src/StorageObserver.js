import { useEffect } from 'react'
import { connect } from 'react-redux'
import { parseJwt, tokenKey } from '@edulastic/api/src/utils/Storage'
import {
  getUserOrgId,
  getUserSelector,
} from './client/author/src/selectors/user'
import { logoutAction } from './client/author/src/actions/auth'

export const useStorageHook = (user, orgId, logout) => {
  useEffect(() => {
    const onStorageChange = (e) => {
      try {
        if (!user._id || !user.role) {
          return
        }
        const tk = tokenKey(user._id, user.role)
        const tokens = JSON.parse(window.localStorage.getItem('tokens') || '[]')

        // e.key will be null if localstorage.clear() is called
        if (e.key && e.key !== tk && e.key !== 'tokens') {
          return
        }

        const token = window.localStorage.getItem(tk)
        if (!token || !tokens.includes(tk))
          throw new Error('User signed out in another tab')

        const jwt = parseJwt(token)
        if (jwt.districtId !== orgId) {
          console.error('STORAGE: switched district in another tab')
          window.location.href = '/'
        }
      } catch (err) {
        console.error('STORAGE: LOGGING OUT', err?.message || err)
        logout()
      }
    }
    window.addEventListener('storage', onStorageChange)
    return () => {
      window.removeEventListener('storage', onStorageChange)
    }
  }, [orgId, user._id, user.role, logout])}

const StorageObserver = (props) => {
  const { user: _user, orgId, logout } = props
  const user = _user?.user || {}

  useStorageHook(user, orgId, logout)
  return props.children || null
}

const mapStateToProps = (state) => ({
  user: getUserSelector(state),
  orgId: getUserOrgId(state),
})

const mapDispatchToProps = {
  logout: logoutAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageObserver)
