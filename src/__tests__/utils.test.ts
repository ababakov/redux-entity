import { isClass } from '../utils'


class Test {
  constructor() {}
}
function testFunction() {}

test('Is Class', () => {
  expect(isClass(Test)).toBe(true)
  expect(isClass(testFunction)).toBe(false)
})
