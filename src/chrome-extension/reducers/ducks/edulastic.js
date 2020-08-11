export const setAuthTokenAction = payload => ({
    type: 'SET_AUTH_TOKEN',
    payload
});

export const updateUserAction = payload => ({
    type: 'UPDATE_USER',
    payload
});

export const updateClassDataAction = payload => ({
    type: 'UPDATE_CLASS_DATA',
    payload
});

export const setAuthModalAction = payload => ({
    type: 'SET_AUTH_MODAL',
    payload
});

export const setDropdownTabAction = payload => ({
    type: 'SET_DROPDOWN_TAB',
    payload
});


const iniialState = {
    authToken: "",
    user: {},   
    classData: {},
    isAuthModal: false,
    dropdownTab: ''
};

const edulasticReducer = (state = { ...iniialState }, {type, payload}) => {
    console.log({type,payload});
    switch (type) {
        case 'SET_AUTH_TOKEN': return ({
            ...state,
            authToken: payload
        });
        case 'UPDATE_USER': return  ({
            ...state,
            user: payload
        });
         case 'UPDATE_CLASS_DATA':  return  ({
            ...state,
            classData: payload
        });
        case 'SET_AUTH_MODAL':  return  ({
            ...state,
            classData: payload
        });
        case 'SET_DROPDOWN_TAB':  return  ({
            ...state,
            dropdownTab: payload
        });
    
        default: return state;
    }
};

export default edulasticReducer;