// Original Kaleidos export: OKISO crimson current, 2026-10-15.
// The field, 110-color palette, orientation and time coefficients are unchanged.
export const crimsonCurrent = String.raw`#define uResolution iResolution.xy
#define uTime iTime

#define time uTime
const float noiseScale = 1.2;
#define screenSize vec2(640.0, 360.0)
#define sampleOffset vec2(0.0)
const float cellSize = 1.0;
const float octaves = 2.0;
const float gain = 1.0;

#define morphPhase (uTime*0.06)
#define scrollSpeed vec2(0.035, 0.015)
const vec2 loopD = vec2(0.0, 0.0);
const float loopZ = 0.0;

const vec4 PALETTE[110] = vec4[110](
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,0.962629,0.967504,1.0),
  vec4(1.0,0.917114,0.927925,1.0),
  vec4(0.990335,0.642409,0.671892,1.0),
  vec4(0.979128,0.332349,0.382379,1.0),
  vec4(0.97286,0.248895,0.303797,1.0),
  vec4(0.968284,0.236311,0.291213,1.0),
  vec4(0.963949,0.224389,0.279291,1.0),
  vec4(0.959878,0.213193,0.268095,1.0),
  vec4(0.956093,0.202785,0.257687,1.0),
  vec4(0.952615,0.193221,0.248123,1.0),
  vec4(0.949464,0.184554,0.239456,1.0),
  vec4(0.946655,0.176832,0.231734,1.0),
  vec4(0.919806,0.16365,0.217615,1.0),
  vec4(0.860909,0.142927,0.194711,1.0),
  vec4(0.812881,0.126028,0.176033,1.0),
  vec4(0.775984,0.113046,0.161685,1.0),
  vec4(0.750421,0.104051,0.151743,1.0),
  vec4(0.73633,0.099093,0.146263,1.0),
  vec4(0.733788,0.098199,0.145275,1.0),
  vec4(0.742809,0.101373,0.148783,1.0),
  vec4(0.763345,0.108599,0.156769,1.0),
  vec4(0.795283,0.119836,0.16919,1.0),
  vec4(0.838448,0.135024,0.185976,1.0),
  vec4(0.892605,0.154079,0.207037,1.0),
  vec4(0.945534,0.173748,0.22865,1.0),
  vec4(0.948186,0.181042,0.235944,1.0),
  vec4(0.951189,0.189299,0.244201,1.0),
  vec4(0.954526,0.198475,0.253377,1.0),
  vec4(0.958178,0.208519,0.263421,1.0),
  vec4(0.962126,0.219376,0.274278,1.0),
  vec4(0.966348,0.230987,0.285888,1.0),
  vec4(0.970821,0.243288,0.29819,1.0),
  vec4(0.975521,0.256213,0.311115,1.0),
  vec4(0.985362,0.504812,0.543413,1.0),
  vec4(0.996781,0.820743,0.838409,1.0),
  vec4(1.0,0.942501,0.950001,1.0),
  vec4(1.0,0.988557,0.990049,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,1.0,1.0,1.0),
  vec4(1.0,0.962629,0.967504,1.0),
  vec4(1.0,0.917114,0.927925,1.0),
  vec4(0.990335,0.642409,0.671892,1.0),
  vec4(0.979128,0.332349,0.382379,1.0),
  vec4(0.97286,0.248895,0.303797,1.0),
  vec4(0.968284,0.236311,0.291213,1.0),
  vec4(0.963949,0.224389,0.279291,1.0),
  vec4(0.959878,0.213193,0.268095,1.0),
  vec4(0.956093,0.202785,0.257687,1.0),
  vec4(0.952615,0.193221,0.248123,1.0),
  vec4(0.949464,0.184554,0.239456,1.0),
  vec4(0.946655,0.176832,0.231734,1.0)
);
vec4 paletteLookup(float x){
  int i = clamp(int(clamp(x,0.0,1.0)*256.0),0,255);
  return PALETTE[clamp(int(float(i)/255.0*110.0),0,109)];
}

#define MAX_OCTAVES 10
#define MORPH_DESYNC_AMP   1.6
#define MORPH_DESYNC_SCALE 2.5

float hash3(vec3 p) {
    p = fract(p * vec3(127.1, 311.7, 74.7));
    p += dot(p, p.yxz + 19.19);
    return fract((p.x + p.y) * p.z);
}

float vnoise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(mix(hash3(i + vec3(0,0,0)), hash3(i + vec3(1,0,0)), u.x),
            mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), u.x), u.y),
        mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), u.x),
            mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), u.x), u.y),
        u.z
    );
}

float basisSample(vec3 p, vec2 d, float pz) {

    return vnoise3(p) * 2.0 - 1.0;
}

float fbm3(vec3 p) {
    float v = 0.0, a = 0.5, norm = 0.0;
    vec2  d  = loopD;
    float pz = loopZ;
    int oct = int(octaves + 0.5);
    for (int i = 0; i < MAX_OCTAVES; i++) {
        if (i >= oct) break;
        float sn = basisSample(p, d, pz);
        float t;
        {
            t = sn * 0.5 + 0.5;
        }
        v    += a * t;
        norm += a;
        p     = p * 2.0 + vec3(5.3, 1.7, 3.1);
        d    *= 2.0;
        pz   *= 2.0;
        a    *= gain;
    }
    return v / norm;
}

float whash2(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p.yx + 19.19);
    return fract((p.x + p.y) * 43.32);
}
float wnoise2(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(whash2(i + vec2(0.0, 0.0)), whash2(i + vec2(1.0, 0.0)), u.x),
               mix(whash2(i + vec2(0.0, 1.0)), whash2(i + vec2(1.0, 1.0)), u.x), u.y);
}

vec2 warpUV(vec2 uv) {
    return uv;
}

vec2 rotateUV(vec2 uv) {
    return uv;
}

float fieldN(vec2 uv, float mzExtra) {
    float mz = morphPhase + mzExtra;

    mz += MORPH_DESYNC_AMP * (wnoise2(uv * MORPH_DESYNC_SCALE) - 0.5);
    
    vec2 nsv = vec2(noiseScale);
    return fbm3(vec3(uv * nsv + time * scrollSpeed, mz));
}

vec4 shade(vec2 screen_coords) {
    vec2 block = floor((screen_coords + sampleOffset) / cellSize) * cellSize;
    vec2 uv0   = warpUV(block / screenSize);
    float mzAdd = 0.0, valAdd = 0.0;
    vec2 uvDisp = vec2(0.0);

    float n = fieldN(rotateUV(uv0 + uvDisp), mzAdd);
    n = clamp(n + valAdd, 0.0, 1.0);
    return paletteLookup(n);
}


void mainImage(out vec4 fragColor, in vec2 fragCoord){
  vec2 uv = fragCoord / iResolution.xy;
  vec4 c = shade(vec2(uv.x, 1.0 - uv.y) * vec2(640.0, 360.0));
  fragColor = c;
}`;
