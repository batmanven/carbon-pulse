/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import InsightsPage from "../../app/dashboard/insights/page";

const baseState: any = {
  recommendations: [],
  insight: null,
  dailyFootprint: 0,
  budgetUsed: 0,
  isProcessing: false,
  dailyBudget: 10,
  region: "global",
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

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
  },
}));

jest.mock("lucide-react", () => ({
  Sparkles: () => <span>Sparkles</span>,
  PieChart: () => <span>PieChart</span>,
  Zap: () => <span>Zap</span>,
}));



describe("InsightsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoreState = baseState;
  });

  it("renders the header", () => {
    render(<InsightsPage />);
    expect(screen.getByText("Personalized Insights")).toBeInTheDocument();
  });

  it("shows log more activities message when no recommendations", () => {
    render(<InsightsPage />);
    expect(screen.getByText(/Log more activities on the Overview page/)).toBeInTheDocument();
  });

  it("shows start message when budget is 0", () => {
    render(<InsightsPage />);
    expect(screen.getByText(/Log an activity to get started/)).toBeInTheDocument();
  });

  it("displays recommendations when present", () => {
    mockStoreState = {
      ...baseState,
      recommendations: [
        { id: "r1", title: "Swap car for bus", description: "Take the bus instead", potentialSavings: 280, difficulty: "Easy" },
        { id: "r2", title: "Meatless Monday", description: "Skip beef once a week", potentialSavings: 150, difficulty: "Medium" },
      ],
    };
    render(<InsightsPage />);
    expect(screen.getByText("Swap car for bus")).toBeInTheDocument();
    expect(screen.getByText("Meatless Monday")).toBeInTheDocument();
    expect(screen.getByText("-280kg")).toBeInTheDocument();
    expect(screen.getByText("-150kg")).toBeInTheDocument();
  });

  it("shows processing skeleton when isProcessing", () => {
    mockStoreState = {
      ...baseState,
      isProcessing: true,
    };
    const { container } = render(<InsightsPage />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("displays budget bar with correct width", () => {
    mockStoreState = {
      ...baseState,
      dailyFootprint: 5,
      budgetUsed: 50,
    };
    render(<InsightsPage />);
    expect(screen.getByText("5.0 kg used")).toBeInTheDocument();
    expect(screen.getByText("10 kg budget")).toBeInTheDocument();
  });

  it("shows insight text when available", () => {
    mockStoreState = {
      ...baseState,
      insight: "You're in the top 15% of low-carbon commuters!",
      dailyFootprint: 3,
      budgetUsed: 30,
    };
    render(<InsightsPage />);
    expect(screen.getByText("You're in the top 15% of low-carbon commuters!")).toBeInTheDocument();
  });

  it("shows difficulty labels on recommendations", () => {
    mockStoreState = {
      ...baseState,
      recommendations: [
        { id: "r1", title: "Swap", description: "Desc", potentialSavings: 100, difficulty: "Easy" as const },
        { id: "r2", title: "Skip", description: "Desc", potentialSavings: 200, difficulty: "Hard" as const },
      ],
    };
    render(<InsightsPage />);
    expect(screen.getByText("Easy Effort")).toBeInTheDocument();
    expect(screen.getByText("Hard Effort")).toBeInTheDocument();
  });
});
