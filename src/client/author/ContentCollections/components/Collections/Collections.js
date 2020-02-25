import React, { useState } from "react";
import { connect } from "react-redux";
import { Icon } from "antd";
import ContentSubHeader from "../../../src/components/common/AdminSubHeader/ContentSubHeader";
import { CollectionsTable } from "./CollectionsTable";
import { PermissionsTable } from "./PermissionsTable";
import { MainContainer, SubHeaderWrapper } from "../../../../common/styled";
import { ImportButton, TablesWrapper , StyledSearch, AddCollectionButton, CollectionSearchHeader } from "../../styled";
import Breadcrumb from "../../../src/components/Breadcrumb";
import ImportContentModal from "../Modals/ImportContentModal";
import AddCollectionModal from "../Modals/AddCollectionModal";

import { getUser, getManageTabLabelSelector } from "../../../src/selectors/user";

const menuActive = { mainMenu: "Content", subMenu: "Collections" };

const Collections = ({ history, user, manageTabLabel }) => {
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
  const handleImportModalResponse = response => {
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
        <ImportButton onClick={() => setImportModalVisibility(true)}>
          <Icon type="upload" />
          Import Content
        </ImportButton>
      </SubHeaderWrapper>
      <ContentSubHeader active={menuActive} history={history} />
      <CollectionSearchHeader>
        <StyledSearch placeholder="Search by collection name" onChange={handleCollectionSeach} value={searchValue} />
        {user.role !== "edulastic-admin" && (
          <AddCollectionButton onClick={() => setAddCollectionModalVisibility(true)}>
            Add Collection
          </AddCollectionButton>
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
      <ImportContentModal visible={showImportModal} handleResponse={handleImportModalResponse} />
      {showAddCollectionModal && (
        <AddCollectionModal
          visible={showAddCollectionModal}
          handleResponse={() => setAddCollectionModalVisibility(false)}
          isEditCollection={false}
        />
      )}
    </MainContainer>
  );
};

export default connect(state => ({ user: getUser(state), manageTabLabel: getManageTabLabelSelector(state) }))(
  Collections
);
