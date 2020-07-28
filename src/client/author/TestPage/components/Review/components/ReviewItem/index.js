import React, { Fragment } from "react";
import MainInfo from "./MainInfo";
import MetaInfo from "./MetaInfo";
import Expanded from "./Expanded";

const ReviewItem = ({
  data,
  handlePreview,
  isEditable,
  owner,
  onChangePoints,
  onDelete,
  questions,
  passagesKeyed,
  expand,
  onSelect,
  selected,
  toggleExpandRow,
  rows,
  mobile,
  scoring
}) => (
  <Fragment>
    {expand && (
      <Expanded
        metaInfoData={data.meta}
        owner={owner}
        selected={selected}
        onSelect={onSelect}
        isEditable={isEditable}
        item={rows[data.key]}
        testItem={data.meta.item}
        points={data.main.points}
        onChangePoints={onChangePoints}
        onPreview={handlePreview}
        questions={questions}
        mobile={mobile}
        passagesKeyed={passagesKeyed}
        collapsRow={toggleExpandRow}
        onDelete={onDelete}
        isScoringDisabled={data.main.isScoringDisabled}
        scoring={scoring}
      />
    )}
    {!expand && (
      <MainInfo
        data={data.main}
        handlePreview={handlePreview}
        isEditable={isEditable}
        owner={owner}
        index={data.key}
        onDelete={onDelete}
        onChangePoints={onChangePoints}
        isScoringDisabled={data.main.isScoringDisabled}
        expandRow={toggleExpandRow}
      />
    )}
    <MetaInfo data={data.meta} />
  </Fragment>
);

export default ReviewItem;
