const STUDENT = 'student'
const ADMIN = 'admin'
const TEACHER = 'teacher'
const DISTRICT_ADMIN = 'district-admin'
const SCHOOL_ADMIN = 'school-admin'
const EDULASTIC_ADMIN = 'edulastic-admin'
const EDULASTIC_CURATOR = 'edulastic-curator'
const PARENT = 'parent'
const DISTRICT_GROUP_ADMIN = 'district-group-admin'

const DA_SA_ROLE_ARRAY = [DISTRICT_ADMIN, SCHOOL_ADMIN]

const ADMINS_ROLE_ARRAY = [...DA_SA_ROLE_ARRAY, DISTRICT_GROUP_ADMIN]

const ORG_TYPE = {
  DISTRICT: 'district',
  INSTITUTION: 'institution',
  TEACHER: 'teacher',
  SCHOOL_ADMIN: 'school-admin',
  DISTRICT_ADMIN: 'district-admin',
  USER: 'user',
}

const ORGANIZATION_TYPE = {
  DISTRICT: 'DISTRICT',
  INSTITUTION: 'INSTITUTION',
  TEACHER: 'TEACHER',
  SCHOOL_ADMIN: 'SCHOOL-ADMIN',
  DISTRICT_ADMIN: 'DISTRICT_ADMIN',
  USER: 'USER',
}

const ROLE_LABEL = {
  [DISTRICT_ADMIN]: 'District Admin',
  [SCHOOL_ADMIN]: 'School Admin',
  [TEACHER]: 'Teacher',
  [STUDENT]: 'Student',
  [DISTRICT_GROUP_ADMIN]: 'District Group Admin',
}

module.exports = {
  STUDENT,
  ADMIN,
  TEACHER,
  DISTRICT_ADMIN,
  SCHOOL_ADMIN,
  EDULASTIC_ADMIN,
  EDULASTIC_CURATOR,
  ADMINS_ROLE_ARRAY,
  DA_SA_ROLE_ARRAY,
  PARENT,
  DISTRICT_GROUP_ADMIN,
  ORG_TYPE,
  ROLE_LABEL,
  ORGANIZATION_TYPE,
}
