/**
 * GLSL Shaders for Liquid Fluid Background
 * Creates a liquid mercury/quicksilver effect with mouse interaction
 */

export const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Легкое искажение сетки (волны)
    float noiseFreq = 2.5;
    float noiseAmp = 0.15;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
    pos.z += sin(noisePos.x) * noiseAmp;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  // Функция шума (упрощенная)
  float random (in vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float noise (in vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    // Искажаем координаты UV с помощью шума и времени
    vec2 distortedUv = vUv;
    distortedUv.x += noise(vUv * 10.0 + uTime * 0.2) * 0.1;
    
    // Создаем градиент на основе мыши
    float dist = distance(vUv, uMouse);
    float strength = smoothstep(0.8, 0.2, dist); // Пятно света
    
    // Смешиваем цвета: Темный фон + Цвет при наведении
    vec3 finalColor = mix(uColor1, uColor2, strength * 0.6);
    
    // Добавляем "шум" сверху для текстуры
    float grain = random(vUv * uTime) * 0.05;
    
    gl_FragColor = vec4(finalColor + grain, 1.0);
  }
`

