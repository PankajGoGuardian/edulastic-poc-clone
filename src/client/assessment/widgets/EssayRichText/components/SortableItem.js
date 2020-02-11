import { greyThemeDark2, greyThemeDark1 } from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";
import { IconImage, IconTranslator } from "@edulastic/icons";
import React from "react";
import { FaBars } from "react-icons/fa";
import { SortableElement, SortableHandle } from "react-sortable-hoc";
import { withTheme } from "styled-components";
import { FlexCon } from "../styled/FlexCon";
import { QlBlocks } from "../styled/QlBlocks";

const DragHandle = withTheme(
  SortableHandle(({ theme }) => (
    <QlBlocks>
      <FlexContainer
        style={{
          fontSize: theme.widgets.essayRichText.dragHandleFontSize,
          color: theme.widgets.essayRichText.dragHandleColor
        }}
        justifyContent="center"
      >
        <FaBars color={greyThemeDark1} />
      </FlexContainer>
    </QlBlocks>
  ))
);

const SortableItem = SortableElement(({ item, i, handleActiveChange, validList, theme }) => {
  const { value, param, active } = item;

  return (
    <FlexCon childMarginRight={0} flexDirection="column">
      {value !== "|" ? (
        <QlBlocks
          active={active}
          onClick={e => {
            e.preventDefault();
            handleActiveChange(i);
          }}
          {...(validList.includes(value) ? { value: param } : {})}
          className={value === "image" ? "" : `ql-${value}`}
          type="button"
        >
          {value === "specialCharacters" && (
            <IconTranslator
              color={
                active ? theme.widgets.essayRichText.qlBlocksActiveColor : theme.widgets.essayRichText.qlBlocksColor
              }
            />
          )}
          {value === "image" && (
            <IconImage
              color={
                active ? theme.widgets.essayRichText.qlBlocksActiveColor : theme.widgets.essayRichText.qlBlocksColor
              }
            />
          )}
        </QlBlocks>
      ) : (
        <QlBlocks
          active={active}
          onClick={e => {
            e.preventDefault();
            handleActiveChange(i);
          }}
          {...(validList.includes(value) ? { value: param } : {})}
          className={`ql-${value}`}
          type="button"
        >
          <div>
            <b
              style={{
                fontSize: theme.widgets.essayRichText.sortableItemFontSize
              }}
            >
              {value}
            </b>
            DIV
          </div>
        </QlBlocks>
      )}

      <DragHandle />
    </FlexCon>
  );
});

export default withTheme(SortableItem);
