const { spawn }=require("child_process");
const fs = require('fs');
const { basename } = require("path");

const additional_path=""; // "path/to/file/"
const source=additional_path+"source.txt";
const video=additional_path+"video"+Date.now()

function links_from_source(){
    return (fs.readFileSync(source,'utf-8',function(err,data){
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
function getOptions(videofolder, url){
    var options = new Array;
    switch(new URL(url).hostname){
        case "v.animethemes.moe":
            options.push("-o",basename(url))
            options.push("-P",videofolder+"a")
            options.push(url)
            return options
        case "www.youtube.com":
        case "youtu.be":
        case "music.youtube.com":
            options.push("-P",videofolder+"y")
            options.push(url)
            return options
    }
}
// main
for (const video_url of links_from_source()){
    if ((video_url).slice(0,2)=="//") continue
    downloader(video, video_url)
}