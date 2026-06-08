/* eslint-disable @typescript-eslint/no-unused-vars */
import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";

if (typeof global.Request === "undefined") {
  global.Request = class Request {
    constructor(_input: unknown, _init?: unknown) {}
  } as unknown as typeof Request;
}
if (typeof global.Response === "undefined") {
  global.Response = class Response {
    constructor(_body?: unknown, _init?: unknown) {}
  } as unknown as typeof Response;
}

expect.extend(toHaveNoViolations);
