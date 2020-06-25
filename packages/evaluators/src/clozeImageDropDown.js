import { evaluatorTypes, questionType } from "@edulastic/constants";
import mainEvaluator from "./mainEvaluator";

const evaluator = mainEvaluator(evaluatorTypes.IS_EQUAL, questionType.CLOZE_IMAGE_DROP_DOWN);

export default evaluator;
