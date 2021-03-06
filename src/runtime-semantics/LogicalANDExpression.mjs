import { Evaluate_Expression } from '../evaluator.mjs';
import { GetValue, ToBoolean } from '../abstract-ops/all.mjs';
import { Value } from '../value.mjs';
import { Q } from '../completion.mjs';

// #sec-binary-logical-operators-runtime-semantics-evaluation
// LogicalANDExpression : LogicalANDExpression `&&` BitwiseORExpression
export function* Evaluate_LogicalANDExpression({
  left: LogicalANDExpression,
  right: BitwiseORExpression,
}) {
  const lref = yield* Evaluate_Expression(LogicalANDExpression);
  const lval = Q(GetValue(lref));
  const lbool = ToBoolean(lval);
  if (lbool === Value.false) {
    return lval;
  }
  const rref = yield* Evaluate_Expression(BitwiseORExpression);
  return Q(GetValue(rref));
}
