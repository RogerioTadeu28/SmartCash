# 💰 Smart Cash – Controle Financeiro

Aplicação web para controle de finanças pessoais com **Dashboard interativo**, **cadastro de movimentações**, **filtros**, **tabela dinâmica** e **gráfico de evolução** (semanal/mensal). Desenvolvida com **HTML, CSS e JavaScript Vanilla**, com persistência local via `localStorage`.

![Preview do Projeto](https://via.placeholder.com/800x400?text=Smart+Cash+Preview)
*(Substitua pelo link da sua imagem, se desejar)*

---

## 🚀 Funcionalidades

- ✅ **Dashboard** com indicadores:
  - Total de Entradas
  - Total de Saídas
  - Saldo Atual (com cores: verde/vermelho)
  - Maior Categoria de Gasto
- ✅ **Cadastro de movimentações** com:
  - Descrição, valor, tipo (entrada/saída), categoria e data
- ✅ **Edição e exclusão** de transações
- ✅ **Filtros** por descrição e categoria
- ✅ **Tabela** com todas as movimentações (ordenada por data)
- ✅ **Gráfico de barras** com evolução de entradas e saídas:
  - Visualização **semanal** ou **mensal** (seletor)
- ✅ **Persistência local** – dados salvos no `localStorage`
- ✅ **Design responsivo** – adapta-se a dispositivos móveis e desktops
- ✅ **Notificações toast** para feedback das ações

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia          | Finalidade                                                         |
|---------------------|--------------------------------------------------------------------|
| **HTML5**           | Estrutura semântica da aplicação                                   |
| **CSS3**            | Estilização moderna, responsiva e com transições suaves            |
| **JavaScript Vanilla** | Lógica de negócio, manipulação do DOM, eventos e persistência    |
| **Chart.js**        | Biblioteca para criação do gráfico de barras                       |
| **LocalStorage**    | Persistência de dados no navegador, sem necessidade de backend     |

---

## 📁 Estrutura do Projeto
📂 smart-cash/
├── 📄 index.html # Página principal (estrutura)
├── 📄 style.css # Estilos e responsividade
├── 📄 script.js # Lógica completa da aplicação
└── 📄 README.md # Este arquivo


> **Nota:** O projeto é composto por três arquivos (HTML, CSS e JS) que podem ser usados separadamente ou combinados em um único arquivo, conforme preferência.

---

## ▶️ Como Executar

1. **Baixe ou clone** este repositório:
   ```bash
   git clone https://github.com/seu-usuario/smart-cash.git

 2.Navegue até a pasta e abra o arquivo index.html em seu navegador favorito.

     Não é necessário servidor web, pois tudo roda no lado do cliente.

 3.Comece a usar – os dados de exemplo já estão carregados, mas você pode adicionar, editar ou excluir transações à vontade.

📌 Funcionalidades em Detalhe
📊 Dashboard

    Exibe resumo financeiro em cards coloridos.

    Atualização automática sempre que os dados são alterados.

    Destaque visual para saldo positivo (verde) ou negativo (vermelho).

📝 Formulário de Cadastro

    Campos: descrição, valor, tipo (entrada/saída), categoria e data.

    Validação de campos obrigatórios.

    Suporte a edição – ao clicar em "Editar" em uma transação, o formulário é preenchido com seus dados.

🔍 Filtros

    Busca por descrição – filtra em tempo real.

    Filtro por categoria – exibe apenas transações de uma categoria específica.

📋 Tabela de Transações

    Colunas: Data, Descrição, Categoria, Tipo, Valor, Ações.

    Ordenada por data (mais recente primeiro).

    Botões de Editar e Excluir em cada linha.

📈 Gráfico de Evolução

    Mostra a evolução de entradas e saídas ao longo do tempo.

    Alternância entre semanal e mensal com um seletor.

    Atualização automática ao adicionar, editar ou excluir transações.

💾 Persistência

    Todos os dados são salvos automaticamente no localStorage após cada operação.

    Ao recarregar a página, os dados são restaurados.

🔮 Melhorias Futuras (Sugestões)

    📅 Filtro por período (últimos 7, 30, 90 dias ou intervalo personalizado).

    📤 Exportar dados para CSV ou PDF.

    🥧 Gráfico de pizza para distribuição de gastos por categoria.

    📊 Coluna de saldo acumulado na tabela.

    🌙 Modo escuro.

    🔔 Notificações para alertas de saldo negativo.

    🗂️ Backend com autenticação e banco de dados (Node.js + MongoDB, Firebase, etc.).

🧠 Aprendizados

Este projeto foi desenvolvido para fortalecer habilidades essenciais em desenvolvimento front-end:

    Lógica de programação – cálculos, filtros, ordenação e manipulação de arrays.

    Manipulação do DOM – criação dinâmica de elementos, atualização de conteúdo e eventos.

    Tratamento de dados – formatação de moeda e data, validações e transformações.

    Persistência local – uso prático de localStorage para simular um banco de dados.

    Gráficos – integração com Chart.js para visualização de dados.

🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias, correções ou novas funcionalidades. Basta abrir uma issue ou enviar um pull request.
📄 Licença

Este projeto está sob a licença MIT – sinta-se livre para usar, modificar e distribuir.
🙏 Agradecimentos

    Chart.js – pela biblioteca de gráficos.

    Você, por testar e sugerir melhorias! 😊

Desenvolvido com 💙 e JavaScript Vanilla
