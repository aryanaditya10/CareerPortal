import { Job } from "../models/job.models.js";
import { User } from "../models/user.model.js";

// Utility function to calculate Cosine Similarity
const cosineSimilarity = (vecA, vecB) => {
    if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
        return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] ** 2;
        normB += vecB[i] ** 2;
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const getBestJobsForUser = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user || user.role !== 'student') {
            return res.status(403).json({
                message: "Only students can view matching jobs.",
                success: false
            });
        }

        const userEmbedding = user.profile?.resumeEmbedding;
        
        if (!userEmbedding || userEmbedding.length === 0) {
            return res.status(400).json({
                message: "Please upload a resume first to get matches.",
                success: false
            });
        }

        // Use MongoDB Atlas $vectorSearch to find the best matching jobs at database level
        const matchingJobs = await Job.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index_1", // NOTE: Ensure your Atlas index is named exactly this, or change as needed.
                    path: "jobEmbedding",
                    queryVector: userEmbedding,
                    numCandidates: 100,
                    limit: 10
                }
            },
            {
                $lookup: {
                    from: "companies", // standard mongoose pluralization
                    localField: "company",
                    foreignField: "_id",
                    as: "company"
                }
            },
            {
                $unwind: {
                    path: "$company",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $set: {
                    matchScore: { $meta: "vectorSearchScore" }
                }
            }
        ]);

        return res.status(200).json({
            message: "Matching jobs fetched successfully",
            jobs: matchingJobs.slice(0, 10), // return top 10
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getBestCandidatesForJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        const jobEmbedding = job.jobEmbedding;
        
        if (!jobEmbedding || jobEmbedding.length === 0) {
            return res.status(400).json({
                message: "This job does not have embedding data yet. Please update the job.",
                success: false
            });
        }

        // Use MongoDB Atlas $vectorSearch for Candidates
        const matchingCandidates = await User.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index_1", // NOTE: Match this with your Atlas index name
                    path: "profile.resumeEmbedding",
                    queryVector: jobEmbedding,
                    numCandidates: 100,
                    limit: 5
                }
            },
            {
                // We must filter for 'student' role after the search, just in case any non-students accidentally got embeddings.
                // Note: For large scale, you should add 'role' to your Atlas index 'filter' configuration and pass the filter inside $vectorSearch instead.
                $match: {
                    role: "student"
                }
            },
            {
                $set: {
                    matchScore: { $meta: "vectorSearchScore" }
                }
            },
            {
                $project: {
                    _id: 1,
                    fullname: 1,
                    email: 1,
                    profile: 1,
                    matchScore: 1
                }
            }
        ]);

        return res.status(200).json({
            message: "Matching candidates fetched successfully",
            candidates: matchingCandidates.slice(0, 10), // return top 10
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
