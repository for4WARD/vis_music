let STARTED = false;
let HISTORY_COUNT = 10;
let MAX_FREQ_BUFFER = 256;
let DETAIL = 4;
let MODE = 'CIRCLE';
let DISTANCE = 100;

let audio;
let normalizer;
let history;

function initApp() {
    // 配置参数
    HISTORY_COUNT = 10;
    MAX_FREQ_BUFFER = 256;
    DETAIL = 2;
    MODE = 'CIRCLE';
    DISTANCE = 100;

    // 设置用户界面监听器
    audio = new Audio();
    const audioProgress = document.getElementById('progress');
    const playButton = document.getElementById('play-button');

    // 音频时长改变时更新进度条
    audio.ondurationchange = (e) => {
        audioProgress.min = 0;
        audioProgress.max = e.target.duration;
    };

    // 音频播放时更新进度条
    audio.ontimeupdate = (e) => {
        audioProgress.value = e.target.currentTime;
    };

    // 设置音频源
    audio.src = "https://raw.githubusercontent.com/saacostam/3d-music-visualizer/master/music/Armin Van Buuren (Lost Frequencies 2.0 Remix) - In And Out Of Love.mp3";
    audio.currentTime = 0;

    normalizer = new Normalizer(audio);
    history = new History(HISTORY_COUNT);

    // 拖动进度条时调整音频播放时间
    audioProgress.oninput = (e) => {
        audio.currentTime = e.target.value;
    };

    // 播放/暂停按钮功能
    playButton.onclick = (e) => {
        const currentlyPlaying = normalizer.togglePlay();
        if (currentlyPlaying) {
            audio.play(); // 用户点击后开始播放
            e.target.innerText = '||';
        } else {
            audio.pause(); // 用户点击后暂停
            e.target.innerText = '▶';
        }
    };

    // 选择缩放模式
    const scaleSelect = document.getElementById('scale-select');
    scaleSelect.addEventListener('input', (e) => {
        if (e.target.value === 'Logarithmic Scale') {
            normalizer.setLogScale();
            MAX_FREQ_BUFFER = 8;
        } else {
            normalizer.setLinearScale();
            MAX_FREQ_BUFFER = 256;
        }
    });

    // 选择显示模式
    const modeSelect = document.getElementById('mode-select');
    modeSelect.addEventListener('input', (e) => {
        MODE = e.target.value === 'Circular Display' ? 'CIRCLE' : 'LINEAR';
    });

    // 选择细节级别
    const detailSelect = document.getElementById('detail-select');
    detailSelect.value = DETAIL;
    detailSelect.addEventListener('input', (e) => {
        DETAIL = Number(e.target.value);
    });

    // 历史记录数量输入
    const historyInput = document.getElementById('history-input');
    historyInput.addEventListener('input', (e) => {
        HISTORY_COUNT = Number(e.target.value);
        history.updateLen(HISTORY_COUNT);
    });

    // 距离输入
    const detailInput = document.getElementById('distance-input');
    detailInput.addEventListener('input', (e) => {
        DISTANCE = Number(e.target.value);
    });

    // 文件输入以加载音频文件
    const fileInput = document.getElementById('file-input');
    fileInput.onchange = function (e) {
        audio.src = URL.createObjectURL(this.files[0]);
        audio.onend = function () {
            URL.revokeObjectURL(this.src);
        };
    };

    // 更新用户界面可见性
    document.getElementById('ui').classList.remove('d-none');
    document.getElementById('control').classList.remove('d-none');
    document.getElementById('start-audio').classList.add('d-none');

    STARTED = true;
}