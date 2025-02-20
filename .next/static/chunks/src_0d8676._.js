(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_0d8676._.js", {

"[project]/src/TextAnimations/ASCIIText/ASCIIText.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/*
	jsrepo 1.38.0
	Installed from https://reactbits.dev/ts/tailwind/
	2-19-2025
*/ __turbopack_esm__({
    "default": (()=>ASCIIText)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
;
;
const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
    vUv = uv;
    float time = uTime * 5.;

    float waveFactor = uEnableWaves;

    vec3 transformed = position;

    transformed.x += sin(time + position.y) * 0.5 * waveFactor;
    transformed.y += cos(time + position.z) * 0.15 * waveFactor;
    transformed.z += sin(time + position.x) * waveFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;
const fragmentShader = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;
    
    float move = sin(time + mouse) * 0.01;
    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`;
function map(n, start, stop, start2, stop2) {
    return (n - start) / (stop - start) * (stop2 - start2) + start2;
}
const PX_RATIO = ("TURBOPACK compile-time truthy", 1) ? window.devicePixelRatio : ("TURBOPACK unreachable", undefined);
class AsciiFilter {
    renderer;
    domElement;
    pre;
    canvas;
    context;
    deg;
    invert;
    fontSize;
    fontFamily;
    charset;
    width = 0;
    height = 0;
    center = {
        x: 0,
        y: 0
    };
    mouse = {
        x: 0,
        y: 0
    };
    cols = 0;
    rows = 0;
    constructor(renderer, { fontSize, fontFamily, charset, invert } = {}){
        this.renderer = renderer;
        this.domElement = document.createElement("div");
        this.domElement.style.position = "absolute";
        this.domElement.style.top = "0";
        this.domElement.style.left = "0";
        this.domElement.style.width = "100%";
        this.domElement.style.height = "100%";
        this.pre = document.createElement("pre");
        this.domElement.appendChild(this.pre);
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.domElement.appendChild(this.canvas);
        this.deg = 0;
        this.invert = invert ?? true;
        this.fontSize = fontSize ?? 12;
        this.fontFamily = fontFamily ?? "'Courier New', monospace";
        this.charset = charset ?? " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
        if (this.context) {
            this.context.imageSmoothingEnabled = false;
            this.context.imageSmoothingEnabled = false;
        }
        this.onMouseMove = this.onMouseMove.bind(this);
        document.addEventListener("mousemove", this.onMouseMove);
    }
    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.renderer.setSize(width, height);
        this.reset();
        this.center = {
            x: width / 2,
            y: height / 2
        };
        this.mouse = {
            x: this.center.x,
            y: this.center.y
        };
    }
    reset() {
        if (this.context) {
            this.context.font = `${this.fontSize}px ${this.fontFamily}`;
            const charWidth = this.context.measureText("A").width;
            this.cols = Math.floor(this.width / (this.fontSize * (charWidth / this.fontSize)));
            this.rows = Math.floor(this.height / this.fontSize);
            this.canvas.width = this.cols;
            this.canvas.height = this.rows;
            this.pre.style.fontFamily = this.fontFamily;
            this.pre.style.fontSize = `${this.fontSize}px`;
            this.pre.style.margin = "0";
            this.pre.style.padding = "0";
            this.pre.style.lineHeight = "1em";
            this.pre.style.position = "absolute";
            this.pre.style.left = "50%";
            this.pre.style.top = "50%";
            this.pre.style.transform = "translate(-50%, -50%)";
            this.pre.style.zIndex = "9";
            this.pre.style.backgroundAttachment = "fixed";
            this.pre.style.mixBlendMode = "difference";
        }
    }
    render(scene, camera) {
        this.renderer.render(scene, camera);
        const w = this.canvas.width;
        const h = this.canvas.height;
        if (this.context) {
            this.context.clearRect(0, 0, w, h);
            if (this.context && w && h) {
                this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
            }
            this.asciify(this.context, w, h);
            this.hue();
        }
    }
    onMouseMove(e) {
        this.mouse = {
            x: e.clientX * PX_RATIO,
            y: e.clientY * PX_RATIO
        };
    }
    get dx() {
        return this.mouse.x - this.center.x;
    }
    get dy() {
        return this.mouse.y - this.center.y;
    }
    hue() {
        const deg = Math.atan2(this.dy, this.dx) * 180 / Math.PI;
        this.deg += (deg - this.deg) * 0.075;
        this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
    }
    asciify(ctx, w, h) {
        if (w && h) {
            const imgData = ctx.getImageData(0, 0, w, h).data;
            let str = "";
            for(let y = 0; y < h; y++){
                for(let x = 0; x < w; x++){
                    const i = x * 4 + y * 4 * w;
                    const [r, g, b, a] = [
                        imgData[i],
                        imgData[i + 1],
                        imgData[i + 2],
                        imgData[i + 3]
                    ];
                    if (a === 0) {
                        str += " ";
                        continue;
                    }
                    const gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
                    let idx = Math.floor((1 - gray) * (this.charset.length - 1));
                    if (this.invert) idx = this.charset.length - idx - 1;
                    str += this.charset[idx];
                }
                str += "\n";
            }
            this.pre.innerHTML = str;
        }
    }
    dispose() {
        document.removeEventListener("mousemove", this.onMouseMove);
    }
}
class CanvasTxt {
    canvas;
    context;
    txt;
    fontSize;
    fontFamily;
    color;
    font;
    constructor(txt, { fontSize = 200, fontFamily = "Arial", color = "#fdf9f3" } = {}){
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.txt = txt;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.color = color;
        this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
    }
    resize() {
        if (this.context) {
            this.context.font = this.font;
            const metrics = this.context.measureText(this.txt);
            const textWidth = Math.ceil(metrics.width) + 20;
            const textHeight = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 20;
            this.canvas.width = textWidth;
            this.canvas.height = textHeight;
        }
    }
    render() {
        if (this.context) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = this.color;
            this.context.font = this.font;
            const metrics = this.context.measureText(this.txt);
            const yPos = 10 + metrics.actualBoundingBoxAscent;
            this.context.fillText(this.txt, 10, yPos);
        }
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    get texture() {
        return this.canvas;
    }
}
class CanvAscii {
    textString;
    asciiFontSize;
    textFontSize;
    textColor;
    planeBaseHeight;
    container;
    width;
    height;
    enableWaves;
    camera;
    scene;
    mouse;
    textCanvas;
    texture;
    geometry;
    material;
    mesh;
    renderer;
    filter;
    center;
    animationFrameId = 0;
    constructor({ text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves }, containerElem, width, height){
        this.textString = text;
        this.asciiFontSize = asciiFontSize;
        this.textFontSize = textFontSize;
        this.textColor = textColor;
        this.planeBaseHeight = planeBaseHeight;
        this.container = containerElem;
        this.width = width;
        this.height = height;
        this.enableWaves = enableWaves;
        this.camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.PerspectiveCamera(45, this.width / this.height, 1, 1000);
        this.camera.position.z = 30;
        this.scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Scene();
        this.mouse = {
            x: 0,
            y: 0
        };
        this.onMouseMove = this.onMouseMove.bind(this);
        this.setMesh();
        this.setRenderer();
    }
    setMesh() {
        this.textCanvas = new CanvasTxt(this.textString, {
            fontSize: this.textFontSize,
            fontFamily: "IBM Plex Mono",
            color: this.textColor
        });
        this.textCanvas.resize();
        this.textCanvas.render();
        this.texture = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.CanvasTexture(this.textCanvas.texture);
        this.texture.minFilter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.NearestFilter;
        const textAspect = this.textCanvas.width / this.textCanvas.height;
        const baseH = this.planeBaseHeight;
        const planeW = baseH * textAspect;
        const planeH = baseH;
        this.geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.PlaneGeometry(planeW, planeH, 36, 36);
        this.material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            uniforms: {
                uTime: {
                    value: 0
                },
                mouse: {
                    value: 1.0
                },
                uTexture: {
                    value: this.texture
                },
                uEnableWaves: {
                    value: this.enableWaves ? 1.0 : 0.0
                }
            }
        });
        this.mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
    }
    setRenderer() {
        this.renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.WebGLRenderer({
            antialias: false,
            alpha: true
        });
        this.renderer.setPixelRatio(1);
        this.renderer.setClearColor(0x000000, 0);
        this.filter = new AsciiFilter(this.renderer, {
            fontFamily: "IBM Plex Mono",
            fontSize: this.asciiFontSize,
            invert: true
        });
        this.container.appendChild(this.filter.domElement);
        this.setSize(this.width, this.height);
        this.container.addEventListener("mousemove", this.onMouseMove);
        this.container.addEventListener("touchmove", this.onMouseMove);
    }
    setSize(w, h) {
        this.width = w;
        this.height = h;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.filter.setSize(w, h);
        this.center = {
            x: w / 2,
            y: h / 2
        };
    }
    load() {
        this.animate();
    }
    onMouseMove(evt) {
        const e = evt.touches ? evt.touches[0] : evt;
        const bounds = this.container.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        this.mouse = {
            x,
            y
        };
    }
    animate() {
        const animateFrame = ()=>{
            this.animationFrameId = requestAnimationFrame(animateFrame);
            this.render();
        };
        animateFrame();
    }
    render() {
        const time = new Date().getTime() * 0.001;
        this.textCanvas.render();
        this.texture.needsUpdate = true;
        this.mesh.material.uniforms.uTime.value = Math.sin(time);
        this.updateRotation();
        this.filter.render(this.scene, this.camera);
    }
    updateRotation() {
        const x = map(this.mouse.y, 0, this.height, 0.5, -0.5);
        const y = map(this.mouse.x, 0, this.width, -0.5, 0.5);
        this.mesh.rotation.x += (x - this.mesh.rotation.x) * 0.05;
        this.mesh.rotation.y += (y - this.mesh.rotation.y) * 0.05;
    }
    clear() {
        this.scene.traverse((object)=>{
            const obj = object;
            if (!obj.isMesh) return;
            [
                obj.material
            ].flat().forEach((material)=>{
                material.dispose();
                Object.keys(material).forEach((key)=>{
                    const matProp = material[key];
                    if (matProp && typeof matProp === "object" && "dispose" in matProp && typeof matProp.dispose === "function") {
                        matProp.dispose();
                    }
                });
            });
            obj.geometry.dispose();
        });
        this.scene.clear();
    }
    dispose() {
        cancelAnimationFrame(this.animationFrameId);
        this.filter.dispose();
        this.container.removeChild(this.filter.domElement);
        this.container.removeEventListener("mousemove", this.onMouseMove);
        this.container.removeEventListener("touchmove", this.onMouseMove);
        this.clear();
        this.renderer.dispose();
    }
}
function ASCIIText({ text = "David!", asciiFontSize = 8, textFontSize = 200, textColor = "#fdf9f3", planeBaseHeight = 8, enableWaves = true }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const asciiRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ASCIIText.useEffect": ()=>{
            if (!containerRef.current) return;
            const { width, height } = containerRef.current.getBoundingClientRect();
            asciiRef.current = new CanvAscii({
                text,
                asciiFontSize,
                textFontSize,
                textColor,
                planeBaseHeight,
                enableWaves
            }, containerRef.current, width, height);
            asciiRef.current.load();
            const ro = new ResizeObserver({
                "ASCIIText.useEffect": (entries)=>{
                    if (!entries[0]) return;
                    const { width: w, height: h } = entries[0].contentRect;
                    asciiRef.current?.setSize(w, h);
                }
            }["ASCIIText.useEffect"]);
            ro.observe(containerRef.current);
            return ({
                "ASCIIText.useEffect": ()=>{
                    ro.disconnect();
                    if (asciiRef.current) {
                        asciiRef.current.dispose();
                    }
                }
            })["ASCIIText.useEffect"];
        }
    }["ASCIIText.useEffect"], [
        text,
        asciiFontSize,
        textFontSize,
        textColor,
        planeBaseHeight,
        enableWaves
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        style: {
            position: "absolute",
            width: "100%",
            height: "100%"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
            children: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap');

        body {
          margin: 0;
          padding: 0;
        }

        canvas {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          image-rendering: optimizeSpeed;
          image-rendering: -moz-crisp-edges;
          image-rendering: -o-crisp-edges;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: pixelated;
        }

        pre {
          margin: 0;
          user-select: none;
          padding: 0;
          line-height: 1em;
          text-align: left;
          position: absolute;
          left: 0;
          top: 0;
          background-image: radial-gradient(circle, #ff6188 0%, #fc9867 50%, #ffd866 100%);
          background-attachment: fixed;
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          z-index: 9;
          mix-blend-mode: difference;
        }
      `
        }, void 0, false, {
            fileName: "[project]/src/TextAnimations/ASCIIText/ASCIIText.tsx",
            lineNumber: 589,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/TextAnimations/ASCIIText/ASCIIText.tsx",
        lineNumber: 581,
        columnNumber: 5
    }, this);
}
_s(ASCIIText, "5h4Kn690JVeTlbs7yHyogHFhYE4=");
_c = ASCIIText;
var _c;
__turbopack_refresh__.register(_c, "ASCIIText");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/Components/Dock/Dock.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/*
	jsrepo 1.38.0
	Installed from https://reactbits.dev/ts/tailwind/
	2-19-2025
*/ __turbopack_esm__({
    "default": (()=>Dock)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/value/use-motion-value.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/value/use-spring.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature(), _s1 = __turbopack_refresh__.signature(), _s2 = __turbopack_refresh__.signature();
"use client";
;
;
function DockItem({ children, className = "", onClick, mouseX, spring, distance, magnification, baseItemSize }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isHovered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    const mouseDistance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(mouseX, {
        "DockItem.useTransform[mouseDistance]": (val)=>{
            const rect = ref.current?.getBoundingClientRect() ?? {
                x: 0,
                width: baseItemSize
            };
            return val - rect.x - baseItemSize / 2;
        }
    }["DockItem.useTransform[mouseDistance]"]);
    const targetSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(mouseDistance, [
        -distance,
        0,
        distance
    ], [
        baseItemSize,
        magnification,
        baseItemSize
    ]);
    const size = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"])(targetSize, spring);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        ref: ref,
        style: {
            width: size,
            height: size
        },
        onHoverStart: ()=>isHovered.set(1),
        onHoverEnd: ()=>isHovered.set(0),
        onFocus: ()=>isHovered.set(1),
        onBlur: ()=>isHovered.set(0),
        onClick: onClick,
        className: `relative inline-flex items-center justify-center rounded-full bg-[#060606] border-neutral-700 border-2 shadow-md ${className}`,
        tabIndex: 0,
        role: "button",
        "aria-haspopup": "true",
        children: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].map(children, (child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"])(child, {
                isHovered
            }))
    }, void 0, false, {
        fileName: "[project]/src/Components/Dock/Dock.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
_s(DockItem, "QD1RMPQ8m9XsgPFJqpWypT5OUzQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"]
    ];
});
_c = DockItem;
function DockLabel({ children, className = "", ...rest }) {
    _s1();
    const { isHovered } = rest;
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DockLabel.useEffect": ()=>{
            const unsubscribe = isHovered.on("change", {
                "DockLabel.useEffect.unsubscribe": (latest)=>{
                    setIsVisible(latest === 1);
                }
            }["DockLabel.useEffect.unsubscribe"]);
            return ({
                "DockLabel.useEffect": ()=>unsubscribe()
            })["DockLabel.useEffect"];
        }
    }["DockLabel.useEffect"], [
        isHovered
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: 0
            },
            animate: {
                opacity: 1,
                y: -10
            },
            exit: {
                opacity: 0,
                y: 0
            },
            transition: {
                duration: 0.2
            },
            className: `${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-neutral-700 bg-[#060606] px-2 py-0.5 text-xs text-white`,
            role: "tooltip",
            style: {
                x: "-50%"
            },
            children: children
        }, void 0, false, {
            fileName: "[project]/src/Components/Dock/Dock.tsx",
            lineNumber: 131,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/Components/Dock/Dock.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_s1(DockLabel, "J3yJOyGdBT4L7hs1p1XQYVGMdrY=");
_c1 = DockLabel;
function DockIcon({ children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center justify-center ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/Components/Dock/Dock.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
_c2 = DockIcon;
function Dock({ items, className = "", spring = {
    mass: 0.1,
    stiffness: 150,
    damping: 12
}, magnification = 70, distance = 200, panelHeight = 64, dockHeight = 256, baseItemSize = 50 }) {
    _s2();
    const mouseX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"])(Infinity);
    const isHovered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    const maxHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Dock.useMemo[maxHeight]": ()=>Math.max(dockHeight, magnification + magnification / 2 + 4)
    }["Dock.useMemo[maxHeight]"], [
        magnification,
        dockHeight
    ]);
    const heightRow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(isHovered, [
        0,
        1
    ], [
        panelHeight,
        maxHeight
    ]);
    const height = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"])(heightRow, spring);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        style: {
            height,
            scrollbarWidth: "none"
        },
        className: "mx-2 flex max-w-full items-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            onMouseMove: ({ pageX })=>{
                isHovered.set(1);
                mouseX.set(pageX);
            },
            onMouseLeave: ()=>{
                isHovered.set(0);
                mouseX.set(Infinity);
            },
            className: `${className} absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl border-neutral-700 border-2 pb-2 px-4`,
            style: {
                height: panelHeight
            },
            role: "toolbar",
            "aria-label": "Application dock",
            children: items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DockItem, {
                    onClick: item.onClick,
                    className: item.className,
                    mouseX: mouseX,
                    spring: spring,
                    distance: distance,
                    magnification: magnification,
                    baseItemSize: baseItemSize,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DockIcon, {
                            children: item.icon
                        }, void 0, false, {
                            fileName: "[project]/src/Components/Dock/Dock.tsx",
                            lineNumber: 210,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DockLabel, {
                            children: item.label
                        }, void 0, false, {
                            fileName: "[project]/src/Components/Dock/Dock.tsx",
                            lineNumber: 211,
                            columnNumber: 13
                        }, this)
                    ]
                }, index, true, {
                    fileName: "[project]/src/Components/Dock/Dock.tsx",
                    lineNumber: 200,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/Components/Dock/Dock.tsx",
            lineNumber: 185,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/Components/Dock/Dock.tsx",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
_s2(Dock, "yDaCl94tHOrividYCf31TQOlkIA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"]
    ];
});
_c3 = Dock;
var _c, _c1, _c2, _c3;
__turbopack_refresh__.register(_c, "DockItem");
__turbopack_refresh__.register(_c1, "DockLabel");
__turbopack_refresh__.register(_c2, "DockIcon");
__turbopack_refresh__.register(_c3, "Dock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/Backgrounds/Iridescence/Iridescence.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/*
	jsrepo 1.38.0
	Installed from https://reactbits.dev/ts/tailwind/
	2-19-2025
*/ __turbopack_esm__({
    "default": (()=>Iridescence)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$core$2f$Renderer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/ogl/src/core/Renderer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$math$2f$Color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/ogl/src/math/Color.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$extras$2f$Triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/ogl/src/extras/Triangle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$core$2f$Program$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/ogl/src/core/Program.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$core$2f$Mesh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/ogl/src/core/Mesh.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
;
;
const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;
const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  // Add a subtle offset based on the mouse position
  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;
function Iridescence({ color = [
    1,
    1,
    1
], speed = 1.0, amplitude = 0.1, mouseReact = true, ...rest }) {
    _s();
    const ctnDom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mousePos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0.5,
        y: 0.5
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Iridescence.useEffect": ()=>{
            if (!ctnDom.current) return;
            const ctn = ctnDom.current;
            const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$core$2f$Renderer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Renderer"]();
            const gl = renderer.gl;
            gl.clearColor(1, 1, 1, 1);
            let program; // declare program first
            function resize() {
                const scale = 1;
                renderer.setSize(ctn.offsetWidth * scale, ctn.offsetHeight * scale);
                if (program) {
                    program.uniforms.uResolution.value = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$math$2f$Color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
                }
            }
            window.addEventListener("resize", resize, false);
            const geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$extras$2f$Triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Triangle"](gl);
            program = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$core$2f$Program$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Program"](gl, {
                vertex: vertexShader,
                fragment: fragmentShader,
                uniforms: {
                    uTime: {
                        value: 0
                    },
                    uColor: {
                        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$math$2f$Color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](...color)
                    },
                    uResolution: {
                        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$math$2f$Color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
                    },
                    uMouse: {
                        value: new Float32Array([
                            mousePos.current.x,
                            mousePos.current.y
                        ])
                    },
                    uAmplitude: {
                        value: amplitude
                    },
                    uSpeed: {
                        value: speed
                    }
                }
            });
            const mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ogl$2f$src$2f$core$2f$Mesh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](gl, {
                geometry,
                program
            });
            let animateId;
            function update(t) {
                animateId = requestAnimationFrame(update);
                program.uniforms.uTime.value = t * 0.001;
                renderer.render({
                    scene: mesh
                });
            }
            animateId = requestAnimationFrame(update);
            resize();
            ctn.appendChild(gl.canvas);
            function handleMouseMove(e) {
                const rect = ctn.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = 1.0 - (e.clientY - rect.top) / rect.height;
                mousePos.current = {
                    x,
                    y
                };
                program.uniforms.uMouse.value[0] = x;
                program.uniforms.uMouse.value[1] = y;
            }
            if (mouseReact) {
                ctn.addEventListener("mousemove", handleMouseMove);
            }
            return ({
                "Iridescence.useEffect": ()=>{
                    cancelAnimationFrame(animateId);
                    window.removeEventListener("resize", resize);
                    if (mouseReact) {
                        ctn.removeEventListener("mousemove", handleMouseMove);
                    }
                    ctn.removeChild(gl.canvas);
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
        ref: ctnDom,
        className: "w-full h-full absolute top-0 left-0 z-0",
        ...rest
    }, void 0, false, {
        fileName: "[project]/src/Backgrounds/Iridescence/Iridescence.tsx",
        lineNumber: 151,
        columnNumber: 10
    }, this);
}
_s(Iridescence, "4UT6OpJuIbbu8O/myXPXcGW257A=");
_c = Iridescence;
var _c;
__turbopack_refresh__.register(_c, "Iridescence");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$TextAnimations$2f$ASCIIText$2f$ASCIIText$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/TextAnimations/ASCIIText/ASCIIText.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Components$2f$Dock$2f$Dock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/Components/Dock/Dock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Backgrounds$2f$Iridescence$2f$Iridescence$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/Backgrounds/Iridescence/Iridescence.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$noop$2d$head$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/client/components/noop-head.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
const dockItems = [
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSpotify"], {
            size: 24,
            className: "text-white hover:text-white/80 transition-colors"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 17,
            columnNumber: 11
        }, this),
        label: 'Spotify',
        onClick: ()=>window.open("https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm?si=54f1d8b0d5784d97", "_blank")
    },
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaInstagram"], {
            size: 24,
            className: "text-white hover:text-white/80 transition-colors"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 22,
            columnNumber: 11
        }, this),
        label: 'Instagram',
        onClick: ()=>window.open("https://www.instagram.com/okisooo_/", "_blank")
    },
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaGithub"], {
            size: 24,
            className: "text-white hover:text-white/80 transition-colors"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 27,
            columnNumber: 11
        }, this),
        label: 'GitHub',
        onClick: ()=>window.open("https://github.com/okisooo", "_blank")
    },
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTwitter"], {
            size: 24,
            className: "text-white hover:text-white/80 transition-colors"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 32,
            columnNumber: 11
        }, this),
        label: 'X',
        onClick: ()=>window.open("https://x.com/okisooo_", "_blank")
    },
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaYoutube"], {
            size: 24,
            className: "text-white hover:text-white/80 transition-colors"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 37,
            columnNumber: 11
        }, this),
        label: 'YouTube',
        onClick: ()=>window.open("https://www.youtube.com/@okiso7", "_blank")
    },
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaDiscord"], {
            size: 24,
            className: "text-white hover:text-white/80 transition-colors"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 42,
            columnNumber: 11
        }, this),
        label: 'Discord',
        onClick: ()=>window.open("https://discord.gg/chill", "_blank")
    }
];
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$noop$2d$head$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "My New Tab Title"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full h-screen relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Backgrounds$2f$Iridescence$2f$Iridescence$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 57,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-10 flex flex-col items-center justify-center h-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$TextAnimations$2f$ASCIIText$2f$ASCIIText$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            text: "オキソ",
                            enableWaves: true,
                            asciiFontSize: 7,
                            textFontSize: 200,
                            textColor: "#ffffff",
                            planeBaseHeight: 8
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 59,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 58,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4 pointer-events-auto z-20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 py-3 relative",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Components$2f$Dock$2f$Dock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                items: dockItems,
                                panelHeight: 68,
                                baseItemSize: 50,
                                magnification: 70,
                                spring: {
                                    mass: 0.2,
                                    stiffness: 200,
                                    damping: 18
                                },
                                distance: 200
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 71,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 70,
                            columnNumber: 3
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 69,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 55,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true);
}
_c = Home;
var _c;
__turbopack_refresh__.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_0d8676._.js.map