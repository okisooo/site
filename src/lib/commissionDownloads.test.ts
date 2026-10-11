import test from 'node:test';
import assert from 'node:assert/strict';
import { groupDownloads, downloadLabel, type DownloadAsset } from './commissionDownloads';
const file=(id:string, format:string, artworkId?:string, artist='Artist', source='https://skeb.jp/@artist/works/1'):DownloadAsset=>({id,format,artworkId,artist,source,filename:`${id}.${format.toLowerCase()}`,bytes:12,hasPreview:true,permissions:{merchandise:'unknown'}});
test('explicit artwork matches pair image and PSD with one preview and preserve every file',()=>{
 const assets=[file('psd','PSD','matching'),file('image','PNG','matching'),file('variant','PNG')];const groups=groupDownloads(assets);
 assert.equal(groups.length,2);assert.equal(groups[0].preview.id,'image');assert.deepEqual(groups[0].files.map(f=>f.id),['image','psd']);assert.equal(groups.flatMap(g=>g.files).length,3);assert.equal(downloadLabel('PSD'),'Layered PSD');assert.equal(downloadLabel('PNG'),'Image · PNG');
});
test('similar filenames, other creators and other works never merge without matching evidence',()=>{
 assert.equal(groupDownloads([file('same','PNG'),file('same','PSD',undefined,'Other'),file('same','JPG',undefined,'Artist','https://skeb.jp/@artist/works/2'),file('different','PNG')]).length,4);
});
