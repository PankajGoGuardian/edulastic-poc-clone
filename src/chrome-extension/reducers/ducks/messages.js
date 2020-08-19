export const addMessageAction = payload => ({
    type: 'ADD_MSG',
    payload
});

export const removeMessageAction = payload => ({
    type: 'REMOVE_MSG',
    payload
});

export const addHandAction = payload => ({
    type: 'ADD_HAND',
    payload
});

export const removeHandAction = payload => ({
    type: 'REMOVE_HAND',
    payload
});

export const addUserDataAction = payload => ({
    type: 'ADD_USER_DATA',
    payload
});

export const updateStatusAction = payload => ({
    type: 'UPDATE_STATUS',
    payload
});

export const updateCheckedAction = payload => ({
    type: 'UPDATE_CHECKED',
    payload
});

export const setVisibleAction = payload => ({
    type: 'SET_VISIBLE',
    payload
});

export const setToneAction = payload => ({
    type: 'SET_TONE',
    payload
});

export const setNameAction = payload => ({
    type: 'SET_NAME',
    payload
});

export const updateRoomDataAction = payload => ({
    type: 'UPDATE_ROOM_DATA',
    payload
});

const iniialState = {
    userData: {},
    messages: [],
    hands: [],
    updateAvailable: false,
    updateChecked: false,
    visible: true,
    username: false,
    tone: 0,
    roomData: {}
};

const meetingsReducer = (state = { ...iniialState }, {type, payload}) => {
    switch (type) {
        case 'ADD_MSG': return ({
            ...state,
            messages: state.messages.concat(payload)
        });
        case 'REMOVE_MSG': return  ({
            ...state,
            messages: state.messages.filter((message) => message.msgId != payload)
        });
         case 'ADD_HAND':  return  ({
            ...state,
            hands: state.hands.concat(payload)
        });
         case 'REMOVE_HAND':  return ({
            ...state,
            hands: state.hands.filter((hand) => hand.msgId != payload)
        });
         case 'ADD_USER_DATA':  return ({
            ...state,
            userData: payload
        });
        case 'UPDATE_STATUS': return ({
            ...state,
            updateAvailable: payload
        });
        case 'UPDATE_CHECKED': return ({
            ...state,
            updateChecked: payload
        });
        case 'SET_VISIBLE': return ({
            ...state,
            visible: payload
        });
        case 'SET_TONE': return ({
            ...state,
            tone: payload
        });
        case 'SET_NAME': return ({
            ...state,
            userName: payload
        });
        case 'UPDATE_ROOM_DATA': return ({
            ...state,
            ...payload
        });
        default: return state;
    }
};

export default meetingsReducer;