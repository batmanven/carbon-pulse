const fs = require('fs');
const path = require('path');

const mockReplacement = `let mockStoreState = baseState;

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
}));`;

const files = [
  'lib/__tests__/dashboard.test.tsx',
  'lib/__tests__/logs.test.tsx',
  'lib/__tests__/insights.test.tsx',
  'lib/__tests__/ActivityLog.test.tsx'
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the old jest.mock("../../lib/store"...) with the new one
  content = content.replace(/jest\.mock\("\.\.\/\.\.\/lib\/store", \(\) => \(\{\n\s+useStore: jest\.fn\(\(\) => baseState\),\n\}\)\);/, mockReplacement);
  content = content.replace(/jest\.mock\("\.\.\/\.\.\/lib\/store", \(\) => \(\{\n\s+useStore: \(\) => \(\{([^}]+)\}\),\n\}\)\);/m, function(match, inner) {
    // For ActivityLog.test.tsx which uses an inline object
    return `let mockStoreState = {${inner}};

jest.mock("../../lib/store", () => ({
  useActivities: () => mockStoreState.activities,
  useAddActivity: () => mockStoreState.addActivity,
  useSetRecommendations: () => mockStoreState.setRecommendations,
  useSetInsight: () => mockStoreState.setInsight,
  useSetIsProcessing: () => mockStoreState.setIsProcessing,
  useIsProcessing: () => mockStoreState.isProcessing,
  useRegion: () => mockStoreState.region,
  useDailyBudget: () => mockStoreState.dailyBudget,
}));`;
  });

  // Replace (useStore as jest.Mock).mockReturnValue(X) with mockStoreState = X
  content = content.replace(/\(useStore as jest\.Mock\)\.mockReturnValue\(([^)]+)\);/g, 'mockStoreState = $1;');
  
  // In ActivityLog, there's no useStore as jest.Mock but we might need to handle it.
  
  fs.writeFileSync(filePath, content);
}
