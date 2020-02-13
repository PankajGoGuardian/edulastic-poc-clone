import React, { useState, useEffect } from "react";
import { get } from "lodash";
import { connect } from "react-redux";
import { Icon } from "antd";
import {
  CollectionTableContainer,
  PermissionsButton,
  StyledScollBar,
  StyledTable,
  BackArrowButton,
  StatusText
} from "../../styled";
import { themeColor } from "@edulastic/colors";
import { IconPencilEdit } from "@edulastic/icons";
import AddCollectionModal from "../Modals/AddCollectionModal";
import {
  fetchCollectionListRequestAction,
  getFetchCollectionListStateSelector,
  getCollectionListSelector
} from "../../ducks";
import { getUserRole, getUserOrgId } from "../../../src/selectors/user";
import { roleuser } from "@edulastic/constants";
import { isEqual } from "lodash";
import { caluculateOffset } from "../../util";

const CollectionsTable = ({
  selectedCollection,
  handlePermissionClick,
  fetchCollectionListRequest,
  fetchCollectionListState,
  collectionList,
  searchValue,
  userRole,
  userDistrictId
}) => {
  const [showAddCollectionModal, setAddCollectionModalVisibility] = useState(false);
  const [editCollectionData, setEditCollectionData] = useState(null);
  const [filteredCollectionList, setFilteredCollectionList] = useState([]);
  const [tableMaxHeight, setTableMaxHeight] = useState(200);
  const [collectionTableRef, setCollectionTableRef] = useState(null);

  useEffect(() => {
    fetchCollectionListRequest();
  }, []);

  useEffect(() => {
    if (collectionTableRef) {
      const offsetTopValue = caluculateOffset(collectionTableRef._container);
      const tableMaxHeight = window.innerHeight - offsetTopValue - 40;
      setTableMaxHeight(tableMaxHeight);
    }
  }, [collectionTableRef?._container?.offsetTop]);

  useEffect(() => {
    if (searchValue) {
      const filteredCollections = collectionList.filter(c => {
        const isPresent = c.name.search(new RegExp(searchValue, "i"));
        if (isPresent < 0) return false;
        return true;
      });
      setFilteredCollectionList(filteredCollections);
    }
  }, [searchValue, collectionList]);

  const getExtraColumns = () => {
    if (selectedCollection) {
      return [];
    }

    return [
      {
        title: "Items",
        dataIndex: "stats.items",
        key: "items",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => {
          const prev = get(a, "stats.items", "");
          const next = get(b, "stats.items", "");
          return prev - next;
        }
      },
      {
        title: "Test",
        dataIndex: "stats.test",
        key: "test",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => {
          const prev = get(a, "stats.test", "");
          const next = get(b, "stats.test", "");
          return prev - next;
        }
      },
      {
        title: "Playlists",
        dataIndex: "stats.playList",
        key: "playList",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => {
          const prev = get(a, "stats.playList", "");
          const next = get(b, "stats.playList", "");
          return prev - next;
        }
      }
    ];
  };

  const columns = [
    {
      title: "Collection Name",
      dataIndex: "name",
      key: "name",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "name", "");
        const next = get(b, "name", "");
        return next.localeCompare(prev);
      }
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "owner", "");
        const next = get(b, "owner", "");
        return next.localeCompare(prev);
      }
    },
    ...getExtraColumns(),
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: value => {
        if (value == 1) return <StatusText color="green">ACTIVE</StatusText>;
        if (value == 2) return <StatusText color="red">EXPIRED</StatusText>;
        return <StatusText color="red">DISABLE</StatusText>;
      }
    },
    {
      title: selectedCollection ? "" : "Permissions",
      key: "permissions",
      width: selectedCollection ? 20 : 150,
      align: "left",
      render: (_, record) =>
        selectedCollection ? (
          selectedCollection.bankId === record._id ? (
            <BackArrowButton onClick={() => handlePermissionClick(null)}>
              <Icon type="arrow-left" />
            </BackArrowButton>
          ) : null
        ) : (
          <>
            <PermissionsButton
              onClick={() =>
                handlePermissionClick({
                  itemBankName: record.name,
                  bankId: record._id,
                  buckets: record.buckets,
                  districtId: record.districtId
                })
              }
            >
              <span>Permissions</span>
            </PermissionsButton>
            {userRole !== roleuser.EDULASTIC_ADMIN && record.districtId === userDistrictId && (
              <span
                onClick={() => {
                  setEditCollectionData(record);
                  setAddCollectionModalVisibility(true);
                }}
                style={{ cursor: "pointer" }}
              >
                <IconPencilEdit color={themeColor} />
              </span>
            )}
          </>
        )
    }
  ];

  const handleCollectionModalResponse = () => {
    setAddCollectionModalVisibility(false);
    if (!!editCollectionData) setEditCollectionData(null);
  };

  return (
    <CollectionTableContainer isCollectionSelected={!!selectedCollection}>
      <StyledScollBar
        table="collectionTable"
        maxHeight={tableMaxHeight}
        option={{
          suppressScrollX: true
        }}
        ref={ref => {
          if (!isEqual(ref, collectionTableRef)) setCollectionTableRef(ref);
        }}
      >
        <StyledTable
          dataSource={searchValue ? filteredCollectionList : collectionList}
          columns={columns}
          pagination={false}
          loading={fetchCollectionListState}
        />
      </StyledScollBar>

      {showAddCollectionModal && (
        <AddCollectionModal
          visible={showAddCollectionModal}
          handleResponse={handleCollectionModalResponse}
          isEditCollection={!!editCollectionData}
          editCollectionData={editCollectionData}
          searchValue={searchValue}
        />
      )}
    </CollectionTableContainer>
  );
};

const CollectionsTableComponent = connect(
  state => ({
    fetchCollectionListState: getFetchCollectionListStateSelector(state),
    collectionList: getCollectionListSelector(state),
    userRole: getUserRole(state),
    userDistrictId: getUserOrgId(state)
  }),
  { fetchCollectionListRequest: fetchCollectionListRequestAction }
)(CollectionsTable);

export { CollectionsTableComponent as CollectionsTable };
