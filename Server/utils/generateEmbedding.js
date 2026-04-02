import { pipeline, env } from "@xenova/transformers";

// Configure transformers cache and locations
env.allowLocalModels = true; // allow loading from local cache
env.allowRemoteModels = true; // allow fetching the model from HF the very first time

// Define a singleton pipeline so we don't load the model into RAM multiple times per request
class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

export const generateEmbedding = async (text) => {
    try {
        if (!text || text.trim().length === 0) return [];

        // Clean and truncate text if it is too long (Hugging Face models usually have token limits, 512 for MiniLM)
        // We'll take roughly the first 2000 characters which usually fits safely in 512 tokens.
        const truncateText = text.substring(0, 2000);

        const extractor = await PipelineSingleton.getInstance();
        
        // Compute embedding using mean pooling and L2 normalization to ensure accurate Cosine Similarity
        const output = await extractor(truncateText, { pooling: 'mean', normalize: true });

        // the output.data is a Float32Array containing the 384 dimensions. Array.from converts to standard native Array of Floats.
        return Array.from(output.data);
    } catch (error) {
        console.error("Error generating local embedding:", error);
        return [];
    }
}
