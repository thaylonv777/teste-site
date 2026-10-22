# LUMIÈRE — Site case (Harmonização Orofacial)

Landing page **dark luxe** fictícia, criada como case para anúncio de criação de sites.
Feita para gravação de tela (scroll suave, animações e vídeo que corre no scroll).

## Rodar localmente
```bash
cd teste-site
python3 -m http.server 8787
# abrir http://localhost:8787
```
> Importante: abra via servidor (comando acima), não com duplo-clique no arquivo.
> A sequência de frames do scroll é carregada por `fetch` e precisa de `http://`.

## Trocar as fotos pelas suas (sem mexer no código)
Basta substituir os arquivos em `assets/img/` mantendo os mesmos nomes:
- `persona.jpg` — retrato do especialista (hero + seção "O especialista") · vertical 4:5
- `result.jpg` — rosto/resultado de beleza (método + antes/depois) · vertical 4:5
- `procedure.jpg` — procedimento/planejamento · vertical 4:5
- `clinic.jpg` — ambiente da clínica · horizontal 16:9

### Regerar o vídeo do scroll depois de trocar as fotos
O "vídeo" do scroll é uma sequência de imagens em `assets/seq/`.
Rode `./build-scrub.sh` (precisa de ffmpeg) para recriar a partir das novas `persona/procedure/result.jpg`.

## Stack
HTML + CSS + JS puro · GSAP ScrollTrigger · Lenis (scroll suave) · canvas (luz + scrub).
Imagens placeholder geradas por IA.
