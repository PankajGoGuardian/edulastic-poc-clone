import React, { useState } from "react";
import { connect } from "react-redux";
import { Icon, Spin } from "antd";
import { EduButton, SearchInputStyled } from "@edulastic/common";
import ContentSubHeader from "../../../src/components/common/AdminSubHeader/ContentSubHeader";
import { CollectionsTable } from "./CollectionsTable";
import { PermissionsTable } from "./PermissionsTable";
import { MainContainer, SubHeaderWrapper } from "../../../../common/styled";
import { TablesWrapper, CollectionSearchHeader } from "../../styled";
import Breadcrumb from "../../../src/components/Breadcrumb";
import ImportContentModal from "../Modals/ImportContentModal";
import AddCollectionModal from "../Modals/AddCollectionModal";

import { getUser, getManageTabLabelSelector } from "../../../src/selectors/user";
import { importingLoaderSelector, importTestToCollectionRequestAction } from "../../ducks";

const menuActive = { mainMenu: "Content", subMenu: "Collections" };

const Collections = ({ history, user, manageTabLabel, importDataToCollection, importLoader }) => {
  const [selectedCollection, setCollection] = useState(null);
  const [showImportModal, setImportModalVisibility] = useState(false);
  const [showAddCollectionModal, setAddCollectionModalVisibility] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const breadcrumbData = [
    {
      title: manageTabLabel.toUpperCase(),
      to: "/author/districtprofile"
    },
    {
      title: "CONTENT",
      to: ""
    }
  ];
  const handleImportModalResponse = data => {
    importDataToCollection(data);
    setImportModalVisibility(false);
  };

  const closeModel = () => {
    setImportModalVisibility(false);
  };

  const handleCollectionSeach = e => {
    setSearchValue(e.target.value);
    setCollection(null);
  };

  return (
    <MainContainer>
      <SubHeaderWrapper>
        {user.role !== "edulastic-admin" && <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} />}
        <EduButton height="30px" onClick={() => setImportModalVisibility(true)}>
          <Icon type="upload" />
          Import Content
        </EduButton>
      </SubHeaderWrapper>
      <ContentSubHeader active={menuActive} history={history} />
      <CollectionSearchHeader>
        <SearchInputStyled
          height="36px"
          placeholder="Search by collection name"
          onChange={handleCollectionSeach}
          value={searchValue}
        />
        {user.role !== "edulastic-admin" && (
          <EduButton onClick={() => setAddCollectionModalVisibility(true)}>
            Add Collection
          </EduButton>
        )}
      </CollectionSearchHeader>
      <TablesWrapper>
        <CollectionsTable
          handlePermissionClick={data => setCollection(data)}
          selectedCollection={selectedCollection}
          searchValue={searchValue}
        />
        {!!selectedCollection && <PermissionsTable selectedCollection={selectedCollection} />}
      </TablesWrapper>
      <ImportContentModal
        visible={showImportModal}
        handleResponse={handleImportModalResponse}
        closeModel={closeModel}
      />
      {showAddCollectionModal && (
        <AddCollectionModal
          visible={showAddCollectionModal}
          handleResponse={() => setAddCollectionModalVisibility(false)}
          isEditCollection={false}
        />
      )}
      {importLoader && <Spin size="small" />}
    </MainContainer>
  );
};

export default connect(
  state => ({
    user: getUser(state),
    manageTabLabel: getManageTabLabelSelector(state),
    importLoader: importingLoaderSelector(state)
  }),
  {
    importDataToCollection: importTestToCollectionRequestAction
  }
)(Collections);
