"""Export the delivered composites and supplied pixel layers without resampling."""
import argparse
import json
from pathlib import Path
from PIL import Image
from psd_tools import PSDImage

parser = argparse.ArgumentParser()
parser.add_argument('--output-dir', required=True)
args = parser.parse_args()
out = Path(args.output_dir)
out.mkdir(parents=True, exist_ok=True)
archive = Path('D:/FOLDERS/Commissions/Bought/OKISO').resolve()
artist = archive / '3kumini@skeb'
requests, inventory = [], []

def save(image, name, source, layer=None, trim=False):
    image = image.convert('RGBA')
    bbox = image.getchannel('A').getbbox() if trim else None
    if trim:
        assert bbox is not None, 'Do not export an empty layer.'
        image = image.crop(bbox)
    path = out / f'4119772-{name}.png'
    profile = image.info.get('icc_profile')
    image.save(path, **({'icc_profile': profile} if profile else {}))
    requests.append(dict(work_url='https://skeb.jp/@3kumini/works/1011', kind='converted',
                         filename=path.name, source_file=str(path), output_dir=str(archive),
                         layout='artist', expected_width=image.width, expected_height=image.height))
    inventory.append(dict(file=path.name, source=source, layer=layer, source_bbox=bbox,
                          width=image.width, height=image.height))

for number, name, size in [(1,'collage-artist-message',(2500,2500)),
                           (2,'collage-no-message',(2500,2500)),
                           (3,'artist-asset-guide',(3200,1800))]:
    source = f'4119772-{number}.psd'
    with Image.open(artist / source) as composite:
        composite.load()
        assert composite.size == size
        save(composite, name, source)

psd = PSDImage.open(artist / '4119772-3.psd')
assert psd.size == (3200,1800) and len(psd) == 11
versions = [(9,'asset-sheet-no-message','List',False),
            (2,'chibi-donut-transparent','donut2',True),
            (3,'chibi-quiet-transparent','3',True),
            (4,'chibi-wink-transparent','2',True),
            (5,'chibi-smile-transparent','1',True),
            (6,'flip-phone-transparent','flipPhone',True),
            (7,'snow-globe-transparent','SnowDome',True),
            (8,'donuts-transparent','donut',True),
            (1,'background','Back',False)]
for index, name, expected, trim in versions:
    layer = psd[index]
    assert layer.name == expected and not layer.is_group()
    save(layer.topil(), name, '4119772-3.psd', index, trim)
(out/'exports.json').write_text(json.dumps(requests,indent=2),encoding='utf-8')
(out/'export-inventory.json').write_text(json.dumps(inventory,indent=2),encoding='utf-8')
print(json.dumps(inventory))
