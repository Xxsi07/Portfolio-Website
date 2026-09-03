# xxsi.me — Portfolio

Portfolio bilingue de Francisco Almeida no formato Personal Grid, com tema claro/escuro e integração com o Spotify.

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:5173/`. A rota `/1` também permanece disponível por compatibilidade.

## Produção

```bash
pnpm build
```

O resultado fica em `dist/`. O projeto inclui regras SPA para Vercel (`vercel.json`) e Netlify/Cloudflare Pages (`public/_redirects`). Rotas antigas ou desconhecidas redirecionam para a página principal.

## Última música do Spotify

O widget usa a função serverless `api/spotify-recent.js`. No projeto Spotify Developer, autoriza os scopes `user-read-currently-playing` e `user-read-recently-played`, obtém um refresh token e configura estas variáveis no deployment:

```env
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REFRESH_TOKEN=...
```

Sem estas variáveis o portfolio continua funcional e mostra um estado discreto de “Liga o teu Spotify”, sem expor segredos no browser.

## Galeria

Coloca as fotografias dentro de `public/gallery/`. A galeria reconhece automaticamente ficheiros `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif` e `.gif` quando o servidor inicia ou o projeto é construído. Ficheiros `.heic` e `.heif` são convertidos automaticamente para JPG dentro de `public/gallery/_converted/`; os originais são preservados e não são incluídos no resultado publicado.

As fotografias abrem em ecrã inteiro, incluem setas de navegação e podem ser percorridas com as teclas `←` e `→`. A tecla `Esc` fecha o visualizador. O nome do ficheiro é usado como legenda, substituindo hífenes e underscores por espaços.
São mostradas inicialmente até oito fotografias; a partir da nona, o botão “Ver mais” apresenta as restantes.

## Atividade do Discord

O cartão do Discord usa a presença pública do Lanyard para o utilizador configurado em `discordUserId`. Atualiza a cada 30 segundos e apresenta jogos ou outras aplicações, incluindo a duração da sessão quando existe um timestamp. Atividades do tipo “Listening” e a aplicação Spotify são ignoradas para não duplicar o widget musical.
