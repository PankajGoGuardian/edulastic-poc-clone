export const TONES = ['#f8cc5c', '#f7dbb8', '#deb793', '#d2a16a', '#bb9065', '#80654d'];

export const DEFAULT_EMOJI = {
    "celebrate": '🎉',
    "laugh": '😂',
    "angel": '😇',
    "think": '🤔',
    "grin": '😄',
    "beam": '😁',
    "wink": '😉',
    "zip": '🤐'
};

export const DEFAULT_SKIN_TONE = {
    'thumb': '👍',
    'thumb_down': '👎',
    'clap': '👏',
    "wave": '👋',
    "raise_hands": '✋',
    "victory": '✌️',
    "ok": '👌',
    "pray": '🙏'
};

export const EMOJI = { ...DEFAULT_EMOJI, ...DEFAULT_SKIN_TONE };

export const EMOJI_BY_TONE = [
    { ...DEFAULT_SKIN_TONE },
    {
        'thumb': '👍🏻',
        'thumb_down': '👎🏻',
        'clap': '👏🏻',
        "wave": '👋🏻',
        "raise_hands": '🤚🏻',
        "victory": '✌🏻',
        "ok": '👌🏻',
        "pray": '🙏🏻'
    },
    {
        'thumb': '👍🏼',
        'thumb_down': '👎🏼',
        'clap': '👏🏼',
        "wave": '👋🏼',
        "raise_hands": '🤚🏼',
        "victory": '✌🏼',
        "ok": '👌🏼',
        "pray": '🙏🏼'
    },
    {
        'thumb': '👍🏽',
        'thumb_down': '👎🏽',
        'clap': '👏🏽',
        "wave": '👋🏽',
        "raise_hands": '🤚🏽',
        "victory": '✌🏽',
        "ok": '👌🏽',
        "pray": '🙏🏽'
    },
    {
        'thumb': '👍🏾',
        'thumb_down': '👎🏾',
        'clap': '👏🏾',
        "wave": '👋🏾',
        "raise_hands": '🤚🏾',
        "victory": '✌🏾',
        "ok": '👌🏾',
        "pray": '🙏🏾'
    },
    {
        'thumb': '👍🏿',
        'thumb_down': '👎🏿',
        'clap': '👏🏿',
        "wave": '👋🏿',
        "raise_hands": '🤚🏿',
        "victory": '✌🏿',
        "ok": '👌🏿',
        "pray": '🙏🏿'
    }
];

export const EVENTS = {
    'CONNECT': 'connect',
    'DISCONNECT': 'disconnect',
    'JOIN': 'join', 
    'ACTIVITY': 'activity', 
    'QUESTION': 'question', 
    'REACTION': 'reaction' 
};

export const ENGAGEMENT_STATUS = {
    'ACTIVE': 0,
    'INACTIVE': 1,
    'DISCONNECT': 2
};

export const COLORS = {
    'PRESENT':  '#5EB500',
    'ABSENT': '#FFA200',
    'ACTIVE': '#5EB500',
    'NOT_ENGAGED': '#5DC3E4'
};