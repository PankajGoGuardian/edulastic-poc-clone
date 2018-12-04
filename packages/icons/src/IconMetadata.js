/* eslint-disable react/prop-types */
import React from 'react';
import withIconStyles from './HOC/withIconStyles';
import SVG from './common/SVG';

// const IconMetadata = props => (
//   <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.636 19.728" {...props}>
//     <path
//       d="M20.221,18.3l-1.727-1.727a4.091,4.091,0,0,0-2.587-6.248V7c0-.007,0-.014,0-.022a.833.833,0,0,0-.19-.53l0,0c-.016-.019-.032-.037-.049-.054l-.007-.007-.022-.022L9.519.245h0C9.5.228,9.483.212,9.465.2L9.448.182,9.406.151,9.386.137,9.341.11,9.322.1Q9.292.083,9.26.069L9.234.059,9.192.043,9.162.034,9.114.022,9.091.016c-.023,0-.047-.008-.07-.011L9,0,8.94,0H1.669A.838.838,0,0,0,.831.838v16.75a.838.838,0,0,0,.838.838h13.4a4.069,4.069,0,0,0,2.24-.67l1.727,1.727A.837.837,0,0,0,20.221,18.3Zm-2.733-3.968a2.42,2.42,0,1,1-2.42-2.42A2.422,2.422,0,0,1,17.488,14.331ZM9.765,2.859l3.282,3.282H9.765ZM2.506,1.675H8.09v5.3a.838.838,0,0,0,.838.838h5.3v2.506a4.091,4.091,0,0,0-2.463,6.428H2.506Z"
//       transform="translate(-0.831)"
//     />
//   </SVG>
// );

const IconMetadata = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.018 18.67" {...props}>
    <path
      d="M18.969,2.811C18.587,1.394,15.739,0,10.759,0S2.93,1.394,2.548,2.811a.324.324,0,0,0-.048.162V15.2a.311.311,0,0,0,.039.149c.39,1.617,3.881,2.824,8.22,2.824s7.814-1.2,8.217-2.813a.326.326,0,0,0,.041-.16V2.973A.324.324,0,0,0,18.969,2.811Zm-.639,8.416a.813.813,0,0,1-.038.12.949.949,0,0,1-.047.1,1.12,1.12,0,0,1-.076.122c-.022.031-.047.061-.072.092s-.076.087-.12.129c-.027.026-.056.052-.086.078-.054.047-.111.094-.174.141-.027.02-.056.04-.085.059-.075.052-.153.1-.238.153l-.07.04c-.1.055-.2.111-.312.164l-.044.02c-.124.058-.253.116-.392.171l-.012,0a12.806,12.806,0,0,1-2.828.717l-.017,0q-.326.048-.669.086l-.114.011c-.2.021-.4.04-.61.055-.1.007-.195.01-.292.016-.157.009-.312.019-.472.025-.262.008-.53.014-.8.014s-.541-.005-.8-.015c-.161-.006-.315-.016-.472-.025-.1-.006-.2-.009-.292-.016-.208-.015-.41-.034-.61-.055l-.114-.011q-.343-.038-.669-.086l-.017,0a12.806,12.806,0,0,1-2.828-.717l-.012,0c-.138-.055-.268-.113-.392-.171l-.044-.02c-.111-.054-.214-.108-.312-.164l-.07-.04c-.086-.05-.164-.1-.238-.153-.028-.02-.058-.039-.085-.059-.063-.047-.12-.093-.174-.141-.029-.026-.059-.052-.086-.078a1.724,1.724,0,0,1-.12-.129c-.026-.03-.051-.061-.072-.092a1.232,1.232,0,0,1-.076-.122,1.022,1.022,0,0,1-.047-.1.8.8,0,0,1-.038-.12.715.715,0,0,1-.026-.159.705.705,0,0,1,.01-.112.329.329,0,0,0-.01-.147V8.356l.03.025c.072.063.145.127.228.187,1.244.941,3.733,1.673,7.34,1.673,3.592,0,6.074-.725,7.324-1.661a3.363,3.363,0,0,0,.274-.224h0v2.453a.329.329,0,0,0-.01.147.668.668,0,0,1,.01.112A.714.714,0,0,1,18.331,11.227Zm.026-6.836V6.844a.329.329,0,0,0-.01.147.668.668,0,0,1,.01.112.714.714,0,0,1-.026.16.813.813,0,0,1-.038.12.949.949,0,0,1-.047.1,1.12,1.12,0,0,1-.076.122c-.022.031-.047.061-.072.092s-.076.087-.12.129c-.027.026-.056.052-.086.078-.054.047-.111.094-.174.141-.027.02-.056.04-.085.059-.075.052-.153.1-.238.153l-.07.04c-.1.055-.2.111-.312.164l-.044.02c-.124.058-.253.116-.392.171l-.012,0a12.806,12.806,0,0,1-2.828.717l-.017,0q-.326.048-.669.086l-.114.011c-.2.021-.4.04-.61.055-.1.007-.195.01-.292.016-.157.009-.312.019-.472.025-.262.008-.53.014-.8.014s-.541-.005-.8-.015c-.161-.006-.315-.016-.472-.025-.1-.006-.2-.009-.292-.016-.208-.015-.41-.034-.61-.055l-.114-.011q-.343-.038-.669-.086l-.017,0a12.806,12.806,0,0,1-2.828-.717l-.012,0c-.138-.055-.268-.113-.392-.171l-.044-.02c-.111-.054-.214-.108-.312-.164l-.07-.04c-.086-.05-.164-.1-.238-.153-.028-.02-.058-.039-.085-.059-.063-.047-.12-.093-.174-.141-.029-.026-.059-.052-.086-.078a1.724,1.724,0,0,1-.12-.129c-.026-.03-.051-.061-.072-.092a1.232,1.232,0,0,1-.076-.122,1.022,1.022,0,0,1-.047-.1.8.8,0,0,1-.038-.12A.715.715,0,0,1,3.161,7.1a.705.705,0,0,1,.01-.112.329.329,0,0,0-.01-.147V4.391c.04.036.085.071.128.107.024.02.046.04.071.059.1.078.206.155.322.23l.076.046q.146.091.308.178l.121.064q.181.092.38.179l.064.029c.155.066.319.129.491.189l.145.049q.2.069.423.132c.053.015.1.031.158.046.193.054.393.1.6.151l.089.018c.185.04.376.078.573.113l.2.034q.281.046.578.085l.151.02c.246.03.5.055.761.077l.2.014q.314.023.642.038l.24.01c.285.01.575.017.875.017s.591-.007.875-.017l.24-.01q.328-.015.642-.038l.2-.014c.261-.021.516-.047.761-.077l.151-.02q.3-.039.578-.085l.2-.034c.2-.035.388-.072.573-.113l.089-.018c.209-.047.409-.1.6-.151l.158-.046q.219-.064.423-.132l.145-.049c.171-.061.336-.124.491-.189l.064-.029q.2-.087.38-.179l.121-.064q.162-.087.308-.178l.076-.046c.116-.075.223-.152.322-.23l.071-.059C18.272,4.463,18.317,4.427,18.357,4.391ZM10.759.661c4.478,0,7.6,1.306,7.6,2.478s-3.12,2.478-7.6,2.478-7.6-1.306-7.6-2.478S6.281.661,10.759.661Zm7.6,14.437a.337.337,0,0,0-.011.045c-.187,1.143-3.281,2.366-7.588,2.366s-7.4-1.223-7.588-2.366a.36.36,0,0,0-.011-.043V12.32l.03.025c.072.063.145.127.228.187,1.244.941,3.733,1.673,7.34,1.673,3.592,0,6.074-.725,7.324-1.661a3.363,3.363,0,0,0,.274-.224h0Z"
        transform="translate(-2.251 0.249)"
    />
  </SVG>
);

export default withIconStyles(IconMetadata);
