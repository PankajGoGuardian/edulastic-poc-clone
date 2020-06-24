import { evaluatorTypes, questionType } from "@edulastic/constants";
import mainEvaluator from "./mainEvaluator";

const evaluator = mainEvaluator(evaluatorTypes.IS_EQUAL, questionType.ORDER_LIST);

export default evaluator;
