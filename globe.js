// 3D globe backdrop: plain WebGL, no libraries.
// The page's glass panels blur and refract this canvas, and scrolling moves the globe between sections.
// LAND is a 360x180 one-bit land mask built from Natural Earth 1:110m land data (public domain).
(() => {
  'use strict';
  const sky = document.querySelector('.sky');
  const fallback = sky && sky.querySelector('.globe');   // the flat SVG globe stays as the no-WebGL fallback
  if (!fallback) return;

  const LAND = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADf//8AAf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB////D//////n/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/gf/x////////wAAAAAbgAAB4AAAAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAf//8A///////+AAAAB/ngAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAcH3Hv/5////////8AAAAA/gAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAcIAAQP/AH///////+AAAAAPCAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAADwDAc+f+AP///////4AAAAAAAAAAAAAB4AAAAB/8AAAAAAAAAAAAAAAAAAAAAH9wc374AAAf/////8AAAAAAAAAAAAH4AAAA////AAAB/gAAAAAAAAAAAAAAAAwAAA/QAAAH/////8AAAAAAAAAAAAOAAAAP///wAAAAAAAAAAAAAAAAAAAAP8AYe+c3AAAD/////4AAAAAAAAAAAA4AAAH////++HgAOAAAAAAAAAAAAAAAfv+4+w/4gAAB/////wAAAAAAAAAAADwAHgH///////4AfgAAAAAgHwAAAAAAPf/4O4//9AAB/////wAAAAAAAAAAADwAPb////////4m//gAAAAAAAf+AAAAAA/+A8f//4AB////8gAAAAAAA/gAAAAAfv/////////////8AAAAAB///+H//H/+PeDwf+AA3////AAAAAAA//4AAAA8fv///////////////P8f/gAAAAAAAA/H9wMH4D//wAAAP//////8AAAP/84AYIAAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAIHmAP/AAAH///////wAAABzAAAAYAAAAAAAAAAAAAAAAABH7AAAAAAAAAAAAAf8AD/gAAf///////gAAGBwAAAAgAAAAAAAAAAAAAAAAAgPAAAAAAAAAAAAAF/8Dn/gAP//gD////ADgB8AAAAAAAAAAAAAAAAAAAAAAAAgEf///////////zw7/AAP/gAAP4AAAB/4/+f//////////////////////8AMAf//////////+DIA/gAH/gAAAAAAAH/z/////////////////////////+AAH///////////8AwgOAAD+AAAAAAAA//H/////////////////////////6AAP///////////wAA/AAAB+AAAAAAAB/+H//////////////////////nP+AAAH//z////////wAA/wAAAOAAAAAAAB//D/////////////////////+A/4AAAA/zAD///////gAA/4wAAAAAAAAAAB//Ab///////////////////+eDgAAAAABwAA///////4AA/94AAAAAAAAAYA5+A///////////////////4AAHAAAAAADcAAD//////4AAf/8AAAAAAAAA8AC+C///////////////////wAAfgAAAAAMAAAA///////wAf/8AAAAAAAAA4AO8H///////////////////AAA/gAAAABgAAAA///////8A///AAAAAAAAA8ANwH//////////////////8AAB/AAAAAEAAAAAf///////z///4AAAAAAAHOAEDv//////////////////+AAA+AAAAAAAAAABH///////x///8AAAAAAAHHAf/////////////////////6AA8AAAAAAAAAAAD///////x///8AAAAAAAGPz//////////////////////6AAwAAAAAAAAAAAD///////9///6AAAAAAAAPj//////////////////////6AAQAAAAAAAAAAAC///////////EAAAAAAAAYf//////////////////////7AAAAAAAAAAAAAABv////////+MNAAAAAAAAD///////////////////////zAAAAAAAAAAAAAAAH////////7gfgAAAAAAAf///////////////////////yAAAAAAAAAAAAAAAL/////////gCgAAAAAAAH///////////////////////iAAAAAAAAAAAAAAAP/////////pAAAAAAAAAD/////uP/x//////////////DAAAAAAAAAAAAAAAP/////////+AAAAAAAAAB//v//Gf/B/////////////+AAAAAAAAAAAAAAAAP////////8wAAAAAAAAAB//H/+AP+P/////////////8CAAAAAAAAAAAAAAAP////////wAAAAAAAAADj/jz/8AD/H/////////////4HgAAAAAAAAAAAAAAP////////gAAAAAAAAAH/4Bw/8AA/B////////////+APAAAAAAAAAAAAAAAP////////gAAAAAAAAAH/wA8f8Ph/g////////////8AAAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/gMHfJ///x///////////v4AMAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/AMCOP///h//////////+JwAMAAAAAAAAAAAAAAAH///////4AAAAAAAAAAH/AAAHH///g//////////8BwAIAAAAAAAAAAAAAAAH///////wAAAAAAAAAAH+AAYGH///w//////////+w4A4AAAAAAAAAAAAAAAD///////wAAAAAAAAAAAgf+ACBs//////////////g4D4AAAAAAAAAAAAAAAB///////wAAAAAAAAAAAj/+AAAA//////////////AYf4AAAAAAAAAAAAAAAA///////gAAAAAAAAAAB//8AAAA//////////////Ah2AAAAAAAAAAAAAAAAAP/////+AAAAAAAAAAAD//+AAAB//////////////gDwAAAAAAAAAAAAAAAAAH/////8AAAAAAAAAAAH///4GAB//////////////gDAAAAAAAAAAAAAAAAAAG/////4AAAAAAAAAAAP///8P4h//////////////wCAAAAAAAAAAAAAAAAAACf////4AAAAAAAAAAAP////v////////////////gAAAAAAAAAAAAAAAAAAABP//hgYAAAAAAAAAAAP//////3//P///////////wAAAAAAAAAAAAAAAAAAAAv//AAYAAAAAAAAAAAf//////9//H///////////wAAAAAAAAAAAAAAAAAAAB3/+AAcAAAAAAAAAAB///////4//h///////////gAAAAAAAAAAAAAAAAAAAAR/+AANAAAAAAAAAAD///////8//wH//////////AAAAAAAAAAAAAAAAAAAAAJ/+AAEAAAAAAAAAAH///////+f/0B/////////+AAAAAAAAAAAAAAAAAAAAAI/8AAAAAAAAAAAAAH///////+f/44Af///////+QAAAAAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAAAP////////H//+AP///////4gAAAAAAAAAAAAAAAAAAAAAP8AAuAAAAAAAAAAP////////H///AD///v///ggAAAAAAAAAAAAAAAAAAAAAH+AABgAAAAAAAAAf////////n//+AD//4P//YAAAAAAAAAAAAAAAAAAAAAAAP+A4AYAAAAAAAAAP////////j//+AAf/4H/+AAAAAAAAAAAAAAAAgAAAAAAAH/B4ABwAAAAAAAAP////////h//8AAf/gD/8YAAAAAAAAAAAAAAAAAAAAAAAD/nwAD9AAAAAAAAP////////x//4AAf/AD/8QAAAAAAAAAAAAAAAAAAAAAAAAf/wAAAAAAAAAAAP////////4//gAAf+AD/+AAwAAAAAAAAAAAAAAAAAAAAAAH/wAAAAAAAAAAAf////////4f+AAAf8AD//AAwAAAAAAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAf////////8f8AAAPwAAP/gAwAAAAAAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAf////////+fgAAAPwAAP/gAwAAAAAAAAAAAAAAAAAAAAAAAA/AAAAAAAAAAAf/////////eAAAAHwAAP/gAMAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAAAAAAAf/////////gAAAAHwAAM/gACAAAAAAAAAAAAAAAAAAAAAAAADABAAAAAAAAAP/////////gYAAADwAAEfgAJAAAAAAAAAAAAAAAAAAAAAAAADgPfOAAAAAAAH/////////34AAADwAAIOABAAAAAAAAAAAAAAAAAAAAAAAAAAyPf+AAAAAAAD//////////4AAADoAAIEACBAAAAAAAAAAAAAAAAAAAAAAAAA8///AAAAAAAB//////////wAAABIAAMAAAFAAAAAAAAAAAAAAAAAAAAAAAAAE///gAAAAAAB//////////wAAAAMAAEAAALgAAAAAAAAAAAAAAAAAAAAAAAAAf//wAAAAAAAf/////////gAAAAMAADAAMCAAAAAAAAAAAAAAAAAAAAAAAAAA////gAAAAAAP/B///////gAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAf///wAAAAAACAA///////AAAAAAAAxgA+AAAAAAAAAAAAAAAAAAAAAAAAAAAf///4AAAAAAAAAD/////+AAAAAAAAZgB4AAAAAAAAAAAAAAAAAAAAAAAAAAB////4AAAAAAAAAD/////8AAAAAAAAMwH8AAAAAAAAAAAAAAAAAAAAAAAAAAB////8AAAAAAAAAH/////4AAAAAAAAHQf8AIAAAAAAAAAAAAAAAAAAAAAAAAD////8AAAAAAAAAH/////gAAAAAAAAHgf88IAAAAAAAAAAAAAAAAAAAAAAAAD////+AAAAAAAAAH/////AAAAAAAAADwf8AAgAAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAAH/////AAAAAAAAABwP5wBwAAAAAAAAAAAAAAAAAAAAAAAH/////6AAAAAAAAD////+AAAAAAAAAB8P5wATwAAAAAAAAAAAAAAAAAAAAAAD//////4AAAAAAAB////8AAAAAAAAAA8AxQif+AAAAAAAAAAAAAAAAAAAAAAH//////8AAAAAAAB////4AAAAAAAAAAcAAIAD/gAAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA////4AAAAAAAAAAMAAIAI/ywAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA////4AAAAAAAAAADgAAAI/8BAAAAAAAAAAAAAAAAAAAAD///////gAAAAAAAf///4AAAAAAAAAAB+AAAA/4AIAAAAAAAAAAAAAAAAAAAB///////gAAAAAAAf///4AAAAAAAAAAAAmogAOMAAAAAAAAAAAAAAAAAAAAAB///////AAAAAAAAf///8AAAAAAAAAAAABCAAAGADAAAAAAAAAAAAAAAAAAAA///////AAAAAAAAf///8AAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAf/////+AAAAAAAAP///8AAAAAAAAAAAAAAAgCAAAAAAAAAAAAAAAAAAAAAAAf/////8AAAAAAAAf///+AQAAAAAAAAAAAAB+CAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAAf///+AQAAAAAAAAAAAAD8DAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAA////+AwAAAAAAAAAAAA38DgAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAA////8BwAAAAAAAAAAAD/8DgAAAAA/////////////////+AAAAAH////////AAAADwP///////////8AA4P//+/+AAAAAAAAAAAAAAAAAAf////4AAAAAAAA////wPgAAAAAAAAAAAP//3wAAAACAAAAAAAAAAAAAAAAAAP////wAAAAAAAA////APgAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgAAAAAAAAAAAf///4AAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgAAAAAAAAAAD////+AAIAAAAAAAAAAAAAAAAAAAAP////gAAAAAAAAP//+AfAAAAAAAAAAAf////+AAEAAAAAAAAAAAAAAAAAAAAP////AAAAAAAAAP///AfAAAAAAAAAAA//////AAAAAAAAAAAAAAAAAAAAAAAP///4AAAAAAAAAP//+APAAAAAAAAAAA//////gAAAAAAAAAAAAAAAAAAAAAAf///gAAAAAAAAAH//+AOAAAAAAAAAAB//////wAAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAH//4AEAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAH//4AAAAAAAAAAAAB//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAH//4AAAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAD//wAAAAAAAAAAAAAf/////8AAAAAAAAAAAAAAAAAAAAAAf//8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///4AAAAAAAAAAA//AAAAAAAAAAAAAAP/////4AAAAAAAAAAAAAAAAAAAAAAf//wAAAAAAAAAAA/+AAAAAAAAAAAAAAP/AP//wAAAAAAAAAAAAAAAAAAAAAA///gAAAAAAAAAAA/4AAAAAAAAAAAAAAf8AG//gAAAAAAAAAAAAAAAAAAAAAA//3AAAAAAAAAAAAYAAAAAAAAAAAAAAAOAAF//gAAAAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//AAABAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAgAAAAAAAAAAAAAAAAAD//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAQAAAAAAAAAAAAAAAAAB//gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYAAAAcAAAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAADQAAAAAAAAAAAAAAAAAD/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAHAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAOAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAH4AAAAAAB4HgAD8AAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAA//AAAD//////////wAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAf///4Af///////////AAAAAAAAAAAAAAAAAAAAAAAz4AAAAAAAAAAAAAAAPz////8B/////////////wAAAAAAAAAAAAAAAAAAAAA78AAAAAAAAAAA8/8///////wf/////////////+AAAAAAAAAAAAAAAAAAAAH9+AAAAAAAAZ////////////w////////////////4AAAAAAAAAAAAAAAAAAAB+AAAAAAAB//////////////////////////////4AAAAAAAAABmAAB8f+HB/+AAAAAAAP//////////////////////////////gAAAAAAAAP/c/oAf/////4AAAAAAAP/////////////////////////////8AAAAAAAD/////////////gAAAAAAB//////////////////////////////wAAAAAAAD////////////wAAAAAAP///////////////////////////////wAAAAAD/////////////4AAAAAAD////////////////////////////////wAAAADh/////////////AAAAB8A/////////////////////////////////+AAAAA4Af///////////gAAAH+AA///////////////////////////////+AAAAAAAAH///////////+A/A/wAA///////////////////////////////8AAAAAAAf//////////////gAAAf////////////////////////////////+AAAAAAAH///////////////h////////////////////////////////////wAAAAAAP/////////////////////////////////////////////////////gA+/gAAH///////////////////////////////////////////////gAAAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////';

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true });
  if (!gl) return;
  canvas.className = 'globe3d';
  sky.insertBefore(canvas, fallback);
  sky.classList.add('gl');

  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RAD = Math.PI / 180;
  const D = 3.4;                              // camera distance, in globe radii
  const RS = D / Math.sqrt(D * D - 1);        // silhouette radius after perspective
  const TEAL = [.24, .88, .69], GOLD = [.85, .73, .47], CORAL = [1, .62, .51], VIOLET = [.66, .61, 1], MINT = [.62, .9, .8];

  // ---------- land dots ----------
  const bits = Uint8Array.from(atob(LAND), c => c.charCodeAt(0));
  const isLand = (lat, lon) => {
    const r = Math.min(179, Math.max(0, Math.floor(90 - lat))), c = Math.min(359, Math.max(0, Math.floor(lon + 180)));
    const i = r * 360 + c;
    return (bits[i >> 3] >> (7 - (i & 7))) & 1;
  };
  let seed = 7;
  const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const COUNT = innerWidth < 980 ? 13000 : 24000, GOLDEN = Math.PI * (3 - Math.sqrt(5));
  const land = [];
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - 2 * (i + .5) / COUNT, r = Math.sqrt(1 - y * y), ph = i * GOLDEN;
    const x = Math.sin(ph) * r, z = Math.cos(ph) * r;
    if (!isLand(Math.asin(y) / RAD, Math.atan2(x, z) / RAD)) continue;
    // where the dot flies in from during the intro
    const a = rnd() * 6.2832, b = Math.acos(2 * rnd() - 1), d = 2.2 + rnd() * 2.6;
    land.push(x, y, z, Math.sin(b) * Math.cos(a) * d, Math.cos(b) * d * .7, Math.sin(b) * Math.sin(a) * d * .4, rnd());
  }
  const landData = new Float32Array(land), landCount = land.length / 7;

  // ---------- cities and arcs ----------
  const V = (lat, lon, k = 1) => [Math.cos(lat * RAD) * Math.sin(lon * RAD) * k, Math.sin(lat * RAD) * k, Math.cos(lat * RAD) * Math.cos(lon * RAD) * k];
  // 0 is home: the Bay Area. Then New York, London, Dubai, Singapore, Tokyo, Sydney, Sao Paulo, Lagos, Mumbai.
  const CITY = [[37.6, -122.2], [40.7, -74], [51.5, -.1], [25.2, 55.3], [1.35, 103.8], [35.7, 139.7], [-33.9, 151.2], [-23.5, -46.6], [6.5, 3.4], [19.1, 72.9]].map(c => V(c[0], c[1], 1.004));
  const LINK = [[0, 1], [0, 5], [0, 2], [1, 2], [2, 3], [3, 4], [4, 6], [5, 4], [1, 7], [2, 8], [3, 9], [0, 6]];
  const SEG = 72;
  const ARC = LINK.map(([i, j]) => {
    const a = CITY[i], b = CITY[j], om = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), so = Math.sin(om);
    const pts = new Float32Array((SEG + 1) * 3);
    for (let s = 0; s <= SEG; s++) {
      const t = s / SEG, k1 = Math.sin((1 - t) * om) / so, k2 = Math.sin(t * om) / so, lift = 1 + (.05 + .2 * om / Math.PI) * Math.sin(Math.PI * t);
      for (let c = 0; c < 3; c++) pts[s * 3 + c] = (a[c] * k1 + b[c] * k2) * lift;
    }
    return { pts, home: i === 0 };
  });

  // ---------- satellites: one per product ----------
  const SAT = [
    { R: 1.17, inc: .55, node: .4, w: .42, ph: 0, col: GOLD },
    { R: 1.26, inc: -.9, node: 2.1, w: -.33, ph: 2, col: CORAL },
    { R: 1.35, inc: 1.15, node: 3.6, w: .27, ph: 4, col: VIOLET },
    { R: 1.44, inc: -.35, node: 5.2, w: -.22, ph: 1, col: TEAL }
  ].map(s => ({ ...s,
    u: [Math.cos(s.node), 0, Math.sin(s.node)],
    v: [-Math.sin(s.node) * Math.cos(s.inc), Math.sin(s.inc), Math.cos(s.node) * Math.cos(s.inc)] }));
  const TRAIL = 48, RING = 120;
  const SPRITES = new Float32Array((ARC.length * (SEG + 1) + CITY.length * 2 + SAT.length * (TRAIL + 1 + RING) + 16) * 9);

  // ---------- shaders ----------
  const CONSTS = `const float D=${D.toFixed(4)}; const float RS=${RS.toFixed(6)};`;
  const HIGHP = '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';
  const SRC = {
    landV: `${CONSTS}
attribute vec3 aPos, aFrom; attribute float aSeed;
uniform mat3 uRot; uniform vec2 uCenter, uScale; uniform vec3 uSun;
uniform float uPx, uDpr, uIntro, uTime, uDim;
varying vec4 vC;
void main(){
  float d = clamp(uIntro*1.75 - aSeed*.75, 0., 1.);
  float e = 1. - pow(1. - d, 4.);
  vec3 p = uRot * mix(aFrom, aPos, e);
  float persp = D / (D - p.z);
  gl_Position = vec4(uCenter + p.xy*persp*uScale, 0., 1.);
  float facing = smoothstep(-.10, .12, p.z - 1./D);
  float day = smoothstep(-.35, .55, dot(p, uSun));
  float s2 = fract(aSeed*91.73);
  vec3 col = mix(vec3(.20,.36,.33), mix(vec3(.62,.84,.74), vec3(.30,.90,.72), s2), day);
  float city = step(.88, s2) * (1. - day);
  col = mix(col, vec3(.95,.78,.45), city * (.65 + .35*sin(uTime*1.7 + aSeed*50.)));
  vC = vec4(col, mix(.07, 1., facing) * (.38 + .62*day + .35*city) * e * uDim);
  gl_PointSize = clamp(uPx*.0074, 1.6*uDpr, 4.4*uDpr) * persp * (.8 + .35*day);
}`,
    landF: `precision mediump float; varying vec4 vC;
void main(){
  float r = length(gl_PointCoord*2. - 1.);
  float a = (1. - smoothstep(.45, 1., r)) * vC.a;
  gl_FragColor = vec4(vC.rgb*a, a*.8);
}`,
    discV: `attribute vec2 aQ; uniform vec2 uCenter, uScale; varying vec2 vQ;
void main(){ vQ = aQ*1.9; gl_Position = vec4(uCenter + vQ*uScale, 0., 1.); }`,
    discF: `${HIGHP}${CONSTS}
varying vec2 vQ;
uniform mat3 uInv; uniform vec3 uSun, uAccent; uniform float uPx, uDim, uIntro;
void main(){
  float d = length(vQ) / RS;
  vec3 ro = vec3(0., 0., D), rd = normalize(vec3(vQ, -D));
  float b = dot(ro, rd), h = b*b - (D*D - 1.);
  vec4 inside = vec4(0.);
  if (h > 0.) {
    vec3 n = ro + rd * (-b - sqrt(h));
    float nv = max(dot(n, -rd), 0.);
    float day = smoothstep(-.3, .85, dot(n, uSun));
    float fres = pow(1. - nv, 2.4);
    vec3 body = mix(vec3(.010,.030,.025), vec3(.025,.085,.068), day);
    vec3 o = uInv * n;
    float lat = asin(clamp(o.y, -1., 1.)), lon = atan(o.x, o.z);
    const float ST = .2617994;
    float g1 = abs(fract(lat/ST + .5) - .5) * ST;
    float g2 = abs(fract(lon/ST + .5) - .5) * ST * cos(lat) + step(1.36, abs(lat));
    float w = 1.1 / uPx;
    float line = (1. - smoothstep(w, w*2.4, min(g1, g2))) * smoothstep(.02, .45, nv);
    inside = vec4(body*.66 + uAccent * (fres*(.16 + .40*day) + line*(.028 + .045*day)), .66);
  }
  float halo = exp(-max(d - 1., 0.) * 8.5);
  float side = .3 + .7*smoothstep(-.7, .7, dot(normalize(vQ + 1e-5), uSun.xy));
  vec4 outside = vec4(uAccent * halo * .30 * side, halo * .08 * side);
  vec4 c = mix(inside, outside, smoothstep(1. - 1.5/uPx, 1. + 1.5/uPx, d));
  gl_FragColor = c * uDim * smoothstep(.05, .6, uIntro);
}`,
    spriteV: `${CONSTS}
attribute vec3 aP; attribute vec4 aC; attribute vec2 aS;
uniform vec2 uCenter, uScale; uniform float uDpr, uDim;
varying vec4 vC; varying float vK;
void main(){
  float persp = D / (D - aP.z);
  gl_Position = vec4(uCenter + aP.xy*persp*uScale, 0., 1.);
  vec3 ro = vec3(0., 0., D), to = aP - ro;
  float dist = length(to); vec3 rd = to/dist;
  float b = dot(ro, rd), h = b*b - (D*D - 1.);
  float hidden = step(0., h) * step(-b - sqrt(max(h, 0.)), dist - .04);   // behind the globe
  vC = vec4(aC.rgb, aC.a * (1. - hidden) * uDim); vK = aS.y;
  gl_PointSize = aS.x * uDpr * persp;
}`,
    spriteF: `precision mediump float; varying vec4 vC; varying float vK;
void main(){
  float r = length(gl_PointCoord*2. - 1.), a;
  if (vK < .5) { a = 1. - smoothstep(0., 1., r); a = a*a*.55 + (1. - smoothstep(.15, .5, r))*.75; }
  else { float ph = vK - 1.; a = (1. - smoothstep(0., .14, abs(r - ph*.9))) * (1. - ph); }
  a *= vC.a;
  gl_FragColor = vec4(vC.rgb*a, a*.7);
}`
  };

  let P = null, B = null;   // programs and buffers, rebuilt if the GPU context is lost
  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const program = (vs, fs, attrs, unis) => {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    attrs.forEach((a, i) => gl.bindAttribLocation(p, i, a));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}; unis.forEach(n => u[n] = gl.getUniformLocation(p, n));
    return { p, u };
  };
  const buffer = (data, usage) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, usage); return b; };
  function setup() {
    P = {
      land: program(SRC.landV, SRC.landF, ['aPos', 'aFrom', 'aSeed'], ['uRot', 'uCenter', 'uScale', 'uSun', 'uPx', 'uDpr', 'uIntro', 'uTime', 'uDim']),
      disc: program(SRC.discV, SRC.discF, ['aQ'], ['uCenter', 'uScale', 'uInv', 'uSun', 'uAccent', 'uPx', 'uDim', 'uIntro']),
      sprite: program(SRC.spriteV, SRC.spriteF, ['aP', 'aC', 'aS'], ['uCenter', 'uScale', 'uDpr', 'uDim'])
    };
    B = {
      land: buffer(landData, gl.STATIC_DRAW),
      disc: buffer(new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW),
      sprite: buffer(SPRITES, gl.DYNAMIC_DRAW)
    };
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
  }
  // layout: [size, ...] per attribute, tightly packed floats
  const bind = (buf, layout) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    const stride = layout.reduce((a, b) => a + b, 0) * 4;
    let off = 0;
    for (let i = 0; i < 3; i++) {
      if (i < layout.length) { gl.enableVertexAttribArray(i); gl.vertexAttribPointer(i, layout[i], gl.FLOAT, false, stride, off); off += layout[i] * 4; }
      else gl.disableVertexAttribArray(i);
    }
  };

  // ---------- small 3x3 matrix helpers (row-major) ----------
  const mul = (a, b) => { const o = new Array(9); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c]; return o; };
  const rotX = a => { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, c, -s, 0, s, c]; };
  const rotY = a => { const c = Math.cos(a), s = Math.sin(a); return [c, 0, s, 0, 1, 0, -s, 0, c]; };
  const rotZ = a => { const c = Math.cos(a), s = Math.sin(a); return [c, -s, 0, s, c, 0, 0, 0, 1]; };
  const transposed = m => [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]];
  const SUN = (() => { const v = [-.6, .5, .62], l = Math.hypot(...v); return v.map(x => x / l); })();

  // ---------- where the globe sits for each section ----------
  // ax, ay: centre as a fraction of the viewport. r: radius as a fraction of the shorter side.
  const pose = (ax, ay, r, col, dim, arc, act) => ({ ax, ay, r, col, dim, arc, act });
  const EVEN = [.65, .65, .65, .65], solo = k => [0, 1, 2, 3].map(i => i === k ? 1 : .18);
  // Headings and their intro lines sit on the bare backdrop, so each heading stop parks the globe in a far corner.
  const WIDE = [
    [null, pose(.735, .34, .40, TEAL, 1, 1, [.45, .45, .45, .45])],
    ['#work .sh', pose(1.04, .04, .36, TEAL, .8, .7, EVEN)],
    ['.proj.c1', pose(1.03, .52, .60, GOLD, .8, .8, solo(0))],
    ['.proj.c2', pose(-.03, .50, .60, CORAL, .8, .8, solo(1))],
    ['.proj.c3', pose(1.03, .50, .60, VIOLET, .8, .8, solo(2))],
    ['.proj.c4', pose(-.03, .50, .60, TEAL, .8, .8, solo(3))],
    ['#news .sh', pose(-.02, .98, .46, TEAL, .8, 1.2, EVEN)],
    ['#news .news', pose(1.03, .50, .50, TEAL, .85, 1.6, EVEN)],
    ['#skills .sh', pose(1.02, 1.06, .42, TEAL, .8, 1, EVEN)],
    ['#skills .skills', pose(-.02, .55, .50, TEAL, .8, 1, EVEN)],
    ['#contact', pose(.5, 1.255, .40, GOLD, .9, 1, EVEN)]   // ends as a sunrise between the footer's two halves
  ];
  const NARROW = [
    [null, pose(.72, .93, .70, TEAL, .8, .8, EVEN)],
    ['#work .sh', pose(1.1, .08, .60, TEAL, .6, .7, EVEN)],
    ['.proj.c1', pose(1.08, .5, .9, GOLD, .6, .8, solo(0))],
    ['.proj.c2', pose(-.08, .5, .9, CORAL, .6, .8, solo(1))],
    ['.proj.c3', pose(1.08, .5, .9, VIOLET, .6, .8, solo(2))],
    ['.proj.c4', pose(-.08, .5, .9, TEAL, .6, .8, solo(3))],
    ['#news .sh', pose(-.1, 1.0, .7, TEAL, .55, 1.2, EVEN)],
    ['#news .news', pose(1.08, .5, .8, TEAL, .6, 1.4, EVEN)],
    ['#skills .sh', pose(1.1, 1.05, .7, TEAL, .55, 1, EVEN)],
    ['#skills .skills', pose(-.08, .5, .8, TEAL, .6, 1, EVEN)],
    ['#contact', pose(.5, 1.2, .75, GOLD, .3, 1, EVEN)]   // faint: the stacked footer text sits on top of it
  ];
  // The hero globe is placed from the layout, not the window, so it sits beside the portrait and never behind it.
  // offsetTop/offsetLeft ignore transforms and scroll, so the card's tilt and entrance don't move the globe.
  const box = el => { let x = 0, y = 0; for (let n = el; n; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; } return { x, y, w: el.offsetWidth, h: el.offsetHeight }; };
  function heroPose(base) {
    const W = innerWidth, H = innerHeight, vmin = Math.min(W, H), card = document.querySelector('.portrait');
    if (!card) return base;
    let cx, cy, r;
    if (W < 980) {
      // phones: a small globe tucked into the free space right of the buttons, above the portrait
      const top = document.querySelector('.ctas'), bottom = document.querySelector('.social');
      if (!top || !bottom) return base;
      const a = box(top), b = box(bottom);
      r = Math.max(60, (b.y + b.h - a.y) / 2 + 6); cx = W - r * .35; cy = (a.y + b.y + b.h) / 2;
    } else {
      // desktops: in the free lane right of the portrait, whole and uncropped whenever the lane is wide enough
      const c = box(card), gap = 40, room = W - (c.x + c.w) - gap;
      r = Math.min(.42 * vmin, Math.max(.26 * vmin, room * .5 - 12)); cx = c.x + c.w + gap + r; cy = c.y + c.h * .5;
    }
    return { ...base, ax: cx / W, ay: cy / H, r: r / vmin };
  }
  let stops = [];
  function measure() {
    const vh = innerHeight, last = document.documentElement.scrollHeight - vh / 2 - 1;
    stops = (innerWidth < 980 ? NARROW : WIDE).map(([sel, p]) => {
      const el = sel && document.querySelector(sel);
      if (sel && !el) return null;
      const b = el && el.getBoundingClientRect();
      return { y: el ? Math.min(last, b.top + scrollY + b.height / 2) : vh / 2, p: sel ? p : heroPose(p) };
    }).filter(Boolean).sort((a, b) => a.y - b.y);
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => ({
    ax: lerp(a.ax, b.ax, t), ay: lerp(a.ay, b.ay, t), r: lerp(a.r, b.r, t), dim: lerp(a.dim, b.dim, t), arc: lerp(a.arc, b.arc, t),
    col: a.col.map((v, i) => lerp(v, b.col[i], t)), act: a.act.map((v, i) => lerp(v, b.act[i], t))
  });
  function target(y) {
    if (calm || stops.length < 2) return stops[0].p;
    const s = y + innerHeight / 2;
    if (s <= stops[0].y) return stops[0].p;
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i], b = stops[i + 1];
      if (s < b.y) { let t = (s - a.y) / Math.max(1, b.y - a.y); t = Math.min(1, Math.max(0, (t - .15) / .7)); return mix(a.p, b.p, t * t * (3 - 2 * t)); }
    }
    return stops[stops.length - 1].p;
  }

  // ---------- state ----------
  let W = 1, H = 1, dpr = 1, maxDpr = 2, needSize = true;
  let cur = null, sy = scrollY, time = 0, intro = 0, arcT = 0, last = 0, raf = 0, frames = 0, slow = 0, slowN = 0;
  let px = 0, py = 0, tx = 0, ty = 0;   // pointer parallax, eased
  function resize() {
    W = sky.clientWidth || innerWidth; H = sky.clientHeight || innerHeight;
    dpr = Math.min(devicePixelRatio || 1, maxDpr);
    const cw = Math.round(W * dpr), ch = Math.round(H * dpr);
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    gl.viewport(0, 0, cw, ch);
    measure(); needSize = false;
  }

  function draw(dt) {
    if (needSize || frames % 90 === 0) { if (needSize) resize(); else measure(); }
    frames++;
    if (!calm) {
      time += dt;
      intro = Math.min(1, intro + dt / 2.8);
      if (intro > .8) arcT += dt;
      sy = lerp(sy, scrollY, 1 - Math.exp(-dt * 7));
      px = lerp(px, tx, 1 - Math.exp(-dt * 3)); py = lerp(py, ty, 1 - Math.exp(-dt * 3));
    }
    const want = target(sy);
    cur = cur ? mix(cur, want, calm ? 1 : 1 - Math.exp(-dt * 4.5)) : want;

    const ease = 1 - Math.pow(1 - intro, 3), vmin = Math.min(W, H);
    const rCss = cur.r * vmin * (.88 + .12 * ease), rPx = rCss * dpr;
    const center = [cur.ax * 2 - 1, 1 - cur.ay * 2], scale = [rCss * 2 / W, rCss * 2 / H];
    // rest on a view of the Americas and sway gently; scrolling does the real turning
    const yaw = .95 + Math.sin(time * .12) * .22 + sy * .0009 + px * .22 - (1 - ease) * 2.4;
    const frame = mul(rotZ(-.3), rotX(.32 + py * .1));
    const M = mul(frame, rotY(yaw));
    const ss = Math.min(1.7, Math.max(.75, rCss / 360));
    gl.clear(gl.COLOR_BUFFER_BIT);

    // globe body, rim light and grid
    gl.useProgram(P.disc.p); bind(B.disc, [2]);
    let u = P.disc.u;
    gl.uniform2fv(u.uCenter, center); gl.uniform2fv(u.uScale, scale); gl.uniformMatrix3fv(u.uInv, false, M);
    gl.uniform3fv(u.uSun, SUN); gl.uniform3fv(u.uAccent, cur.col); gl.uniform1f(u.uPx, rPx); gl.uniform1f(u.uDim, cur.dim); gl.uniform1f(u.uIntro, intro);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // continents
    gl.useProgram(P.land.p); bind(B.land, [3, 3, 1]);
    u = P.land.u;
    gl.uniformMatrix3fv(u.uRot, false, transposed(M)); gl.uniform2fv(u.uCenter, center); gl.uniform2fv(u.uScale, scale); gl.uniform3fv(u.uSun, SUN);
    gl.uniform1f(u.uPx, rPx); gl.uniform1f(u.uDpr, dpr); gl.uniform1f(u.uIntro, intro); gl.uniform1f(u.uTime, time); gl.uniform1f(u.uDim, cur.dim);
    gl.drawArrays(gl.POINTS, 0, landCount);

    // arcs, cities, satellites
    let n = 0;
    const put = (x, y, z, c, a, size, kind) => { const o = n++ * 9; SPRITES[o] = x; SPRITES[o + 1] = y; SPRITES[o + 2] = z; SPRITES[o + 3] = c[0]; SPRITES[o + 4] = c[1]; SPRITES[o + 5] = c[2]; SPRITES[o + 6] = a; SPRITES[o + 7] = size; SPRITES[o + 8] = kind; };
    const tf = (m, x, y, z) => [m[0] * x + m[1] * y + m[2] * z, m[3] * x + m[4] * y + m[5] * z, m[6] * x + m[7] * y + m[8] * z];
    if (arcT > 0) {
      ARC.forEach((arc, k) => {
        const shown = Math.min(1, Math.max(0, (arcT - k * .18) / .9)), head = (time * (.16 + .05 * (k % 3)) + k * .37) % 1, col = arc.home ? GOLD : MINT;
        for (let s = 0; s <= SEG; s++) {
          const t = s / SEG; if (t > shown) break;
          let gap = head - t; if (gap < 0) gap += 1;
          const glow = Math.exp(-gap * 9), p = tf(M, arc.pts[s * 3], arc.pts[s * 3 + 1], arc.pts[s * 3 + 2]);
          put(p[0], p[1], p[2], col, (.11 + glow * .95) * Math.min(1.2, cur.arc), (1.5 + glow * 2.6) * ss, 0);
        }
      });
      const fade = Math.min(1, arcT / .8);
      CITY.forEach((c, k) => {
        const p = tf(M, c[0], c[1], c[2]), col = k ? MINT : GOLD;
        put(p[0], p[1], p[2], col, .95 * fade, (k ? 5.5 : 8) * ss, 0);
        put(p[0], p[1], p[2], col, .55 * fade * cur.arc, (k ? 30 : 46) * ss, 1 + (time * .45 + k * .31) % 1);
      });
    }
    const satFade = Math.min(1, Math.max(0, (intro - .45) / .55));
    if (satFade > 0) {
      const F = mul(frame, rotY(time * .02));
      SAT.forEach((s, k) => {
        const act = cur.act[k], th = time * s.w + s.ph, dir = Math.sign(s.w);
        const at = a => tf(F, s.R * (Math.cos(a) * s.u[0] + Math.sin(a) * s.v[0]), s.R * (Math.cos(a) * s.u[1] + Math.sin(a) * s.v[1]), s.R * (Math.cos(a) * s.u[2] + Math.sin(a) * s.v[2]));
        for (let i = 0; i < RING; i++) { const p = at(i / RING * 6.2832); put(p[0], p[1], p[2], s.col, (.03 + .17 * act * act) * satFade, 1.3 * ss, 0); }
        for (let j = 0; j < TRAIL; j++) { const f = 1 - j / TRAIL, p = at(th - j * .02 * dir); put(p[0], p[1], p[2], s.col, Math.pow(f, 1.7) * (.25 + .75 * act) * satFade, (1.2 + 3.6 * f * f) * ss * (.8 + .5 * act), 0); }
        const p = at(th); put(p[0], p[1], p[2], s.col, .5 * act * satFade, 18 * ss, 0);
      });
    }
    gl.useProgram(P.sprite.p); bind(B.sprite, [3, 4, 2]);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, SPRITES.subarray(0, n * 9));
    u = P.sprite.u;
    gl.uniform2fv(u.uCenter, center); gl.uniform2fv(u.uScale, scale); gl.uniform1f(u.uDpr, dpr); gl.uniform1f(u.uDim, cur.dim);
    gl.drawArrays(gl.POINTS, 0, n);
  }

  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(.05, (now - last) / 1000 || .016); last = now;
    draw(dt);
    // if the device can't keep up once the intro is done, render fewer pixels
    if (intro >= 1 && maxDpr > 1) { slow += dt; if (++slowN === 90) { if (slow / 90 > .03) { maxDpr = Math.max(1, maxDpr - .5); needSize = true; } slow = 0; slowN = 0; } }
  }
  const start = () => { if (!raf && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  try { setup(); } catch (err) { canvas.remove(); sky.classList.remove('gl'); return; }
  resize();
  if (calm) {
    // reduced motion: one finished, still frame
    intro = 1; arcT = 99; time = 14;
    const still = () => { needSize = true; draw(0); };
    still(); addEventListener('resize', still);
  } else {
    if (scrollY > innerHeight * .5) { intro = 1; arcT = 99; }   // reloaded mid-page: skip the intro
    addEventListener('resize', () => { needSize = true; });
    addEventListener('load', () => { needSize = true; });
    if (matchMedia('(pointer:fine)').matches) addEventListener('pointermove', e => { tx = e.clientX / innerWidth * 2 - 1; ty = e.clientY / innerHeight * 2 - 1; }, { passive: true });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    start();
  }
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); stop(); });
  canvas.addEventListener('webglcontextrestored', () => { try { setup(); needSize = true; calm ? draw(0) : start(); } catch (err) { /* stay on the fallback */ } });
})();
