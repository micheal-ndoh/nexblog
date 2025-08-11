"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FileUpload } from "@/components/file-upload";

export default function NewPostPage() {
  const router = useRouter();
  const { status } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          imageUrl,
          tags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
      }

      const post = await response.json();
      router.push(`/posts/${post.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glassmorphism-card rounded-xl p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
        Create New Post
      </h1>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm sm:text-base">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
            placeholder="Enter your post title..."
            required
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-vertical text-sm sm:text-base"
            placeholder="Write your post content..."
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2">
            Featured Image (Optional)
          </label>
          <FileUpload
            type="post"
            onUpload={setImageUrl}
            onError={setError}
            className="mb-2"
          >
            Upload Image
          </FileUpload>
          {imageUrl && (
            <div className="mt-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="mt-2 text-xs sm:text-sm text-red-400 hover:text-red-300"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2">
            Tags (Optional)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddTag())
              }
              className="flex-1 px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              placeholder="Add a tag..."
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs sm:text-sm"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs sm:text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-orange-300 hover:text-orange-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="submit"
            disabled={loading || !title.trim() || !content.trim()}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
