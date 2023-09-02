var book = document.getElementById("book");
var audio = document.getElementById("myAudio");
var controlPanel = document.getElementById("controlPanel");
var btnArea = document.getElementById("btnArea");
let playInfo = document.getElementById("playInfo");
var setVolValue = document.getElementById("setVolValue");
var volValue = document.getElementById("volValue");
let progress = document.getElementById("progress");
var music = document.getElementById("music");
let btnPlay = btnArea.children[2];
let btnMuted = btnArea.children[6];
let btnAddAll = book.children[3];

var option;
for (var i = 0; i < book.children[0].children.length; i++) {
    book.children[0].children[i].draggable = "true";
    book.children[0].children[i].id = "song" + i;

    //為歌曲加入ondragstart事件
    book.children[0].children[i].ondragstart = drag;

    option = document.createElement("option");

    //<option value="歌的路徑">歌名</option>
    option.value = book.children[0].children[i].title;
    option.innerText = book.children[0].children[i].innerText;
    music.appendChild(option);
}
changeMusic(0);

//更新播放清單
function updateMusic() {
    //1. 把music原先的option全部移除
    //for (var i = music.children.length-1; i >=0 ; i--) {
    //    music.removeChild(music.children[i]);
    //}
    for (var i = music.children.length - 1; i >= 0; i--) {
        music.remove(i);
    }
    //2. 再讀取我的歌本內的歌曲,append至music下拉選單
    for (var i = 0; i < book.children[1].children.length; i++) {

        option = document.createElement("option");

        //<option value="歌的路徑">歌名</option>
        option.value = book.children[1].children[i].title;
        option.innerText = book.children[1].children[i].innerText;
        music.appendChild(option);
    }

} 

//新增所有音樂
var div;
function addAll() {
    for (var i = 0; i < book.children[0].children.length; i++) {

        div = document.createElement("div");

        //<div title="歌的路徑">歌名</div>
        div.title = book.children[0].children[i].title;
        div.innerText = book.children[0].children[i].innerText;
        div.draggable = book.children[0].children[i].draggable;
        div.id = book.children[0].children[i].id;
        book.children[1].appendChild(div);
        book.children[1].children[i].ondragstart = drag;

    }
    //把來源音樂刪掉
    for (var i = book.children[0].children.length - 1; i >= 0; i--) {
        book.children[0].removeChild(book.children[0].children[i]);

    }

    btnAddAll.innerText = "清除播放清單";
    btnAddAll.onclick = delAll;
    }


//刪除全部
function delAll() {
    //1.先把小孩2的音樂加回去小孩1去
    for (var i = 0; i < book.children[1].children.length; i++) {
        div = document.createElement("div");

        //<div title="歌的路徑">歌名</div>
        div.title = book.children[1].children[i].title;
        div.innerText = book.children[1].children[i].innerText;
        div.draggable = book.children[1].children[i].draggable;
        div.id = book.children[1].children[i].id;
        book.children[0].appendChild(div);
        book.children[0].children[i].ondragstart = drag;

    }

    //2.把小孩2的音樂刪掉
    for (var i = book.children[1].children.length - 1; i >= 0; i--) {
        book.children[1].removeChild(book.children[1].children[i]);

    }
    btnAddAll.innerText = "新增全部";
    btnAddAll.onclick = addAll;

}


//當來源物件被拖曳到目標區上方時呼叫他
function allowDrop(ev) {
    ev.preventDefault();
}


//當來源物件被拖曳時呼叫它
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

//當來源物件被丟到目標區時呼叫他
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    /*book.children[1].appendChild(document.getElementById(data));*/
    if (ev.target.id == "")
        ev.target.appendChild(document.getElementById(data));
    else
        ev.target.parentNode.appendChild(document.getElementById(data));
    //book.children[1].appendChild(document.getElementById(data));
}

//全曲循環
function setAllRandom() {
    playInfo.children[2].innerText = playInfo.children[2].innerText == "全曲循環" ? "一般播放" : "全曲循環";
}

//隨機播放
function setRandom() {
    playInfo.children[2].innerText = playInfo.children[2].innerText == "隨機播放" ? "一般播放" : "隨機播放";
}

//單曲循環
function setLoop() {
    playInfo.children[2].innerText = playInfo.children[2].innerText == "單曲循環" ? "一般播放" : "單曲循環";
}

//選擇歌曲
function changeMusic(i) {
    /*console.log(music.selectedIndex + i);*/
    audio.children[0].src = music.options[music.selectedIndex + i].value;
    audio.children[0].title = music.options[music.selectedIndex + i].innerText;
    music.options[music.selectedIndex + i].selected = true;
    audio.load();

    if (btnPlay.innerText == ";")
        playAudio();
}



//播放進度拖曳
function setProgressBar() {
    audio.currentTime = progress.value;
}


//將時間格式從秒轉為分與秒
var min = 0, sec = 0;
function getTimeFormat(timeSec) {
    //if...else...三元表達式
    min = parseInt(timeSec / 60);
    sec = parseInt(timeSec % 60);
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    return min + ":" + sec;
}

//取得目前播放時間
var w = 0;
var r = 0; //存放隨機播放的亂數值
getDuration();
function getDuration() {
    playInfo.children[1].innerText = getTimeFormat(audio.currentTime) + " / " + getTimeFormat(audio.duration);

    w = audio.currentTime / audio.duration * 100;
    console.log(w);
    progress.style.backgroundImage = "-webkit-linear-gradient(left,#ffffff,#ffffff " + w + "%, #c0c0c0 " + w + "% ,#c0c0c0)";
    progress.max = parseInt(audio.duration);
    progress.value = parseInt(audio.currentTime);

    //當歌曲結束時,自動換曲
    if (audio.currentTime == audio.duration) {

        if (playInfo.children[2].innerText == "單曲循環")
            changeMusic(0);
        else if (playInfo.children[2].innerText == "隨機播放") {
            //在播放清單中隨機找歌
            r = Math.floor(Math.random() * music.options.length);
            r = r - music.selectedIndex;
            changeMusic(r)
        }
        else if (music.selectedIndex == music.options.length - 1)
            if (playInfo.children[2].innerText == "全曲循環")
                changeMusic(-music.selectedIndex);
            else
                stopAudio();
        else
            changeMusic(1);
    }

    //if (audio.currentTime < audio.duration) {
    setTimeout(getDuration, 50);
    //else {
    //如果目前不是最後一首,前進下一首歌
    //}
}

setVolume();
//音量Bar
function setVolume() {
    volValue.value = setVolValue.value;
    audio.volume = setVolValue.value / 100;
    setVolValue.style.backgroundImage = "-webkit-linear-gradient(left,#3cb371,#3cb371 " + setVolValue.value + "%, #c0c0c0 " + setVolValue.value + "% ,#c0c0c0)";
}

//音量按鍵控制
function btnSetVolume(vol) {
    setVolValue.value = parseInt(volValue.value) + vol;
    setVolume();
}


function playAudio() {
    audio.play();
    btnPlay.innerText = ";";
    btnPlay.onclick = pauseAudio;
    playInfo.children[0].innerText = "現正播放: " + audio.children[0].title;
}

function pauseAudio() {
    audio.pause();
    btnPlay.innerText = "4";
    btnPlay.onclick = playAudio;
    playInfo.children[0].innerText = "暫停播放";
}

function stopAudio() {
    pauseAudio();
    audio.currentTime = 0;
    playInfo.children[0].innerText = "請按播放鍵";

}

function changeTimeTracks(sec) {
    audio.currentTime += sec;
}

function setMuted() {
    audio.muted = !audio.muted;
    btnMuted.style.textDecoration = audio.muted ? "line-through" : "none";

}

function showBook() {
    book.className = book.className == "" ? "hide" : "";
}