import test from 'node:test';
import assert from 'node:assert/strict';
import { groupDownloads, downloadLabel, previewSource, thumbnailWidths, type DownloadAsset } from './commissionDownloads';
const file=(id:string, format:string, artworkId?:string, artist='Artist', source='https://skeb.jp/@artist/works/1'):DownloadAsset=>({id,format,artworkId,artist,source,filename:`${id}.${format.toLowerCase()}`,bytes:12,hasPreview:true,permissions:{merchandise:'unknown'}});
test('explicit artwork matches pair image and PSD with one preview and preserve every file',()=>{
 const assets=[file('psd','PSD','matching'),file('image','PNG','matching'),file('variant','PNG')];const groups=groupDownloads(assets);
 assert.equal(groups.length,2);assert.equal(groups[0].preview.id,'image');assert.deepEqual(groups[0].files.map(f=>f.id),['image','psd']);assert.equal(groups.flatMap(g=>g.files).length,3);assert.equal(downloadLabel('PSD'),'Layered PSD');assert.equal(downloadLabel('PNG'),'Image · PNG');
});
test('similar filenames, other creators and other works never merge without matching evidence',()=>{
 assert.equal(groupDownloads([file('same','PNG'),file('same','PSD',undefined,'Other'),file('same','JPG',undefined,'Artist','https://skeb.jp/@artist/works/2'),file('different','PNG')]).length,4);
});
test('thumbnails only when the API lists widths; otherwise and on fallback the full preview, never an original',()=>{
 const api='https://api.okiso.net/api/commission-downloads';
 assert.deepEqual(thumbnailWidths(undefined),[]);assert.deepEqual(thumbnailWidths('480'),[]);assert.deepEqual(thumbnailWidths([960,480,480,0,-1,1.5,'960',null]),[480,960]);
 assert.deepEqual(previewSource(api,'abc',[]),{src:`${api}/assets/abc/preview`});
 assert.deepEqual(previewSource(api,'abc',[480,960]),{src:`${api}/assets/abc/thumbnail?w=480`,srcSet:`${api}/assets/abc/thumbnail?w=480 480w, ${api}/assets/abc/thumbnail?w=960 960w`,sizes:'(max-width: 700px) 46vw, 300px'});
 assert.deepEqual(previewSource(api,'abc',[480,960],false,'0a1b2c'),{src:`${api}/assets/abc/thumbnail?w=480&v=0a1b2c`,srcSet:`${api}/assets/abc/thumbnail?w=480&v=0a1b2c 480w, ${api}/assets/abc/thumbnail?w=960&v=0a1b2c 960w`,sizes:'(max-width: 700px) 46vw, 300px'});
 assert.deepEqual(previewSource(api,'abc',[480,960],true),{src:`${api}/assets/abc/preview`});assert.deepEqual(previewSource(api,'abc',[480,960],true,'0a1b2c'),{src:`${api}/assets/abc/preview`});
 assert.ok(![previewSource(api,'abc',[480,960]),previewSource(api,'abc',[])].some(s=>JSON.stringify(s).includes('original')));
});
