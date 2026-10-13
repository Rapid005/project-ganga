"""Our story scene: a pilgrim filling a copper kalash at the Gangotri ghat.

Usage: python3 ghat.py OUT.svg [layered OUT.json]"""
import os
LABEL = "A pilgrim fills a copper kalash with Ganga water from the stone ghat below the Gangotri temple, snow peaks glowing at sunrise"
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'landscape.py')).read())

b('<!--LAYER front-->')
# ------------------------------------------------------------------ ghat scene
# right-hand meadow bank and the river coming out of the gorge toward us
R_EDGE = [(640, 597), (690, 612), (760, 628), (850, 640), (960, 652), (1080, 662), (1210, 668), (1360, 672), (1510, 676), (1660, 680), (1810, 684)]
bank_r = md((650, 598), (1810, 628), .05, 5) + [(1810, 628), (1810, 684)] + list(reversed(R_EDGE))
b(f'<path d="{poly(bank_r)}" fill="url(#bank)"/>')
river = [(520, 600), (600, 594)] + R_EDGE + [(1810, 800), (-310, 800), (-310, 640)]
b(f'<clipPath id="cRiv"><path d="{poly(river)}"/></clipPath>')
b(f'<path d="{poly(river)}" fill="url(#water)"/>')
# reflections: a bright streak of sky and soft ripples
b('<path d="M760 640C860 660 980 700 1810 734V774C1000 740 860 700 740 660z" fill="#fff4c8" opacity=".55" filter="url(#soft6)" clip-path="url(#cRiv)"/>')
for _ in range(180):
    y = R.uniform(640, 800); t = (y - 640) / 160
    x = R.uniform(-310, 1810); ln = R.uniform(12, 50) * (.5 + t)
    b(f'<path d="M{f(x)} {f(y)}q{f(ln/2)} {f(-1.5-2*t)} {f(ln)} 0" stroke="#ffffff" stroke-width="{f(.6+1.4*t)}" stroke-opacity="{f(R.uniform(.2,.6))}" fill="none" stroke-linecap="round" clip-path="url(#cRiv)"/>')
for x, y, r in [(880, 690, 9), (1010, 742, 13), (1140, 700, 8), (930, 782, 16), (1560, 724, 11), (1700, 770, 15)]:
    b(boulder(x, y, r))

# stone ghat: platform and steps descending into the water
STEP, N = 12, 10
top = 528
b(f'<path d="M-310 {top}H680L{680 + N*9} {top + N*STEP}H-310z" fill="#bfae92"/>')
for k in range(N):
    y = top + k * STEP; xr = 680 + k * 9
    b(f'<path d="M-310 {y}H{xr}l9 {STEP}H-310z" fill="#e9dcc3"/>')                          # tread
    b(f'<path d="M-310 {y + 4}H{xr + 3}l6 {STEP - 4}H-310z" fill="#cdbb9c"/>')              # riser
    b(f'<path d="M-310 {y}H{xr}" stroke="#fff6e4" stroke-width="1" opacity=".8"/>')
b(f'<path d="M680 {top}l{N*9} {N*STEP}h26l-{N*9 - 6} -{N*STEP}z" fill="#a8977c"/>')       # side wall
b(f'<clipPath id="cGhat"><path d="M-310 {top}H{680 + 26}L{680 + N*9 + 26} {top + N*STEP}H-310z"/></clipPath>')
b(f'<rect x="{X0}" width="{AW}" height="{H}" filter="url(#texFine)" style="mix-blend-mode:multiply" opacity=".25" clip-path="url(#cGhat)"/>')
# waterline: wet bottom step and foam
wl = top + N * STEP
b(f'<path d="M-310 {wl}H{680 + N*9 + 26}" stroke="#ffffff" stroke-width="3" opacity=".7" filter="url(#soft)"/>')
b(f'<path d="M-310 {wl+2}H{680 + N*9 + 26}V{wl+16}H-310z" fill="#7cc7cf" opacity=".5"/>')
# reflection of the ghat and temple in the water
b(f'<rect x="150" y="{wl+6}" width="330" height="90" fill="#ffffff" opacity=".22" filter="url(#soft14)" clip-path="url(#cRiv)"/>')

# a peepal tree and a small chhatri along the left of the ghat
pc = [(-262, 380, 70), (-205, 352, 64), (-150, 392, 58), (-232, 430, 60), (-180, 436, 54), (-290, 446, 46)]
b(f'<path d="M-214 {top}c-4-40-2-80 6-110M-210 {top - 60}c-20-10-30-26-34-44M-208 {top - 80}c18-14 34-30 44-50" stroke="#6b4a32" stroke-width="9" fill="none" stroke-linecap="round"/>')
b(''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>' for (x, y, r), c in zip(pc, ['#3f7a3e', '#4d8a45', '#3a7038', '#5a9a4e', '#4d8a45', '#3f7a3e'])))
b(''.join(f'<circle cx="{f(x + R.uniform(-r*.6, r*.6))}" cy="{f(y + R.uniform(-r*.6, r*.2))}" r="{f(R.uniform(6, 12))}" fill="#9fcf72" opacity=".35"/>' for x, y, r in pc for _ in range(4)))
b(f'<g transform="translate(-60 {top})"><path d="M-46 0v-8h92v8z" fill="#d8c8ac"/>'
  + ''.join(f'<path d="M{x0} -8v-52h7v52z" fill="#efe5d8"/>' for x0 in (-38, -14, 7, 31))
  + '<path d="M-44 -60h88v-8h-88z" fill="#e7dccf"/><path d="M-36 -68c0-24 16-40 36-46c20 6 36 22 36 46z" fill="url(#templeLit)"/>'
  + '<path d="M0 -114v-12" stroke="#b8862b" stroke-width="2"/><circle cx="0" cy="-128" r="3.4" fill="url(#gold)"/></g>')

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
FLAGS = [(520, 150, '#ef6c1a'), (600, 120, '#f6b21b'), (90, 140, '#ef6c1a'), (-128, 120, '#f6b21b')]
OVER['flags'] = [(x, top - h, c) for x, h, c in FLAGS]
for x, h, c in FLAGS:
    b(f'<path d="M{x} {top}v-{h}" stroke="#8a6a42" stroke-width="3"/>')
    if not LAYERED: b(f'<path d="M{x} {top-h}c18 4 30 12 40 22c-14 0-28-4-40-10z" fill="{c}"/>')
b(f'<path d="M466 {top}v-60h40v60" stroke="#6b4a2a" stroke-width="3" fill="none"/><path d="M478 {top-60}v8" stroke="#6b4a2a"/><path d="M472 {top-38}a8 9 0 0 1 16 0z" fill="url(#gold)"/>')
# diyas and marigolds on the steps
DIYAS = [(150, 2), (210, 5), (470, 3), (560, 6), (420, 8), (60, 7), (-90, 4), (-230, 6), (-170, 9)]
OVER['diyas'] = [(x, top + k * STEP - 1) for x, k in DIYAS] + [(868, 725)]
for x, k in DIYAS:
    y = top + k * STEP + 8
    b(f'<circle cx="{x}" cy="{y-6}" r="9" fill="#ffd27a" opacity=".55" filter="url(#soft)"/><path d="M{x-6} {y-3}h12c-1 4-3 5-6 5s-5-1-6-5z" fill="#b35a22"/><path d="M{x} {y-11}c-2 3-3 4-3 5.5a3 3 0 0 0 6 0c0-1.5-1-2.5-3-5.5z" fill="#ffcf4a"/>')
for x, k in [(250, 4), (520, 7), (110, 9), (-40, 6), (-260, 3)]:
    y = top + k * STEP + 6
    b(''.join(f'<circle cx="{x + j*7}" cy="{y}" r="4" fill="{c}"/>' for j, c in enumerate(['#f39c12', '#e67e22', '#f1c40f'])))
# floating petals and a leaf-boat diya on the water
for _ in range(40):
    x = R.uniform(-200, 1100); y = R.uniform(wl + 10, 790)
    b(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="3.4" ry="1.8" fill="{R.choice(["#f39c12", "#e67e22", "#f1c40f", "#ff6f91"])}" transform="rotate({R.randint(-40,40)} {f(x)} {f(y)})"/>')
b('<g transform="translate(860 735)"><ellipse rx="30" ry="5" fill="#ffffff" opacity=".35" filter="url(#soft)"/><path d="M-24 0q24 12 48 0q-24 5-48 0z" fill="#3f7f2a"/><circle cx="-8" cy="-3" r="6" fill="#f39c12"/><path d="M2 -3h12c-1 4-3 5-6 5s-5-1-6-5z" fill="#b35a22"/><circle cx="8" cy="-10" r="10" fill="#ffd27a" opacity=".5" filter="url(#soft)"/><path d="M8 -13c-2 3-3 4-3 5.5a3 3 0 0 0 6 0c0-1.5-1-2.5-3-5.5z" fill="#ffcf4a"/></g>')

# a woman kneels in profile on the bottom step, her head covered by her saree's pallu,
# leaning forward to lower a copper kalash into the river. Drawn at 1:1 then scaled by S.
px, py, S = 600, wl, 1.4
SKIN, SKIN_D, HAIR = '#b97a50', '#94592f', '#1d1412'
SAREE, SAREE_D, SAREE_L = '#f08a24', '#c6601a', '#ffb35a'
BORDER, ZARI, BLOUSE = '#a8201a', '#f2c14e', '#8e1a1a'
HEAD = [
  # face in profile, bowed toward the water (head coordinates, upright, facing right)
  f'<path d="M6.4 -5C7.3 -3.4 7.6 -2.2 7.8 -1.4L9.7 1.3L7.8 2.2L8.2 3.4L7.4 4.2L7.9 5L7.2 6.8C6.6 8 5.4 8.5 3.8 8.5C1 8.5-1 7-1 5L-1 -2Z" fill="{SKIN}"/>',
  f'<path d="M3.8 8.5C1 8.5-1 7-1 5L-1 1C0.6 4 2.6 6.4 5.6 7.6C5 8.2 4.4 8.5 3.8 8.5Z" fill="{SKIN_D}" opacity=".5"/>',
  '<path d="M4.2 -.4q1.1 .9 2.3 .2" stroke="#3a2418" stroke-width=".55" fill="none" stroke-linecap="round"/>',
  '<circle cx="7.1" cy="-3.3" r=".7" fill="#c0392b"/>',
  # hair at the parting, then the pallu over the head, framing the face
  f'<path d="M7 -5.4C4 -5 1 -3.6 0 -1.4L.9 -.9C2 -3 4.4 -4.2 7.2 -4.5Z" fill="{HAIR}"/>',
  f'<path d="M7 -5.4C5.6 -9.6 0 -11 -4.4 -9C-9 -6.8-10.2 -1-8.6 4C-7.2 7.6-4.2 9.8-1 10.6L.4 8.8C-.8 7.6-1.2 5-1 2C-.6 -1.6 2.4 -4.6 7 -5.4Z" fill="{SAREE}"/>',
  f'<path d="M-4.4 -9C-9 -6.8-10.2 -1-8.6 4C-7.4 7-5.6 8.8-3.4 9.8C-6.4 6-7.2 0-4.4 -9Z" fill="{SAREE_D}" opacity=".7"/>',
  f'<path d="M7 -5.4C2.4 -4.6 -.6 -1.6 -1 2C-1.2 5 -.8 7.6 .4 8.8" stroke="{BORDER}" stroke-width="1.5" fill="none"/>',
  f'<path d="M6.6 -6.3C2.2 -5.5 -1.5 -2.4 -1.9 1.6" stroke="{ZARI}" stroke-width=".5" fill="none"/>',
]
P = [f'<g transform="translate({px} {py}) scale({S})">',
  '<ellipse cx="-10" cy="1" rx="30" ry="3.6" fill="#5b4a33" opacity=".28" filter="url(#soft)"/>',
  # legs folded under her: she sits back on her heels, the saree spread over them
  f'<path d="M4 0C6 -7 -2 -15 -16 -18C-26 -20 -35 -15 -37 -7C-38 -3 -37 -1 -36 0Z" fill="{SAREE}"/>',
  f'<path d="M-37 -7C-38 -3 -37 -1 -36 0H-20C-26 -3 -30 -9 -31 -16C-34 -14 -36 -11 -37 -7Z" fill="{SAREE_D}" opacity=".75"/>',
  f'<path d="M4 0C6 -7 1 -13 -8 -16" stroke="{SAREE_L}" stroke-width="2" fill="none" opacity=".6"/>',
  f'<path d="M-36 -1.3H4.5" stroke="{BORDER}" stroke-width="2.6"/><path d="M-36 -3.4H4" stroke="{ZARI}" stroke-width=".8"/>',
  f'<path d="M-37.5 -2.6c-1.6 0-2.4 1-2.4 2.6h4z" fill="{SKIN_D}"/>',                     # sole of the foot behind her
  f'<path d="M-10 -15C-12 -10 -16 -5 -22 -2M-2 -12C-5 -8 -9 -4 -14 -1" stroke="{SAREE_D}" stroke-width=".9" fill="none" opacity=".7"/>',
  # torso leaning forward, blouse at the shoulder
  f'<path d="M-28 -15C-31 -29 -23 -43 -11 -49C-3 -52 4 -47 3 -40C2 -32 -2 -22 -6 -15Z" fill="{SAREE}"/>',
  f'<path d="M-9 -49C-3 -51 3 -48 3 -43C1 -42 -3 -42 -6 -44C-8 -45 -9 -47 -9 -49Z" fill="{BLOUSE}"/>',
  # the far arm, mostly hidden, and the near arm reaching down to the kalash
  f'<path d="M0 -44C6 -36 10 -24 15 -9" stroke="{SKIN_D}" stroke-width="3.4" stroke-linecap="round" fill="none"/>',
  f'<path d="M-3 -43C3 -33 7 -21 13 -7" stroke="{SKIN}" stroke-width="3.8" stroke-linecap="round" fill="none"/>',
  f'<path d="M-3.4 -44.6C-1 -40 .8 -38 2.4 -36.4" stroke="{BLOUSE}" stroke-width="5" stroke-linecap="round" fill="none"/>',
  f'<path d="M9.4 -17.6l3 -1.3M10 -16l3 -1.3" stroke="{ZARI}" stroke-width="1.1"/><path d="M9.7 -16.8l3 -1.3" stroke="#c0392b" stroke-width=".9"/>',
  # the pallu falls from her head down her back to the waist
  f'<path d="M-1 -60C-9 -56 -19 -46 -26 -32C-30 -24 -30 -18 -28 -14L-23 -17C-21 -28 -14 -40 -4 -49C-1 -52 1 -55 1 -58Z" fill="{SAREE_D}"/>',
  f'<path d="M-23 -17C-21 -28 -14 -40 -4 -49" stroke="{BORDER}" stroke-width="2.2" fill="none"/>',
  f'<path d="M-24.6 -18.4C-22.6 -29 -15.6 -41 -5.4 -50" stroke="{ZARI}" stroke-width=".7" fill="none"/>',
  # neck and the bowed head
  f'<path d="M-1 -48C1 -51 3 -53 5 -54L8 -51C6 -50 4 -48 3 -46Z" fill="{SKIN_D}"/>',
  '<g transform="translate(5.6 -57.4) rotate(32)">' + ''.join(HEAD) + '</g>',
  '</g>']
b(''.join(P))
# the kalash, held at the neck and half in the water in front of her
kx, ky = px + 17 * S, py + 7 * S
OVER['kalash'] = (round(kx), round(ky + 2 * S))
if not LAYERED: b(f'<ellipse cx="{f(kx)}" cy="{f(ky + 3*S)}" rx="34" ry="5" fill="none" stroke="#ffffff" stroke-width="1.4" opacity=".7"/>'
  f'<ellipse cx="{f(kx)}" cy="{f(ky + 5*S)}" rx="54" ry="8" fill="none" stroke="#ffffff" stroke-width="1" opacity=".45"/>')
b(f'<g transform="translate({f(kx)} {f(ky)}) scale({S}) rotate(-24)">'
  '<defs><linearGradient id="copper" x1="0" x2="1"><stop offset="0" stop-color="#7a3512"/><stop offset=".45" stop-color="#e08a4a"/><stop offset=".7" stop-color="#b8582a"/><stop offset="1" stop-color="#6a2c10"/></linearGradient></defs>'
  '<path d="M-9 2c0-7 4-10 9-10s9 3 9 10c0 6-4 9-9 9s-9-3-9-9z" fill="url(#copper)"/>'
  '<path d="M-3.6 -8v-3.4h7.2v3.4z" fill="#a24a1e"/><ellipse cx="0" cy="-11.4" rx="6" ry="1.8" fill="#c9672e"/><ellipse cx="0" cy="-11.4" rx="4.3" ry="1.1" fill="#4a1e08"/>'
  '<path d="M-5.6 -2.4c1.3-2.4 3.2-3.7 5.1-3.7" stroke="#ffd2a8" stroke-width="1.3" fill="none" opacity=".8"/>'
  '<path d="M-9 .4h18" stroke="#e8b024" stroke-width="1"/></g>')
# her hands around the neck of the pot
b(f'<g transform="translate({px} {py}) scale({S})"><ellipse cx="14.4" cy="-6.6" rx="2.6" ry="2" fill="{SKIN}"/><ellipse cx="16.4" cy="-5.2" rx="2.2" ry="1.7" fill="{SKIN_D}"/></g>')
# the water closes over the lower half of the pot
b(f'<clipPath id="cUnder"><rect x="{f(kx - 20*S)}" y="{f(ky + 2*S)}" width="{f(40*S)}" height="{f(20*S)}"/></clipPath>')
b(f'<ellipse cx="{f(kx + 1.5*S)}" cy="{f(ky + 2.5*S)}" rx="{f(9.8*S)}" ry="{f(9.8*S)}" fill="#58b3bf" opacity=".62" clip-path="url(#cUnder)"/>')
b(f'<path d="M{f(kx - 12*S)} {f(ky + 2*S)}q{f(12*S)} -{f(2*S)} {f(24*S)} 0" stroke="#ffffff" stroke-width="1.6" fill="none" opacity=".85"/>')
# a moored wooden boat on the right
b('<g transform="translate(1040 690)"><path d="M-80 0q80 22 160 0l-10 12q-70 14-140 0z" fill="#7a4b2a"/><path d="M-80 0q80 22 160 0" stroke="#e8c48a" stroke-width="2" fill="none"/><path d="M-60 6h120" stroke="#5a341c" stroke-width="1"/><ellipse cy="16" rx="90" ry="5" fill="#2c6f7c" opacity=".3" filter="url(#soft)"/></g>')
# right bank flowers and a deodar frame
g = ['<g clip-path="url(#cBankR)">']
for _ in range(300):
    x = R.uniform(640, 1810); y = R.uniform(600, 684); r = R.uniform(.8, 2)
    g.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{R.choice(["#ff7aa8", "#ffd23f", "#ffffff", "#b48cff", "#ff9f43"])}"/>')
b(f'<clipPath id="cBankR"><path d="{poly(bank_r)}"/></clipPath>' + ''.join(g) + '</g>')
for x, y, h in [(1170, 660, 300), (1120, 650, 210), (1240, 690, 380), (1330, 664, 320), (1420, 652, 280), (1490, 690, 360), (1580, 668, 330), (1670, 650, 290), (1760, 688, 370)]:
    b(f'<path d="M{x} {y}v-{h*.25}" stroke="#5a3e2b" stroke-width="{h*.03:.1f}"/>')
    b(tree(x, y, h, '#24543a', lit='#e6d27e'))

b('<!--LAYER mist-->')
b('<rect x="790" y="585" width="1030" height="36" fill="#ffffff" opacity=".35" filter="url(#fog)"/>')
b('<rect x="-310" y="700" width="1000" height="40" fill="#ffffff" opacity=".22" filter="url(#fog)"/>')

finish(662)
