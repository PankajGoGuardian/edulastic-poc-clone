import React from "react";
import { SortableHandle } from "react-sortable-hoc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignJustify } from "@fortawesome/free-solid-svg-icons";

const DragHandle = React.memo(SortableHandle(() => <FontAwesomeIcon icon={faAlignJustify} />));

export default DragHandle;
