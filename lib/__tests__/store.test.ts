import { useStore } from "../store";
import { calculateEmissions } from "../emissions";
import { Activity } from "../types";

describe("useStore", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any;
  beforeEach(() => {
    useStore.setState({
      activities: [],
      dailyFootprint: 0,
      budgetUsed: 0,
      recommendations: [],
      insight: null,
      isProcessing: false,
    });
    store = useStore.getState();
  });

  it("starts with an empty state", () => {
    expect(store.activities.length).toBe(0);
    expect(store.dailyFootprint).toBe(0);
  });

  it("adds an activity correctly", () => {
    const co2e = calculateEmissions("transport", "car", 10);
    const newActivity: Activity = {
      id: "1",
      category: "transport",
      subCategory: "car",
      amount: 10,
      unit: "km",
      co2e,
      rawInput: "Driving 10km",
      timestamp: "",
      equivalent: "",
    };
    store.addActivity(newActivity);

    const newState = useStore.getState();
    expect(newState.activities.length).toBe(1);
    expect(newState.activities[0].subCategory).toBe("car");
    expect(newState.dailyFootprint).toBe(10 * 0.17);
    const expectedBudget = Math.min(((10 * 0.17) / 10) * 100, 100);
    expect(newState.budgetUsed).toBe(expectedBudget);
  });

  it("appends new activities to the list", () => {
    store.addActivity({
      id: "1",
      category: "transport",
      subCategory: "car",
      amount: 10,
      unit: "km",
      co2e: 1.7,
      rawInput: "Drive 1",
    });
    store.addActivity({
      id: "2",
      category: "transport",
      subCategory: "car",
      amount: 20,
      unit: "km",
      co2e: 3.4,
      rawInput: "Drive 2",
    });

    const newState = useStore.getState();
    expect(newState.activities.length).toBe(2);
    expect(newState.activities[1].rawInput).toBe("Drive 2");
    expect(newState.dailyFootprint).toBe(1.7 + 3.4);
  });

  it("caps budgetUsed at 100", () => {
    store.addActivity({
      id: "1",
      category: "food",
      subCategory: "beef",
      amount: 100,
      unit: "kg",
      co2e: 2700,
      rawInput: "Eating cows",
    });
    const newState = useStore.getState();
    expect(newState.budgetUsed).toBe(100);
  });
});
