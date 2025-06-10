// File: glass.vertex.fx
// Description: Vertex shader for the glass effect.
// Responsibilities:
// 1. Transform vertex positions to clip space.
// 2. Pass world space position, normal, and UV coordinates to the fragment shader.

precision highp float; // Use high precision for float variables

// Attributes: Input data from the mesh geometry
attribute vec3 position; // Vertex position in local space
attribute vec3 normal;   // Vertex normal in local space
attribute vec2 uv;       // Vertex UV coordinates (for texture mapping)

// Uniforms: Data passed from JavaScript, constant for all vertices in a draw call
uniform mat4 world;                 // World matrix: transforms from local to world space
uniform mat4 worldView;             // Combined world and view matrix
uniform mat4 worldViewProjection;   // Combined world, view, and projection matrix

// Varying: Data passed from the vertex shader to the fragment shader (interpolated per fragment)
varying vec3 vPositionW; // Vertex position in world space
varying vec3 vNormalW;   // Vertex normal in world space
varying vec2 vUV;        // Vertex UV coordinates

void main(void) {
    // Transform vertex position to clip space for rendering
    vec4 outPosition = worldViewProjection * vec4(position, 1.0);
    gl_Position = outPosition;
    
    // Transform vertex position from local to world space
    vPositionW = vec3(world * vec4(position, 1.0)); // Store the world position for the fragment shader

    // Transform vertex normal from local to world space
    // Assumes uniform scaling. For non-uniform scaling, use: normalize(mat3(transpose(inverse(world))) * normal);
    vNormalW = normalize(vec3(world * vec4(normal, 0.0))); // Store the world normal for the fragment shader

    // Pass UV coordinates directly to the fragment shader
    vUV = uv;
}
