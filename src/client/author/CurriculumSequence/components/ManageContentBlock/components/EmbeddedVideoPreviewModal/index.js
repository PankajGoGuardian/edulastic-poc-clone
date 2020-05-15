import React from "react";
import PropTypes from "prop-types";
import EdulasticResourceModal from "../common/EdulasticResourceModal";

/**
 * EmbeddedVideoPreviewModal modal to preview embedded video links
 * Each Service has their own format of embedding videos in iframe
 * Current Support for external video links (Youtube,Vimeo, GDrive public shared)
 */

const EmbeddedVideoPreviewModal = props => {
  const { title = "", url = "" } = props.isVisible || {};

  const youtubeService = () => {
    // Matches Various patterns of youtube links and extracts video ID
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (
      <EdulasticResourceModal headerText={title} {...props} maxWidth="645px" hideFooter smallFont>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${match[1]}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          style={{ margin: "auto" }}
          allowFullScreen
        />
      </EdulasticResourceModal>
    );
  };

  const vimeoService = () => {
    // Matches Various patterns of vimeo links and extracts video ID
    const regExp = /^.*(?:vimeo.com)\/(?:channels\/|channels\/\w+\/|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regExp);
    return (
      <EdulasticResourceModal headerText={title} {...props} maxWidth="720px" hideFooter smallFont>
        <iframe
          width="640"
          height="360"
          src={`https://player.vimeo.com/video/${match[1]}`}
          frameBorder="0"
          allow="autoplay; fullscreen"
          style={{ margin: "auto" }}
          allowFullScreen
        />
      </EdulasticResourceModal>
    );
  };

  const googleDriveService = () => {
    return (
      <EdulasticResourceModal headerText={title} {...props} maxWidth="720px" hideFooter smallFont>
        <iframe width="640" height="480" src={url} style={{ margin: "auto" }} />
      </EdulasticResourceModal>
    );
  };

  if (url.search(/youtu\.?be(\.com)?\//) !== -1) {
    return youtubeService();
  } else if (url.includes("vimeo.com")) {
    return vimeoService();
  } else if (url.includes("drive.google.com")) {
    return googleDriveService();
  } else {
    return (
      <EdulasticResourceModal headerText={title} {...props} maxWidth="720px" hideFooter smallFont>
        <iframe width="720px" height="405px" src={url} frameBorder="0" allowFullScreen />
      </EdulasticResourceModal>
    );
  }
};

EmbeddedVideoPreviewModal.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default EmbeddedVideoPreviewModal;
