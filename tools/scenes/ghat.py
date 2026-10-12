"""Our story scene: a pilgrim filling a copper kalash at the Gangotri ghat.

Usage: python3 ghat.py OUT.svg [layered OUT.json]"""
import os
LABEL = "A pilgrim fills a copper kalash with Ganga water from the stone ghat below the Gangotri temple, snow peaks glowing at sunrise"
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'landscape.py')).read())

b('<!--LAYER front-->')
# ------------------------------------------------------------------ ghat scene
# right-hand meadow bank and the river coming out of the gorge toward us
R_EDGE = [(640, 597), (690, 612), (760, 628), (850, 640), (960, 652), (1080, 662), (1210, 668)]
bank_r = md((650, 598), (1210, 618), .05, 5) + [(1210, 618), (1210, 668)] + list(reversed(R_EDGE))
b(f'<path d="{poly(bank_r)}" fill="url(#bank)"/>')
river = [(520, 600), (600, 594)] + R_EDGE + [(1210, 800), (-10, 800), (-10, 640)]
b(f'<clipPath id="cRiv"><path d="{poly(river)}"/></clipPath>')
b(f'<path d="{poly(river)}" fill="url(#water)"/>')
# reflections: a bright streak of sky and soft ripples
b('<path d="M760 640C860 660 980 700 1210 720V760C1000 740 860 700 740 660z" fill="#fff4c8" opacity=".55" filter="url(#soft6)" clip-path="url(#cRiv)"/>')
for _ in range(110):
    y = R.uniform(640, 800); t = (y - 640) / 160
    x = R.uniform(-10, 1210); ln = R.uniform(12, 50) * (.5 + t)
    b(f'<path d="M{f(x)} {f(y)}q{f(ln/2)} {f(-1.5-2*t)} {f(ln)} 0" stroke="#ffffff" stroke-width="{f(.6+1.4*t)}" stroke-opacity="{f(R.uniform(.2,.6))}" fill="none" stroke-linecap="round" clip-path="url(#cRiv)"/>')
for x, y, r in [(880, 690, 9), (1010, 742, 13), (1140, 700, 8), (930, 782, 16)]:
    b(boulder(x, y, r))

# stone ghat: platform and steps descending into the water
STEP, N = 12, 10
top = 528
b(f'<path d="M-10 {top}H680L{680 + N*9} {top + N*STEP}H-10z" fill="#bfae92"/>')
for k in range(N):
    y = top + k * STEP; xr = 680 + k * 9
    b(f'<path d="M-10 {y}H{xr}l9 {STEP}H-10z" fill="#e9dcc3"/>')                          # tread
    b(f'<path d="M-10 {y + 4}H{xr + 3}l6 {STEP - 4}H-10z" fill="#cdbb9c"/>')              # riser
    b(f'<path d="M-10 {y}H{xr}" stroke="#fff6e4" stroke-width="1" opacity=".8"/>')
b(f'<path d="M680 {top}l{N*9} {N*STEP}h26l-{N*9 - 6} -{N*STEP}z" fill="#a8977c"/>')       # side wall
b(f'<clipPath id="cGhat"><path d="M-10 {top}H{680 + 26}L{680 + N*9 + 26} {top + N*STEP}H-10z"/></clipPath>')
b(f'<rect width="{W}" height="{H}" filter="url(#texFine)" style="mix-blend-mode:multiply" opacity=".25" clip-path="url(#cGhat)"/>')
# waterline: wet bottom step and foam
wl = top + N * STEP
b(f'<path d="M-10 {wl}H{680 + N*9 + 26}" stroke="#ffffff" stroke-width="3" opacity=".7" filter="url(#soft)"/>')
b(f'<path d="M-10 {wl+2}H{680 + N*9 + 26}V{wl+16}H-10z" fill="#7cc7cf" opacity=".5"/>')
# reflection of the ghat and temple in the water
b(f'<rect x="150" y="{wl+6}" width="330" height="90" fill="#ffffff" opacity=".22" filter="url(#soft14)" clip-path="url(#cRiv)"/>')

# Gangotri temple on the platform (closer, so more detail)
cx, base_y = 330, top
T = [f'<g transform="translate({cx} {base_y})">',
  '<path d="M-150 0v-18h300v18z" fill="#d8c8ac"/><path d="M-150 -18h300" stroke="#fff6e4" stroke-width="2"/>',
  '<path d="M-118 -18v-96h236v96z" fill="url(#templeLit)"/>',
  '<path d="M-124 -114h248v-12h-248z" fill="#efe5d8"/><path d="M-124 -126h248" stroke="#c9b9a6" stroke-width="1.5"/>',
  # pillars and arches
  ''.join(f'<path d="M{x0} -18v-62a14 14 0 0 1 28 0v62z" fill="#5b463a" opacity=".78"/><path d="M{x0+3} -18v-58a11 11 0 0 1 22 0v58z" fill="#f4b24a" opacity=".35"/>' for x0 in (-104, -58, 30, 76)),
  '<path d="M-22 -18v-74a22 22 0 0 1 44 0v74z" fill="#3e2c22"/><path d="M-18 -18v-70a18 18 0 0 1 36 0v70z" fill="#f6a93b" opacity=".55"/>',
  '<circle cx="0" cy="-58" r="14" fill="#ffdc8a" opacity=".7" filter="url(#soft)"/>',
  '<path d="M0 -92v14" stroke="#b8862b" stroke-width="1.5"/><path d="M-6 -78a6 7 0 0 1 12 0z" fill="url(#gold)"/>',
  ''.join(f'<path d="M{x0} -18v-96" stroke="#d9cdbf" stroke-width="3"/>' for x0 in (-80, -36, 36, 80)),
  # main shikhara with horizontal courses
  '<path d="M-62 -126c0-70 26-130 62-170c36 40 62 100 62 170z" fill="url(#templeLit)"/>',
  ''.join(f'<path d="M{-62 + k*4.6:.1f} {-138 - k*12}h{124 - k*9.2:.1f}" stroke="#d6c7b6" stroke-width="1.4"/>' for k in range(12)),
  '<path d="M0 -296c18 20 34 50 44 90" stroke="#ffffff" stroke-width="5" opacity=".5" fill="none"/>',
  '<ellipse cx="0" cy="-300" rx="15" ry="6" fill="#e8dccd"/><path d="M-6 -306h12l-6-16z" fill="url(#gold)"/><circle cx="0" cy="-310" r="5.5" fill="url(#gold)"/>',
  '<path d="M0 -322v-44" stroke="#6b4a2a" stroke-width="2"/><path d="M0 -366c14 2 26 8 34 16c-12 2-24 0-34-4z" fill="#ef6c1a"/>',
  # corner spires
  ''.join(f'<path d="M{x0-18} -126c0-26 8-46 18-60c10 14 18 34 18 60z" fill="url(#templeLit)"/><circle cx="{x0}" cy="-190" r="4" fill="url(#gold)"/><path d="M{x0} -194v-14" stroke="#b8862b" stroke-width="1.6"/>' for x0 in (-100, 100)),
  ''.join(f'<path d="M{x0-12} -126c0-18 6-30 12-40c6 10 12 22 12 40z" fill="url(#templeLit)"/><circle cx="{x0}" cy="-169" r="3" fill="url(#gold)"/>' for x0 in (-74, 74)),
  # marigold garland across the front
  '<path d="M-118 -110' + ''.join(f'q{29.5/2:.2f} 14 29.5 0' for _ in range(8)) + '" stroke="#f39c12" stroke-width="5" fill="none" stroke-dasharray="1 5" stroke-linecap="round"/>',
  '</g>']
b(''.join(T))
# bell, flags on bamboo poles at the ghat edge
# (in the layered build the flags are drawn live by js/scene.js, so they can flutter)
FLAGS = [(520, 150, '#ef6c1a'), (600, 120, '#f6b21b'), (90, 140, '#ef6c1a')]
OVER['flags'] = [(x, top - h, c) for x, h, c in FLAGS]
for x, h, c in FLAGS:
    b(f'<path d="M{x} {top}v-{h}" stroke="#8a6a42" stroke-width="3"/>')
    if not LAYERED: b(f'<path d="M{x} {top-h}c18 4 30 12 40 22c-14 0-28-4-40-10z" fill="{c}"/>')
b(f'<path d="M466 {top}v-60h40v60" stroke="#6b4a2a" stroke-width="3" fill="none"/><path d="M478 {top-60}v8" stroke="#6b4a2a"/><path d="M472 {top-38}a8 9 0 0 1 16 0z" fill="url(#gold)"/>')
# diyas and marigolds on the steps
OVER['diyas'] = [(x, top + k * STEP - 1) for x, k in [(150, 2), (210, 5), (470, 3), (560, 6), (420, 8), (60, 7)]] + [(868, 725)]
for x, k in [(150, 2), (210, 5), (470, 3), (560, 6), (420, 8), (60, 7)]:
    y = top + k * STEP + 8
    b(f'<circle cx="{x}" cy="{y-6}" r="9" fill="#ffd27a" opacity=".55" filter="url(#soft)"/><path d="M{x-6} {y-3}h12c-1 4-3 5-6 5s-5-1-6-5z" fill="#b35a22"/><path d="M{x} {y-11}c-2 3-3 4-3 5.5a3 3 0 0 0 6 0c0-1.5-1-2.5-3-5.5z" fill="#ffcf4a"/>')
for x, k in [(250, 4), (520, 7), (110, 9)]:
    y = top + k * STEP + 6
    b(''.join(f'<circle cx="{x + j*7}" cy="{y}" r="4" fill="{c}"/>' for j, c in enumerate(['#f39c12', '#e67e22', '#f1c40f'])))
# floating petals and a leaf-boat diya on the water
for _ in range(26):
    x = R.uniform(100, 900); y = R.uniform(wl + 10, 790)
    b(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="3.4" ry="1.8" fill="{R.choice(["#f39c12", "#e67e22", "#f1c40f", "#ff6f91"])}" transform="rotate({R.randint(-40,40)} {f(x)} {f(y)})"/>')
b('<g transform="translate(860 735)"><ellipse rx="30" ry="5" fill="#ffffff" opacity=".35" filter="url(#soft)"/><path d="M-24 0q24 12 48 0q-24 5-48 0z" fill="#3f7f2a"/><circle cx="-8" cy="-3" r="6" fill="#f39c12"/><path d="M2 -3h12c-1 4-3 5-6 5s-5-1-6-5z" fill="#b35a22"/><circle cx="8" cy="-10" r="10" fill="#ffd27a" opacity=".5" filter="url(#soft)"/><path d="M8 -13c-2 3-3 4-3 5.5a3 3 0 0 0 6 0c0-1.5-1-2.5-3-5.5z" fill="#ffcf4a"/></g>')

# pilgrim kneeling on the last step, filling a copper kalash
px, py = 640, wl          # knee on the bottom step, facing the river
SKIN, SAREE, SAREE_D, BORDER = '#c98d62', '#f08a24', '#c9621a', '#b3261e'
P = [f'<g transform="translate({px} {py})">',
  '<ellipse cx="10" cy="2" rx="48" ry="6" fill="#5b4a33" opacity=".3" filter="url(#soft)"/>',
  # folded legs / saree skirt
  f'<path d="M-40 0c-4-16 2-30 16-36c18-6 40-2 52 6c8 6 12 16 12 30z" fill="{SAREE}"/>',
  f'<path d="M-40 0c-4-16 2-30 16-36c-8 10-10 24-6 36z" fill="{SAREE_D}"/>',
  f'<path d="M-40 -1h80" stroke="{BORDER}" stroke-width="4"/><path d="M-40 -4h80" stroke="#f6c343" stroke-width="1.2"/>',
  # torso leaning forward toward the water
  f'<path d="M-26 -34c-6-24 0-50 14-66c10-10 22-12 30-6c6 6 6 16 4 24c-4 16-6 30-2 48z" fill="{SAREE}"/>',
  f'<path d="M-26 -34c-6-24 0-50 14-66c-4 18-6 40 2 64z" fill="{SAREE_D}" opacity=".8"/>',
  # pallu over the head and down the back, with border
  f'<path d="M-6 -104c8-16 30-18 40-4c6 8 6 18 2 26c-8-12-22-14-30-6c-10 12-16 34-20 54c-8-22-6-52 8-70z" fill="{SAREE_D}"/>',
  f'<path d="M34 -82c-8-12-22-14-30-6c-10 12-16 34-20 54" stroke="{BORDER}" stroke-width="3.2" fill="none"/>',
  # face in profile
  f'<path d="M30 -94c6 2 9 7 9 12c0 3-2 4-4 5l2 4c-3 3-8 4-12 1c-2-6-1-16 5-22z" fill="{SKIN}"/>',
  '<circle cx="36.5" cy="-90" r="1.3" fill="#b3261e"/>',
  # saree folds and pleats
  '<path d="M-20 -6c4-10 12-18 22-22M0 -4c4-8 10-14 18-16M-14 -40c-2-16 2-34 10-46" stroke="#b8541a" stroke-width="1.6" fill="none" opacity=".7" stroke-linecap="round"/>',
  # hand around the kalash neck
  '<ellipse cx="55" cy="-17" rx="5" ry="4" fill="#c98d62"/>',
  # arm reaching down to the kalash at the water's surface
  f'<path d="M14 -74c10 14 22 34 40 56" stroke="{SKIN}" stroke-width="7" stroke-linecap="round" fill="none"/>',
  f'<path d="M14 -74c6 10 12 18 18 26" stroke="{SAREE}" stroke-width="9" stroke-linecap="round" fill="none"/>',
  '<path d="M44 -26l6 2M45 -23l6 2" stroke="#e8b024" stroke-width="2"/>',
  '</g>']
b(''.join(P))
# the kalash, half-dipped, with ripples spreading (animated by js/scene.js in the layered build)
kx, ky = px + 66, wl + 10
OVER['kalash'] = (kx, ky)
if not LAYERED: b(f'<ellipse cx="{kx}" cy="{ky+6}" rx="34" ry="5" fill="none" stroke="#ffffff" stroke-width="1.4" opacity=".7"/>'
  f'<ellipse cx="{kx}" cy="{ky+8}" rx="54" ry="8" fill="none" stroke="#ffffff" stroke-width="1" opacity=".45"/>'
  f'<ellipse cx="{kx}" cy="{ky+10}" rx="76" ry="11" fill="none" stroke="#ffffff" stroke-width=".8" opacity=".3"/>')
b(f'<g transform="translate({kx} {ky}) rotate(-28)">'
  '<defs><linearGradient id="copper" x1="0" x2="1"><stop offset="0" stop-color="#7a3512"/><stop offset=".45" stop-color="#e08a4a"/><stop offset=".7" stop-color="#b8582a"/><stop offset="1" stop-color="#6a2c10"/></linearGradient></defs>'
  '<path d="M-15 -4c0-12 7-18 15-18s15 6 15 18c0 10-7 16-15 16s-15-6-15-16z" fill="url(#copper)"/>'
  '<path d="M-6 -22v-6h12v6z" fill="#a24a1e"/><ellipse cx="0" cy="-28" rx="10" ry="3" fill="#c9672e"/><ellipse cx="0" cy="-28" rx="7" ry="1.8" fill="#4a1e08"/>'
  '<path d="M-9 -12c2-4 5-6 8-6" stroke="#ffd2a8" stroke-width="2" fill="none" opacity=".8"/>'
  '<path d="M-15 -2h30" stroke="#e8b024" stroke-width="1.6"/></g>')
b(f'<path d="M{kx-24} {ky+4}q24 -5 48 0v10h-48z" fill="#7fd0d6" opacity=".75"/>')
# a moored wooden boat on the right
b('<g transform="translate(1040 690)"><path d="M-80 0q80 22 160 0l-10 12q-70 14-140 0z" fill="#7a4b2a"/><path d="M-80 0q80 22 160 0" stroke="#e8c48a" stroke-width="2" fill="none"/><path d="M-60 6h120" stroke="#5a341c" stroke-width="1"/><ellipse cy="16" rx="90" ry="5" fill="#2c6f7c" opacity=".3" filter="url(#soft)"/></g>')
# right bank flowers and a deodar frame
g = ['<g clip-path="url(#cBankR)">']
for _ in range(160):
    x = R.uniform(640, 1210); y = R.uniform(600, 668); r = R.uniform(.8, 2)
    g.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{R.choice(["#ff7aa8", "#ffd23f", "#ffffff", "#b48cff", "#ff9f43"])}"/>')
b(f'<clipPath id="cBankR"><path d="{poly(bank_r)}"/></clipPath>' + ''.join(g) + '</g>')
for x, y, h in [(1170, 660, 300), (1120, 650, 210), (1215, 690, 380)]:
    b(f'<path d="M{x} {y}v-{h*.25}" stroke="#5a3e2b" stroke-width="{h*.03:.1f}"/>')
    b(tree(x, y, h, '#24543a', lit='#e6d27e'))

b('<!--LAYER mist-->')
b('<rect x="790" y="585" width="430" height="36" fill="#ffffff" opacity=".35" filter="url(#fog)"/>')
b('<rect x="-10" y="700" width="700" height="40" fill="#ffffff" opacity=".22" filter="url(#fog)"/>')

finish(662)
