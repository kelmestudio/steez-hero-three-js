"use client";

import React from 'react';
import MarkdownPage from '@/layouts/markdown-page';

// Conteúdo em markdown para a página de FAQ
const faqMarkdown = `
# Perguntas Frequentes sobre a Steez

## O que é Steez?

A Steez foi pensada para quem se preocupa com o corpo mas não abdica da diversão. É baixa em calorias, sem açúcares adicionados.

## Qual é o teor alcoólico da Steez?

A Steez contém 5% de álcool por volume, o que a coloca na mesma categoria de bebidas como cerveja artesanal e hard seltzers.

## A Steez é vegana?

Sim! Todos os nossos produtos são 100% veganos e não contêm ingredientes de origem animal.

## A Steez dá ressaca?

Como qualquer bebida alcoólica, tudo depende da quantidade e do seu corpo. Mas por ser leve e limpa, ajuda a evitar aquele peso no dia seguinte.

## A Steez contém glúten?

Não, a Steez é naturalmente sem glúten, o que a torna adequada para pessoas com intolerância ao glúten ou doença celíaca.

## Onde posso comprar Steez?

Você pode comprar Steez diretamente em nosso site, em lojas selecionadas ou em bares e restaurantes parceiros em todo o país.

## Fazem envios para todo o país?

Sim, fazemos envios para todo o território continental. Açores e Madeira estarão disponíveis em breve.

## Quero vender Steez no meu espaço. Como faço?

Ótimo! Entre em contato connosco através do e-mail comercial@steez.com para discutirmos uma parceria.

## Quais sabores estão disponíveis?

Atualmente, oferecemos quatro sabores: Limão, Pêssego, Tangerina e Berry Mix. Estamos sempre trabalhando em novos sabores, então fique atento!

## A Steez tem validade?

Sim, cada lata tem validade de 12 meses a partir da data de fabricação, que está impressa na parte inferior da lata.
`;

export default function FaqExtendedPage() {
  return (
    <MarkdownPage 
      title="Perguntas Frequentes" 
      description="Tudo o que você precisa saber sobre a Steez"
      markdownContent={faqMarkdown}
      lastUpdated="15 de julho de 2025"
    />
  );
}
