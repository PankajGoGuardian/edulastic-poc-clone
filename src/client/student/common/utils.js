export const scopes = [
	'https://www.googleapis.com/auth/classroom.courses.readonly',
	'https://www.googleapis.com/auth/classroom.rosters.readonly',
	'https://www.googleapis.com/auth/classroom.coursework.students',
	'https://www.googleapis.com/auth/classroom.coursework.me',
	'https://www.googleapis.com/auth/classroom.profile.emails',
	'https://www.googleapis.com/auth/classroom.profile.photos',
	'https://www.googleapis.com/auth/calendar',
	'https://www.googleapis.com/auth/calendar.events',
	'https://www.googleapis.com/auth/classroom.announcements',
  ].join(' ')


const UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN = '[addItems] update init search state on login';
export const updateInitSearchStateAction = (payload) => ({
	type: UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN,
	payload,
})

export const getUser = (state) => state.user?.user;

export const getUserRole = (state) => state.user?.user?.role

export const getCurrentTerm = (state) => state.user?.user?.orgData?.defaultTermId;

export const getFormattedName = (
	firstName = '',
	middleName = '',
	lastName = ''
  ) => {
	if (
	  (!firstName && !lastName && !middleName) ||
	  (firstName && firstName === 'Anonymous')
	) {
	  return 'Anonymous'
	}
	let fullName = ''
	if (lastName && (firstName || middleName)) {
	  fullName = `${capitalize(lastName)},`
	} else if (lastName) {
	  return `${capitalize(lastName)}`
	}
	if (firstName) {
	  fullName = fullName
		? `${fullName} ${capitalize(firstName)}`
		: `${capitalize(firstName)}`
	}
	if (middleName) {
	  fullName = fullName
		? `${fullName} ${capitalize(middleName)}`
		: `${capitalize(middleName)}`
	}
	return fullName
  }

  export const beforeUpload = (file, type) => {
	const isVideoFile = type === 'video'
	const isAllowedType = allowedFileTypes.includes(file.type)
	if (!isAllowedType) {
	  notification({ messageKey: 'imageTypeError' })
	}
	const withinSizeLimit = isVideoFile
	  ? file.size / 1024 / 1024 < 25
	  : file.size / 1024 / 1024 < 2
	if (!withinSizeLimit) {
	  notification({
		messageKey: isVideoFile ? 'videoSizeError' : 'imageSizeError',
	  })
	}
	return isAllowedType && withinSizeLimit
  }

  export const getInterestedCurriculumsSelector = (state) => {
	  const _state = state.user;
	  const orgData = state?.user?.orgData || {}
	  return orgData?.interestedCurriculums||[];
  }