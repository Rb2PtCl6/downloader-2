const { spawn }=require("child_process");
const { readFileSync } = require("fs");
const { basename } = require("path");

const additional_path=""; // "path/to/file/"
const source=additional_path+"source.txt";
const video=additional_path+"video"+Date.now()

function links_from_source(){
    return (readFileSync(source,'utf-8',function(err,data){
        if (err) return;
        return data
    })).split('\r\n')
}
function downloader(videofolder ,url){
    const action=spawn("yt-dlp", getOptions(videofolder,url))
    action.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });
    action.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });
    action.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });
    action.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });
}
function getOptions(videofolder, url) {
    var hostname = new URL(url).hostname;
    const options = {
        "v.animethemes.moe": ["-o", basename(url), "-P", videofolder + "a", url],
        "www.youtube.com": ["-P", videofolder + "y", url],
        "youtu.be": ["-P", videofolder + "y", url],
        "music.youtube.com": ["-P", videofolder + "y", url],
    };
    return options[hostname] || [];
}
// main
for (const video_url of links_from_source()){
    if ((video_url).slice(0,2)=="//") continue
    downloader(video, video_url)
}