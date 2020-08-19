import React from "react";
import { connect } from 'react-redux';
import { Dropdown } from "./styled";
import { EMOJI_BY_TONE, EMOJI } from "../../constants";
import { generateUUID } from "../../utils";
import { removeMessageAction, addMessageAction } from '../../reducers/ducks/messages';

const Reaction = ({ emoji, label, clickCallback }) => {

    const activeToneId = localStorage.getItem("edu-skinTone");

    return (
      <div className="dropdown-outer" role="button" onClick={() => clickCallback(emoji)}>
        <div className="dropdown-item" title={label}>
          {EMOJI_BY_TONE[activeToneId] && EMOJI_BY_TONE[activeToneId][emoji] || EMOJI[emoji]}
        </div>
      </div>
    );
};

// Change to GIF ones
const Reactions = [
    { emoji: "thumb", label: "Thumbs Up" },
    { emoji: "thumb_down", label: "Thumbs Down" },
    { emoji: "victory", label: "Victory" },
    { emoji: "ok", label: "Superb" },
    { emoji: "raise_hands", label: "Raising Hands" },
    { emoji: "clap", label: "Clap" },
    { emoji: "wave", label: "Wave" },
    { emoji: "pray", label: "Closed Hands" },
    { emoji: "grin", label: "Grinning" },
    { emoji: "beam", label: "Beaming" },
    { emoji: "laugh", label: "Laughing" },
    { emoji: "wink", label: "Winking" },
    { emoji: "zip", label: "Zipped Mouth" },
    { emoji: "angel", label: "Innocent" },
    { emoji: "think", label: "Wondering" },
    { emoji: "celebrate", label: "Celebrate" }
];

const ReactionsDropdown = ({userData, addMessage, removeMessage, toneId}) => {

    const socket = window['edu-meet'];

    const clickCallback = emoji => {
        if(socket.connected){
            const msgId = generateUUID();
            const msgData = {
                meetingID,
                userId,
                classId,
                reaction: {
                    msgId,
                    emoji,
                    timestamp: Date.now(),
                    type: 'QUEUE'
                },
                metadata: {
                    fullname,
                    avatar,
                    toneId: toneId || localStorage.getItem('edu-skinTone') || 0
                }
            };
            socket.send(msgData);
            addMessage({...msgData.reaction,...msgData.metadata});
            setTimeout(() => removeMessage(msgId),2000);
        }
    }

    return (
      <Dropdown id="reactions-dropdown">
        {
                Reactions.map(reaction => <Reaction key={reaction.emoji} clickCallback={clickCallback} {...reaction} />)
            }
      </Dropdown>
    );
};

export default connect(
    state => ({
        userData: state.meetingsReducer.userData,
        toneId: state.meetingsReducer.toneId
      }),
      {
        addMessage: addMessageAction,
        removeMessage: removeMessageAction
      }
)(ReactionsDropdown);