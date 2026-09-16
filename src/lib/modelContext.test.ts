import assert from "node:assert/strict";
import test from "node:test";
import { createModelContext } from "./modelContext";

test("model contexts reject software fallback without retrying and preserve accepted contexts", () => {
  const accepted = {} as WebGL2RenderingContext;
  for (const result of [null, accepted, new Error("WebGL unavailable")]) {
    let calls = 0;
    let requestedType: string | undefined;
    let requestedAttributes: WebGLContextAttributes | undefined;
    const canvas = {
      getContext(type: string, attributes: WebGLContextAttributes) {
        calls++;
        requestedType = type;
        requestedAttributes = attributes;
        if (result instanceof Error) throw result;
        return result;
      },
    } as unknown as HTMLCanvasElement;
    assert.equal(createModelContext(canvas), result instanceof Error ? null : result);
    assert.equal(requestedType, "webgl2");
    assert.equal(requestedAttributes?.failIfMajorPerformanceCaveat, true);
    assert.equal(requestedAttributes?.alpha, true);
    assert.equal(requestedAttributes?.antialias, true);
    assert.equal(calls, 1, "must not retry with an unrestricted software context");
  }
});
