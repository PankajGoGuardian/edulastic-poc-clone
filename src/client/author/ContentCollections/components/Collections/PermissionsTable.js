import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Tabs, Icon } from "antd";
import { get } from "lodash";
import moment from "moment";
import { themeColor } from "@edulastic/colors";
import { IconPencilEdit } from "@edulastic/icons";
import { ContentBucketTable } from "./ContentBucketsTable";
import {
  PermissionTableContainer,
  HeadingContainer,
  TableHeading,
  StyledSearch,
  AddPermissionButton,
  StyledTab,
  StyledTable,
  StyledScollBar,
  StatusText,
  DeletePermissionButton
} from "../../styled";
import AddPermissionModal from "../Modals/AddPermissionModal";
import {
  getFetchPermissionsStateSelector,
  getPermissionsSelector,
  addPermissionRequestAction,
  fetchPermissionsRequestAction,
  editPermissionRequestAction,
  deletePermissionRequestAction
} from "../../ducks";

const { TabPane } = Tabs;

const PermissionsTable = ({
  selectedCollection,
  isFetchingPermissions,
  permissions,
  fetchPermissionsRequest,
  addPermissionRequest,
  editPermissionRequest,
  deletePermissionRequest
}) => {
  const [showPermissionModal, setPermissionModalVisibility] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [searchPermissionValue, setPermissionSearchValue] = useState("");
  const [filteredPermissionList, setFilteredPermissionList] = useState([]);

  useEffect(() => {
    fetchPermissionsRequest(selectedCollection.bankId);
  }, [selectedCollection]);

  const columns = [
    {
      title: "Organization",
      dataIndex: "orgName",
      key: "orgName",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "orgName", "");
        const next = get(b, "orgName", "");
        return next.localeCompare(prev);
      }
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_, record) => record.role.join(" / ")
    },
    {
      title: "Start",
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
      render: value => (value && moment(value).format("Do MMM, YYYY")) || "-"
    },
    {
      title: "End",
      dataIndex: "endDate",
      key: "endDate",
      align: "center",
      render: value => (value && moment(value).format("Do MMM, YYYY")) || "-"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value, record) => {
        if (record?.endDate <= moment().valueOf()) return <StatusText color="red">Expired</StatusText>;
        if (value) return <StatusText color="green">Active</StatusText>;
        return <StatusText color="red">Revoked</StatusText>;
      }
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => {
        return (
          <div>
            <span style={{ cursor: "pointer" }} onClick={() => handleEditPermission(record)}>
              <IconPencilEdit color={themeColor} />
            </span>
            <DeletePermissionButton onClick={() => handleDeactivatePermission(record._id)}>
              <i class="fa fa-trash-o" aria-hidden="true" />
            </DeletePermissionButton>
          </div>
        );
      }
    }
  ];

  const handleEditPermission = permission => {
    setSelectedPermission(permission);
    setPermissionModalVisibility(true);
  };

  const handleDeactivatePermission = id => {
    deletePermissionRequest({ bankId: selectedCollection.bankId, id });
  };

  const handlePermissionModalResponse = response => {
    setPermissionModalVisibility(false);
    if (response) {
      const data = { bankId: selectedCollection.bankId, data: response };
      if (selectedPermission) {
        editPermissionRequest({ ...data, id: selectedPermission._id });
      } else {
        addPermissionRequest(data);
      }
    }
    setSelectedPermission(null);
  };

  const handlePermissionSearch = e => {
    const searchString = e.target.value;
    setPermissionSearchValue(searchString);
    if (searchString) {
      const filteredPermissions = permissions.filter(c => {
        const isPresent = c.orgName.search(new RegExp(searchString, "i"));
        if (isPresent < 0) return false;
        return true;
      });
      setFilteredPermissionList(filteredPermissions);
    }
  };

  return (
    <PermissionTableContainer>
      <StyledTab defaultActiveKey="1">
        <TabPane tab="PERMISSIONS" key="1">
          <HeadingContainer className="heading-container">
            <div>
              <TableHeading>Permissions</TableHeading>
            </div>
            <div>
              <StyledSearch placeholder="Search for an organization" onChange={handlePermissionSearch} />
            </div>
            <div>
              <AddPermissionButton onClick={() => setPermissionModalVisibility(true)}>
                Add Permission
              </AddPermissionButton>
            </div>
          </HeadingContainer>
          <StyledScollBar table="permissionTable">
            <StyledTable
              loading={isFetchingPermissions}
              dataSource={searchPermissionValue ? filteredPermissionList : permissions}
              columns={columns}
              pagination={false}
            />
          </StyledScollBar>
        </TabPane>
        <TabPane tab="CONTENT BUCKETS" key="2">
          <HeadingContainer>
            <div>
              <TableHeading>Content Buckets</TableHeading>
            </div>
          </HeadingContainer>
          <ContentBucketTable buckets={selectedCollection.buckets} />
        </TabPane>
      </StyledTab>
      {showPermissionModal && (
        <AddPermissionModal
          visible={showPermissionModal}
          handleResponse={handlePermissionModalResponse}
          itemBankName={selectedCollection.itemBankName}
          selectedPermission={selectedPermission}
          isEditPermission={!!selectedPermission}
        />
      )}
    </PermissionTableContainer>
  );
};
const PermissionsTableComponent = connect(
  state => ({
    isFetchingPermissions: getFetchPermissionsStateSelector(state),
    permissions: getPermissionsSelector(state)
  }),
  {
    fetchPermissionsRequest: fetchPermissionsRequestAction,
    addPermissionRequest: addPermissionRequestAction,
    editPermissionRequest: editPermissionRequestAction,
    deletePermissionRequest: deletePermissionRequestAction
  }
)(PermissionsTable);
export { PermissionsTableComponent as PermissionsTable };
