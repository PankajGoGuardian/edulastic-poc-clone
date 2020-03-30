import React from "react";
import flattenDeep from "lodash/flatMapDeep";
import uniq from "lodash/uniq";
import { FlexContainer, DragDrop, MathFormulaDisplay } from "@edulastic/common";
import { InnerTitle } from "../../../../../styled/InnerTitle";
import { DragItemCont, Choice } from "./styled";

const { DragItem } = DragDrop;

const DragDropValues = ({ choices }) => {
  const possibleChoices = uniq(flattenDeep(choices));
  return (
    <DragItemCont>
      <InnerTitle innerText="Drag Drop Values" />
      <FlexContainer justifyContent="flex-start" flexWrap="wrap">
        {possibleChoices.map(
          (choice, indx) =>
            choice && (
              <DragItem key={indx} data={choice}>
                <Choice>
                  <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: choice }} />
                </Choice>
              </DragItem>
            )
        )}
      </FlexContainer>
    </DragItemCont>
  );
};

export default DragDropValues;
