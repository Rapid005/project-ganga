"""Home page scene: sunrise at Gangotri, the Bhagirathi winding past the temple.

Usage: python3 gangotri.py OUT.svg [layered OUT.json]"""
import os
LABEL = "Sunrise at Gangotri: snow peaks glowing above deodar forests, wildflower meadows and the clear Bhagirathi flowing past the white Gangotri temple"
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'landscape.py')).read())

b('<!--LAYER front-->')
# ------------------------------------------------------------------ valley, river, temple
# meadow banks
bank_l = md((-10, 640), (470, 600), .05, 5) + [(470, 600), (560, 598)] + [(548, 612), (535, 640), (520, 668), (512, 695), (500, 720), (470, 745), (420, 770), (360, 790), (300, 800)] + [(-10, 800)]
bank_r = md((650, 600), (1210, 630), .05, 5) + [(1210, 630), (1210, 800)] + list(reversed([(640, 597), (668, 615), (690, 640), (700, 668), (712, 700), (740, 730), (790, 760), (850, 785), (900, 800)]))
b(f'<path d="{poly(bank_l)}" fill="url(#bank)"/>')
b(f'<path d="{poly(bank_r)}" fill="url(#bank)"/>')
b('<clipPath id="cBank">' + f'<path d="{poly(bank_l)}"/><path d="{poly(bank_r)}"/>' + '</clipPath>')
b(f'<rect width="{W}" height="{H}" filter="url(#texFine)" clip-path="url(#cBank)" style="mix-blend-mode:multiply" opacity=".22"/>')
# river: narrow from the gorge, widening toward the viewer
R_EDGE = [(640, 597), (668, 615), (690, 640), (700, 668), (712, 700), (740, 730), (790, 760), (850, 785), (900, 800)]
L_EDGE = [(548, 612), (535, 640), (520, 668), (512, 695), (500, 720), (470, 745), (420, 770), (360, 790), (300, 800)]
river = [(560, 598), (600, 594)] + R_EDGE + list(reversed(L_EDGE))
river_s = []
for p, q in zip(river, river[1:] + river[:1]):
    river_s += md(p, q, .025, 4)
b(f'<clipPath id="cRiv"><path d="{poly(river_s)}"/></clipPath>')
b(f'<path d="{poly(river_s)}" fill="url(#water)"/>')
# sky reflection and current lines
b('<path d="M520 640C600 650 700 660 760 700L700 700C640 670 590 660 520 655z" fill="#fff4c8" opacity=".6" filter="url(#soft6)" clip-path="url(#cRiv)"/>')
for _ in range(70):
    y = R.uniform(605, 800)
    t = (y - 600) / 200
    cx = 600 - 60 * t + R.uniform(-160, 160) * (0.3 + t)
    if not inside_poly(cx, y, river): continue
    ln = R.uniform(10, 40) * (0.4 + t)
    b(f'<path d="M{f(cx)} {f(y)}q{f(ln/2)} {f(-2-2*t)} {f(ln)} 0" stroke="#f3f6f2" stroke-width="{f(.6+1.6*t)}" stroke-opacity="{f(R.uniform(.25,.7))}" fill="none" stroke-linecap="round" clip-path="url(#cRiv)"/>')

stones = []
for _ in range(34):
    y = R.uniform(610, 790); t = (y - 600) / 200
    left = 560 - 330 * t; right = 640 + 300 * t
    x = R.uniform(left - 40, right + 40)
    inside = inside_poly(x, y, river)
    stones.append((y, x, (3 + 26 * t ** 1.4) * R.uniform(.6, 1.2), inside))
for y, x, r, inside in sorted(stones):
    b(boulder(x, y, r, foam=inside))

# Gangotri temple on the right bank
tx, ty = 820, 640
temple = [f'<g transform="translate({tx} {ty})">',
  '<ellipse cx="0" cy="4" rx="70" ry="7" fill="#2a2426" opacity=".35" filter="url(#soft)"/>',
  '<path d="M-74 4h148v-10h-148z" fill="#b9aea5"/><path d="M-80 10h160v-6h-160z" fill="#9b918b"/>',
  '<path d="M-48 -6v-34h96v34z" fill="url(#templeLit)"/>',
  '<path d="M-48 -40h96v-5h-96z" fill="#e7dccf"/>',
  ''.join(f'<path d="M{x0} -6v-18a7 7 0 0 1 14 0v18z" fill="#4a3f3b" opacity=".75"/>' for x0 in (-38, -14, 10, 30)),
  # spires: one tall shikhara and four small ones
  '<path d="M-20 -45c0-22 8-40 20-56c12 16 20 34 20 56z" fill="url(#templeLit)"/>',
  '<path d="M-14 -60h28M-17 -52h34M-10 -72h20M-6 -84h12" stroke="#cbbfb3" stroke-width="1"/>',
  '<path d="M0 -101v-9" stroke="#b8862b" stroke-width="2"/><circle cx="0" cy="-104" r="3.4" fill="url(#gold)"/><path d="M0 -111v-16" stroke="#6b4a2a" stroke-width="1.2"/><path d="M0 -127l16 4-16 5z" fill="#e2651d"/>',
  ''.join(f'<path d="M{x0-8} -45c0-10 4-17 8-22c4 5 8 12 8 22z" fill="url(#templeLit)"/><circle cx="{x0}" cy="-69" r="2.4" fill="url(#gold)"/>' for x0 in (-38, 38)),
  ''.join(f'<path d="M{x0-6} -45c0-7 3-12 6-16c3 4 6 9 6 16z" fill="url(#templeLit)"/><circle cx="{x0}" cy="-62.5" r="2" fill="url(#gold)"/>' for x0 in (-26, 26)),
  # ghat steps down to the river
  ''.join(f'<path d="M{-92 - k*8} {10 + k*5}h{70 + k*10}v5h-{70 + k*10}z" fill="{c}"/>' for k, c in enumerate(['#a59a92', '#958a83', '#857b75', '#766d68'])),
  '</g>']
b(''.join(temple))
# a few lit diyas on the ghat
OVER['diyas'] = [(tx + dx, ty + 18) for dx in (-70, -54, -40)]
for dx in (-70, -54, -40):
    b(f'<circle cx="{tx+dx}" cy="{ty+18}" r="5" fill="#ffd27a" opacity=".55" filter="url(#soft)"/><circle cx="{tx+dx}" cy="{ty+18}" r="1.4" fill="#fff3c4"/>')

# ------------------------------------------------------------------ foreground frame
fg_l = md((-10, 520), (150, 660), .12, 4) + md((150, 660), (330, 800), .1, 4) + [(330, 800), (-10, 800)]
b(f'<path d="{poly(fg_l)}" fill="url(#meadow)"/>')
b(f'<clipPath id="cFg"><path d="{poly(fg_l)}"/></clipPath>')
b(f'<rect width="{W}" height="{H}" filter="url(#texFine)" clip-path="url(#cFg)" style="mix-blend-mode:multiply" opacity=".5"/>')
fg_r = md((1210, 600), (1060, 720), .1, 4) + md((1060, 720), (960, 800), .1, 4) + [(960, 800), (1210, 800)]
b(f'<path d="{poly(fg_r)}" fill="url(#meadow)"/>')
b(boulder(150, 760, 48, 'rockDark', foam=False) + boulder(1070, 772, 40, 'rockDark', foam=False) + boulder(260, 790, 30, 'rockDark', foam=False))
for x, y, h in [(30, 640, 330), (95, 600, 250), (-20, 690, 380), (150, 650, 190), (1170, 640, 290), (1120, 670, 220), (1215, 700, 360)]:
    b(f'<path d="M{x} {y}v-{h*.25}" stroke="#5a3e2b" stroke-width="{h*.03:.1f}"/>')
    b(tree(x, y, h, '#24543a', lit='#e6d27e'))

# wildflowers and grass tufts
fl_cols = ['#ff7aa8', '#ffd23f', '#ffffff', '#b48cff', '#ff9f43', '#ff5d6c']
b('<clipPath id="cFgAll">' + f'<path d="{poly(fg_l)}"/><path d="{poly(fg_r)}"/>' + '</clipPath>')
for cid, n in (('cBank', 260), ('cFgAll', 260)):
    g = [f'<g clip-path="url(#{cid})">']
    for _ in range(n):
        y = R.uniform(600, 800); t = (y - 600) / 200
        x = R.uniform(-10, 1210)
        if cid == 'cFgAll' and 330 < x < 950: continue
        r = .8 + 3.2 * t * R.uniform(.6, 1.2)
        g.append(f'<path d="M{f(x)} {f(y)}v{f(r*2.2)}" stroke="#4f8a3a" stroke-width="{f(.4+r*.2)}"/>')
        c = R.choice(fl_cols)
        g.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{c}"/><circle cx="{f(x)}" cy="{f(y)}" r="{f(r*.35)}" fill="#fff4b0"/>')
    for _ in range(n):
        y = R.uniform(600, 800); t = (y - 600) / 200; x = R.uniform(-10, 1210); h = 3 + 14 * t
        g.append(f'<path d="M{f(x)} {f(y)}l{f(-h*.3)} {f(-h)}M{f(x)} {f(y)}l{f(h*.05)} {f(-h*1.1)}M{f(x)} {f(y)}l{f(h*.35)} {f(-h*.9)}" stroke="#6faa45" stroke-width="{f(.5+t)}" stroke-linecap="round"/>')
    b(''.join(g) + '</g>')

b('<!--LAYER mist-->')
# morning mist drifting low over the water
b('<rect x="300" y="605" width="700" height="50" fill="#ffffff" opacity=".35" filter="url(#fog)"/>')

finish(600)
