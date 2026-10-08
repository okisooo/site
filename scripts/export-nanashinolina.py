"""Export the four supplied artwork layers at their native resolution."""
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
artist_root = (archive / 'nanashinolina@skeb').resolve()
psd = PSDImage.open(artist_root / '4070361-5.psd')
assert len(psd) == 5, 'Reinspect the delivery if its layers change.'
versions = [
    (1, 'portrait-mascot-transparent', (2035, 3739)),
    (2, 'full-body-transparent', (1609, 3703)),
    (3, 'collage-artist-message', (2894, 4093)),
    (4, 'collage-no-message', (2894, 4093)),
]
requests = []
profile = psd.topil().info.get('icc_profile')
for index, name, dimensions in versions:
    layer = psd[index]
    assert not layer.is_group()
    image = layer.topil()
    assert image.size == dimensions
    path = output / f'4070361-{name}.png'
    image.save(path, **({'icc_profile': profile} if profile else {}))
    requests.append(dict(work_url='https://skeb.jp/@nanashinolina/works/32',
                         kind='converted', filename=path.name, source_file=str(path),
                         output_dir=str(artist_root.parent), layout='artist',
                         expected_width=image.width, expected_height=image.height))
(output / 'exports.json').write_text(json.dumps(requests, indent=2), encoding='utf-8')
print(f'Exported {len(versions)} native-resolution supplied artwork layers.')
