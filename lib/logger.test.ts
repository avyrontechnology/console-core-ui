import { logger } from "@/lib/logger";

describe("logger", () => {
  it("emits structured JSON without console noise in test env", () => {
    const info = jest.spyOn(console, "log").mockImplementation(() => undefined);
    const err = jest.spyOn(console, "error").mockImplementation(() => undefined);
    logger.info("hello", { a: 1 });
    logger.error("bad");
    expect(info).toHaveBeenCalledWith(JSON.stringify({ message: "hello", a: 1 }));
    expect(err).toHaveBeenCalledWith(JSON.stringify({ message: "bad" }));
    info.mockRestore();
    err.mockRestore();
  });

  it("debug is silent outside development", () => {
    const info = jest.spyOn(console, "log").mockImplementation(() => undefined);
    logger.debug("nope");
    expect(info).not.toHaveBeenCalled();
    info.mockRestore();
  });
});
