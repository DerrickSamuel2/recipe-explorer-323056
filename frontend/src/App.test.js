import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders recipe explorer title", () => {
  render(<App />);
  const title = screen.getByText(/recipe explorer/i);
  expect(title).toBeInTheDocument();
});
