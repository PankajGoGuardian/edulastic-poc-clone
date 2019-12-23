import React from "react";
import { greyDarken } from "@edulastic/colors";
import styled from "styled-components";
import { getAuthorCollectionMap } from "../../../../../src/client/author/dataUtils";

const CollectionTag = ({ collectionName }) =>
  getAuthorCollectionMap()[collectionName] ? (
    <HelperText>{getAuthorCollectionMap()[collectionName]?.displayName}</HelperText>
  ) : null;

export const HelperText = styled.p`
  color: ${greyDarken};
  font-weight: 700;
  font-size: 10px;
  text-transform: uppercase;
`;

export default CollectionTag;
