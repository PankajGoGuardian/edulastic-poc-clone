import React, {useState} from "react";
import { connect } from "react-redux";
import { EMOJI_BY_TONE, EMOJI } from '../../constants';
import { removeHandAction } from "../../reducers/ducks/messages";

const Hand = ({ msgId, fullname = 'Anonymous', toneId, emoji, avatar, removeHand, deviceId }) => {

    const [isClose, setClose] = useState(false);

    return (
      <div className="edu-message hand" onMouseEnter={() => setClose(true)} onMouseLeave={() => setClose(false)} onClick={() => removeHand(msgId)}>
        <div className="edu-emoji-wrapper hand">
          {
                isClose ? 
                (<span className="edu-emoji">❌</span>) : 
                (<span className="edu-emoji">{EMOJI_BY_TONE[toneId] && EMOJI_BY_TONE[toneId][emoji] || EMOJI[emoji]}</span>)
            }
            
        </div>
        <img src={avatar || `https://api.adorable.io/avatars/126/${deviceId}.png`} alt={fullname} className="edu-avatar" />
        <h3>{fullname}</h3>
      </div>
    );
};

export default connect(
    null,
    {
        removeHand: removeHandAction
    }
)(Hand);