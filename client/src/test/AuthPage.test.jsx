import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import { api } from "../lib/api";
import { AuthPage } from "../pages/AuthPage";

vi.mock("../lib/api", () => ({
  api: {
    register: vi.fn(),
    login: vi.fn(),
    forgotPassword: vi.fn()
  }
}));

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock
  };
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    </MemoryRouter>
  );

describe("AuthPage", () => {
  it("switches to register mode and submits a valid registration", async () => {
    const user = userEvent.setup();
    api.register.mockResolvedValue({
      token: "token-123",
      user: { id: "1", name: "QA Tester", email: "qa@example.com" }
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthPage initialMode="register" />
        </AuthProvider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/name/i), "QA Tester");
    await user.type(screen.getByLabelText(/email/i), "qa@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /^register$/i }));

    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith({
        name: "QA Tester",
        email: "qa@example.com",
        password: "secret123"
      });
      expect(navigateMock).toHaveBeenCalledWith("/builder");
    });
  });

  it("shows validation feedback for short passwords", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/email/i), "qa@example.com");
    await user.type(screen.getByLabelText(/password/i), "123");
    await user.click(screen.getByRole("button", { name: /^login$/i }));

    expect(await screen.findByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
  });
});
