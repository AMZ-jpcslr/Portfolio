from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Code-drawn social card that shares the site's editorial palette and display font.
ROOT = Path(__file__).resolve().parent.parent
S = 2
INK, PAPER, ACCENT, MUTED, LINE = '#1d2b32', '#f3f2ee', '#bb3c20', '#566269', '#c8cdc9'
im = Image.new('RGB', (1200*S, 630*S), PAPER)
d = ImageDraw.Draw(im)

def font(size, heading=False):
    source = str(ROOT/'dist/assets/fonts/shippori-display.woff2') if heading else 'C:/Windows/Fonts/YuGothM.ttc'
    return ImageFont.truetype(source, size*S)

def text(x, y, content, size=20, color=INK, heading=False):
    d.text((x*S,y*S), content, font=font(size,heading), fill=color, anchor='lt')

def line(x1,y1,x2,y2,color=LINE,width=1):
    d.line((x1*S,y1*S,x2*S,y2*S), fill=color, width=width*S)

text(58,40,'amz',42)
text(151,48,'.',34,color=ACCENT,heading=True)
text(198,49,'DESIGN & DEVELOPMENT',14,color=MUTED)
text(957,49,'PORTFOLIO / 2026',12,color=MUTED)
line(58,104,1142,104)
text(58,153,'北岡 英磨',18)
text(200,158,'Yoma Kitaoka / AMZ-jpcslr',13,color=MUTED)
text(55,223,'日常の不便から、',57,heading=True)
text(55,313,'社会の課題まで。',57,color=ACCENT,heading=True)
text(58,425,'個人開発から、問題解決の糸口をつくる。',20,color=MUTED)
line(733,152,733,461)
text(781,155,'SELECTED PROJECTS',12,color=MUTED)
items=['しゅうかつ手帳','Streaming Screen','Discord Bot','Artificial Moral Architecture','Inspection Proxy / SSL Robot AI']
for i,title in enumerate(items):
    y=204+i*49
    text(781,y,title,20 if i<2 else 15,heading=i<2)
    line(781,y+34,1139,y+34)
line(58,529,1142,529)
text(58,562,'課題設定 / 設計 / レビュー / 検証',16,color=MUTED)
text(951,555,'07 PROJECTS',20)
out=ROOT/'dist/og-image.png'
im.resize((1200,630),Image.Resampling.LANCZOS).save(out,optimize=True)
print(f'Created {out.name}: 1200 x 630')
