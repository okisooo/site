"""Export supplied pixel layers without repainting or changing the original PSD."""
import argparse
import json
from pathlib import Path
from psd_tools import PSDImage

parser = argparse.ArgumentParser()
parser.add_argument('--output-dir', required=True)
args = parser.parse_args()
output = Path(args.output_dir)
output.mkdir(parents=True, exist_ok=True)
archive = Path('D:/FOLDERS/Commissions/Bought/OKISO')
psd = PSDImage.open(archive / 'ObakenoPerutan@skeb/4070366-1.psd')
names = ['portrait-transparent', 'side-profile-transparent', 'tiny-mascot-transparent',
         'full-body-transparent', 'chibi-mascot-transparent', 'collage-no-message',
         'collage-artist-message']
assert len(psd) == len(names), 'Reinspect the delivery if its layers change.'
requests = []
for layer, name in zip(psd, names):
    image = layer.topil()
    path = output / f'4070366-{name}.png'
    image.save(path)
    requests.append(dict(work_url='https://skeb.jp/@ObakenoPerutan/works/14',
                         kind='converted', filename=path.name, source_file=str(path),
                         output_dir=str(archive), layout='artist',
                         expected_width=image.width, expected_height=image.height))
# Preserve and validate Skeb's separately supplied converted composite too.
requests.append(dict(work_url='https://skeb.jp/@ObakenoPerutan/works/14',
                     kind='converted', filename='4070366-1.output.png',
                     source_file=str(archive / 'ObakenoPerutan@skeb/4070366-1.output.png'),
                     output_dir=str(archive), layout='artist',
                     expected_width=4559, expected_height=3950))
(output / 'exports.json').write_text(json.dumps(requests, indent=2), encoding='utf-8')
print(f'Exported {len(names)} native-resolution supplied layers.')
