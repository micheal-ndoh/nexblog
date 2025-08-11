"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeExternalLinks from "rehype-external-links";

type MarkdownProps = {
  content: string;
  className?: string;
};

// Extend the default sanitize schema to allow some useful attributes
const extendedSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), ["className"]],
    pre: [...(defaultSchema.attributes?.pre || []), ["className"]],
    span: [...(defaultSchema.attributes?.span || []), ["className"]],
    img: [
      ...(defaultSchema.attributes?.img || []),
      ["className"],
      ["loading"],
      ["decoding"],
      ["sizes"],
      ["srcSet"],
    ],
    a: [
      ...(defaultSchema.attributes?.a || []),
      ["className"],
      ["target"],
      ["rel"],
    ],
    ul: [...(defaultSchema.attributes?.ul || []), ["className"]],
    ol: [...(defaultSchema.attributes?.ol || []), ["className"]],
    li: [...(defaultSchema.attributes?.li || []), ["className"]],
    p: [...(defaultSchema.attributes?.p || []), ["className"]],
    h1: [...(defaultSchema.attributes?.h1 || []), ["className"]],
    h2: [...(defaultSchema.attributes?.h2 || []), ["className"]],
    h3: [...(defaultSchema.attributes?.h3 || []), ["className"]],
    h4: [...(defaultSchema.attributes?.h4 || []), ["className"]],
    h5: [...(defaultSchema.attributes?.h5 || []), ["className"]],
    h6: [...(defaultSchema.attributes?.h6 || []), ["className"]],
    blockquote: [
      ...(defaultSchema.attributes?.blockquote || []),
      ["className"],
    ],
    table: [...(defaultSchema.attributes?.table || []), ["className"]],
    thead: [...(defaultSchema.attributes?.thead || []), ["className"]],
    tbody: [...(defaultSchema.attributes?.tbody || []), ["className"]],
    tr: [...(defaultSchema.attributes?.tr || []), ["className"]],
    th: [...(defaultSchema.attributes?.th || []), ["className"]],
    td: [...(defaultSchema.attributes?.td || []), ["className"]],
  },
};

export function Markdown({ content, className = "" }: MarkdownProps) {
  return (
    <div
      className={[
        // Container typography and colors
        "text-white leading-relaxed text-sm sm:text-base",
        // Vertical rhythm
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className,
      ].join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[
          [rehypeSanitize, extendedSchema],
          [
            rehypeExternalLinks,
            { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] },
          ],
        ]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="mt-6 mb-3 text-2xl sm:text-3xl font-bold"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="mt-6 mb-3 text-xl sm:text-2xl font-bold"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="mt-5 mb-2 text-lg sm:text-xl font-semibold"
              {...props}
            />
          ),
          p: ({ node, ...props }) => <p className="my-3 sm:my-4" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="my-3 sm:my-4 list-disc pl-5 sm:pl-6 space-y-2"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="my-3 sm:my-4 list-decimal pl-5 sm:pl-6 space-y-2"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="my-4 border-l-4 border-orange-500/60 pl-4 italic text-gray-200"
              {...props}
            />
          ),
          code: ({ className: codeClassName, children, ...restProps }: any) => {
            const isInline = Boolean((restProps as any).inline);
            const hasLang = /language-/.test(codeClassName || "");
            if (isInline) {
              return (
                <code
                  className={`px-1.5 py-0.5 rounded bg-gray-800/80 text-orange-200 ${
                    codeClassName || ""
                  }`}
                  {...restProps}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className={`block ${
                  codeClassName ||
                  (hasLang ? codeClassName : "language-plaintext")
                } `}
                {...restProps}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre
              className="my-4 overflow-x-auto rounded-lg bg-gray-900/80 p-4 text-xs sm:text-sm"
              {...props}
            />
          ),
          img: ({ node, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="my-3 sm:my-4 max-w-full h-auto rounded"
              loading="lazy"
              decoding="async"
              {...props}
              alt={(props.alt as string) || "Image"}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="my-4 w-full overflow-x-auto">
              <table
                className="w-full border-collapse text-left text-sm sm:text-base"
                {...props}
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="border-b border-gray-700 px-3 py-2 font-semibold"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="border-b border-gray-800 px-3 py-2" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-gray-700" {...props} />
          ),
        }}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}

export default Markdown;
