const sh_type = `
varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    uniform vec3 uRed;
    uniform vec3 uBlue;
    uniform vec3 uYellow;

    // Random noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec3 baseColor;
      vec3 uLightDirection = vec3(0.5, 0.5, 0.5);
      vec3 uLightColor = vec3(1.0, 1.0, 1.0);

      baseColor = uBlue;

      // Calculate the Lambertian diffuse lighting
      float diffuse = max(dot(normalize(vNormal), normalize(uLightDirection)), 0.0);
      
      // Final color considering the light effect
      vec3 finalColor = baseColor * diffuse * uLightColor;
    
      // Output the final color
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `

export default sh_type
