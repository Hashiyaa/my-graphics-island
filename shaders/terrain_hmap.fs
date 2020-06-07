uniform vec3 ambientLightColor;

uniform sampler2D dirtTexture;
uniform sampler2D sandTexture;
uniform sampler2D grassTexture;
uniform sampler2D rockTexture;

varying float vAmount;
// varying vec3 vNormal;
varying vec2 vUv;

void main() 
{
    // vec3 nhat = normalize(vNormal);
    // float dirLight = abs(dot(nhat, directionalLights[0].direction));

    // vAmount ranges from 0.0 to 1.0
    vec4 sand = (smoothstep(0.0, 0.05, vAmount) - smoothstep(0.05, 0.15, vAmount)) * texture2D(sandTexture, vUv * 20.0);
    vec4 grass = (smoothstep(0.05, 0.15, vAmount) - smoothstep(0.15, 0.30, vAmount)) * texture2D(grassTexture, vUv * 20.0);
	vec4 dirt = (smoothstep(0.15, 0.30, vAmount) - smoothstep(0.30, 0.50, vAmount)) * texture2D(dirtTexture, vUv * 20.0);
	vec4 rock = (smoothstep(0.30, 0.50, vAmount)) * texture2D(rockTexture, vUv * 20.0);

    gl_FragColor = (vec4(ambientLightColor, 1.) + sand + grass + dirt + rock);
}