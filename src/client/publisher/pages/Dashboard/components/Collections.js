import React, { useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { CollectionItem } from "./CollectionItem";
import { StyledH3, StyledPrimaryGreenButton } from "./styled";
import { getCollectionsDataAction, getCollectionsDataSelector } from "../ducks";
import { getUser } from "../../../../author/src/selectors/user";
import { getCollectionsList } from "../utils";

const Collections = props => {
  const { className, getCollectionsData, user, collectionsData = {} } = props;

  useEffect(() => {
    getCollectionsData(user?.districtIds?.[0]);
  }, []);

  const { collections = [] } = collectionsData;
  const collectionsList = getCollectionsList(collections);

  return (
    <div className={className}>
      <div className="heading-bar">
        <StyledH3>Collection</StyledH3>
        <StyledPrimaryGreenButton type="primary">ADD NEW</StyledPrimaryGreenButton>
      </div>
      {collectionsList.map(collection => (
        <CollectionItem data={collection} />
      ))}
    </div>
  );
};

const StyledCollections = styled(Collections)`
  .heading-bar {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
  }
`;

const CollectionComponent = connect(
  state => ({ user: getUser(state), collectionsData: getCollectionsDataSelector(state) }),
  { getCollectionsData: getCollectionsDataAction }
)(StyledCollections);

export { CollectionComponent as Collections };
