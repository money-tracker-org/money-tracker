type Expr = string
const constantExpressionRE = /^[\d\.]+$/
const containsOperatorRE = /[\+\-\*/]/

export class InvalidExpressionError extends Error {
    fullExpression: Expr
    offset: number

    constructor(msg: string) {
        super(msg)
    }
}

export const evaluateArithmeticExpressionSafe = (
    expression: Expr | undefined
) => {
    try {
        return evaluateArithmeticExpression(expression)
    } catch (e) {
        if (e instanceof InvalidExpressionError) {
            return undefined
        } else {
            throw e
        }
    }
}

export const evaluateArithmeticExpression = (expression: Expr | undefined) => {
    if (expression === undefined || expression === '') {
        return 0
    }
    const expressionWithoutWhitespace = expression
        .replace(/\s/g, '')
        .replace(',', '.')
    const rootNode = expressionToNode(expressionWithoutWhitespace)
    // console.log(`Parsed expression: ${rootNode.repr()}`)
    return rootNode.evaluate()
}

const expressionToNode: (partialExpr: Expr) => Node = (expr: Expr) => {
    if (constantExpressionRE.test(expr)) {
        return makeConstNode(expr)
    } else if (containsOperatorRE.test(expr)) {
        return makeOperatorNode(expr)
    } else {
        throw new InvalidExpressionError(`Invalid expression: "${expr}"`)
    }
}

interface Node {
    evaluate: () => number
    repr: () => string
}

type OpCode = '+' | '-' | '/' | '*'

class OperationNode implements Node {
    opcode: OpCode
    lhs: Node
    rhs: Node
    fullExpression: Expr

    constructor(opcode: OpCode, lhs: Node, rhs: Node, fullExpression: Expr) {
        this.opcode = opcode
        this.lhs = lhs
        this.rhs = rhs
        this.fullExpression = fullExpression
    }

    evaluate: () => number = () => {
        let retVal
        switch (this.opcode) {
            case '*':
                retVal = this.lhs.evaluate() * this.rhs.evaluate()
                break
            case '/':
                retVal = this.lhs.evaluate() / this.rhs.evaluate()
                break
            case '+':
                retVal = this.lhs.evaluate() + this.rhs.evaluate()
                break
            case '-':
                retVal = this.lhs.evaluate() - this.rhs.evaluate()
                break
            default:
                // should never happen
                throw new InvalidExpressionError(
                    `Invalid operator used in expression:"${this.opcode}"`
                )
        }
        return retVal
    }

    repr: () => string = () =>
        `(${this.lhs.repr()}${this.opcode}${this.rhs.repr()})`
}

const makeOperatorNode: (expr: Expr) => Node = (expr: Expr) => {
    // find last occurance of + or -
    const lastPlusMinusOpPos = lastIndexOf(expr, ['+', '-'])
    const lastMultiplyDevidePos = lastIndexOf(expr, ['*', '/'])
    const lastOperatorPos =
        lastPlusMinusOpPos >= 0 ? lastPlusMinusOpPos : lastMultiplyDevidePos
    if (lastOperatorPos > 0) {
        const opCode = expr[lastOperatorPos] as '+' | '-'
        const lhsExpr = expr.substring(0, lastOperatorPos)
        const lhs = expressionToNode(lhsExpr)
        const rhsExpr = expr.substring(lastOperatorPos + 1)
        const rhs = expressionToNode(rhsExpr)
        return new OperationNode(opCode, lhs, rhs, expr)
    }
    throw new InvalidExpressionError(`Invalid operation expression: "${expr}"`)
}

const lastIndexOf = (expr: Expr, operators: string[]) => {
    const indicies = operators.map((op) => expr.lastIndexOf(op))
    let maxOpPos = -1
    for (const opPos of indicies) {
        if (opPos >= 0 && opPos > maxOpPos) {
            maxOpPos = opPos
        }
    }
    return maxOpPos
}

const makeConstNode: (expr: Expr) => Node = (expr: Expr) => {
    if (expr === undefined) {
        return { evaluate: () => 0, repr: () => '0' }
    } else {
        return { evaluate: () => parseFloat(expr), repr: () => expr }
    }
}
