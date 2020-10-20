import { isClass } from '../utils';

class Test {}

// eslint-disable-next-line
function testFunction() {}

test('Is Class', () => {
  expect(isClass(Test)).toBe(true);
  expect(isClass(testFunction)).toBe(false);
});
