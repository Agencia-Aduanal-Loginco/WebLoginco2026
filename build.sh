#!/usr/bin/env bash
# Regenera style.min.css desde style.css y lo incrusta INLINE en cada index.html
# entre los marcadores <!--CSS:START--> y <!--CSS:END-->.
#
# Ejecutar tras CUALQUIER cambio en style.css:
#     ./build.sh
#
# Requiere: npx (lightningcss-cli) y python3.
set -euo pipefail
cd "$(dirname "$0")"

echo "· Minificando style.css -> style.min.css"
npx --yes lightningcss-cli --minify --targets ">= 0.25%" style.css -o style.min.css

echo "· Incrustando CSS en los HTML"
python3 - <<'PY'
import pathlib, re
css = pathlib.Path("style.min.css").read_text(encoding="utf-8").strip()
block = "<!--CSS:START--><style>%s</style><!--CSS:END-->" % css
pat = re.compile(r"<!--CSS:START-->.*?<!--CSS:END-->", re.S)
pages = ["index.html"] + [str(p) for p in pathlib.Path(".").glob("*/index.html")]
for f in pages:
    p = pathlib.Path(f)
    html = p.read_text(encoding="utf-8")
    if not pat.search(html):
        print("  !! sin marcadores CSS:START/END:", f); continue
    p.write_text(pat.sub(lambda _: block, html), encoding="utf-8")
    print("  ok", f)
PY
echo "· Listo."
