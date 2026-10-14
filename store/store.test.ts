import { makeStore } from "@/store/store";
import { setSidebarOpen, toggleSidebar } from "@/store/appSlice";

describe("store", () => {
  it("toggles sidebar", () => {
    const store = makeStore();
    expect(store.getState().app.sidebarOpen).toBe(true);
    store.dispatch(toggleSidebar());
    expect(store.getState().app.sidebarOpen).toBe(false);
    store.dispatch(setSidebarOpen(true));
    expect(store.getState().app.sidebarOpen).toBe(true);
  });
});
