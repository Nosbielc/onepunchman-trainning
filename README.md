# Desafio 100 Dias – Treinamento do Herói

Site estático, responsivo e interativo para um desafio fitness gamificado inspirado em anime de super-herói careca, com visual original.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- Sem backend
- Compatível com GitHub Pages

## Funcionalidades

- Página inicial com destaque para o desafio de 100 dias
- Explicação do treino clássico: 100 flexões, 100 abdominais, 100 agachamentos e 10 km de corrida (todos os dias)
- Aviso de segurança para adaptação e respeito aos limites físicos
- Checklist diário com barra de progresso em porcentagem
- Contador de dia atual (1 a 100)
- Frases motivacionais aleatórias
- Ranking visual por evolução:
  - Civil
  - Aprendiz de Herói
  - Classe C
  - Classe B
  - Classe A
  - Classe S
- Persistência em `localStorage` (dia, modo, tarefas e dias concluídos)
- Botão de reset com confirmação
- Extra: Modo Treino Adaptado (20/20/20 + 2 km)
- Extra: Calendário simples com 100 dias
- Extra: Mensagem especial ao concluir os 100 dias

## Como executar localmente

Basta abrir o arquivo `index.html` no navegador.

## Como publicar no GitHub Pages

1. Faça commit de `index.html`, `style.css`, `script.js` e `README.md` na branch padrão.
2. No GitHub, abra **Settings** do repositório.
3. Vá em **Pages**.
4. Em **Build and deployment**, selecione:
   - **Source**: `Deploy from a branch`
   - **Branch**: branch padrão (ex.: `main`) e pasta `/ (root)`
5. Salve as configurações.
6. Aguarde o deploy e acesse a URL publicada pelo GitHub Pages.
