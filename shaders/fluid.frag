#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform float u_waves[30]; // 10 waves max: x, y, age for each
uniform int u_waveCount;
uniform vec2 u_resolution;

varying vec2 vTexCoord;

// Alex Grey-like color palette
vec3 palette(float t) {
  return vec3(
    0.6 + 0.4 * cos(6.2831 * (t + 0.0)),
    0.6 + 0.4 * cos(6.2831 * (t + 0.33)),
    0.6 + 0.4 * cos(6.2831 * (t + 0.67))
  );
}

void main() {
  // Normalize coordinates from (-1,-1) to (1,1)
  vec2 uv = vTexCoord * 2.0 - 1.0;
  float v = 0.0;
  for (int i = 0; i < 10; i++) {
    if (i >= u_waveCount) break;
    float x = u_waves[i*3+0]*2.0 - 1.0;
    float y = u_waves[i*3+1]*2.0 - 1.0;
    float age = u_waves[i*3+2];
    float d = length(uv - vec2(x, y));
    v += exp(-d*10.0) * (1.0 - age);
  }
  float t = 0.8 * u_time + v * 1.8;
  gl_FragColor = vec4(palette(mod(t,1.0)), 0.96 * (0.9 + 0.1*v));
}
