describe("Sample Test", () => {
  it("should test that true === true", () => {
    expect(true).toBe(true);
  });

  it("should check if a number is equal to itself", () => {
    expect(5).toBe(5);
  });

  it("should verify that an array contains a specific value", () => {
    const colors = ["red", "blue", "green"];
    expect(colors).toContain("blue");
  });
});
