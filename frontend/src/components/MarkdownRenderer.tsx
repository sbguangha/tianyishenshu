import React from 'react'

interface MarkdownRendererProps {
  content: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderMarkdown = (text: string) => {
    // 简单的Markdown渲染逻辑
    let html = text
      // 标题渲染
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-gray-800 mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-gray-800 mb-3 mt-4">$1</h3>')
      
      // 粗体文本
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      
      // 列表项
      .replace(/^• (.*$)/gm, '<li class="ml-4 mb-2 text-gray-700">• $1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-2 text-gray-700">- $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-2 text-gray-700 list-decimal">$1</li>')
      
      // 段落
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      
    // 包装在段落标签中
    html = '<p class="mb-4 text-gray-700 leading-relaxed">' + html + '</p>'
    
    // 清理空段落
    html = html.replace(/<p class="mb-4 text-gray-700 leading-relaxed"><\/p>/g, '')
    
    return html
  }

  return (
    <div 
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}

export default MarkdownRenderer 