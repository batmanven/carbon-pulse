/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, act } from "@testing-library/react";
import Dashboard from "../../app/dashboard/page";

const mockLoadSampleData = jest.fn();
const mockToggleChallenge = jest.fn();

const baseState: any = {
  activities: [] as any[],
  dailyFootprint: 0,
  budgetUsed: 0,
  dailyBudget: 10,
  region: "global",
  weeklyTrend: [],
  recommendations: [],
  challenges: [
    {
      id: "c1",
      title: "Meatless Monday",
      description: "Skip meat",
      active: false,
      streak: 0,
      completed: false,
    },
    {
      id: "c2",
      title: "Bike to Work",
      description: "Use a bike",
      active: false,
      streak: 0,
      completed: false,
    },
  ],
  insight: null,
  isProcessing: false,
  loadSampleData: mockLoadSampleData,
  toggleChallenge: mockToggleChallenge,
};

const stateWithActivities = {
  ...baseState,
  activities: [
    {
      id: "1",
      category: "transport",
      subCategory: "car",
      amount: 10,
      unit: "km",
      co2e: 1.7,
      timestamp: new Date().toISOString(),
      equivalent: "= 212x phone",
      rawInput: "drove",
    },
  ],
  dailyFootprint: 1.7,
  budgetUsed: 17,
  weeklyTrend: [{ date: "Mon", value: 1.7 }],
};

let mockStoreState = baseState;

jest.mock("../../lib/store", () => ({
  useStore: jest.fn(() => mockStoreState),
  useActivities: () => mockStoreState.activities,
  useDailyFootprint: () => mockStoreState.dailyFootprint,
  useBudgetUsed: () => mockStoreState.budgetUsed,
  useDailyBudget: () => mockStoreState.dailyBudget,
  useWeeklyTrend: () => mockStoreState.weeklyTrend,
  useRecommendations: () => mockStoreState.recommendations,
  useChallenges: () => mockStoreState.challenges,
  useInsight: () => mockStoreState.insight,
  useLoadSampleData: () => mockStoreState.loadSampleData,
  useToggleChallenge: () => mockStoreState.toggleChallenge,
  useAddActivity: () => mockStoreState.addActivity,
  useSetRecommendations: () => mockStoreState.setRecommendations,
  useSetInsight: () => mockStoreState.setInsight,
  useSetIsProcessing: () => mockStoreState.setIsProcessing,
  useIsProcessing: () => mockStoreState.isProcessing,
  useRegion: () => mockStoreState.region,
  useClearActivities: () => mockStoreState.clearActivities,
}));

jest.mock("next/dynamic", () => {
  const Mock = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dynamic-chart">{children}</div>
  );
  Mock.displayName = "DynamicMock";
  return () => Mock;
});

jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    button: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <button {...props}>{children}</button>
    ),
  },
}));

jest.mock("../../components/ActivityLog", () => ({
  ActivityLog: () => <div data-testid="activity-log">ActivityLog</div>,
}));

jest.mock("lucide-react", () => ({
  Leaf: () => <span>Leaf</span>,
  Zap: () => <span>Zap</span>,
  Map: () => <span>Map</span>,
  Database: () => <span>Database</span>,
  Target: () => <span>Target</span>,
  TrendingDown: () => <span>TrendingDown</span>,
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  mockStoreState = baseState;
});

afterEach(() => {
  jest.useRealTimers();
});

function renderDashboard() {
  const view = render(<Dashboard />);
  act(() => {
    jest.advanceTimersByTime(10);
  });
  return view;
}

describe("Dashboard", () => {
  it("renders the header", () => {
    renderDashboard();
    expect(
      screen.getByText("Track, Understand, and Reduce Your Carbon Footprint"),
    ).toBeInTheDocument();
  });

  it("shows empty state when no activities", () => {
    renderDashboard();
    expect(screen.getByText("No activities logged yet")).toBeInTheDocument();
    expect(screen.getByText("Load Demo Data")).toBeInTheDocument();
  });

  it("calls loadSampleData when Load Demo Data is clicked", () => {
    renderDashboard();
    fireEvent.click(screen.getByText("Load Demo Data"));
    expect(mockLoadSampleData).toHaveBeenCalled();
  });

  it("renders daily footprint card when activities exist", () => {
    mockStoreState = stateWithActivities;
    renderDashboard();
    expect(screen.getByText("1.7")).toBeInTheDocument();
    expect(screen.getByText(/kg CO₂e/)).toBeInTheDocument();
    expect(screen.getByText(/17% of/)).toBeInTheDocument();
    expect(screen.getByText(/8.3 kg remaining today/)).toBeInTheDocument();
  });

  it("renders challenges section when activities exist", () => {
    mockStoreState = stateWithActivities;
    renderDashboard();
    expect(screen.getByText("Meatless Monday")).toBeInTheDocument();
    expect(screen.getByText("Bike to Work")).toBeInTheDocument();
  });

  it("toggles challenge on click", () => {
    mockStoreState = stateWithActivities;
    renderDashboard();
    const buttons = screen.getAllByText("Start");
    fireEvent.click(buttons[0]);
    expect(mockToggleChallenge).toHaveBeenCalled();
  });

  it("shows over budget message when over limit", () => {
    mockStoreState = {
      ...stateWithActivities,
      activities: [
        {
          id: "1",
          category: "transport",
          subCategory: "car",
          amount: 100,
          unit: "km",
          co2e: 17,
          timestamp: new Date().toISOString(),
          equivalent: "test",
          rawInput: "drove",
        },
      ],
      dailyFootprint: 17,
      budgetUsed: 100,
    };
    renderDashboard();
    expect(screen.getByText(/Over budget by/)).toBeInTheDocument();
  });

  it("shows activity log component", () => {
    renderDashboard();
    expect(screen.getByTestId("activity-log")).toBeInTheDocument();
  });
});
