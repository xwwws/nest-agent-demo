"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 用 react-markdown 渲染后端返回的 markdown 内容。
// - remark-gfm: 支持表格、任务列表、删除线等 GFM 扩展
// - react-markdown 默认转义原始 HTML，避免任意 HTML 注入
// 这里用自定义 components 给各元素套上 Tailwind 排版样式
export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="[&_*]:leading-relaxed [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:my-1 [&_ul]:pl-6 [&_ol]:pl-6 [&_h1]:my-3 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:my-3 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:my-2 [&_h3]:font-semibold [&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:text-gray-500 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-gray-900 [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-100 [&_table]:my-2 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_a]:text-blue-600 [&_a]:underline">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}