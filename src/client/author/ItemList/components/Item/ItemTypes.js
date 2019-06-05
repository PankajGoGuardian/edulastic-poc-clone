import React from "react";
import { Label, LabelText, Count } from "./styled";

const ItemTypes = ({ item }) => {
  const itemTypes = [];

  if (item.data && item.data.questions) {
    item.data.questions.map(({ type }) => {
      const index = itemTypes.findIndex(({ name }) => name === type);

      if (index >= 0) {
        itemTypes[index].count++;
      } else {
        itemTypes.push({
          name: type,
          count: 1
        });
      }

      return itemTypes;
    });
  }

  return itemTypes.map(({ name }, index) =>
    index + 1 <= 1 ? (
      <Label key={`TypeName_${name}_${index}`}>
        <LabelText>{name}</LabelText>
      </Label>
    ) : (
      index + 1 === itemTypes.length && <Count key={`Count_TypeName__${item._id}`}>+{itemTypes.length - 1}</Count>
    )
  );
};

export default ItemTypes;
