"""Generates every PNG used by the shop into public/assets/.
Run:  python3 tools/make_assets.py   (needs Pillow)
These are STYLISED look-alikes, not scans of real packaging. To make the shop
historically accurate, drop real reference images over the files of the same name."""
import os, random
from PIL import Image, ImageDraw, ImageFont

R = random.Random(1998)
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'assets')
FD = '/usr/share/fonts/truetype/dejavu/'


def F(sz, serif=True, italic=False):
    n = 'DejaVuSerif-Bold.ttf' if serif else ('DejaVuSans-Oblique.ttf' if italic else 'DejaVuSans-Bold.ttf')
    try:
        return ImageFont.truetype(FD + n, sz)
    except Exception:
        return ImageFont.load_default()


def save(im, rel):
    p = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    im.convert('RGB').save(p)


def hexrgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def grime(im, n=300, a=40):
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    w, h = im.size
    for _ in range(n):
        x, y = R.randrange(w), R.randrange(h)
        c = (40, 25, 10, R.randrange(5, a)) if R.random() < .65 else (255, 240, 200, R.randrange(5, a))
        d.rectangle([x, y, x + R.randrange(1, 14), y + R.randrange(1, 30)], fill=c)
    im.paste(Image.alpha_composite(im.convert('RGBA'), ov).convert('RGB'))


def grad(w, h, c1, c2):
    im = Image.new('RGB', (w, h))
    d = ImageDraw.Draw(im)
    for y in range(h):
        t = y / (h - 1)
        d.line([(0, y), (w, y)], fill=tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)))
    return im


def text(d, xy, s, font, fill, anchor='mm', shadow=None):
    if shadow:
        d.text((xy[0] + 3, xy[1] + 3), s, font=font, fill=shadow, anchor=anchor)
    d.text(xy, s, font=font, fill=fill, anchor=anchor)


def fit(d, s, maxw, start, serif=True):
    sz = start
    while sz > 8 and d.textlength(s, font=F(sz, serif)) > maxw:
        sz -= 2
    return F(sz, serif)


# ---- packets (256x384) ----
PK = [('parleg', 'Parle-G', 'GLUCOSE BISCUITS', '#f4c430', '#c0281c'), ('monaco', 'Monaco', 'SALTED CRACKER', '#d8452a', '#ffffff'),
      ('hideseek', 'Hide&Seek', 'CHOCO CHIP', '#5b2b17', '#f6c944'), ('littlehearts', 'Little Hearts', 'HEART BISCUITS', '#e56a8a', '#ffffff'),
      ('fiftyfifty', '50-50', 'SWEET & SALTY', '#2b6cb0', '#ffffff'), ('unclechipps', 'Uncle Chipps', 'SALTED CHIPS', '#f0b92a', '#27408b'),
      ('poppins', 'Poppins', 'FRUIT CANDY', '#7cbf3e', '#ffffff'), ('melody', 'Melody', 'CHOCOLATY TOFFEE', '#6a3b1f', '#f7d98b'),
      ('hajmola', 'Hajmola', 'CHATPATA GOLI', '#a3202b', '#ffffff'), ('krackjack', 'KrackJack', 'SWEET & SALTY', '#1f7050', '#ffd33d')]
for i, n, sub, bg, fg in PK:
    w, h = 256, 384
    im = grad(w, h, hexrgb(bg), tuple(int(c * .8) for c in hexrgb(bg)))
    d = ImageDraw.Draw(im, 'RGBA')
    d.polygon([(0, h * .55), (w, h * .3), (w, h * .62), (0, h * .9)], fill=(255, 255, 255, 46))
    d.ellipse([w / 2 - 70, h * .12, w / 2 + 70, h * .12 + 140], fill=hexrgb(fg) + (255,))
    text(d, (w / 2, h * .12 + 70), n[0], F(90), hexrgb(bg))
    text(d, (w / 2, h * .62), n, fit(d, n, w - 28, 54), hexrgb(fg), shadow=(0, 0, 0, 90))
    text(d, (w / 2, h * .74), sub, F(16, False), hexrgb(fg))
    d.rectangle([0, 0, w, 22], fill=(0, 0, 0, 70))
    d.rectangle([0, h - 22, w, h], fill=(0, 0, 0, 70))
    for x in range(0, w, 6):
        d.line([(x, 0), (x, 22)], fill=(255, 255, 255, 40))
        d.line([(x, h - 22), (x, h)], fill=(255, 255, 255, 40))
    d.rectangle([w * .1, h * .84, w * .9, h * .93], outline=hexrgb(fg), width=3)
    text(d, (w / 2, h * .885), 'Rs. 5', F(26, False), hexrgb(fg))
    grime(im, 160, 30)
    save(im, f'products/{i}.png')

# ---- candy-cigarette box, pencil box, car hood ----
im = Image.new('RGB', (300, 300), '#f4f1ea')
d = ImageDraw.Draw(im)
d.rectangle([0, 0, 300, 44], fill='#c2272d')
d.rectangle([0, 262, 300, 300], fill='#c2272d')
text(d, (150, 125), 'PHANTOM', F(54), '#173b7a')
text(d, (150, 175), 'SWEET CANDY STICKS', F(20, False), '#173b7a')
text(d, (150, 208), 'contains no tobacco', F(16, False, True), '#173b7a')
grime(im, 100, 25)
save(im, 'products/phantom.png')

im = grad(512, 256, (31, 111, 181), (123, 63, 181))
d = ImageDraw.Draw(im)
text(d, (256, 100), 'SPACE RANGERS', F(46), '#ffd24a', shadow=(0, 0, 0))
text(d, (256, 160), 'Ambassador pencil box  -  2 compartments', F(20, False), 'white')
for k in range(14):
    x, y = R.randrange(512), R.randrange(256)
    d.ellipse([x, y, x + 4, y + 4], fill='white')
d.polygon([(40, 210), (80, 170), (120, 210), (80, 200)], fill='#ffd24a')
grime(im, 120, 30)
save(im, 'products/spaceranger.png')

im = Image.new('RGB', (512, 256), '#d62828')
d = ImageDraw.Draw(im)
for k in range(6):
    y0 = 30 + k * 34
    d.polygon([(0, y0), (260, y0 - 24 + k * 6), (420, y0 + 20), (260, y0 + 12), (0, y0 + 26)], fill='#ffd23f' if k % 2 == 0 else '#ff9f1c')
text(d, (440, 200), '5', F(70, False), 'white')
grime(im, 80, 30)
save(im, 'products/flames.png')

# ---- cassettes ----
for cid, title, sub, col in [('cassette_mix', "MIX '99", 'Antakshari hits - Side A', '#e0405a'), ('cassette_filmi', 'FILMI GAANE', 'Vol. 4 - 90 min', '#1f6fb5')]:
    im = Image.new('RGB', (512, 320), '#efe4c4')
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 512, 80], fill=col)
    text(d, (256, 40), title, F(40), 'white')
    text(d, (256, 130), sub, F(26, False, True), '#33302a')
    for y in (170, 205, 240):
        d.line([(40, y), (472, y)], fill='#b9ad8a', width=2)
    d.rounded_rectangle([140, 262, 372, 310], 10, fill='#2b2a28')
    for cx in (200, 312):
        d.ellipse([cx - 22, 274, cx + 22, 298], fill='#f4f4f0')
    grime(im, 120, 30)
    save(im, f'products/{cid}.png')

# ---- DVD covers (400x560) ----
for cid, title, tag, c1, c2 in [('dil_ke_paas', 'Dil Ke Paas', 'A love story in 3 monsoons', '#c2185b', '#ff9800'),
                                ('chhota_hero', 'Chhota Hero', 'Small kid. Big heart.', '#1565c0', '#4dd0e1'),
                                ('bandook_2', 'Bandook 2', 'The sequel nobody asked for', '#212121', '#b71c1c'),
                                ('shaadi_season', 'Shaadi Season', '5 days. 500 guests. 1 mandap.', '#f9a825', '#e91e63'),
                                ('cartoon_mela', 'Cartoon Mela Vol. 3', '12 episodes - Hindi dub', '#7cb342', '#00acc1'),
                                ('cricket_deewane', 'Cricket Ke Deewane', 'Gully to glory', '#2e7d32', '#1a237e')]:
    w, h = 400, 560
    im = grad(w, h, hexrgb(c1), hexrgb(c2))
    d = ImageDraw.Draw(im, 'RGBA')
    d.ellipse([w / 2 - 55, 120, w / 2 + 55, 230], fill=(20, 12, 10, 200))
    d.polygon([(70, 400), (130, 262), (270, 262), (330, 400)], fill=(20, 12, 10, 200))
    text(d, (w / 2, 60), tag, fit(d, tag, w - 40, 22, False), 'white')
    text(d, (w / 2, 450), title, fit(d, title, w - 40, 54), '#ffe9a8', shadow=(0, 0, 0, 160))
    d.rectangle([0, h - 56, w, h], fill=(0, 0, 0, 230))
    text(d, (70, h - 28), 'DVD', F(26), 'white')
    text(d, (w - 130, h - 28), 'VIDEO  Region 5', F(18, False), '#cccccc')
    grime(im, 100, 25)
    save(im, f'dvd/{cid}.png')


# ---- shop textures ----
im = grad(2048, 460, (31, 90, 69), (24, 70, 55))
d = ImageDraw.Draw(im, 'RGBA')
d.rectangle([24, 24, 2024, 436], outline='#f1dfa6', width=10)
text(d, (1030, 188), 'SHARMA JI KI DUKAAN', fit(d, 'SHARMA JI KI DUKAAN', 1800, 200), '#f6e3a1', shadow='#8a1c10')
text(d, (1024, 360), 'Kirana  -  Stationery  -  Toffee-Biscuit  -  Toys  -  Since 1987', F(54, False), '#ffd24a')
grime(im, 1400, 60)
save(im, 'textures/sign.png')


def board(name, size, bg, lines):
    im = Image.new('RGB', size, bg)
    d = ImageDraw.Draw(im)
    w, h = size
    n = len(lines)
    for k, (s, sz, col) in enumerate(lines):
        text(d, (w / 2, h * (k + 1) / (n + 1)), s, fit(d, s, w - 30, sz), col)
    grime(im, 160, 45)
    save(im, f'textures/{name}.png')


board('board_std', (512, 256), '#f2c500', [('S.T.D.', 110, '#111'), ('I.S.D.   P.C.O.', 60, '#111')])
board('board_gola', (384, 512), '#e8553d', [('Gola', 80, '#fff6d6'), ('Ice Candy', 70, '#fff6d6'), ('50 paise', 64, '#fff6d6')])
board('board_cold', (384, 384), '#ffffff', [('Cold Drinks', 60, '#c8321e'), ('Recharge', 56, '#1f4f9a'), ('Coupons', 56, '#1f4f9a')])

im = Image.new('RGB', (384, 512), '#f0e1b0')
d = ImageDraw.Draw(im)
d.rectangle([20, 20, 364, 250], fill='#2f6e8f')
d.ellipse([140, 70, 250, 180], fill='#ffd24a')
text(d, (192, 290), '1999', F(60), '#8a1c10')
for r in range(5):
    for c in range(7):
        n = r * 7 + c + 1
        if n < 31:
            text(d, (40 + c * 50, 350 + r * 30), str(n), F(20, False), '#222')
grime(im, 200, 40)
save(im, 'textures/poster_calendar.png')

im = grad(384, 512, (194, 24, 91), (255, 152, 0))
d = ImageDraw.Draw(im)
text(d, (192, 150), 'DIL KE', F(80), 'white')
text(d, (192, 240), 'PAAS', F(80), 'white')
text(d, (192, 400), 'Now showing - Matinee 12:30', F(22, False), 'white')
grime(im, 200, 40)
save(im, 'textures/poster_film.png')

im = Image.new('RGB', (384, 512), '#ffe8a8')
d = ImageDraw.Draw(im)
text(d, (192, 80), 'LUCKY', F(64), '#d62828')
text(d, (192, 150), 'SCRATCH', F(64), '#d62828')
d.rectangle([80, 230, 304, 360], fill='#c0c0c0')
text(d, (192, 295), 'scratch here', F(24, False), '#555')
grime(im, 200, 40)
save(im, 'textures/poster_scratch.png')

im = Image.new('RGB', (512, 512), '#5b9a93')
d = ImageDraw.Draw(im)
d.rectangle([0, 300, 512, 512], fill='#e0cd8c')
d.rectangle([0, 296, 512, 306], fill='#3a6d68')
for k in range(24):
    x, y = R.randrange(512), R.randrange(290)
    d.ellipse([x - 30, y - 15, x + 30, y + 15], fill=(210, 190, 140))
grime(im, 900, 50)
save(im, 'textures/facade.png')

im = Image.new('RGB', (256, 256), '#e9e0b8')
d = ImageDraw.Draw(im)
d.rectangle([0, 133, 256, 256], fill='#4f8f8a')
d.rectangle([0, 128, 256, 136], fill='#2f605c')
grime(im, 500, 45)
save(im, 'textures/wall_paint.png')

im = Image.new('RGB', (256, 256))
d = ImageDraw.Draw(im)
for a in range(8):
    for b in range(8):
        d.rectangle([a * 32 + 1, b * 32 + 1, a * 32 + 31, b * 32 + 31], fill='#a8a39a' if (a + b) % 2 else '#8c5043')
grime(im, 500, 50)
save(im, 'textures/floor_tile.png')

im = Image.new('RGB', (256, 256), '#8a5530')
d = ImageDraw.Draw(im)
for _ in range(90):
    y = R.randrange(256)
    d.line([(0, y), (256, y + R.randrange(-3, 3))], fill=(70 + R.randrange(30), 40, 15), width=R.randrange(1, 3))
save(im, 'textures/wood.png')

im = Image.new('RGB', (256, 256), '#57534e')
grime(im, 2500, 70)
save(im, 'textures/asphalt.png')

im = grad(800, 600, (90, 150, 230), (200, 230, 255))
d = ImageDraw.Draw(im)
d.ellipse([-200, 380, 600, 900], fill='#4c9a2a')
d.ellipse([300, 430, 1100, 950], fill='#3e8a22')
for cx, cy in [(180, 120), (520, 80), (650, 200)]:
    for k in range(5):
        d.ellipse([cx + k * 28 - 40, cy - 14 - (k % 2) * 8, cx + k * 28 + 40, cy + 22], fill=(255, 255, 255))
save(im, 'textures/wallpaper.png')
print('assets done')
