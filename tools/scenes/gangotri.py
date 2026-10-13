"""Home page scene: sunrise at Gangotri, the Bhagirathi winding past the temple.

Usage: python3 gangotri.py OUT.svg [layered OUT.json]"""
import os
LABEL = "Sunrise at Gangotri: snow peaks glowing above deodar forests, wildflower meadows and the clear Bhagirathi flowing past the white Gangotri temple"
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'landscape.py')).read())

b('<!--LAYER front-->')
# ------------------------------------------------------------------ valley, river, temple
# The Bhagirathi leaves the gorge and widens as it nears us, in an S-bend: first toward
# the temple steps, then back across the foreground. COURSE is (centre x, y, width).
COURSE = [(600, 600, 90), (630, 625, 110), (680, 650, 150), (690, 680, 200), (650, 710, 250), (560, 745, 320), (500, 775, 420), (470, 800, 560)]
L_EDGE = [(cx - w / 2, y) for cx, y, w in COURSE]
R_EDGE = [(cx + w / 2, y) for cx, y, w in COURSE]
river = [(570, 597), (630, 597)] + R_EDGE + list(reversed(L_EDGE))
river_s = []
for p, q in zip(river, river[1:] + river[:1]):
    river_s += md(p, q, .06 if p[1] > 610 and q[1] > 610 else .02, 4)
# meadow banks follow the rough river edge
iL = next(i for i, p in enumerate(river_s) if p == L_EDGE[-1])
iR0 = next(i for i, p in enumerate(river_s) if p == R_EDGE[0])
iR1 = next(i for i, p in enumerate(river_s) if p == R_EDGE[-1])
left_edge = river_s[iL:] + [river_s[0]]                  # from the bottom-left corner back up to the gorge
bank_l = md((-310, 652), (520, 598), .05, 5) + [(520, 598)] + list(reversed(left_edge)) + [(-310, 800)]
bank_r = md((650, 598), (1810, 636), .05, 5) + [(1810, 636), (1810, 800)] + list(reversed(river_s[iR0:iR1 + 1]))
b(f'<path d="{poly(bank_l)}" fill="url(#bank)"/>')
b(f'<path d="{poly(bank_r)}" fill="url(#bank)"/>')
b('<clipPath id="cBank">' + f'<path d="{poly(bank_l)}"/><path d="{poly(bank_r)}"/>' + '</clipPath>')
b(f'<rect x="{X0}" width="{AW}" height="{H}" filter="url(#texFine)" clip-path="url(#cBank)" style="mix-blend-mode:multiply" opacity=".22"/>')
# a soft pebble beach where water meets meadow
b(f'<path d="{poly(river_s)}" fill="none" stroke="#e3dac6" stroke-width="18" stroke-linejoin="round" opacity=".9" filter="url(#soft)"/>')
b(f'<clipPath id="cRiv"><path d="{poly(river_s)}"/></clipPath>')
b(f'<path d="{poly(river_s)}" fill="url(#water)"/>')
# reflections: the snow peaks far up the river, and the bright morning sky closer in
b('<ellipse cx="600" cy="622" rx="80" ry="9" fill="#f6eef3" opacity=".5" filter="url(#soft6)" clip-path="url(#cRiv)"/>')
b('<path d="M640 630C690 650 712 680 676 706S560 748 470 800" stroke="#fff4c8" stroke-width="46" fill="none" opacity=".5" filter="url(#soft6)" clip-path="url(#cRiv)"/>')
# a long gravel bar splits the current in the shallows
bar = []
for k in range(18):
    a = math.pi * 2 * k / 18
    rr = R.uniform(.88, 1.1)
    bar.append((548 + math.cos(a) * 96 * rr, 757 + math.sin(a) * (13 if a < math.pi else 8) * rr))
b(f'<path d="{poly(bar)}" fill="#e4dccb"/><path d="{poly(bar)}" fill="none" stroke="#ffffff" stroke-width="2.4" opacity=".75" filter="url(#soft)"/>')
b(''.join(f'<ellipse cx="{f(R.uniform(470, 625))}" cy="{f(R.uniform(752, 764))}" rx="{f(R.uniform(1.5, 4))}" ry="{f(R.uniform(1, 2.2))}" fill="{R.choice(["#b9ae99", "#a39985", "#cfc6b4"])}"/>' for _ in range(40)))
# current lines, longer and brighter in the foreground
for _ in range(150):
    y = R.uniform(604, 800); t = (y - 600) / 200
    x = R.uniform(170, 1030)
    if not inside_poly(x, y, river) or inside_poly(x, y, bar): continue
    ln = R.uniform(10, 46) * (0.4 + t)
    b(f'<path d="M{f(x)} {f(y)}q{f(ln/2)} {f(-2-2*t)} {f(ln)} 0" stroke="#f3f6f2" stroke-width="{f(.6+1.6*t)}" stroke-opacity="{f(R.uniform(.25,.7))}" fill="none" stroke-linecap="round" clip-path="url(#cRiv)"/>')

stones = []
for _ in range(44):
    y = R.uniform(612, 795); t = (y - 600) / 200
    x = R.uniform(170, 1030)
    if inside_poly(x, y, bar): continue
    stones.append((y, x, (3 + 22 * t ** 1.4) * R.uniform(.6, 1.2), inside_poly(x, y, river)))
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
fg_l = md((-310, 500), (-120, 562), .1, 4) + md((-120, 562), (60, 680), .12, 4) + md((60, 680), (160, 800), .1, 4) + [(160, 800), (-310, 800)]
b(f'<path d="{poly(fg_l)}" fill="url(#meadow)"/>')
fg_r = md((1810, 560), (1510, 578), .1, 4) + md((1510, 578), (1160, 690), .1, 4) + md((1160, 690), (1060, 800), .1, 4) + [(1060, 800), (1810, 800)]
b(f'<path d="{poly(fg_r)}" fill="url(#meadow)"/>')
b('<clipPath id="cFgAll">' + f'<path d="{poly(fg_l)}"/><path d="{poly(fg_r)}"/>' + '</clipPath>')
b(f'<rect x="{X0}" width="{AW}" height="{H}" filter="url(#texFine)" clip-path="url(#cFgAll)" style="mix-blend-mode:multiply" opacity=".45"/>')
b(boulder(70, 772, 40, 'rockDark', foam=False) + boulder(1110, 778, 36, 'rockDark', foam=False) + boulder(-160, 786, 46, 'rockDark', foam=False) + boulder(1600, 784, 44, 'rockDark', foam=False))
for x, y, h in [(-250, 600, 360), (-170, 566, 300), (-95, 640, 330), (-25, 696, 250), (40, 650, 190),
                (1150, 706, 230), (1215, 668, 300), (1300, 644, 360), (1390, 626, 320), (1465, 690, 380),
                (1560, 640, 340), (1640, 606, 300), (1720, 664, 370), (1790, 624, 320)]:
    b(f'<path d="M{x} {y}v-{h*.25}" stroke="#5a3e2b" stroke-width="{h*.03:.1f}"/>')
    b(tree(x, y, h, '#24543a', lit='#e6d27e'))

# wildflowers and grass tufts
fl_cols = ['#ff7aa8', '#ffd23f', '#ffffff', '#b48cff', '#ff9f43', '#ff5d6c']
for cid, n in (('cBank', 360), ('cFgAll', 320)):
    g = [f'<g clip-path="url(#{cid})">']
    for _ in range(n):
        y = R.uniform(600, 800); t = (y - 600) / 200
        x = R.uniform(-310, 1810)
        if cid == 'cFgAll' and 160 < x < 1060: continue
        r = .8 + 3.2 * t * R.uniform(.6, 1.2)
        g.append(f'<path d="M{f(x)} {f(y)}v{f(r*2.2)}" stroke="#4f8a3a" stroke-width="{f(.4+r*.2)}"/>')
        c = R.choice(fl_cols)
        g.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{c}"/><circle cx="{f(x)}" cy="{f(y)}" r="{f(r*.35)}" fill="#fff4b0"/>')
    for _ in range(n):
        y = R.uniform(600, 800); t = (y - 600) / 200; x = R.uniform(-310, 1810); h = 3 + 14 * t
        g.append(f'<path d="M{f(x)} {f(y)}l{f(-h*.3)} {f(-h)}M{f(x)} {f(y)}l{f(h*.05)} {f(-h*1.1)}M{f(x)} {f(y)}l{f(h*.35)} {f(-h*.9)}" stroke="#6faa45" stroke-width="{f(.5+t)}" stroke-linecap="round"/>')
    b(''.join(g) + '</g>')

b('<!--LAYER mist-->')
# morning mist drifting low over the water
b('<rect x="250" y="604" width="800" height="54" fill="#ffffff" opacity=".35" filter="url(#fog)"/>')

finish(600)
