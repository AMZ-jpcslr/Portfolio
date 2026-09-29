from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Code-drawn social card; no external assets or network calls are needed.
S = 2
im = Image.new('RGB', (1200*S,630*S), '#f7f8fa')
d = ImageDraw.Draw(im)
fonts = Path('C:/Windows/Fonts')
def font(size,bold=False,jp=False):
    name = ('YuGothB.ttc' if bold else 'YuGothM.ttc') if jp else ('arialbd.ttf' if bold else 'arial.ttf')
    return ImageFont.truetype(str(fonts/name),size*S)
def text(x,y,t,size=20,color='#242824',bold=False,jp=False):
    d.text((x*S,y*S),t,font=font(size,bold,jp),fill=color,anchor='lt')
def box(x,y,w,h,color,r=0,stroke=None):
    d.rounded_rectangle((x*S,y*S,(x+w)*S,(y+h)*S),radius=r*S,fill=color,outline=stroke,width=S)
def line(points,color,width=2):
    d.line([(x*S,y*S) for x,y in points],fill=color,width=width*S)

box(0,0,1200,9,'#c0f95a')
text(58,42,'amz',52,bold=True)
box(166,78,10,10,'#a9e34e',5)
text(198,57,'DEVELOPER PORTFOLIO',15,color='#6b706f',bold=True)
text(60,167,'A WIDER VIEW. A PERSONAL APPROACH.',14,color='#66735e',bold=True)
text(55,220,'日常の不便から、',53,bold=True,jp=True)
box(59,345,285,16,'#c0f95a')
text(55,293,'社会の課題まで。',53,bold=True,jp=True)
text(60,402,'個人開発から、問題解決の糸口をつくる。',23,color='#5e655f',jp=True)
line([(60,521),(1140,521)],'#daded7',1)
text(60,554,'Kitaoka Yoma',26,bold=True)
text(267,562,'/ AMZ-jpcslr',16,color='#57634e')
text(915,562,'BUILD. LEARN. REPEAT.',16,color='#57634e',bold=True)

box(674,110,467,380,'#eaf0e4',22)
text(697,130,'SELECTED WORKS',12,color='#65765c',bold=True)
text(1089,128,'07',18,color='#65765c',bold=True)
items=[('DISCORD','Voice Bot','#e7def2'),('DISASTER','Earthquake Bot','#dbe9f6'),('CREATOR','Streaming Screen','#f1e0e8'),('AI / RESEARCH','Moral Architecture','#e2ecd4'),('NETWORK','Inspection Proxy','#ede8dc'),('SIMULATION','Robot Soccer','#d9eee2'),('CAREER','しゅうかつ手帳','#dceef0')]
for i,(tag,title,color) in enumerate(items):
    x=692+(i%2)*222; y=166+(i//2)*77
    box(x,y,431 if i==6 else 209,67,color,10)
    text(x+13,y+13,tag,10,color='#617064',bold=True)
    text(x+13,y+33,title,16,bold=True,jp=i==6)
    line([(x+185,y+16),(x+193,y+16),(x+193,y+24)],'#617064',1)
    line([(x+186,y+23),(x+193,y+16)],'#617064',1)

out=Path(__file__).resolve().parent.parent/'dist'/'og-image.png'
im.resize((1200,630),Image.Resampling.LANCZOS).save(out,optimize=True)
print(f'Created {out.name}: 1200 x 630')
