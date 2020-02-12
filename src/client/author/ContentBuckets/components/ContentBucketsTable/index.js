import React, { useState, useEffect, useMemo } from "react";
import { withTheme } from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, isEmpty, debounce } from "lodash";
import { Button } from "antd";
import { roleuser } from "@edulastic/constants";
import { StyledFilterDiv } from "../../../../admin/Common/StyledComponents";

import {
  MainContainer,
  TableContainer,
  SubHeaderWrapper,
  StyledContentBucketSearch,
  LeftFilterDiv,
  RightFilterDiv
} from "../../../../common/styled";

import { StyledContentBucketsTable, StyledIconCheck, StyledIconClose, StyledIconPencilEdit } from "./styled";

import CreateBucketModalForm from "./CreateBucketModal";

import { receiveBucketsAction, createBucketAction, updateBucketAction } from "../../ducks";
import { fetchCollectionListRequestAction, getCollectionListSelector } from "../../../ContentCollections/ducks";

import Breadcrumb from "../../../src/components/Breadcrumb";

import ContentSubHeader from "../../../src/components/common/AdminSubHeader/ContentSubHeader";
import { withNamespaces } from "@edulastic/localization";
const menuActive = { mainMenu: "Content", subMenu: "Buckets" };
const breadcrumbData = [
  {
    title: "MANAGE DISTRICT",
    to: "/author/districtprofile"
  },
  {
    title: "CONTENT",
    to: ""
  }
];

const ContentBucketsTable = ({
  loadBuckets,
  createBucket,
  updateBucket,
  buckets,
  history,
  theme,
  collections,
  fetchCollectionListRequest,
  user,
  t
}) => {
  const [upsertModalVisibility, setUpsertModalVisibility] = useState(false);
  const [editableBucketId, setEditableBucketId] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    loadBuckets();
  }, []);

  const onEditBucket = key => {
    setEditableBucketId(key);
    toggleCreateBucketModal();
  };

  const toggleCreateBucketModal = () => {
    if (!upsertModalVisibility) {
      fetchCollectionListRequest({
        pageNo: 1,
        recordsPerPage: 20,
        searchString: ""
      });
    } else {
      setEditableBucketId("");
    }
    setUpsertModalVisibility(!upsertModalVisibility);
  };

  const handleCreateBucket = data => {
    if (data._id) {
      data = { ...data, owner: editableBucket.owner };
      updateBucket(data);
    } else {
      data = { ...data, owner: [user.firstName, user.lastName].filter(n => n).join(" ") };
      createBucket(data);
    }
    toggleCreateBucketModal();
  };

  const handleSearchName = value => setSearchName(value.trim());
  const filteredBuckets = () => {
    if (!!searchName) {
      return buckets.filter(bucket => bucket.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    return buckets;
  };

  const onCollectionSearch = debounce(value => {
    if (value.trim().length >= 3)
      fetchCollectionListRequest({
        pageNo: 1,
        recordsPerPage: 20,
        searchString: value
      });
  }, 500);

  const columns = [
    {
      title: t("content.buckets.tableHeader.name"),
      dataIndex: "name",
      render: name => {
        return <span>{name === "Anonymous" || isEmpty(name) ? "-" : name}</span>;
      },
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "name", "");
        const next = get(b, "name", "");
        return next.localeCompare(prev);
      },
      className: "column-align-left",
      width: 300
    },
    {
      title: t("content.buckets.tableHeader.collectionName"),
      dataIndex: "collection.name",
      render: (collectionName, { _source }) => {
        return <span>{collectionName === "Anonymous" || isEmpty(collectionName) ? "-" : collectionName}</span>;
      },
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = `${get(a, "name", "")}${get(a, "name", "")}`;
        const next = `${get(b, "name", "")}${get(b, "name", "")}`;
        return next.localeCompare(prev);
      },
      className: "column-align-left"
    },
    {
      title: t("content.buckets.tableHeader.owner"),
      dataIndex: "owner",
      render: (owner = "-") => owner,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "owner", "");
        const next = get(b, "owner", "");
        return next.localeCompare(prev);
      },
      className: "column-align-left"
    },
    {
      title: t("content.buckets.tableHeader.cloneItem"),
      dataIndex: "canDuplicateItem",
      render: (cloneItem = false) =>
        cloneItem ? <StyledIconCheck color={theme.checkColor} /> : <StyledIconClose color={theme.closeColor} />,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "canDuplicateItem", false);
        const next = get(b, "canDuplicateItem", false);
        return next - prev;
      }
    },
    {
      title: t("content.buckets.tableHeader.cloneTest"),
      dataIndex: "canDuplicateTest",
      render: (cloneTest = false) =>
        cloneTest ? <StyledIconCheck color={theme.checkColor} /> : <StyledIconClose color={theme.closeColor} />,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "canDuplicateTest", false);
        const next = get(b, "canDuplicateTest", false);
        return next - prev;
      }
    },
    ,
    {
      title: t("content.buckets.tableHeader.clonePlaylist"),
      dataIndex: "canDuplicatePlayList",
      render: (clonePlaylist = false) =>
        clonePlaylist ? <StyledIconCheck color={theme.checkColor} /> : <StyledIconClose color={theme.closeColor} />,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "canDuplicatePlayList", false);
        const next = get(b, "canDuplicatePlayList", false);
        return next - prev;
      }
    },
    {
      title: t("content.buckets.tableHeader.itemVisibility"),
      dataIndex: "isItemVisible",
      render: (itemVisibility = false) =>
        itemVisibility ? <StyledIconCheck color={theme.checkColor} /> : <StyledIconClose color={theme.closeColor} />,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "isItemVisible", false);
        const next = get(b, "isItemVisible", false);
        return next - prev;
      }
    },
    {
      title: t("content.buckets.tableHeader.testVisibility"),
      dataIndex: "isTestVisible",
      render: (testVisibility = false) =>
        testVisibility ? <StyledIconCheck color={theme.checkColor} /> : <StyledIconClose color={theme.closeColor} />,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "isTestVisible", false);
        const next = get(b, "isTestVisible", false);
        return next > prev;
      }
    },
    {
      title: t("content.buckets.tableHeader.items"),
      dataIndex: "items",
      render: (items = 0) => items,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "items", "");
        const next = get(b, "items", "");
        return prev - next;
      }
    },
    {
      title: t("content.buckets.tableHeader.test"),
      dataIndex: "test",
      render: (test = 0) => test,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "test", "");
        const next = get(b, "test", "");
        return prev - next;
      }
    },
    {
      title: t("content.buckets.tableHeader.playlist"),
      dataIndex: "playlist",
      render: (playlist = 0) => playlist,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "playlist", "");
        const next = get(b, "playlist", "");
        return prev - next;
      }
    },
    {
      title: t("content.buckets.tableHeader.status"),
      dataIndex: "status",
      render: (status = "-") => (
        <span
          style={{
            color: status === 0 ? theme.closeColor : theme.checkColor,
            fontSize: "9px"
          }}
        >
          {status === 0 ? "Disable" : "Active"}
        </span>
      ),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "status", "");
        const next = get(b, "status", "");
        return next.localeCompare(prev);
      },
      className: "status-column"
    },
    {
      dataIndex: "_id",
      render: (id, record) => {
        if (record.collection.districtId === user.districtId || user.role === roleuser.EDULASTIC_ADMIN)
          return <StyledIconPencilEdit color={theme.themeColor} onClick={() => onEditBucket(id)} />;
        return null;
      }
    }
  ];

  const editableBucket = useMemo(() => buckets.find(bucket => bucket._id === editableBucketId), [
    buckets,
    editableBucketId
  ]);

  let filteredCollections = collections;
  if (editableBucket && !filteredCollections.find(fc => fc._id === editableBucket.collection._id)) {
    filteredCollections.push(editableBucket.collection);
  }

  return (
    <MainContainer>
      <SubHeaderWrapper>
        {user.role !== roleuser.EDULASTIC_ADMIN && <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} />}
      </SubHeaderWrapper>
      <ContentSubHeader active={menuActive} history={history} />

      <StyledFilterDiv
        style={{
          marginBottom: "20.7px",
          padding: "30px",
          boxShadow: "none"
        }}
      >
        <LeftFilterDiv width={89}>
          <StyledContentBucketSearch placeholder={t("common.searchbyname")} onSearch={handleSearchName} />
        </LeftFilterDiv>
        <RightFilterDiv width={12}>
          <Button
            type="primary"
            onClick={toggleCreateBucketModal}
            style={{
              width: "100%",
              textTransform: "uppercase",
              height: "40px",
              fontSize: "11px"
            }}
          >
            {t("content.buckets.createBuckets")}
          </Button>
        </RightFilterDiv>
      </StyledFilterDiv>
      <TableContainer style={{ boxShadow: "none" }}>
        <StyledContentBucketsTable
          rowKey={record => record._id}
          dataSource={filteredBuckets()}
          columns={columns}
          pagination={false}
        />
      </TableContainer>
      {upsertModalVisibility && (
        <CreateBucketModalForm
          t={t}
          closeModal={toggleCreateBucketModal}
          createBucket={handleCreateBucket}
          bucket={editableBucket || {}}
          collections={filteredCollections}
          onCollectionSearch={onCollectionSearch}
        />
      )}
    </MainContainer>
  );
};

const enhance = compose(
  withNamespaces("manageDistrict"),
  connect(
    state => ({
      buckets: get(state, ["bucketReducer", "data"], []),
      collections: getCollectionListSelector(state),
      user: get(state, ["user", "user"], {})
    }),
    {
      loadBuckets: receiveBucketsAction,
      createBucket: createBucketAction,
      updateBucket: updateBucketAction,
      fetchCollectionListRequest: fetchCollectionListRequestAction
    }
  )
);

export default enhance(withTheme(ContentBucketsTable));

ContentBucketsTable.propTypes = {
  loadBuckets: PropTypes.func.isRequired,
  createBucket: PropTypes.func.isRequired,
  updateBucket: PropTypes.func.isRequired,
  buckets: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired,
  theme: PropTypes.object,
  t: PropTypes.func.isRequired
};
