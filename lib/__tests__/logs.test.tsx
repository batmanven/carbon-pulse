import { render, screen, fireEvent } from "@testing-library/react";
import LogsPage from "../../app/dashboard/logs/page";

const mockClearActivities = jest.fn();

const baseState = {
  activities: [],
  clearActivities: mockClearActivities,
};

jest.mock("../../lib/store", () => ({
  useStore: jest.fn(() => baseState),
}));

jest.mock("lucide-react", () => ({
  Trash2: () => <span>Trash2</span>,
  FileText: () => <span>FileText</span>,
}));

jest.mock("date-fns", () => ({
  format: () => "Jun 8, 2026 12:00",
}));

const { useStore } = jest.requireMock("../../lib/store");

describe("LogsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as jest.Mock).mockReturnValue(baseState);
  });

  it("renders the header", () => {
    render(<LogsPage />);
    expect(screen.getByText("Track: Activity Logs & Carbon History")).toBeInTheDocument();
  });

  it("shows empty state when no activities", () => {
    render(<LogsPage />);
    expect(screen.getByText("No logs found")).toBeInTheDocument();
    expect(screen.getByText(/Head over to the Overview page/)).toBeInTheDocument();
  });

  it("does not show Clear Data button when no activities", () => {
    render(<LogsPage />);
    expect(screen.queryByText("Clear Data")).not.toBeInTheDocument();
  });

  it("renders table headers when activities exist", () => {
    (useStore as jest.Mock).mockReturnValue({
      ...baseState,
      activities: [
        { id: "1", category: "transport", subCategory: "car", amount: 10, unit: "km", co2e: 1.7, timestamp: "2026-06-08T12:00:00Z", equivalent: "= 212x phone", rawInput: "drove 10km" },
      ],
    });
    render(<LogsPage />);
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Raw Input")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("CO₂e (kg)")).toBeInTheDocument();
    expect(screen.getByText("Global Equivalent")).toBeInTheDocument();
  });

  it("renders activity data in table", () => {
    (useStore as jest.Mock).mockReturnValue({
      ...baseState,
      activities: [
        { id: "1", category: "transport", subCategory: "car", amount: 10, unit: "km", co2e: 1.7, timestamp: "2026-06-08T12:00:00Z", equivalent: "= 212x phone", rawInput: "drove 10km" },
      ],
    });
    render(<LogsPage />);
    expect(screen.getByText("transport › car")).toBeInTheDocument();
    expect(screen.getByText("drove 10km")).toBeInTheDocument();
    expect(screen.getByText("10 km")).toBeInTheDocument();
    expect(screen.getByText("1.70")).toBeInTheDocument();
    expect(screen.getByText("= 212x phone")).toBeInTheDocument();
  });

  it("shows Clear Data button when activities exist", () => {
    (useStore as jest.Mock).mockReturnValue({
      ...baseState,
      activities: [
        { id: "1", category: "transport", subCategory: "car", amount: 10, unit: "km", co2e: 1.7, timestamp: "2026-06-08T12:00:00Z", equivalent: "test", rawInput: "drove" },
      ],
    });
    render(<LogsPage />);
    expect(screen.getByText("Clear Data")).toBeInTheDocument();
  });

  it("calls clearActivities when Clear Data is clicked and confirmed", () => {
    window.confirm = jest.fn().mockReturnValue(true);
    (useStore as jest.Mock).mockReturnValue({
      ...baseState,
      activities: [
        { id: "1", category: "transport", subCategory: "car", amount: 10, unit: "km", co2e: 1.7, timestamp: "2026-06-08T12:00:00Z", equivalent: "test", rawInput: "drove" },
      ],
    });
    render(<LogsPage />);
    fireEvent.click(screen.getByText("Clear Data"));
    expect(mockClearActivities).toHaveBeenCalled();
  });

  it("displays formatted date from activity", () => {
    (useStore as jest.Mock).mockReturnValue({
      ...baseState,
      activities: [
        { id: "1", category: "transport", subCategory: "car", amount: 10, unit: "km", co2e: 1.7, timestamp: "2026-06-08T12:00:00Z", equivalent: "test", rawInput: "drove" },
      ],
    });
    render(<LogsPage />);
    expect(screen.getByText("Jun 8, 2026 12:00")).toBeInTheDocument();
  });

  it("shows 'Manual entry' when no rawInput", () => {
    (useStore as jest.Mock).mockReturnValue({
      ...baseState,
      activities: [
        { id: "1", category: "transport", subCategory: "car", amount: 10, unit: "km", co2e: 1.7, timestamp: "2026-06-08T12:00:00Z", equivalent: "test" },
      ],
    });
    render(<LogsPage />);
    expect(screen.getByText("Manual entry")).toBeInTheDocument();
  });
});
