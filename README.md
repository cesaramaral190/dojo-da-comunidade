# Dojo da Comunidade

Landing page implementada em HTML, CSS e JavaScript a partir da referência visual. Os títulos, parágrafos, seções, botões, navegação e formulário são elementos HTML reais; a marca e os ícones são SVG. As únicas imagens de fundo são fotografias. O layout se adapta a desktop e celular.

Execute `npm run dev` para visualizar em http://localhost:4173. Os arquivos em `dist` são estáticos e não precisam de compilação. `npm run check` verifica a sintaxe do JavaScript.

O formulário tem validação nativa, campos acessíveis e salva as inscrições no Supabase. A página `admin.html` permite consultar os cadastros após autenticação com o usuário administrativo.

O navegador usa apenas a chave publicável do Supabase. A chave secreta do projeto não é armazenada no código. A tabela usa Row Level Security: visitantes podem inserir inscrições e somente o e-mail administrativo autenticado pode consultá-las.

A referência original, as capturas de revisão e as configurações locais não integram o repositório. Nenhuma credencial é necessária para executar a página.
