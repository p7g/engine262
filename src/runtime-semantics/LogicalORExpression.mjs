import { Evaluate_Expression } from '../evaluator.mjs';
import { GetValue, ToBoolean } from '../abstract-ops/all.mjs';
import { Value } from '../value.mjs';
import { Q } from '../completion.mjs';

// #sec-binary-logical-operators-runtime-semantics-evaluation
// LogicalORExpression : LogicalORExpression `||` LogicalANDExpression
export function* Evaluate_LogicalORExpression({
  left: LogicalORExpression,
  right: LogicalANDExpression,
}) {
  const lref = yield* Evaluate_Expression(LogicalORExpression);
  const lval = Q(GetValue(lref));
  const lbool = ToBoolean(lval);
  if (lbool === Value.true) {
    return lval;
  }
  const rref = yield* Evaluate_Expression(LogicalANDExpression);
  return Q(GetValue(rref));
}
