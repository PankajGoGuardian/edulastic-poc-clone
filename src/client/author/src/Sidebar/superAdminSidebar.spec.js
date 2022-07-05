import {
  TEACHER,
  DISTRICT_ADMIN,
  SCHOOL_ADMIN,
} from '@edulastic/constants/const/roleType'
import { SideMenuComp as SideBar } from './SideMenu'

const features = {
  free: true,
  premium: true,
  isCurator: false,
  isPublisherAuthor: false,
  showCollaborationGroups: false,
}

const props = {
  lastPlayList: {},
  features,
  isSidebarCollapsed: true,
}

describe('#Super Admin Sidebar Menu for DA', () => {
  it('> Testing super admin allowed menu for Super Admin DA - Manage District', () => {
    props.isSuperAdmin = true
    props.isOrganizationDistrict = false
    props.userRole = DISTRICT_ADMIN
    const result = 'Manage District'

    const obj = new SideBar(props)
    const menus = obj.MenuItems

    const roleBasedMenu = menus.find(
      (menu) => menu.role?.includes(props.userRole) && menu.allowSuperAdmin
    )

    expect(roleBasedMenu.label).toEqual(result)
  })

  it('> Testing super admin allowed menu for Super Admin DA - Organization', () => {
    props.isSuperAdmin = true
    props.isOrganizationDistrict = true
    props.userRole = DISTRICT_ADMIN
    const result = 'Organization'

    const obj = new SideBar(props)
    const menus = obj.MenuItems

    const roleBasedMenu = menus.find(
      (menu) => menu.role?.includes(props.userRole) && menu.allowSuperAdmin
    )

    expect(roleBasedMenu.label).toEqual(result)
  })

  it('> Testing no super admin allowed menu for normal DA', () => {
    props.isSuperAdmin = false
    props.isOrganizationDistrict = false
    props.userRole = DISTRICT_ADMIN

    const obj = new SideBar(props)
    const menus = obj.MenuItems

    const roleBasedMenu = menus.find(
      (menu) => menu.role?.includes(props.userRole) && menu.allowSuperAdmin
    )

    expect(roleBasedMenu).toBeUndefined()
  })
})

describe('#Super Admin Sidebar Menu for SA', () => {
  it('> Testing super admin allowed menu for Super Admin SA - Manage School', () => {
    props.isSuperAdmin = true
    props.isOrganizationDistrict = false
    props.userRole = SCHOOL_ADMIN
    const result = 'Manage School'

    const obj = new SideBar(props)
    const menus = obj.MenuItems

    const roleBasedMenu = menus.find(
      (menu) => menu.role?.includes(props.userRole) && menu.allowSuperAdmin
    )

    expect(roleBasedMenu.label).toEqual(result)
  })

  it('> Testing no super admin allowed menu for normal SA', () => {
    props.isSuperAdmin = false
    props.isOrganizationDistrict = false
    props.userRole = SCHOOL_ADMIN

    const obj = new SideBar(props)
    const menus = obj.MenuItems

    const roleBasedMenu = menus.find(
      (menu) => menu.role?.includes(props.userRole) && menu.allowSuperAdmin
    )

    expect(roleBasedMenu).toBeUndefined()
  })
})

describe('#Super Admin Sidebar Menu for teacher', () => {
  it('> Testing no super admin allowed menu item for Teacher', () => {
    props.isSuperAdmin = false
    props.isOrganizationDistrict = false
    props.userRole = TEACHER

    const obj = new SideBar(props)
    const menus = obj.MenuItems

    const roleBasedMenu = menus.find(
      (menu) => menu.role?.includes(props.userRole) && menu.allowSuperAdmin
    )

    expect(roleBasedMenu).toBeUndefined()
  })
})
