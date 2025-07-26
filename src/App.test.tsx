import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple component to test the toBeInTheDocument matcher
const TestComponent = () => <div>Test Component</div>;

test('toBeInTheDocument matcher works correctly', () => {
  render(<TestComponent />);
  const element = screen.getByText('Test Component');
  expect(element).toBeInTheDocument();
});

// Additional test to verify jest-dom matchers are working
test('jest-dom matchers are properly configured', () => {
  render(<div data-testid="test-element">Hello World</div>);
  
  const element = screen.getByTestId('test-element');
  
  // Test various jest-dom matchers to confirm they're working
  expect(element).toBeInTheDocument();
  expect(element).toHaveTextContent('Hello World');
  expect(element).toBeVisible();
});
