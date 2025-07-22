"use client";

import React from 'react';
import PageLayout from '@/layouts/page-layout';
import { marked } from 'marked';

// Interface para as props que podem ser passadas para a página
interface MarkdownPageProps {
  title: string;
  description?: string;
  markdownContent: string;
  lastUpdated?: string;
}

/**
 * Página que renderiza conteúdo Markdown dentro do layout padrão
 * Pode ser usada para várias páginas de conteúdo estático como termos, políticas, etc.
 */
export default function MarkdownPage({ 
  title, 
  description, 
  markdownContent,
  lastUpdated 
}: MarkdownPageProps) {
  // Converter o markdown para HTML
  const htmlContent = React.useMemo(() => {
    return { __html: marked(markdownContent) };
  }, [markdownContent]);

  return (
    <PageLayout 
      title={title} 
      description={description}
    >
      {/* Renderiza o HTML convertido do markdown */}
      <div 
        className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700" 
        dangerouslySetInnerHTML={htmlContent}
      />
      
      {/* Exibe a data de última atualização se fornecida */}
      {lastUpdated && (
        <div className="mt-16 pt-4 border-t border-gray-200 text-sm text-gray-500">
          <p>Última atualização: {lastUpdated}</p>
        </div>
      )}
    </PageLayout>
  );
}
