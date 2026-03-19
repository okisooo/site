const fs = require("fs");
let code = fs.readFileSync("D:/GitHub/site/src/app/page.tsx", "utf8");

const wrapperStart = `<div className="w-full xl:w-7/12 flex flex-col gap-6 md:gap-12">`;
const wrapperEndStr = `          </div>\n\n          {/* Social Ecosystem */}`;

if(code.indexOf(wrapperStart) === -1) {
    console.log("Couldnt find wrapperStart");
    process.exit(1);
}
if(code.indexOf(wrapperEndStr) === -1) {
    const fallbackEnd = `          </div>\r\n\r\n          {/* Social Ecosystem */}`;
    if (code.indexOf(fallbackEnd) !== -1) {
        let fullBlock = code.substring(code.indexOf(wrapperStart), code.indexOf(fallbackEnd));
        replaceBlock(fullBlock);
    } else {
        console.log("Couldnt find wrapperEndStr");
        process.exit(1);
    }
} else {
    let fullBlock = code.substring(code.indexOf(wrapperStart), code.indexOf(wrapperEndStr));
    replaceBlock(fullBlock);
}

function replaceBlock(fullBlock) {
    const newBlock = `          <div className="w-full xl:w-7/12 flex flex-col gap-6 md:gap-12">      
            <div className="flex items-center justify-between">
              <h2 className="text-[12vw] xl:text-[6vw] font-black leading-[0.9] uppercase tracking-tighter text-black dark:text-white">
                {isLive && !showVOD ? "Live" : "Featured"} <br /> <span className="text-black/20 dark:text-white/20">Broadcast</span>
              </h2>
              {isLive && (
                <button 
                  onClick={() => setShowVOD(!showVOD)}
                  className="px-6 py-3 bg-ba-pink text-white rounded-full font-bold uppercase tracking-widest text-xs md:text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,126,179,0.4)]"
                >
                  {showVOD ? "View Live Stream" : "View Archive VOD"}
                </button>
              )}
            </div>
            <div className="w-full aspect-video rounded-[24px] md:rounded-[40px] overflow-hidden bg-black shadow-[0_40px_80px_rgba(0,0,0,0.15)] border-[8px] md:border-[16px] border-white dark:border-ba-dark-soft relative group isolate">
              {isLive && !showVOD ? (
                <iframe
                  src={\`https://player.twitch.tv/?channel=okiso&parent=localhost\`}
                  height="100%"
                  width="100%"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <CustomVideoPlayer 
                  src="https://www.w3schools.com/html/mov_bbb.mp4" 
                  title="LATEST_STREAM.MP4"
                  className="w-full h-full"
                />
              )}
            </div>\n`;
    code = code.replace(fullBlock, newBlock);
    fs.writeFileSync("D:/GitHub/site/src/app/page.tsx", code, "utf8");
    console.log("Successful exact replace");
}
