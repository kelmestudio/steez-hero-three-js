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
          Ao acederes e utilizares o site e serviços da Steez, concordas em cumprir e estar vinculado pelos seguintes termos e condições de uso. 
          Se não concordares com algum destes termos, não utilizes o nosso site ou serviços.
        </p>
        
        <h2>2. Elegibilidade</h2>
        <p>
          Para utilizares os nossos serviços, deves ter pelo menos 18 anos de idade, conforme exigido pela legislação portuguesa para consumo de bebidas alcoólicas.
          Ao utilizares o nosso site e serviços, confirmas que tens idade legal para consumir bebidas alcoólicas no país em que resides.
        </p>
        
        <h2>3. Propriedade Intelectual</h2>
        <p>
          Todo o conteúdo presente no site da Steez, incluindo, mas não se limitando a textos, gráficos, logotipos, ícones, 
          imagens, clipes de áudio, downloads digitais e compilações de dados, é de propriedade da Steez ou dos fornecedores de conteúdo da Steez 
          e está protegido pelas leis portuguesas, da União Europeia e internacionais de direitos autorais.
        </p>
        
        <h2>4. Uso do Site</h2>
        <p>
          Concordas em utilizar o nosso site apenas para fins legais e de forma que não infrinja os direitos de terceiros, 
          nem restrinja ou iniba o uso e aproveitamento do site por qualquer terceiro.
        </p>
        
        <h2>5. Contas de Utilizador</h2>
        <p>
          Ao criares uma conta no nosso site, és responsável por manter a confidencialidade das tuas informações de login e palavra-passe, 
          e por todas as actividades que ocorram na tua conta. Concordas em notificar-nos imediatamente sobre qualquer uso não autorizado da tua conta.
        </p>
        
        <h2>6. Compras Online</h2>
        <p>
          Ao fazeres uma compra através do nosso site, concordas com os termos de venda, incluindo preço, método de pagamento, 
          entrega e políticas de devolução conforme descritas no nosso site no momento da compra.
        </p>
        
        <h2>7. Limitação de Responsabilidade</h2>
        <p>
          A Steez não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso 
          ou incapacidade de uso de nossos serviços ou produtos.
        </p>
        
        <h2>8. Alterações nos Termos</h2>
        <p>
          Reservamo-nos o direito de modificar estes termos a qualquer momento. As modificações entrarão em vigor imediatamente após a publicação 
          dos termos actualizados. O teu uso continuado do site após tais alterações constituirá o teu consentimento para as alterações.
        </p>
        
        <h2>9. Lei Aplicável e Jurisdição</h2>
        <p>
          Estes termos serão regidos e interpretados de acordo com as leis de Portugal e da União Europeia, sem consideração aos conflitos de princípios legais. Qualquer disputa decorrente ou relacionada a estes termos será submetida à jurisdição exclusiva dos tribunais de Lisboa, Portugal.
        </p>
        
        <h2>10. Contacto</h2>
        <p>
          Se tiveres alguma dúvida sobre estes Termos de Uso, entra em contacto connosco através do e-mail: contacto@steez.com
        </p>
      </section>
    </PageLayout>
  );
}
