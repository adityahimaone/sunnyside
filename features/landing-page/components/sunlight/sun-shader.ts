/**
 * The sun, in one fullscreen fragment shader.
 *
 * No geometry beyond a clip-space quad: a disc, a corona, two sets of god rays,
 * an anamorphic streak that blooms with scroll speed, and three lens ghosts on
 * the line through the middle of the frame. Output is straight (non-premult)
 * RGBA with alpha capped low, so it lays warm light over both the dark DAW and
 * the cream chassis with ordinary alpha blending, and never blows out text.
 */

export const SUN_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

export const SUN_FRAGMENT = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;

  uniform vec2 uRes;
  uniform vec2 uSun;
  uniform vec3 uColor;
  uniform float uRadius;
  uniform float uIntensity;
  uniform float uFlare;
  uniform float uTime;
  uniform float uDark;
  uniform vec2 uPointer;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(hash(i), hash(i + 1.0), f);
  }

  float ghost(vec2 uv, vec2 centre, float size, float aspect) {
    vec2 d = (uv - centre) * vec2(aspect, 1.0);
    float r = length(d);
    float ring = smoothstep(size, size * 0.82, r) * smoothstep(size * 0.55, size * 0.8, r);
    float fill = smoothstep(size, 0.0, r) * 0.18;
    return ring * 0.5 + fill;
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 sun = uSun + uPointer * 0.012;
    vec2 p = (vUv - sun) * vec2(aspect, 1.0);
    float r = length(p);
    float a = atan(p.y, p.x);

    // Disc and corona.
    float core = smoothstep(uRadius, uRadius * 0.34, r);
    float halo = exp(-r * 3.1) * 0.5 + exp(-r * 9.5) * 0.55;

    // Two counter-drifting ray fans, broken up by noise so they shimmer.
    float shimmer = noise(a * 3.0 + uTime * 0.35);
    float fanA = pow(max(0.0, sin(a * 9.0 + uTime * 0.07 + shimmer * 2.2)), 7.0);
    float fanB = pow(max(0.0, sin(a * 17.0 - uTime * 0.05 + shimmer * 3.1)), 12.0);
    float rays = (fanA * 0.55 + fanB * 0.35) * exp(-r * 2.3) * smoothstep(uRadius * 0.6, uRadius * 2.4, r);

    // Anamorphic streak: wide and flat, and it blooms when the page is flicked.
    float streak = exp(-abs(p.y) * 46.0) * exp(-abs(p.x) * (1.9 - uFlare * 0.9));
    streak *= 0.22 + uFlare * 0.55;

    // Lens ghosts along the sun → centre line, nudged by the pointer.
    vec2 axis = vec2(0.5) - sun;
    float ghosts =
      ghost(vUv, vec2(0.5) + axis * 0.35 + uPointer * 0.01, 0.045, aspect) +
      ghost(vUv, vec2(0.5) + axis * 0.7 + uPointer * 0.02, 0.085, aspect) * 0.8 +
      ghost(vUv, vec2(0.5) + axis * 1.25 + uPointer * 0.03, 0.03, aspect) * 0.9;
    ghosts *= 0.28 + uFlare * 0.4;

    float glow = core * 1.35 + halo + rays + streak + ghosts;
    glow *= uIntensity * (1.0 + uFlare * 0.45);

    // Light on cream wants to be gentler than light on the dark ground.
    float cap = mix(0.5, 0.78, uDark);
    float alpha = clamp(glow * mix(0.62, 0.9, uDark), 0.0, cap);

    vec3 colour = mix(uColor, vec3(1.0, 0.97, 0.9), clamp(core * 0.9 + halo * 0.12, 0.0, 1.0));
    gl_FragColor = vec4(colour, alpha);
  }
`

export const MOTE_VERTEX = /* glsl */ `
  attribute float aSeed;
  attribute float aDepth;
  uniform float uTime;
  uniform float uScroll;
  uniform float uFlare;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  varying float vTwinkle;

  void main() {
    vec3 pos = position;
    // Slow upward drift, wrapped inside the box. Deeper motes move less with
    // scroll, which is the whole parallax.
    float drift = uTime * (0.012 + aSeed * 0.02);
    pos.y = mod(pos.y + drift + uScroll * (2.2 + aDepth * 5.5) + 6.0, 12.0) - 6.0;
    pos.x += sin(uTime * 0.2 + aSeed * 40.0) * 0.18 + uPointer.x * aDepth * 0.35;
    pos.y += uPointer.y * aDepth * 0.2;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.8 + aSeed * 1.6) + aSeed * 60.0);
    float size = (1.6 + aSeed * 3.2) * (0.6 + aDepth) * (1.0 + uFlare * 0.6);
    gl_PointSize = size * uPixelRatio * (6.0 / -mv.z);
  }
`

export const MOTE_FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uDark;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float soft = smoothstep(0.5, 0.0, d);
    float alpha = soft * soft * vTwinkle * mix(0.42, 0.62, uDark);
    gl_FragColor = vec4(uColor, alpha);
  }
`
