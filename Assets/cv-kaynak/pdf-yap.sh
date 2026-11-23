#!/bin/sh
# tr.html ve en.html'den CV PDF'lerini üretir (Google Chrome gerekir).
# Kullanım: sh Assets/cv-kaynak/pdf-yap.sh [çıktı klasörü]
# Çıktı klasörü verilmezse sitedeki PDF'lerin üzerine yazar (Assets/).
set -e
KAYNAK="$(cd "$(dirname "$0")" && pwd)"
CIKTI="${1:-$KAYNAK/..}"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

yap() {
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="$2" "file://$KAYNAK/$1" 2>/dev/null
  echo "$2"
}

yap tr.html "$CIKTI/Kaan_Kara_CV_Tr.pdf"
yap en.html "$CIKTI/Kaan_Kara_CV_Eng.pdf"
