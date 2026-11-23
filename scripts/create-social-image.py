"""Compose the 1200 × 630 share card using the site's approved hero illustration."""
import argparse
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("illustration", nargs="?", type=Path, default=ROOT / "site/assets/workshop/front.webp",
                    help="Approved transparent portfolio illustration")
args = parser.parse_args()

paper = "#f7f1e6"
ink = "#382f34"
green = "#3d5d53"
orange = "#aa5834"
card = Image.new("RGBA", (1200, 630), paper)
draw = ImageDraw.Draw(card)
font_path = os.environ.get("PORTFOLIO_JP_FONT", "C:/Windows/Fonts/YuGothM.ttc")

def text(position, message, size, color=ink):
    draw.text(position, message, font=ImageFont.truetype(font_path, size), fill=color, anchor="lt")

draw.line((50, 32, 50, 602), fill="#cfc4b1", width=2)
draw.line((79, 92, 1128, 92), fill="#bcb19f", width=2)
draw.rounded_rectangle((80, 36, 119, 76), radius=5, outline=green, width=2)
text((88, 45), "作", 23, green)
text((138, 44), "AMZ-jpcslr   /   PORTFOLIO", 24, green)
text((80, 161), "Yoma Kitaoka", 49, green)
text((78, 235), "北岡 英磨", 72)
draw.line([(83, 328), (207, 325), (330, 326), (438, 323)], fill=orange, width=3)
text((80, 382), "技術で、身近な困りごとを減らす。", 31)
text((80, 443), "個人開発と研究のポートフォリオ", 23, green)
draw.line((79, 548, 1128, 548), fill="#cfc4b1", width=2)
text((80, 576), "portfolio-amz-jpcslr.vercel.app", 18, green)
portrait = Image.open(args.illustration).convert("RGBA")
portrait = portrait.crop(portrait.getchannel("A").getbbox())
portrait.thumbnail((390, 437), Image.Resampling.LANCZOS)
card.alpha_composite(portrait, (910 - portrait.width // 2, 548 - portrait.height))
card.convert("RGB").save(ROOT / "dist" / "og-image.png", optimize=True)
