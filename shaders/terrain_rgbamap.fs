// Adapt ideas from http://test.ngongo-b.net/shaderExperiment/TileBlendShader.html

uniform vec3 ambientLightColor;

uniform sampler2D splatMap;
uniform sampler2D dirtTexture;
uniform sampler2D sandTexture;
uniform sampler2D grassTexture;
uniform sampler2D rockTexture;

// varying vec3 vNormal;
varying vec2 vUv;

void main() 
{
    vec4 blend = texture2D(splatMap, vUv);
	float baseWeight = 1.0 - max(blend.r, max(blend.g, blend.b));

	vec4 base =  baseWeight * texture2D(grassTexture, vUv * 20.0);
	vec4 sand = blend.r * texture2D(sandTexture, vUv * 20.0);
	vec4 grass = blend.g * texture2D(dirtTexture, vUv * 20.0);
	vec4 rock = blend.b * texture2D(rockTexture, vUv * 20.0);
	gl_FragColor = (vec4(ambientLightColor, 1.0) + base + sand + grass + rock) / (baseWeight + blend.r + blend.g + blend.b); 
}