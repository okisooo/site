(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_app_page_tsx_32efbb._.js", {

"[project]/src/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>Iridescence)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$core$2f$Renderer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/ogl/src/core/Renderer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$core$2f$Program$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/ogl/src/core/Program.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$core$2f$Mesh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/ogl/src/core/Mesh.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
function Iridescence({ color, speed, amplitude, mouseReact, ...rest }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const programRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null); // Hoist the program
    const rendererRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const animateIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Iridescence.useEffect": ()=>{
            if (!containerRef.current) return;
            const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$core$2f$Renderer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Renderer"]();
            rendererRef.current = renderer;
            const gl = renderer.gl;
            // Initialize your shaders here (vertexShader, fragmentShader)
            const vertexShader = `...`;
            const fragmentShader = `...`;
            const program = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$core$2f$Program$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Program"](gl, {
                vertex: vertexShader,
                fragment: fragmentShader,
                uniforms: {
                    uTime: {
                        value: 0
                    },
                    uColor: {
                        value: new window.Color(...color || [
                            1,
                            1,
                            1
                        ])
                    },
                    uResolution: {
                        value: new window.Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
                    },
                    uAmplitude: {
                        value: amplitude
                    },
                    uSpeed: {
                        value: speed
                    }
                }
            });
            programRef.current = program;
            // Create mesh, scene, etc.
            const mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$core$2f$Mesh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](gl, {});
            containerRef.current.appendChild(gl.canvas);
            function resize() {
                const scale = 1;
                const width = containerRef.current.offsetWidth * scale;
                const height = containerRef.current.offsetHeight * scale;
                renderer.setSize(width, height);
                if (programRef.current) {
                    programRef.current.uniforms.uResolution.value = new window.Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
                }
            }
            window.addEventListener("resize", resize);
            resize();
            function update(t) {
                animateIdRef.current = requestAnimationFrame(update);
                if (programRef.current) {
                    programRef.current.uniforms.uTime.value = t * 0.001;
                }
                renderer.render({
                    scene: mesh
                });
            }
            animateIdRef.current = requestAnimationFrame(update);
            function handleMouseMove(e) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = 1.0 - (e.clientY - rect.top) / rect.height;
                if (programRef.current) {
                    programRef.current.uniforms.uMouse.value[0] = x;
                    programRef.current.uniforms.uMouse.value[1] = y;
                }
            }
            if (mouseReact) containerRef.current.addEventListener("mousemove", handleMouseMove);
            return ({
                "Iridescence.useEffect": ()=>{
                    cancelAnimationFrame(animateIdRef.current);
                    window.removeEventListener("resize", resize);
                    if (mouseReact && containerRef.current) containerRef.current.removeEventListener("mousemove", handleMouseMove);
                    containerRef.current?.removeChild(gl.canvas);
                    gl.getExtension("WEBGL_lose_context")?.loseContext();
                }
            })["Iridescence.useEffect"];
        }
    }["Iridescence.useEffect"], [
        color,
        speed,
        amplitude,
        mouseReact
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        ...rest,
        className: "w-full h-full"
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 82,
        columnNumber: 10
    }, this);
}
_s(Iridescence, "nKuJATmh5vFUTvuZ6pbfydm4q8E=");
_c = Iridescence;
var _c;
__turbopack_refresh__.register(_c, "Iridescence");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_app_page_tsx_32efbb._.js.map