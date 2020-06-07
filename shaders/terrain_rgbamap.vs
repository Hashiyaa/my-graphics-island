uniform sampler2D bumpTexture;
uniform float bumpScale;

// varying vec3 vNormal;
varying vec2 vUv;

void main()
{
    // vNormal = normalMatrix * normal;
    vUv = uv;
    vec4 bumpData = texture2D(bumpTexture, uv);
    float vAmount = (bumpData.r + bumpData.g + bumpData.b) / 3.;

    vec3 newPos = position + normal * bumpScale * vAmount;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.);
}