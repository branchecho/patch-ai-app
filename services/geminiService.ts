import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

/**
 * Generates a product mockup based on an input patch image and a scenario prompt.
 */
export const generateMockup = async (
  imageBase64: string,
  scenarioPrompt: string,
  customInstruction?: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  // Clean base64 string if it contains metadata header
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  // Logic: If the user provides a custom description, it overrides the default scenario context partially or fully
  const targetContext = customInstruction && customInstruction.trim().length > 0 
    ? `User Custom Requirement (HIGHEST PRIORITY): ${customInstruction}` 
    : `Default Scenario: ${scenarioPrompt}`;

  const prompt = `
    TASK: Realistic Product Composite Photography for Embroidery Patches.
    
    INPUT: An image containing one or more embroidery patches.
    INPUT METADATA: User Scenario: "${targetContext}".
    
    *** CRITICAL REQUIREMENT 1: PRESERVE PATCH FIDELITY (DO NOT REDRAW) ***
    - The patch in the output MUST appear identical to the input patch in terms of: Design, Color, Stitch Texture, Shape, and Aspect Ratio.
    - DO NOT simplify, cartoonize, or "style transfer" the patch art.
    - Treat the input patch as a rigid texture that needs to be mapped onto a 3D surface.
    
    *** CRITICAL REQUIREMENT 2: INTELLIGENT SCALING (READ DIMENSIONS) ***
    - DETECT TEXT: Scan the input image for dimension markers (e.g., "3 inch", "7.5cm", ruler lines).
    - APPLY REAL SCALE: Use this text to determine how big the patch should be relative to the target item.
      - Example: If text says "2 inches", the patch should look small on a Tote Bag.
      - Example: If text says "10 inches", the patch should cover a large portion of a Jacket Back.
    - If no text is found, assume a standard versatile size (approx 3-4 inches / 8-10cm).
    
    *** CRITICAL REQUIREMENT 3: ARTIFACT REMOVAL ***
    - REMOVE: Dimension lines, size text, arrows, pointer text, and white background borders from the source image.
    - KEEP: Only the clean embroidered patch content.

    *** CRITICAL REQUIREMENT 4: IRON-ON REALISM ***
    - **Surface Interaction**: The patch must follow the curvature and folds of the target object (e.g., curving around a hat, rippling on a shirt).
    - **Texture Integration**: The patch must look "pressed" into the fabric. The underlying fabric texture (denim twill, canvas weave) should slightly influence the lighting on the patch, but NOT change the embroidery pattern.
    - **Edges**: Edges must be flush with the fabric. NO floating, NO white sticker borders, NO 3D extrusion shadows. It should look like a heat-pressed iron-on patch.

    *** CRITICAL REQUIREMENT 5: RICH ENVIRONMENT (BACKGROUNDS) ***
    - **MANDATORY**: Generate a full, realistic background suitable for the item.
    - Do NOT generate a plain fabric close-up unless explicitly requested.
    - Examples: 
      - Pencil Case -> On a wooden study desk with books and a lamp.
      - Tote Bag -> On a cafe chair or held in a park setting.
      - Hat -> On a retail display shelf or worn by a model (headless/blurred).
      - Jeans -> Laid on a bed or worn in a lifestyle shot.

    *** CRITICAL REQUIREMENT 6: MULTI-PATCH HANDLING ***
    - If the input image has multiple distinct patches, SEPARATE them.
    - Do NOT paste them as a single rectangular block.
    - Place them naturally on the item.

    Output format: Return only the generated image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanBase64,
            },
          },
        ],
      },
      config: {
        // requesting high quality image generation
        temperature: 0.4, 
      }
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated.");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};