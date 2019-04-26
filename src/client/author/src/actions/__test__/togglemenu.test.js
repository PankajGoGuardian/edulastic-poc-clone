import { desktopSideBar } from "../toggleMenu";

describe("Toggle Menu", () => {
  it("desktop sidebar should return an action", () => {
    expect(desktopSideBar()).toMatchSnapshot();
  });
});
