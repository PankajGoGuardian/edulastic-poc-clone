import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Radio, Spin, Button, Row, Col, Select, message, Typography } from "antd";
import { debounce, get as _get } from "lodash";
import { withRouter } from "react-router-dom";

import { FlexContainer } from "@edulastic/common";
import { mainBlueColor, whiteSmoke, greenDark, fadedGrey, white } from "@edulastic/colors";
import { IconClose, IconShare } from "@edulastic/icons";
import { getUserFeatures } from "../../../../../student/Login/ducks";

import {
  getTestIdSelector,
  getUserListSelector,
  sendTestShareAction,
  receiveSharedWithListAction,
  deleteSharedUserAction
} from "../../../../TestPage/ducks";

import {
  getUsersListSelector,
  getFetchingSelector,
  fetchUsersListAction,
  updateUsersListAction
} from "../../../../sharedDucks/userDetails";

const { Paragraph } = Typography;

const permissions = {
  EDIT: "Can Edit, Add/Remove Items",
  VIEW: "Can View & Duplicate"
};

const permissionKeys = ["EDIT", "VIEW"];

const shareTypes = {
  PUBLIC: "Everyone",
  DISTRICT: "District",
  SCHOOL: "School",
  INDIVIDUAL: "Individuals"
};

const sharedKeysObj = {
  PUBLIC: "PUBLIC",
  DISTRICT: "DISTRICT",
  SCHOOL: "SCHOOL",
  INDIVIDUAL: "INDIVIDUAL"
};

const shareTypeKeys = ["PUBLIC", "DISTRICT", "SCHOOL", "INDIVIDUAL"];
class ShareModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharedType: sharedKeysObj.INDIVIDUAL,
      currentUser: {},
      permission: props.features["editPermissionOnTestSharing"] ? "EDIT" : "VIEW"
    };
    this.handleSearch = this.handleSearch.bind(this);

    this._permissionKeys = [];
    if (!props.features["editPermissionOnTestSharing"]) {
      this._permissionKeys = [permissionKeys[1]];
    } else {
      this._permissionKeys = permissionKeys;
    }
  }

  componentDidMount() {
    const { getSharedUsers, match, isPlaylist } = this.props;
    const testId = match.params.id;
    if (testId) getSharedUsers({ contentId: testId, contentType: isPlaylist ? "PLAYLIST" : "TEST" });
  }

  radioHandler = e => {
    this.setState({ sharedType: e.target.value });
    if (e.target.value !== sharedKeysObj.INDIVIDUAL) {
      this.setState({
        permission: "VIEW"
      });
    } else {
      this.setState({
        permission: "EDIT"
      });
    }
  };

  removeHandler = data => {
    const { deleteShared, testId, isPlaylist } = this.props;
    const { sharedId, _userId: sharedWith } = data;
    const contentType = isPlaylist ? "PLAYLIST" : "TEST";

    deleteShared({ contentId: testId, sharedId, sharedWith, contentType });
  };

  permissionHandler = value => {
    const { currentUser } = this.state;
    this.setState({ permission: value, currentUser: { ...currentUser, permission: value } });
  };

  searchUser = debounce(value => {
    const { sharedType } = this.state;
    const { getUsers } = this.props;
    const searchBody = {
      limit: 10,
      page: 1,
      type: sharedType,
      search: {
        role: "teacher",
        searchString: value
      }
    };
    getUsers(searchBody);
  }, 500);

  handleSearch(value) {
    const { updateShareList } = this.props;
    if (value.length > 1) {
      this.searchUser(value);
    } else {
      updateShareList({ data: [] });
    }
  }

  handleChange = value => {
    const { permission } = this.state;
    const [userName, email, _userId] = value.split("||");
    const newState = {
      userName,
      email,
      _userId,
      permission
    };
    this.setState({
      currentUser: newState
    });
  };

  handleShare = () => {
    const { currentUser, sharedType, permission } = this.state;
    const { shareTest, testId, sharedUsersList, isPlaylist } = this.props;
    const isExisting = sharedUsersList.some(item => item._userId === currentUser._userId);

    let person = {};
    if (sharedType === sharedKeysObj.INDIVIDUAL) {
      if (Object.keys(currentUser).length === 0) {
        message.error("Please select any user which are not in the shared list");
        return;
      } else if (isExisting) {
        message.error("This user has permission");
        return;
      } else {
        const { _userId, userName } = currentUser;
        person = { sharedWith: [{ _id: _userId, name: userName }] };
        this.setState({
          currentUser: {}
        });
      }
    } else {
      const isTypeExisting = sharedUsersList.some(item => item.userName === shareTypes[sharedType]);
      if (isTypeExisting) {
        message.error(`You have shared with ${shareTypes[sharedType]} try other option`);
        return;
      } else {
        this.setState({
          currentUser: {}
        });
      }
    }
    const data = {
      ...person,
      sharedType,
      permission,
      contentType: isPlaylist ? "PLAYLIST" : "TEST"
    };
    shareTest({ data, contentId: testId });
  };

  render() {
    const { sharedType, permission } = this.state;
    const {
      isVisible,
      onClose,
      userList = [],
      fetching,
      sharedUsersList,
      currentUserId,
      isPublished,
      testId,
      isPlaylist
    } = this.props;
    const filteredUserList = userList.filter(
      user => sharedUsersList.every(people => user._id !== people._userId) && user._id !== currentUserId
    );
    const sharableURL = `${window.location.origin}/author/${isPlaylist ? "playlists" : "tests"}/${testId}`;
    return (
      <Modal open={isVisible} onClose={onClose} center styles={{ modal: { borderRadius: 5 } }}>
        <ModalContainer>
          <h2 style={{ fontWeight: "bold", fontSize: 20 }}>Share with others</h2>
          <ShareBlock>
            <ShareLabel>Share</ShareLabel>
            <FlexContainer>
              <ShareTitle>{sharableURL}</ShareTitle>
              <CopyWrapper>
                <TitleCopy copyable={{ text: sharableURL }} />
                <span>COPY</span>
              </CopyWrapper>
            </FlexContainer>
            {sharedUsersList.length !== 0 && (
              <ShareList>
                {sharedUsersList.map((data, index) => (
                  <Row
                    key={index}
                    style={{
                      paddingBottom: 5,
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <Col span={12}>
                      {data.userName && data.userName !== "null" ? data.userName : ""}
                      {` ${data.email && data.email !== "null" ? `, ${data.email}` : ""}`}
                    </Col>
                    <Col span={11}>
                      <span>{data.permission === "EDIT" && "Can Edit, Add/Remove Items"}</span>
                      <span>{data.permission === "VIEW" && "Can View & Duplicate"}</span>
                    </Col>
                    <Col span={1}>
                      <a onClick={() => this.removeHandler(data)}>
                        <CloseIcon />
                      </a>
                    </Col>
                  </Row>
                ))}
              </ShareList>
            )}
          </ShareBlock>
          <PeopleBlock>
            <PeopleLabel>People</PeopleLabel>
            <RadioBtnWrapper>
              <Radio.Group value={sharedType} onChange={e => this.radioHandler(e)}>
                {shareTypeKeys.map(item => (
                  <Radio value={item} key={item} disabled={!isPublished && item !== shareTypeKeys[3]}>
                    {shareTypes[item]}
                  </Radio>
                ))}
              </Radio.Group>
            </RadioBtnWrapper>
            <FlexContainer style={{ marginTop: 5 }}>
              <Address
                showSearch
                placeholder={"Enter names or email addresses"}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                disabled={sharedType !== sharedKeysObj.INDIVIDUAL}
                notFoundContent={fetching ? <Spin size="small" /> : null}
              >
                {filteredUserList.map(item => (
                  <Select.Option
                    value={`${item._source.firstName}${"||"}${item._source.email}${"||"}${item._id}`}
                    key={item._id}
                  >
                    {item._source.firstName}
                    {", "}
                    {item._source.email}
                  </Select.Option>
                ))}
              </Address>
              <Select
                style={{ width: 650 }}
                onChange={this.permissionHandler}
                disabled={sharedType !== sharedKeysObj.INDIVIDUAL}
                value={permission}
              >
                {this._permissionKeys.map(item => {
                  return (
                    <Select.Option value={item} key={permissions[item]}>
                      {permissions[item]}
                    </Select.Option>
                  );
                })}
              </Select>
              <ShareButton type="primary" onClick={this.handleShare}>
                <IconShare color={white} /> SHARE
              </ShareButton>
            </FlexContainer>
          </PeopleBlock>
        </ModalContainer>
      </Modal>
    );
  }
}

ShareModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isPlaylist: PropTypes.bool,
  isPublished: PropTypes.bool,
  test: PropTypes.object
};

ShareModal.defaultProps = {
  isPlaylist: false,
  test: null
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      userList: getUsersListSelector(state),
      fetching: getFetchingSelector(state),
      sharedUsersList: getUserListSelector(state),
      currentUserId: _get(state, "user.user._id", ""),
      features: getUserFeatures(state)
    }),
    {
      getUsers: fetchUsersListAction,
      updateShareList: updateUsersListAction,
      shareTest: sendTestShareAction,
      getSharedUsers: receiveSharedWithListAction,
      deleteShared: deleteSharedUserAction
    }
  )
);

export default enhance(ShareModal);

const ModalContainer = styled.div`
  width: 100%;
  padding: 20px 30px;
  .anticon-down {
    svg {
      fill: ${mainBlueColor};
    }
  }
`;

const ShareBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  padding-bottom: 25px;
  border-bottom: 1px solid ${fadedGrey};
`;

const ShareLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
`;
const ShareTitle = styled.div`
  background-color: ${whiteSmoke};
  border-radius: 4px;
  display: flex;
  padding: 10px;
  border: 1px solid ${fadedGrey};
  width: 100%;
`;

const ShareList = styled.div`
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  max-height: 110px;
  overflow: auto;
  width: 88%;
  margin-top: 10px;
`;

const PeopleBlock = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;

  .ant-radio {
    margin-right: 5px;
  }
`;

const Address = styled(Select)`
  min-height: 35px;
  height: auto;
  width: 100%;
  ::placeholder {
    font-size: 13px;
    font-style: italic;
  }
`;

const ShareButton = styled(Button)`
  height: 35px;
  width: 160px;
  background: ${mainBlueColor};
  border: none;
  display: flex;
  align-items: center;
  span {
    font-size: 12px;
    font-weight: 600;
    margin-left: 30px;
  }
`;

const DoneButton = styled(Button)`
  width: 200px;
  background: ${mainBlueColor};
  border: none;
  height: 35px;
  span {
    font-size: 11px;
    font-weight: 600;
  }
`;
const RadioBtnWrapper = styled.div`
  font-weight: 600;
  margin: 10px 0px;
`;
const PeopleLabel = styled.span`
  font-size: 13;
  font-weight: 600;
`;
const CloseIcon = styled(IconClose)`
  width: 11px;
  height: 16px;
  margin-top: 4px;
  fill: ${greenDark};
`;

const CopyWrapper = styled.div`
  display: flex;
  color: ${mainBlueColor};
  font-weight: 600;
  align-items: center;
  font-size: 12px;
`;
const TitleCopy = styled(Paragraph)`
  &.ant-typography {
    margin: 0;
  }
  button {
    margin-right: 10px;
  }
  svg {
    width: 20px;
    height: 20px;
    color: ${mainBlueColor};
  }
`;
