# generate_images.py — creates branded SVG placeholders for all images
import os

def make_svg(path, label, w, h, hue=210):
    bg1 = f'hsl({hue}, 45%, 22%)'
    bg2 = f'hsl({hue}, 50%, 12%)'
    accent = '#f4a300'
    fs1, fs2 = int(h*0.09), int(h*0.05)
    scale = h/400
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="{bg1}"/>
    <stop offset="100%" stop-color="{bg2}"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="{w*0.85}" cy="{h*0.2}" r="{h*0.3}" fill="{accent}" opacity="0.07"/>
  <circle cx="{w*0.15}" cy="{h*0.85}" r="{h*0.25}" fill="{accent}" opacity="0.05"/>
  <g transform="translate({w/2},{h*0.32}) scale({scale})">
    <polygon points="0,-28 70,-8 0,12 -70,-8" fill="{accent}"/>
    <rect x="-38" y="2" width="76" height="34" rx="4" fill="#ffffff"/>
    <rect x="-5" y="-32" width="10" height="46" fill="{accent}"/>
    <circle cx="0" cy="-32" r="5" fill="#0b2545"/>
  </g>
  <text x="50%" y="{h*0.62}" text-anchor="middle" font-family="Poppins,Arial,sans-serif"
        font-size="{fs1}" font-weight="700" fill="#ffffff">{label}</text>
  <text x="50%" y="{h*0.73}" text-anchor="middle" font-family="Poppins,Arial,sans-serif"
        font-size="{fs2}" fill="{accent}" letter-spacing="3" font-weight="600">PRIME INSTITUTE</text>
</svg>'''
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f'  ✓ {path}')

print('Generating demo images…')
images = [
    ('assets/images/hero.jpg',        'Prime Institute Hero',     1920, 1080, 215),
    ('assets/images/campus.jpg',      'Prime Institute Campus',   1200,  800, 215),
    ('assets/images/about.jpg',       'About Prime Institute',     800,  600, 215),
    ('assets/images/course-foundation.jpg', 'Foundation Course',   600,  400,  30),
    ('assets/images/course-seba.jpg',       'SEBA IX–X',           600,  400,  30),
    ('assets/images/course-arts.jpg',       'Arts XI–XII',         600,  400,  30),
    ('assets/images/course-commerce.jpg',   'Commerce XI–XII',     600,  400,  30),
    ('assets/images/course-computer.jpg',   'Computer Course',     600,  400,  30),
    ('assets/images/course-olympiad.jpg',   'Olympiad Batch',      600,  400,  30),
    ('assets/images/event-1.jpg',     'Science Exhibition',       600,  400, 200),
    ('assets/images/event-2.jpg',     'Olympiad Championship',    600,  400, 200),
    ('assets/images/event-3.jpg',     'Career Workshop',          600,  400, 200),
    ('assets/images/event-4.jpg',     'Saraswati Puja',           600,  400, 200),
    ('assets/images/event-5.jpg',     'Sports Meet',              600,  400, 200),
    ('assets/images/event-6.jpg',     'Computer Camp',            600,  400, 200),
    ('assets/images/principal.jpg', 'Dr. Bhaskar Jyoti Sarma', 500, 600, 210),
]

teachers = [
    'Dr. Bhaskar Jyoti Sarma', 'Mrs. Anima Kalita', 'Mr. Pranjal Bora',
    'Mrs. Rupali Das', 'Mr. Dhruba Saikia', 'Mrs. Junmoni Gogoi',
    'Mr. Kaushik Baruah', 'Mrs. Pallabi Deka', 'Mr. Nayan Sharma',
    'Mrs. Manashi Nath', 'Mr. Himangshu Talukdar', 'Mrs. Priyanka Choudhury',
]
for i, name in enumerate(teachers, 1):
    images.append((f'assets/images/teacher-{i}.jpg', name, 400, 400, 220))

for path, label, w, h, hue in images:
    make_svg(path, label, w, h, hue)

# Logo file
logo = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
<path d="M100 8 L184 36 L184 104 C184 156 100 192 100 192 C100 192 16 156 16 104 L16 36 Z" fill="#12355b" stroke="#0b2545" stroke-width="3"/>
<path d="M100 24 L168 48 L168 104 C168 144 100 176 100 176 C100 176 32 144 32 104 L32 48 Z" fill="none" stroke="#f4a300" stroke-width="3" opacity="0.45"/>
<polygon points="100,60 152,80 100,100 48,80" fill="#f4a300"/>
<rect x="72" y="84" width="56" height="28" fill="#ffffff" rx="3"/>
<rect x="94" y="60" width="12" height="40" fill="#f4a300"/>
<circle cx="100" cy="60" r="5" fill="#0b2545"/>
<rect x="56" y="120" width="88" height="6" fill="#f4a300" rx="2"/>
<rect x="64" y="136" width="72" height="6" fill="#f4a300" rx="2" opacity="0.7"/>
</svg>'''
os.makedirs('assets/logo', exist_ok=True)
with open('assets/logo/logo.svg', 'w') as f:
    f.write(logo)
print('  ✓ assets/logo/logo.svg')
print(f'\n✅ Done! {len(images)} images + logo generated.')
print('   Update .jpg / .png references to .svg if you prefer using these files.')