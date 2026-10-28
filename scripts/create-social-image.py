from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import os
ROOT=Path(__file__).resolve().parent.parent
S=2
im=Image.new('RGB',(1200*S,630*S),'#15251f');d=ImageDraw.Draw(im)
PAPER,INK,GOLD='#f5f0e4','#253c2d','#d8bb85'
body=Path(os.environ.get('PORTFOLIO_JP_FONT','C:/Windows/Fonts/YuGothM.ttc'))
if not body.exists(): raise FileNotFoundError('Set PORTFOLIO_JP_FONT to a complete Japanese TTF/OTF/TTC font.')
def font(size,heading=False): return ImageFont.truetype(str(body),size*S)
def text(x,y,s,size=20,color=INK,heading=False):d.text((x*S,y*S),s,font=font(size,heading),fill=color,anchor='lt')
def rect(box,color):d.rectangle(tuple(v*S for v in box),fill=color)
text(50,32,'amz.',46,PAPER,True);text(211,50,'NOTES & WORKS',17,GOLD);text(952,53,'PORTFOLIO / 2026',12,PAPER)
rect((48,124,704,546),'#74644b');rect((58,134,695,536),PAPER)
for y in range(174,537,40):d.line((78*S,y*S,675*S,y*S),fill='#e4decd',width=S)
rect((79,148,81,522),'#d3b497')
text(101,166,'北岡 英磨  /  Yoma Kitaoka',24)
text(101,235,'課題から考え、',45,heading=True)
text(101,305,'プロダクトをつくる。',45,heading=True)
text(103,403,'PdMを目指す、個人開発と研究',22)
text(103,467,'目的・設計の理由・結果と現状を紹介',17,'#52634d')
colors=['#e6ce9e','#c7d1b5','#dec6b8']
items=['まにあう','しゅうかつ手帳','Streaming Screen','Yomiage Bot','Shindo Bot','Artificial Moral Architecture','Inspection Proxy','SSL Robot AI']
for i,title in enumerate(items):
 y=131+i*49;rect((752,y,1144,y+43),'#0b140f');rect((748,y-3,1140,y+38),colors[i%3]);rect((754,y+2,757,y+33),'#8e7d5e');rect((761,y+2,763,y+33),'#b7a785')
 text(777,y+9,f'{i+1:02}',12);text(814,y+8,title,16)
rect((743,526,1152,537),'#79664b')
text(52,581,'portfolio-amz-jpcslr.vercel.app',15,PAPER);text(985,577,'08 PROJECTS',20,GOLD)
im.resize((1200,630),Image.Resampling.LANCZOS).save(ROOT/'dist/og-image.png',optimize=True)
print('Created og-image.png: 1200 x 630, Notes & Works, 8 projects')
