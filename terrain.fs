uniform vec3 color;

#if NUM_DIR_LIGHTS > 0
    struct DirectionalLight {
        vec3 direction;
        vec3 color;
    };
    uniform DirectionalLight directionalLights[NUM_DIR_LIGHTS];
#endif
 
uniform vec3 ambientLightColor;

varying vec3 vNormal;

void main() 
{
    vec3 nhat = normalize(vNormal);

    float dirLight = abs(dot(nhat, directionalLights[0].direction));

    gl_FragColor = vec4(dirLight * ambientLightColor, 1.);
}