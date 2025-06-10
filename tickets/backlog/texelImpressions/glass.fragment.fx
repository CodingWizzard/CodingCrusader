// File: glass.fragment.fx
// Description: Fragment shader for the glass effect.
// Responsibilities:
// 1. Simulate refraction using UV distortion based on a normal map.
// 2. Apply normal mapping for surface detail.
// 3. Calculate Fresnel effect for edge highlights/reflectivity.
// 4. Combine effects and apply color and opacity.

precision highp float;

// Varying: Data received from the vertex shader (interpolated per fragment)
varying vec3 vPositionW; // Fragment position in world space
varying vec3 vNormalW;   // Fragment normal in world space (from vertex, pre-normal mapping)
varying vec2 vUV;        // Fragment UV coordinates

// Uniforms: Data passed from JavaScript, constant for all fragments in a draw call
uniform vec3 cameraPosition;      // Camera position in world space (needed for view direction)
uniform sampler2D textureSampler; // Texture containing the scene rendered from glass object's perspective (for refraction)
uniform sampler2D refractionSampler; // Texture containing the scene rendered from glass object's perspective (for refraction)
uniform float refractionStrength; // Controls the magnitude of UV distortion for refraction (0.0 to 1.0)
uniform vec3 glassColor;          // Base color of the glass (RGB, 0.0 to 1.0)

// Constants
const float R0 = 0.02; // Fresnel reflection coefficient at normal incidence
const float IOR = 1.52; // Index of refraction for glass

void main(void) {
    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
    vec3 normalW = normalize(vNormalW);
    
    // Calculate fresnel term
    float fresnelTerm = R0 + (1.0 - R0) * pow(1.0 - dot(viewDirectionW, normalW), 5.0);
    
    // Calculate refraction
    vec3 refractionVector = refract(-viewDirectionW, normalW, 1.0/IOR);
    vec2 refractionCoords = vUV + refractionVector.xy * refractionStrength;
    vec4 refractionColor = texture2D(refractionSampler, refractionCoords);
    
    // Final color
    vec4 finalColor = mix(refractionColor, vec4(glassColor, 1.0), 0.1);
    finalColor.rgb += fresnelTerm * 0.5; // Add fresnel highlight
    
    gl_FragColor = finalColor;
}
