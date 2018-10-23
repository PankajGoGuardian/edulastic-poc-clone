import React from 'react';
// import style from './sidebar.scss';
class User extends React.Component {
  render() {
    return (
      <div className="s-user">
        {/* <!-- Avatar --> */}
        <div className="s-user__avatar">
          <img
            src="pic/assignments/s-user-avatar.png"
            src="pic/assignments/s-user-avatar@2x.png 2x"
            alt="Zack Oliver"
          />
        </div>

        {/* <!-- Information --> */}
        <div className="s-user__info">
          {/* <!-- Title --> */}
          <div className="s-user__title">Zack Oliver</div>
          {/* <!-- Occupation --> */}
          <div className="s-user__occupation">Student</div>
        </div>

        {/* <!-- Arrow --> */}
        <svg className="s-user__arrow">
          {/* <use xlink:href="#icon-arrow-down"></use> */}
        </svg>
      </div>
    );
  }
}

export default User;
