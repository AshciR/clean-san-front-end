// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import {server} from "./mocks/server";

jest.setTimeout(30000);

// Establish API mocking before all tests.
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())

/**
 * Util function to help convert enums into display values
 * @param word
 */
const convertToSentenceCase = (word: string) => {
  return word[0] + word.slice(1).toLowerCase();
}

export {convertToSentenceCase};
