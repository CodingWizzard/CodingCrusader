// File: glassShaderMaterial.js
// Description: Factory function to create and configure the custom glass ShaderMaterial for Babylon.js.

/**
 * Creates a custom glass shader material for Babylon.js.
 * This material simulates effects like refraction, normal mapping, and Fresnel.
 * @param {BABYLON.Scene} scene - The Babylon.js scene.
 * @param {string} normalTexturePath - Path to the normal map texture.
 * @returns {BABYLON.ShaderMaterial} The configured glass material.
 */
function createGlassMaterial(scene, normalMapPath) {
    // Get shader code from HTML
    const vertexShader = document.getElementById('glassVertexShader').textContent;
    const fragmentShader = document.getElementById('glassFragmentShader').textContent;

    // Create shader material
    const glassMaterial = new BABYLON.ShaderMaterial("glass", scene, {
        vertexSource: vertexShader,
        fragmentSource: fragmentShader,
    },
    {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "cameraPosition",
                  "refractionStrength", "glassColor"],
        samplers: ["textureSampler", "refractionSampler"]
    });

    // Create refraction render target
    const refractionTexture = new BABYLON.RenderTargetTexture(
        "refractionTexture",
        1024,
        scene,
        {generateMipMaps: true}
    );
    scene.customRenderTargets.push(refractionTexture);

    // Set material properties
    glassMaterial.setFloat("refractionStrength", 0.05);
    glassMaterial.setColor3("glassColor", new BABYLON.Color3(0.85, 0.85, 0.95));
    glassMaterial.setTexture("refractionSampler", refractionTexture);

    // Store refraction texture on material for access in main scene
    glassMaterial.refractionTexture = refractionTexture;

    // Enable alpha blending
    glassMaterial.alphaMode = BABYLON.Engine.ALPHA_COMBINE;

    return glassMaterial;
}

// Example of how to make createGlassMaterial available if using it in a modular way or for global access.
// This is useful if `glassShaderMaterial.js` is included as a script tag and you need to access
// `createGlassMaterial` from another script.
// if (typeof window !== 'undefined') {
//     window.MyShaders = window.MyShaders || {}; // Create a namespace if it doesn't exist
//     window.MyShaders.createGlassMaterial = createGlassMaterial;
// }
