"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function PostModal({ post, comments, isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xl transition-all duration-300" />
      {/* Modal card */}
      <div
        ref={modalRef}
        className="glassmorphism-card relative z-10 max-w-2xl w-full mx-4 p-8 rounded-2xl shadow-2xl animate-fade-in-up max-h-[90vh] overflow-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-orange-500 p-2 rounded-full bg-gray-800/50"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{post.title}</h2>
          <p className="text-white mb-4">{post.content}</p>
          {post.imageUrl && (
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Comments</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {comments && comments.length > 0 ? (
              comments.map((c) => (
                <div key={c.id} className="bg-gray-800/60 rounded-lg p-3">
                  <p className="text-white font-medium">
                    {c.user?.name || "User"}
                  </p>
                  <p className="text-gray-300 text-sm">{c.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
