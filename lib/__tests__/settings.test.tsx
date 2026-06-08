import { render, screen, fireEvent } from "@testing-library/react";
import SettingsPage from "../../app/dashboard/settings/page";

const mockSetDailyBudget = jest.fn();

jest.mock("../../lib/store", () => ({
  useStore: jest.fn(() => mockSetDailyBudget),
}));

jest.mock("lucide-react", () => ({
  Settings2: () => <span>Settings2</span>,
  Key: () => <span>Key</span>,
  Database: () => <span>Database</span>,
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn() },
}));

let localStorageStore: Record<string, string> = {};

beforeEach(() => {
  jest.clearAllMocks();
  localStorageStore = {};
  jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => localStorageStore[key] ?? null);
  jest.spyOn(Storage.prototype, "setItem").mockImplementation((key, value) => { localStorageStore[key] = value; });
});

describe("SettingsPage", () => {
  it("renders the header", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders daily budget input", () => {
    render(<SettingsPage />);
    const input = screen.getByDisplayValue("10");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "number");
  });

  it("renders API key input", () => {
    render(<SettingsPage />);
    expect(screen.getByPlaceholderText("AIzaSy...")).toBeInTheDocument();
  });

  it("renders save button", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Save Settings")).toBeInTheDocument();
  });

  it("saves budget to localStorage on submit", () => {
    render(<SettingsPage />);
    const budgetInput = screen.getByDisplayValue("10");
    fireEvent.change(budgetInput, { target: { value: "15" } });
    fireEvent.click(screen.getByText("Save Settings"));
    expect(localStorageStore["CARBON_BUDGET"]).toBe("15");
  });

  it("saves API key to localStorage on submit", () => {
    render(<SettingsPage />);
    const keyInput = screen.getByPlaceholderText("AIzaSy...");
    fireEvent.change(keyInput, { target: { value: "my-api-key" } });
    fireEvent.click(screen.getByText("Save Settings"));
    expect(localStorageStore["GEMINI_API_KEY"]).toBe("my-api-key");
  });

  it("calls setDailyBudget on submit", () => {
    render(<SettingsPage />);
    const budgetInput = screen.getByDisplayValue("10");
    fireEvent.change(budgetInput, { target: { value: "20" } });
    fireEvent.click(screen.getByText("Save Settings"));
    expect(mockSetDailyBudget).toHaveBeenCalledWith(20);
  });

  it("calls toast.success on successful save", () => {
    render(<SettingsPage />);
    fireEvent.click(screen.getByText("Save Settings"));
    const { toast } = jest.requireMock("sonner");
    expect(toast.success).toHaveBeenCalledWith("Settings saved successfully!");
  });

  it("does not call setDailyBudget for invalid budget", () => {
    render(<SettingsPage />);
    const budgetInput = screen.getByDisplayValue("10");
    fireEvent.change(budgetInput, { target: { value: "abc" } });
    fireEvent.click(screen.getByText("Save Settings"));
    expect(mockSetDailyBudget).not.toHaveBeenCalled();
  });
});
