import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock("./components/Map", () => () => <div data-testid="mock-map">Mock Map</div>);
jest.mock("./components/PageTransition", () => ({ children }) => <div>{children}</div>);

test('renders app without crashing', () => {
  render(<App />);
  const titleElements = screen.getAllByText(/Deprem Risk Analizi/i);
  expect(titleElements.length).toBeGreaterThan(0);
});
