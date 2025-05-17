import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { configure } from '@testing-library/react';

// Configure testing-library
configure({ testIdAttribute: 'data-testid' });

// Configure Jest matchers
expect.extend({
  toHaveBeenCalledWith: (received, ...expected) => {
    const pass = jest.isMockFunction(received) && 
      received.mock.calls.some(call => 
        JSON.stringify(call) === JSON.stringify(expected)
      );
    return {
      pass,
      message: () => pass
        ? `expected ${received} not to have been called with ${expected}`
        : `expected ${received} to have been called with ${expected}`,
    };
  },
});

// Configure global mocks
window.alert = jest.fn();
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  })
) as jest.Mock;