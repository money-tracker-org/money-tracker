import { evaluateArithmeticExpression } from './arithmetic'

test('Undefined evaluates to 0', async () => {
    const value = evaluateArithmeticExpression(undefined)
    expect(value).toBe(0)
})

const generateRandomInt = () => {
    const exponent = Math.pow(10, Math.round(Math.random() * 10))
    return Math.round(Math.random() * exponent)
}

const generateRandomFloat = () => {
    return Math.random()
}

function* numberGenerator(n: number, factory: () => number) {
    for (let i = 0; i < n; i++) {
        yield factory()
    }
}

test('Expect integer parsed correctly', async () => {
    const gen = numberGenerator(100, generateRandomInt)
    let num = gen.next()
    while (!num.done) {
        const value = evaluateArithmeticExpression(num.value.toString(10))
        expect(value).toBe(num.value)
        num = gen.next()
    }
})

test('Expect float parsed correctly', async () => {
    const gen = numberGenerator(100, generateRandomFloat)
    let num = gen.next()
    while (!num.done) {
        const value = evaluateArithmeticExpression(num.value.toString(10))
        expect(value).toBe(num.value)
        num = gen.next()
    }
})

const testExpression = (expr: string, expected: number) => {
    const value = evaluateArithmeticExpression(expr)
    expect(value).toBeCloseTo(expected)
}

const testExpressionJs = (expr: string) => {
    const value = evaluateArithmeticExpression(expr)
    const expected = eval(expr)

    expect(value).toBeCloseTo(expected)
}

test('Test add and subtract', async () => {
    testExpression('1+1', 2)
    testExpression('1-1', 0)
    testExpression('1-5-1', -5)
    testExpression('1+1+1', 3)
    testExpression('5,1+1+1', 7.1)
    testExpression('5.1 +\n9-101', -86.9)
    testExpression('1.33-0.33+123', 124)
    testExpressionJs('0.2-0.2-0.5-0.2')
})

describe('random expression with additions and deletions', () => {
    for (let i = 0; i < 5; i++) {
        let expression = generateRandomFloat().toString()
        for (let i = 0; i < Math.random() * 100; i++) {
            const opCode = Math.random() > 0.5 ? '+' : '-'
            expression += `${opCode}${generateRandomFloat().toString()}`
        }
        it(expression, () => {
            testExpressionJs(expression)
        })
    }
})

test('Test multiply and devide', async () => {
    testExpression('1*1', 1)
    testExpression('2*2', 4)
    testExpression('2/2', 1)
    testExpression('2*2*2/2', 4)
    testExpressionJs('7* 9*13\n/5')
})

describe('random expression with multiplications and divisions', () => {
    for (let i = 0; i < 5; i++) {
        let expression = generateRandomFloat().toString()
        for (let i = 0; i < Math.random() * 100; i++) {
            const opCode = Math.random() > 0.5 ? '*' : '/'
            expression += `${opCode}${generateRandomFloat().toString()}`
        }
        it(expression, () => {
            testExpressionJs(expression)
        })
    }
})

describe('random expression with additions, subtractions, multiplications, divisions', () => {
    for (let i = 0; i < 5; i++) {
        let expression = generateRandomFloat().toString()
        for (let i = 0; i < Math.random() * 100; i++) {
            const addSub = Math.random() > 0.5 ? '+' : '-'
            const mulDiv = Math.random() > 0.5 ? '*' : '/'
            const opCode = Math.random() > 0.5 ? addSub : mulDiv
            expression += `${opCode}${generateRandomFloat().toString()}`
        }
        it(expression, () => {
            testExpressionJs(expression)
        })
    }
})

test('Test operation ordering', async () => {
    testExpression('1/4 + 2/4', 0.75)
    // I assume these to be common case: 2 beers and quarter pizza or such
    testExpression('2*3.9 + 18/4', 12.3)
})
