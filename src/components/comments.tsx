"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useT } from "@/lib/tolgee";
import EmojiPicker from "emoji-picker-react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface CommentsProps {
  postId: string;
  initialComments: Comment[];
}

type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

export function Comments({ postId, initialComments }: CommentsProps) {
  const { data: session } = useSession();
  const { t } = useT();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [emojiTheme, setEmojiTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setEmojiTheme("dark");
    } else {
      setEmojiTheme("light");
    }
  }, []);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session?.user) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t("general.error"));
      }

      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      setError(error instanceof Error ? error.message : t("general.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!session?.user) return;

    try {
      const response = await fetch(
        `/api/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t("general.error"));
      }

      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      setError(error instanceof Error ? error.message : t("general.error"));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Comment Form */}
      {session?.user && (
        <div className="glassmorphism-card rounded-lg p-3 sm:p-4">
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("comments.placeholder")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical text-sm sm:text-base"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-2 bottom-2 text-lg sm:text-xl"
                onClick={() => setShowEmojiPicker((v) => !v)}
                tabIndex={-1}
                aria-label="Add emoji"
              >
                😊
              </button>
              {showEmojiPicker && (
                <div className="absolute z-10 bottom-12 right-0">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      const emojiChar = emojiData.emoji;
                      if (textareaRef.current) {
                        const start = textareaRef.current.selectionStart;
                        const end = textareaRef.current.selectionEnd;
                        const before = newComment.slice(0, start);
                        const after = newComment.slice(end);
                        setNewComment(before + emojiChar + after);
                        setTimeout(() => {
                          textareaRef.current?.focus();
                          textareaRef.current?.setSelectionRange(
                            start + emojiChar.length,
                            start + emojiChar.length
                          );
                        }, 0);
                      } else {
                        setNewComment(newComment + emojiChar);
                      }
                      setShowEmojiPicker(false);
                    }}
                    theme={emojiTheme}
                  />
                </div>
              )}
            </div>
            {error && (
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? t("comments.posting") : t("comments.post")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3 sm:space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">
            {t("comments.noCommentsMessage")}
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="glassmorphism-card rounded-lg p-3 sm:p-4"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <Link
                  href={`/users/${comment.author.id}`}
                  className="hover:opacity-80 transition-opacity flex-shrink-0"
                >
                  {comment.author.image ? (
                    <img
                      src={comment.author.image}
                      alt={comment.author.name || "User"}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
                      {comment.author.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-1">
                    <Link
                      href={`/users/${comment.author.id}`}
                      className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm hover:text-primary transition-colors truncate"
                    >
                      {comment.author.name || "Anonymous"}
                    </Link>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
                {(session?.user as SessionUser)?.id === comment.author.id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                    title={t("comments.delete")}
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
