import React from "react";
import { EMOJI_BY_TONE, EMOJI } from '../../constants';

const Message = ({ fullname='Anonymous', toneId, emoji, avatar, deviceId }) => (
  <div className="edu-message">
    <div className="edu-emoji-wrapper">
      <span className="edu-emoji">{EMOJI_BY_TONE[toneId] && EMOJI_BY_TONE[toneId][emoji] || EMOJI[emoji]}</span>
    </div>
    <img src={avatar || `https://api.adorable.io/avatars/126/${deviceId}.png`} alt={fullname} className="edu-avatar" />
    <h3>{fullname}</h3>
  </div>
    );

export default Message;
