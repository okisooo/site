"""Export the commissioned compositions and artist-supplied transparent layers."""
import argparse
import json
from pathlib import Path
from PIL import Image
from psd_tools import PSDImage

parser=argparse.ArgumentParser()
parser.add_argument('--output-dir',required=True)
args=parser.parse_args()
out=Path(args.output_dir)
out.mkdir(parents=True,exist_ok=True)
archive=Path('D:/FOLDERS/Commissions/Bought/OKISO').resolve()
source=archive/'Midori_annte23@skeb/4068823-1.psd'
psd=PSDImage.open(source)
assert psd.size==(2000,2000) and len(psd)==4
assert all(not layer.is_group() and layer.visible for layer in psd)
assert psd[3].bbox==(1203,77,1952,421)
requests=[]
inventory=[]
def save(image,label,method,layer=None):
    image=image.convert('RGBA')
    assert image.size==(2000,2000)
    file=out/f'4068823-{label}.png'
    profile=image.info.get('icc_profile')
    image.save(file,**({'icc_profile':profile} if profile else {}))
    requests.append(dict(work_url='https://skeb.jp/@Midori_annte23/works/1538',kind='converted',
        filename=file.name,source_file=str(file),output_dir=str(archive),layout='artist',
        expected_width=2000,expected_height=2000))
    inventory.append(dict(file=file.name,source='4068823-1.psd',method=method,layer=layer,
                          width=2000,height=2000,alpha=image.getextrema()[3]))

with Image.open(source) as cached:
    cached.load()
    save(cached,'illustration-artist-message','cached original composite')
psd[3].visible=False
save(psd.composite(force=True),'illustration-no-message','original composition with dedication layer hidden')
save(psd[2].topil(),'illustration-transparent','unmodified supplied pixel layer',2)
save(psd[1].topil(),'character-transparent','unmodified supplied pixel layer',1)
(out/'exports.json').write_text(json.dumps(requests,indent=2),encoding='utf-8')
(out/'export-inventory.json').write_text(json.dumps(inventory,indent=2),encoding='utf-8')
print(json.dumps(inventory))
