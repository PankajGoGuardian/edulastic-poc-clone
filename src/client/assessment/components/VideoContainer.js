import React, { useMemo } from "react";
import PropTypes from "prop-types";

// const VideoContainer = ({ src }) => {
//   console.log(src);
//   return useMemo(() => {
//     return (
//       <iframe
//         width="640"
//         height="360"
//         src="https://www.youtube.com/embed/ltBZELUKdAk?wmode=opaque"
//         frameborder="0"
//         allowfullscreen=""
//         class="fr-draggable"
//       />
//     );
//   }, [src]);
// };

class VideoContainer extends React.Component {
  constructor(props) {
    super(props);
    console.log("constructor~~~~~~");
  }

  render() {
    return (
      <iframe
        width="640"
        height="360"
        src="https://www.youtube.com/embed/ltBZELUKdAk?wmode=opaque"
        frameborder="0"
        allowfullscreen=""
        class="fr-draggable"
      />
    );
  }
}

export default VideoContainer;

// const UserInfoMemo = React.memo(props => {
//   const { name, avatar } = props;
//   console.log("MEMO COMPONENT RENDERING");

//   return (
//     <div className="user-info">
//       <img src={avatar} alt={`${name}'s avatar`} />
//       <span>{name}</span>
//     </div>
//   );
// });
