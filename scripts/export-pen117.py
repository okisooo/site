"""Export the supplied complete character, line art and frame without resampling."""
import argparse
import json
from pathlib import Path
from psd_tools import PSDImage

parser = argparse.ArgumentParser()
parser.add_argument('--output-dir', required=True)
args = parser.parse_args()
output = Path(args.output_dir)
output.mkdir(parents=True, exist_ok=True)
archive = Path('D:/FOLDERS/Commissions/Bought/OKISO').resolve()
psd = PSDImage.open(archive / 'pen_117@skeb/4119838-3.psd')
assert psd.size == (1666, 2500) and len(psd) == 3
assert len(psd[1]) == 2 and len(psd[2]) == 5
assert len(list(psd.descendants())) == 28, 'Reinspect changed layer structure.'
assert all(layer.visible for layer in psd.descendants()), 'Reinspect hidden variants.'
profile = psd.topil().info.get('icc_profile')
versions = [
    (psd[2], 'character-native-transparent', (1895, 2758)),
    (psd[2][1], 'line-art-transparent', (1414, 2455)),
    (psd[1][0], 'frame-transparent', (1570, 2385)),
]
requests = []
for layer, name, size in versions:
    image = layer.composite() if layer.is_group() else layer.topil()
    assert image.size == size and image.mode == 'RGBA'
    path = output / f'4119838-{name}.png'
    image.save(path, **({'icc_profile': profile} if profile else {}))
    requests.append(dict(work_url='https://skeb.jp/@pen_117/works/241',
                         kind='converted', filename=path.name, source_file=str(path),
                         output_dir=str(archive), layout='artist',
                         expected_width=size[0], expected_height=size[1]))
(output / 'exports.json').write_text(json.dumps(requests, indent=2), encoding='utf-8')
print(f'Exported {len(requests)} supplied native-resolution assets.')
