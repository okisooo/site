"""Export delivered layers and isolated pieces of the artist's transparent sheet."""
import argparse
import json
from pathlib import Path
from PIL import Image
from psd_tools import PSDImage

parser = argparse.ArgumentParser()
parser.add_argument('--output-dir', required=True)
args = parser.parse_args()
output = Path(args.output_dir)
output.mkdir(parents=True, exist_ok=True)
archive = Path('D:/FOLDERS/Commissions/Bought/OKISO/OTORIxxx@skeb')
requests = []

def save(image, name):
    path = output / f'4043266-{name}.png'
    image.save(path)
    requests.append(dict(work_url='https://skeb.jp/@OTORIxxx/works/37',
                         kind='converted', filename=path.name, source_file=str(path),
                         output_dir=str(archive.resolve().parent), layout='artist',
                         expected_width=image.width, expected_height=image.height))

square = PSDImage.open(archive / '4043266-2.psd')
assert square.size == (6668, 6668) and len(square) == 4
save(square.topil(), 'collage')
for layer, name in zip(list(square)[1:], ['keychain-transparent', 'ring-transparent', 'pencils-transparent']):
    save(layer.composite(), name)

sheet = PSDImage.open(archive / '4043266-3.psd')
assert sheet.size == (5667, 9029) and len(sheet) == 2
save(sheet.topil(), 'asset-guide')
transparent = Image.new('RGBA', sheet.size)
transparent.paste(sheet[0].topil(), sheet[0].bbox[:2])
save(transparent, 'asset-sheet-transparent')

# Rectangles follow the supplied sheet's empty gutters. Only transparent margins
# are trimmed; painted backgrounds, signatures and text are never erased.
# Coordinates refer to the reviewed 1004 x 1600 sheet preview.
pieces = [
    ('portrait-transparent', (35, 100, 580, 715)),
    ('holographic-sticker-transparent', (650, 105, 912, 365)),
    ('pixel-character-transparent', (628, 405, 968, 709)),
    ('dark-keychain-transparent', (10, 713, 273, 1210)),
    ('silver-keychain-transparent', (270, 759, 507, 1260)),
    ('mascot-open-transparent', (508, 769, 734, 975)),
    ('mascot-raised-transparent', (744, 759, 970, 970)),
    ('mascot-left-transparent', (516, 982, 686, 1110)),
    ('mascot-right-transparent', (737, 978, 894, 1109)),
    ('mascot-front-transparent', (619, 1111, 789, 1260)),
    ('mascot-back-transparent', (819, 1111, 998, 1250)),
    ('name-sticker-transparent', (80, 1298, 530, 1545)),
    ('portrait-card-transparent', (589, 1275, 860, 1540)),
]
for name, box in pieces:
    native_box = tuple(round(value * sheet.size[i % 2] / (1004, 1600)[i % 2]) for i, value in enumerate(box))
    piece = transparent.crop(native_box)
    bounds = piece.getbbox()
    assert bounds, name
    save(piece.crop(bounds), name)

(output / 'exports.json').write_text(json.dumps(requests, indent=2), encoding='utf-8')
print(f'Exported {len(requests)} lossless full-resolution versions and supplied pieces.')
