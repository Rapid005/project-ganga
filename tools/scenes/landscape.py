"""Shared landscape for the scenes: sky, clouds, the Gangotri peaks, forested hills.
Run by each scene file with exec(), so everything lands in that scene's namespace."""
import math, random, sys, json
LAYERED = len(sys.argv) > 2 and sys.argv[2] == 'layered'
OVER = {}

W, H = 1200, 800
R = random.Random(11)
out = []
def add(s): out.append(s)
def f(v): return f'{v:.1f}'.rstrip('0').rstrip('.')

def inside_poly(x, y, pts):
    c = False
    for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1]):
        if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1): c = not c
    return c

def md(a, b, rough, depth, rng=R):
    """Midpoint-displacement polyline from a to b (excluding b)."""
    pts = [a, b]
    for d in range(depth):
        n = [pts[0]]
        for p, q in zip(pts, pts[1:]):
            L = math.hypot(q[0]-p[0], q[1]-p[1])
            mx, my = (p[0]+q[0])/2, (p[1]+q[1])/2
            # displace perpendicular-ish, mostly vertical for ridgelines
            nx, ny = -(q[1]-p[1])/(L or 1), (q[0]-p[0])/(L or 1)
            off = rng.uniform(-1, 1) * L * rough
            n += [(mx + nx*off, my + ny*off), q]
        pts = n
    return pts[:-1]

def poly(pts): return 'M' + 'L'.join(f'{f(x)} {f(y)}' for x, y in pts) + 'Z'
def line(pts): return 'M' + 'L'.join(f'{f(x)} {f(y)}' for x, y in pts)

def skyline(keys, rough, depth):
    pts = []
    for a, b in zip(keys, keys[1:]): pts += md(a, b, rough, depth)
    return pts + [keys[-1]]

# ------------------------------------------------------------------ defs
add(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{LABEL}">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#5d9bd6"/><stop offset=".3" stop-color="#9cc8ec"/>
  <stop offset=".5" stop-color="#d9ebf2"/><stop offset=".62" stop-color="#fff0cf"/><stop offset=".8" stop-color="#ffe2a6"/></linearGradient>
<radialGradient id="sun" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1000 345) scale(560 420)">
  <stop offset="0" stop-color="#fff4cf" stop-opacity="1"/><stop offset=".18" stop-color="#ffd99a" stop-opacity=".8"/>
  <stop offset=".5" stop-color="#f6a98a" stop-opacity=".25"/><stop offset="1" stop-color="#f6a98a" stop-opacity="0"/></radialGradient>
<linearGradient id="farShade" x1="0" x2="0" gradientUnits="userSpaceOnUse" y1="150" y2="560">
  <stop offset="0" stop-color="#e4eef8"/><stop offset=".45" stop-color="#bdd1e8"/><stop offset="1" stop-color="#93aecd"/></linearGradient>
<linearGradient id="farLit" x1="0" x2="0" gradientUnits="userSpaceOnUse" y1="150" y2="560">
  <stop offset="0" stop-color="#ffffff"/><stop offset=".25" stop-color="#fff8e8"/><stop offset=".55" stop-color="#f9e2c2"/><stop offset="1" stop-color="#cdbfae"/></linearGradient>
<linearGradient id="mid1" x1="0" x2="0" gradientUnits="userSpaceOnUse" y1="360" y2="640">
  <stop offset="0" stop-color="#7fa7a2"/><stop offset="1" stop-color="#4f7f70"/></linearGradient>
<linearGradient id="mid1Lit" x1="0" x2="0" gradientUnits="userSpaceOnUse" y1="360" y2="640">
  <stop offset="0" stop-color="#d8e3b0"/><stop offset=".5" stop-color="#a6c792"/><stop offset="1" stop-color="#6c9a78"/></linearGradient>
<linearGradient id="mid2" x1="0" x2="0" gradientUnits="userSpaceOnUse" y1="440" y2="700">
  <stop offset="0" stop-color="#5a9a62"/><stop offset="1" stop-color="#2f6a42"/></linearGradient>
<linearGradient id="meadow" x1="0" x2="0" gradientUnits="userSpaceOnUse" y1="520" y2="800"><stop offset="0" stop-color="#9fd06e"/><stop offset="1" stop-color="#3f8a3a"/></linearGradient>
<linearGradient id="water" x1="0" x2="0" gradientUnits="userSpaceOnUse" y1="560" y2="800">
  <stop offset="0" stop-color="#dff6f2"/><stop offset=".35" stop-color="#86d3d6"/><stop offset="1" stop-color="#2c96a8"/></linearGradient>
<linearGradient id="bank" x1="0" x2="0" gradientUnits="userSpaceOnUse" y1="560" y2="800">
  <stop offset="0" stop-color="#b4d889"/><stop offset="1" stop-color="#5f9d4a"/></linearGradient>
<radialGradient id="rock" cx=".62" cy=".3" r=".8">
  <stop offset="0" stop-color="#f4ece0"/><stop offset=".45" stop-color="#bdb3a6"/><stop offset="1" stop-color="#7c7266"/></radialGradient>
<radialGradient id="rockDark" cx=".65" cy=".3" r=".85">
  <stop offset="0" stop-color="#e2d8c8"/><stop offset=".5" stop-color="#9c9284"/><stop offset="1" stop-color="#5e564c"/></radialGradient>
<linearGradient id="ray" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#fff1cf" stop-opacity="0"/><stop offset="1" stop-color="#fff1cf" stop-opacity=".9"/></linearGradient>
<linearGradient id="templeLit" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#d9cfc6"/><stop offset=".55" stop-color="#f6eee4"/><stop offset="1" stop-color="#ffe9cf"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#8f6418"/><stop offset=".6" stop-color="#f3d38a"/><stop offset="1" stop-color="#ffe6a8"/></linearGradient>
<filter id="tex" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".006 .022" numOctaves="6" seed="4"/>
  <feDiffuseLighting surfaceScale="5" lighting-color="#ffffff" diffuseConstant="1.1"><feDistantLight azimuth="-10" elevation="38"/></feDiffuseLighting>
</filter>
<filter id="texFine" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".02 .05" numOctaves="5" seed="9"/>
  <feDiffuseLighting surfaceScale="3" lighting-color="#ffffff" diffuseConstant="1.1"><feDistantLight azimuth="-10" elevation="45"/></feDiffuseLighting>
</filter>
<filter id="fog" x="-10%" y="-60%" width="120%" height="220%">
  <feTurbulence type="fractalNoise" baseFrequency=".006 .03" numOctaves="4" seed="2" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="60" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feGaussianBlur in="d" stdDeviation="10"/></filter>
<filter id="cloud" x="-20%" y="-100%" width="140%" height="300%">
  <feTurbulence type="fractalNoise" baseFrequency=".01 .06" numOctaves="4" seed="7" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="40" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feGaussianBlur in="d" stdDeviation="3"/></filter>
<filter id="soft"><feGaussianBlur stdDeviation="2.2"/></filter>
<filter id="soft6" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="soft14" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="5"/>
  <feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .55 0"/></filter>
''')

# ------------------------------------------------------------------ sky
body = []
def b(s): body.append(s)
b('<!--LAYER sky-->')
b(f'<rect width="{W}" height="{H}" fill="url(#sky)"/>')
b(f'<rect width="{W}" height="{H}" fill="url(#sun)"/>')
b('<circle cx="1000" cy="345" r="60" fill="#fff6d6" opacity=".6" filter="url(#soft14)"/><circle cx="1000" cy="345" r="25" fill="#fffdf2"/>')
# high thin clouds lit by the sunrise
b('<!--LAYER clouds-->')
for cx, cy, rx, ry, op in [(260,150,230,9,.5),(520,118,170,6,.4),(860,190,260,10,.55),(1080,140,140,6,.4),(700,240,200,7,.45)]:
    b(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#ffffff" opacity="{min(1,op+.35)}" filter="url(#cloud)"/>')
    b(f'<ellipse cx="{cx+20}" cy="{cy-2}" rx="{rx*.6:.0f}" ry="{ry*.45:.1f}" fill="#fff1cc" opacity="{min(1,op+.3)}" filter="url(#cloud)"/>')

# ------------------------------------------------------------------ mountains
def crests_and_gullies(sk):
    """Peaks (local minima of y) and saddles (local maxima) along a skyline."""
    peaks, sads = [], []
    for i in range(1, len(sk) - 1):
        if sk[i][1] <= sk[i-1][1] and sk[i][1] < sk[i+1][1]: peaks.append(i)
        if sk[i][1] >= sk[i-1][1] and sk[i][1] > sk[i+1][1]: sads.append(i)
    return peaks, sads

def fall(p, base, lean, rough=.06):
    """A ridge or gully falling from skyline point p down-left to the base."""
    end = (p[0] - (base - p[1]) * lean, base)
    return md(p, end, rough, 5) + [end]

def facet_layer(sk, base, fill, lit_fill, shade_col, cid, lean=.42, minw=14, flutes=0, flute_col='#4b4660', tex='tex', tex_op=.4):
    shape = sk + [(1210, base), (-10, base)]
    b(f'<clipPath id="{cid}"><path d="{poly(shape)}"/></clipPath>')
    b(f'<path d="{poly(shape)}" fill="{fill}"/>')
    peaks, sads = crests_and_gullies(sk)
    for pi in peaks:
        nxt = [s for s in sads if s > pi]
        if not nxt: continue
        si = nxt[0]
        if sk[si][0] - sk[pi][0] < minw: continue
        crest = fall(sk[pi], base, lean)
        gully = fall(sk[si], base, lean * 1.1)
        # sunlit face: crest (bottom to top), along the skyline, then down the gully
        face = list(reversed(crest)) + sk[pi:si+1] + gully
        b(f'<path d="{poly(face)}" fill="{lit_fill}" clip-path="url(#{cid})"/>')
        # secondary ribs inside the lit face: thin shadowed gullies between them
        span = si - pi
        for k in range(1, span):
            if R.random() < .35:
                p = sk[pi + k]
                g = fall(p, min(base, p[1] + R.uniform(60, 220)), lean * R.uniform(.9, 1.2), .1)
                w = R.uniform(1.5, 6)
                b(f'<path d="{line(g)}" stroke="{shade_col}" stroke-width="{f(w)}" stroke-opacity="{f(R.uniform(.25,.55))}" fill="none" stroke-linecap="round" clip-path="url(#{cid})"/>')
    # snow flutes: fine parallel lines following the fall line
    for _ in range(flutes):
        k = R.randrange(len(sk)); p = sk[k]
        L = R.uniform(25, 110)
        g = fall((p[0] + R.uniform(-6, 6), p[1] + R.uniform(4, 30)), p[1] + L, lean * R.uniform(.8, 1.2), .05)
        b(f'<path d="{line(g)}" stroke="{flute_col}" stroke-width="{f(R.uniform(.6,1.8))}" stroke-opacity="{f(R.uniform(.15,.4))}" fill="none" clip-path="url(#{cid})"/>')
    b(f'<rect width="{W}" height="{base}" filter="url(#{tex})" clip-path="url(#{cid})" style="mix-blend-mode:multiply" opacity="{tex_op}"/>')
    return shape

b('<!--LAYER far-->')
far_keys = [(-10,430),(70,372),(150,318),(205,300),(250,262),(300,282),(338,236),(372,262),(420,214),(470,280),(540,330),
            (610,300),(700,170),(760,250),(820,300),(900,350),(980,382),(1060,360),(1130,392),(1210,410)]
sky_far = skyline(far_keys, .12, 5)
facet_layer(sky_far, 640, 'url(#farShade)', 'url(#farLit)', '#a9bcd6', 'cFar', flutes=160, flute_col='#8fa6c4', tex_op=.22)
# alpenglow rim on the ridgelines
b(f'<path d="{line(sky_far)}" stroke="#fff6ea" stroke-width="1.6" fill="none" opacity=".6" filter="url(#soft)"/>')
# haze over the base of the far range
b('<rect y="400" width="1200" height="240" fill="#fff6e2" opacity=".45" filter="url(#soft14)"/>')

def ridge_layer(keys, rough, fill, lit_fill, tex_op, cid, shade='#4a7a66'):
    sk = skyline(keys, rough, 5)
    facet_layer(sk, 800, fill, lit_fill, shade, cid, lean=.6, minw=10, tex='texFine', tex_op=tex_op)
    return sk

b('<!--LAYER mid-->')
mid1 = ridge_layer([(-10,470),(90,430),(180,452),(260,404),(350,450),(430,470),(520,452),(600,480),(690,500),(780,470),
                    (860,430),(930,410),(1010,446),(1100,420),(1210,450)], .14, 'url(#mid1)', 'url(#mid1Lit)', .45, 'cM1')
b('<rect y="470" width="1200" height="120" fill="#ffffff" opacity=".42" filter="url(#fog)"/>')

# forests on the second ridge
mid2 = ridge_layer([(-10,520),(70,500),(160,532),(250,512),(330,560),(420,575),(500,590),(560,600),(620,598),(700,588),
                    (790,560),(880,520),(960,500),(1050,528),(1130,505),(1210,520)], .1, 'url(#mid2)', '#93c46e', .25, 'cM2')

def tree(x, y, h, col, lit=None):
    """Deodar: a narrow spire with drooping tiers."""
    w = h * .36
    tiers = max(3, int(h / 7))
    d = f'M{f(x)} {f(y-h)}'
    left, right = [], []
    for t in range(1, tiers + 1):
        yy = y - h + h * t / tiers
        ww = w * (t / tiers) ** .85 * R.uniform(.85, 1.1)
        right += [(x + ww, yy + h*.03), (x + ww * .38, yy - h*.025)]
        left += [(x - ww, yy + h*.03), (x - ww * .38, yy - h*.025)]
    right[-1] = (x + 1.2, y); left[-1] = (x - 1.2, y)
    d += ''.join(f'L{f(px)} {f(py)}' for px, py in right) + ''.join(f'L{f(px)} {f(py)}' for px, py in reversed(left)) + 'Z'
    s = f'<path d="{d}" fill="{col}"/>'
    if lit:
        s += f'<path d="M{f(x)} {f(y-h)}' + ''.join(f'L{f(px)} {f(py)}' for px, py in right) + f'L{f(x)} {f(y)}Z" fill="{lit}" opacity=".35"/>'
    return s

def ridge_y(sk, x):
    for p, q in zip(sk, sk[1:]):
        if p[0] <= x <= q[0]:
            t = (x - p[0]) / ((q[0] - p[0]) or 1)
            return p[1] + (q[1] - p[1]) * t
    return sk[-1][1]

# trees along and below mid2 ridge, receding = smaller & hazier
trees = []
for _ in range(900):
    x = R.uniform(-10, 1210)
    ry = ridge_y(mid2, x)
    dy = R.uniform(-4, 120) ** 1.0
    y = ry + abs(dy)
    if 545 < y < 640 and 380 < x < 820: continue      # keep the gorge clear
    h = 10 + (y - 480) * .09 + R.uniform(-3, 4)
    trees.append((y, x, h))
for y, x, h in sorted(trees):
    tone = min(1, max(0, (y - 500) / 160))
    r_, g_, bb = int(78 - 46*tone), int(128 - 46*tone), int(96 - 50*tone)
    b(tree(x, y, h, f'#{r_:02x}{g_:02x}{bb:02x}', lit='#f0dc8a' if x > 600 else None))
b('<rect y="560" width="1200" height="90" fill="#fffaf0" opacity=".4" filter="url(#fog)"/>')

def boulder(x, y, r, grad='rock', foam=True):
    pts = []
    n = 14
    for k in range(n):
        a = math.pi * 2 * k / n
        rr = r * R.uniform(.82, 1.12)
        pts.append((x + math.cos(a) * rr * 1.25, y + math.sin(a) * rr * (.75 if a < math.pi else .45)))
    s = ''
    if foam:
        s += f'<ellipse cx="{f(x)}" cy="{f(y + r*.4)}" rx="{f(r*1.9)}" ry="{f(r*.45)}" fill="#ffffff" opacity=".75" filter="url(#soft)"/>'
        s += f'<path d="M{f(x - r*2.2)} {f(y + r*.55)}q{f(r*.6)} {f(-r*.3)} {f(r*1.2)} 0M{f(x + r*.9)} {f(y + r*.6)}q{f(r*.6)} {f(-r*.3)} {f(r*1.3)} 0" stroke="#fff" stroke-width="{f(max(1, r*.12))}" fill="none" opacity=".8" stroke-linecap="round"/>'
    s += f'<path d="{poly(pts)}" fill="url(#{grad})"/>'
    return s


def finish(sparkle_top):
    """Birds, light rays, grain, overlay data; then write the SVG."""
    b('<!--LAYER birds-->')
    # birds
    for x, y, s in [(560, 300, 1), (590, 318, .8), (612, 296, .7), (300, 210, 1.2), (330, 228, .9), (845, 255, .8)]:
        b(f'<path d="M{x} {y}q{5*s} {-5*s} {10*s} 0q{5*s} {-5*s} {10*s} 0" stroke="#41506a" stroke-width="1.4" fill="none" stroke-linecap="round"/>')

    b('<!--LAYER rays-->')
    # sun rays through the gap, then film grain
    for a0, a1, op in [(-.2, -.05, .1), (.02, .12, .08), (.2, .3, .06)]:
        x0, y0 = 1000, 345
        pts = [(x0, y0), (x0 - 1100 * math.cos(a0), y0 + 1100 * math.sin(a0)), (x0 - 1100 * math.cos(a1), y0 + 1100 * math.sin(a1))]
        b(f'<path d="{poly(pts)}" fill="#fff3c8" opacity="{op*2.2}" filter="url(#soft14)" style="mix-blend-mode:screen"/>')
    b('<!--LAYER grain-->')
    b(f'<rect width="{W}" height="{H}" filter="url(#grain)" opacity=".05" style="mix-blend-mode:overlay"/>')

    sp = []
    while len(sp) < 34:
        x, y = R.uniform(0, 1200), R.uniform(sparkle_top, 800)
        if inside_poly(x, y, river): sp.append((round(x), round(y)))
    OVER['sparkles'] = sp
    if len(sys.argv) > 3: json.dump(OVER, open(sys.argv[3], 'w'))
    svg = '\n'.join(out) + '</defs>\n' + '\n'.join(body) + '\n</svg>\n'
    open(sys.argv[1], 'w').write(svg)
    print(len(svg) // 1024, 'KB')
