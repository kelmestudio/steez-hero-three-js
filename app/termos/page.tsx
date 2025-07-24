"use client";

import React from 'react';
import PageLayout from '@/layouts/page-layout';

export default function TermosPage() {
  return (
    <PageLayout 
      title="Termos de Uso" 
      description="Leia atentamente os termos e condições de uso da Steez"
    >
      {/* O conteúdo pode ser HTML direto ou markdown processado */}
      <section>
        <h2>1. Aceitação dos Termos</h2>
        <p>
          Ao acessar e utilizar o site e serviços da Steez, você concorda em cumprir e estar vinculado pelos seguintes termos e condições de uso. 
          Se você não concordar com algum destes termos, não utilize nosso site ou serviços.
        </p>
        
        <h2>2. Elegibilidade</h2>
        <p>
          Para utilizar nossos serviços, você deve ter pelo menos 18 anos de idade, conforme exigido pela legislação portuguesa para consumo de bebidas alcoólicas.
          Ao utilizar nosso site e serviços, você confirma que tem idade legal para consumir bebidas alcoólicas no país em que reside.
        </p>
        
        <h2>3. Propriedade Intelectual</h2>
        <p>
          Todo o conteúdo presente no site da Steez, incluindo, mas não se limitando a textos, gráficos, logotipos, ícones, 
          imagens, clipes de áudio, downloads digitais e compilações de dados, é de propriedade da Steez ou de seus fornecedores de conteúdo 
          e está protegido pelas leis portuguesas, da União Europeia e internacionais de direitos autorais.
        </p>
        
        <h2>4. Uso do Site</h2>
        <p>
          Você concorda em utilizar nosso site apenas para fins legais e de forma que não infrinja os direitos de terceiros, 
          nem restrinja ou iniba o uso e aproveitamento do site por qualquer terceiro.
        </p>
        
        <h2>5. Contas de Usuário</h2>
        <p>
          Ao criar uma conta em nosso site, você é responsável por manter a confidencialidade de suas informações de login e senha, 
          e por todas as atividades que ocorrerem em sua conta. Você concorda em notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta.
        </p>
        
        <h2>6. Compras Online</h2>
        <p>
          Ao fazer uma compra através de nosso site, você concorda com os termos de venda, incluindo preço, método de pagamento, 
          entrega e políticas de devolução conforme descritas em nosso site no momento da compra.
        </p>
        
        <h2>7. Limitação de Responsabilidade</h2>
        <p>
          A Steez não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso 
          ou incapacidade de uso de nossos serviços ou produtos.
        </p>
        
        <h2>8. Alterações nos Termos</h2>
        <p>
          Reservamo-nos o direito de modificar estes termos a qualquer momento. As modificações entrarão em vigor imediatamente após a publicação 
          dos termos atualizados. Seu uso continuado do site após tais alterações constituirá seu consentimento para as alterações.
        </p>
        
        <h2>9. Lei Aplicável e Jurisdição</h2>
        <p>
          Estes termos serão regidos e interpretados de acordo com as leis de Portugal e da União Europeia, sem consideração a seus conflitos de princípios legais. Qualquer disputa decorrente ou relacionada a estes termos será submetida à jurisdição exclusiva dos tribunais de Lisboa, Portugal.
        </p>
        
        <h2>10. Contato</h2>
        <p>
          Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato connosco através do e-mail: contacto@steez.com
        </p>
      </section>
    </PageLayout>
  );
}
