#!/usr/bin/env bash
# Recria o vídeo do scroll (sequência de frames) a partir das fotos em assets/img/
# Uso: ./build-scrub.sh    (requer ffmpeg)
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
IMG="$DIR/assets/img"; VID="$DIR/assets/video"; SEQ="$DIR/assets/seq"
FF="${FFMPEG:-ffmpeg}"
mkdir -p "$VID" "$SEQ"; rm -f "${SEQ:?}"/f_*.jpg
TMP="$(mktemp -d)"

mkclip(){ # $1 img  $2 out  $3 in|out
  if [ "$3" = "out" ]; then Z="z='if(eq(on,0),1.14,max(zoom-0.0009,1.0))'"; else Z="z='min(zoom+0.0009,1.14)'"; fi
  "$FF" -v error -loop 1 -i "$1" -t 3 -r 30 -vf \
  "scale=2600:-2:force_original_aspect_ratio=increase,crop=2600:1463,zoompan=$Z:d=90:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30,format=yuv420p,setsar=1" \
  -c:v libx264 -crf 20 -pix_fmt yuv420p -y "$2"
}
mkclip "$IMG/persona.jpg"   "$TMP/c1.mp4" in
mkclip "$IMG/procedure.jpg" "$TMP/c2.mp4" out
mkclip "$IMG/result.jpg"    "$TMP/c3.mp4" in
"$FF" -v error -i "$TMP/c1.mp4" -i "$TMP/c2.mp4" -i "$TMP/c3.mp4" -filter_complex \
"[0][1]xfade=transition=fade:duration=0.7:offset=2.3[a];[a][2]xfade=transition=fade:duration=0.7:offset=4.6,format=yuv420p[v]" \
-map "[v]" -c:v libx264 -crf 20 -g 1 -pix_fmt yuv420p -movflags +faststart -y "$VID/scrub.mp4"
"$FF" -v error -i "$VID/scrub.mp4" -vf "fps=10,scale=1280:-2" -q:v 4 "$SEQ/f_%03d.jpg" -y
echo "OK — frames: $(ls "$SEQ"/f_*.jpg | wc -l | tr -d ' ')"
rm -rf "$TMP"
