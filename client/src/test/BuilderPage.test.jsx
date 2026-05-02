import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "../context/AuthContext";
import { api } from "../lib/api";
import { BuilderPage } from "../pages/BuilderPage";

vi.mock("../lib/api", () => ({
  api: {
    getComponents: vi.fn(),
    getSavedBuilds: vi.fn(),
    saveBuild: vi.fn(),
    deleteBuild: vi.fn(),
    getPerformanceEstimate: vi.fn(),
    generateAutoBuild: vi.fn()
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

const mockComponentResponse = (type) => {
  const items = {
    cpu: [
      {
        _id: "cpu-1",
        name: "Ryzen 5 7600",
        type: "cpu",
        brand: "AMD",
        price: 229,
        priceInfo: { bestPrice: 19000, bestVendor: "Amazon", lastUpdated: new Date().toISOString() },
        specs: { socket: "AM5", tdp: 65, performanceRank: 7 },
        insight: { useCase: "Good for gaming.", pairing: "Pairs with mid-range GPUs.", warnings: [] }
      }
    ],
    motherboard: [
      {
        _id: "mb-1",
        name: "Z790 Edge",
        type: "motherboard",
        brand: "Gigabyte",
        price: 269,
        priceInfo: { bestPrice: 22000, bestVendor: "Amazon", lastUpdated: new Date().toISOString() },
        specs: { socket: "LGA1700", ramType: "DDR5", formFactor: "ATX" },
        insight: { useCase: "Great for current builds.", pairing: "Pairs with Intel CPUs.", warnings: [] }
      }
    ]
  };

  return {
    items: items[type] || [],
    brands: ["AMD", "Gigabyte"],
    total: (items[type] || []).length,
    totalPages: 1
  };
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          token: "token-123",
          user: { id: "1", name: "QA User" },
          isAuthenticated: true,
          login: vi.fn(),
          logout: vi.fn()
        }}
      >
        <BuilderPage />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe("BuilderPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    api.getComponents.mockReset();
    api.getSavedBuilds.mockReset();
    api.getPerformanceEstimate.mockResolvedValue({
      gamingScore: 7,
      productivityScore: 6,
      combinedScore: 7,
      label: "High",
      fps: []
    });
  });

  it("loads components, allows selection, and shows compatibility warnings", async () => {
    const user = userEvent.setup();

    api.getComponents.mockImplementation(async (query) => mockComponentResponse(query.type));
    api.getSavedBuilds.mockResolvedValue([]);

    renderPage();

    expect(await screen.findByText(/ryzen 5 7600/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /choose component/i }));

    await waitFor(() => expect(api.getComponents).toHaveBeenCalledWith(expect.objectContaining({ type: "motherboard" }), expect.anything()));
    expect(await screen.findByText(/z790 edge/i)).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: /choose component/i })[0]);

    expect(await screen.findByText(/cpu socket and motherboard socket do not match/i)).toBeInTheDocument();
  });

  it("redirects unauthenticated users to auth on save", async () => {
    const user = userEvent.setup();
    api.getComponents.mockResolvedValue({
      items: [
        {
          _id: "cpu-1",
          name: "Ryzen 5 7600",
          type: "cpu",
          brand: "AMD",
          price: 229,
          priceInfo: { bestPrice: 19000, bestVendor: "Amazon", lastUpdated: new Date().toISOString() },
          specs: { socket: "AM5", tdp: 65, performanceRank: 7 },
          insight: { useCase: "Good for gaming.", pairing: "Pairs with mid-range GPUs.", warnings: [] }
        }
      ],
      brands: ["AMD"],
      total: 1,
      totalPages: 1
    });
    api.getSavedBuilds.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            token: "",
            user: null,
            isAuthenticated: false,
            login: vi.fn(),
            logout: vi.fn()
          }}
        >
          <BuilderPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await user.click(await screen.findByRole("button", { name: /choose component/i }));
    const saveButton = await screen.findByRole("button", { name: /save & share build/i });
    await user.click(saveButton);

    expect(navigateMock).toHaveBeenCalledWith("/auth");
  });
});
