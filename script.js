// ==================== চালুং টিভি - সম্পূর্ণ জাভাস্ক্রিপ্ট ====================

// Playlist URLs
const PLAYLISTS = [
    "https://raw.githubusercontent.com/sm-monirulislam/RoarZone-Auto-Update-playlist/refs/heads/main/RoarZone.m3u",
    "https://raw.githubusercontent.com/sm-monirulislam/SM-Live-TV/refs/heads/main/Bangla%20Channel.m3u"
];

// Translations
const translations = {
    bn: {
        heroTitle: 'ওয়ার্ল্ড কাপ ২০২৬',
        heroDesc: 'লাইভ সম্প্রচার | বাংলা কমেন্টারি',
        heroBtnText: 'দেখুন',
        countdownLabel: 'বাকি',
        promoTitle: 'প্রিমিয়াম প্যাকেজে ৫০% ছাড়!',
        promoBtnText: 'অফার নিন',
        brandName: 'চালুং টিভি',
        tagline: '⚡ লাইভ স্ট্রিমিং',
        liveText: 'লাইভ',
        tickerLabel: 'খবর',
        wcTitle: 'ফিফা ওয়ার্ল্ড কাপ',
        nextMatchLabel: 'পরবর্তী ম্যাচ',
        liveScoreText: 'লাইভ',
        loaderText: 'স্ট্রিম লোড হচ্ছে...',
        currentChannelDefault: 'চ্যানেল নির্বাচন করুন',
        epgPrefix: 'এখন যা চলছে:',
        pipText: 'PIP',
        searchPlaceholder: '🔍 চ্যানেল খুঁজুন...',
        allCategories: 'সব ক্যাটাগরি',
        allTabText: 'সব',
        wcTabText: 'বিশ্বকাপ',
        favTabText: 'প্রিয়',
        historyTabText: 'ইতিহাস',
        refreshText: 'রিফ্রেশ',
        noChannels: '📺 কোন চ্যানেল পাওয়া যায়নি',
        noFavorites: '⭐ প্রিয় চ্যানেল নির্বাচন করুন',
        noHistory: 'কোনো ইতিহাস নেই',
        favoriteAdded: 'প্রিয় তে যুক্ত!',
        favoriteRemoved: 'প্রিয় থেকে সরানো হয়েছে',
        refreshSuccess: 'প্লেলিস্ট রিফ্রেশ সম্পূর্ণ!',
        refreshFailed: 'রিফ্রেশ ব্যর্থ',
        streamError: 'স্ট্রিম অফলাইন',
        qualityChanged: 'কোয়ালিটি পরিবর্তন:',
        nowPlaying: 'এখন যা চলছে:',
        channelNotFound: 'চ্যানেল পাওয়া যায়নি',
        navHomeText: 'হোম',
        navWorldcupText: 'বিশ্বকাপ',
        navFavText: 'প্রিয়',
        navHistoryText: 'ইতিহাস',
        navRefreshText: 'রিফ্রেশ'
    },
    en: {
        heroTitle: 'World Cup 2026',
        heroDesc: 'Live Broadcast | Multi Language',
        heroBtnText: 'Watch',
        countdownLabel: 'Days Left',
        promoTitle: '50% OFF Premium Package!',
        promoBtnText: 'Get Offer',
        brandName: 'CHALUNG TV',
        tagline: '⚡ Live Streaming',
        liveText: 'LIVE',
        tickerLabel: 'News',
        wcTitle: 'FIFA World Cup',
        nextMatchLabel: 'Next Match',
        liveScoreText: 'LIVE',
        loaderText: 'Loading stream...',
        currentChannelDefault: 'Select Channel',
        epgPrefix: 'Now Playing:',
        pipText: 'PIP',
        searchPlaceholder: '🔍 Search channels...',
        allCategories: 'All Categories',
        allTabText: 'All',
        wcTabText: 'World Cup',
        favTabText: 'Favorites',
        historyTabText: 'History',
        refreshText: 'Refresh',
        noChannels: '📺 No channels found',
        noFavorites: '⭐ Select favorite channels',
        noHistory: 'No history',
        favoriteAdded: 'Added to favorites!',
        favoriteRemoved: 'Removed from favorites',
        refreshSuccess: 'Playlist refreshed!',
        refreshFailed: 'Refresh failed',
        streamError: 'Stream offline',
        qualityChanged: 'Quality changed:',
        nowPlaying: 'Now Playing:',
        channelNotFound: 'Channel not found',
        navHomeText: 'Home',
        navWorldcupText: 'World Cup',
        navFavText: 'Fav',
        navHistoryText: 'History',
        navRefreshText: 'Refresh'
    }
};

// Global variables
let currentLang = 'bn';
let allChannels = [], groupedChannels = {}, plyr = null, hls = null;
let currentChannelObj = null, currentChannelIndex = -1, flatChannelList = [];
let isWCMode = false, isFavMode = false, isHistoryMode = false;
let favoriteSet = new Set(), watchHistory = [], epgData = {};

// DOM Elements
const video = document.getElementById('mainVideo');
const loader = document.getElementById('loaderOverlay');
const currentNameSpan = document.getElementById('currentChannelName');
const epgSpan = document.getElementById('epgNowPlaying');
const qualitySelect = document.getElementById('qualitySelect');
const pipButton = document.getElementById('pipButton');
const mobileChannelContainer = document.getElementById('mobileChannelContainer');
const mobileWcContainer = document.getElementById('mobileWcContainer');
const mobileHistoryContainer = document.getElementById('mobileHistoryContainer');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileCategorySelect = document.getElementById('mobileCategorySelect');
const mobileChannelName = document.getElementById('mobileChannelName');
const mobileChannelNumber = document.getElementById('mobileChannelNumber');
const mobilePrevChannel = document.getElementById('mobilePrevChannel');
const mobileNextChannel = document.getElementById('mobileNextChannel');
const mobileChannelCount = document.getElementById('mobileChannelCount');
const mobileViewerCount = document.getElementById('mobileViewerCount');
const desktopChannelList = document.getElementById('desktopChannelList');
const desktopWcList = document.getElementById('desktopWcList');
const desktopHistoryPanel = document.getElementById('desktopHistoryPanel');
const categorySelect = document.getElementById('categorySelect');
const searchInput = document.getElementById('searchInput');

// World Cup Data
const worldCupChannels = [
    { nameBn: "সনি টেন ১", nameEn: "Sony Ten 1", quality: "HD", langBn: "ইংরেজি", langEn: "English" },
    { nameBn: "সনি টেন ৩", nameEn: "Sony Ten 3", quality: "HD", langBn: "বাংলা", langEn: "Bengali" },
    { nameBn: "স্টার স্পোর্টস", nameEn: "Star Sports", quality: "4K", langBn: "ইংরেজি/বাংলা", langEn: "English/Bengali" }
];

const matchSchedule = [
    { team1Bn: "ব্রাজিল", team1En: "Brazil", team2Bn: "আর্জেন্টিনা", team2En: "Argentina", timeBn: "রাত ৯:০০", timeEn: "9:00 PM", live: true },
    { team1Bn: "ফ্রান্স", team1En: "France", team2Bn: "ইংল্যান্ড", team2En: "England", timeBn: "রাত ১২:৩০", timeEn: "12:30 AM", live: false },
    { team1Bn: "জার্মানি", team1En: "Germany", team2Bn: "স্পেন", team2En: "Spain", timeBn: "সকাল ৬:০০", timeEn: "6:00 AM", live: false }
];

// ==================== Helper Functions ====================
function showToast(msg) {
    const toast = document.getElementById('toastMsg');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

function updateUILanguage() {
    const t = translations[currentLang];
    document.getElementById('heroTitle').innerHTML = `<i class="fas fa-futbol"></i> ${t.heroTitle}`;
    document.getElementById('heroDesc').innerText = t.heroDesc;
    document.getElementById('heroBtnText').innerText = t.heroBtnText;
    document.getElementById('countdownLabel').innerText = t.countdownLabel;
    document.getElementById('promoTitle').innerHTML = t.promoTitle;
    document.getElementById('promoBtnText').innerText = t.promoBtnText;
    document.getElementById('brandName').innerText = t.brandName;
    document.getElementById('tagline').innerText = t.tagline;
    document.getElementById('liveText').innerText = t.liveText;
    document.getElementById('tickerLabel').innerHTML = `<i class="fas fa-futbol"></i> ${t.tickerLabel}`;
    document.getElementById('wcTitle').innerText = t.wcTitle;
    document.getElementById('nextMatchLabel').innerText = t.nextMatchLabel;
    document.getElementById('liveScoreText').innerText = t.liveScoreText;
    document.getElementById('loaderText').innerHTML = t.loaderText;
    if (!currentChannelObj) currentNameSpan.innerText = t.currentChannelDefault;
    document.getElementById('pipText').innerText = t.pipText;
    mobileSearchInput.placeholder = t.searchPlaceholder;
    if(searchInput) searchInput.placeholder = t.searchPlaceholder;
    
    // Update category select options
    if(mobileCategorySelect) {
        mobileCategorySelect.innerHTML = `<option value="__ALL__">${t.allCategories}</option>`;
        for(let grp of Object.keys(groupedChannels)) {
            const opt = document.createElement('option');
            opt.value = grp;
            opt.innerText = grp;
            mobileCategorySelect.appendChild(opt);
        }
    }
    if(categorySelect) {
        categorySelect.innerHTML = `<option value="__ALL__">${t.allCategories}</option>`;
        for(let grp of Object.keys(groupedChannels)) {
            const opt = document.createElement('option');
            opt.value = grp;
            opt.innerText = grp;
            categorySelect.appendChild(opt);
        }
    }
    
    document.getElementById('allTabText').innerText = t.allTabText;
    document.getElementById('wcTabText').innerText = t.wcTabText;
    document.getElementById('favTabText').innerText = t.favTabText;
    document.getElementById('historyTabText').innerText = t.historyTabText;
    document.getElementById('refreshText').innerText = t.refreshText;
    document.getElementById('navHomeText').innerText = t.navHomeText;
    document.getElementById('navWorldcupText').innerText = t.navWorldcupText;
    document.getElementById('navFavText').innerText = t.navFavText;
    document.getElementById('navHistoryText').innerText = t.navHistoryText;
    document.getElementById('navRefreshText').innerText = t.navRefreshText;
    
    if (isWCMode) renderMobileWc();
    else if (isFavMode) renderMobileChannelList();
    else if (isHistoryMode) renderMobileHistory();
    else renderMobileChannelList();
    
    // Desktop render
    if(!isWCMode && !isFavMode && !isHistoryMode) renderDesktopChannelList();
    else if(isWCMode) renderDesktopWc();
    else if(isFavMode) renderDesktopChannelList();
    else if(isHistoryMode) renderDesktopHistory();
}

// ==================== Favorites & History ====================
function loadFav() { 
    try { 
        const s = localStorage.getItem('chalung_tv_fav'); 
        if(s) favoriteSet = new Set(JSON.parse(s)); 
        else favoriteSet.clear();
    } catch(e) { favoriteSet = new Set(); } 
}

function saveFav() { 
    localStorage.setItem('chalung_tv_fav', JSON.stringify(Array.from(favoriteSet))); 
}

function loadHistory() { 
    try { 
        const s = localStorage.getItem('chalung_tv_history'); 
        if(s) watchHistory = JSON.parse(s); 
        else watchHistory = [];
    } catch(e) { watchHistory = []; } 
}

function saveHistory() { 
    localStorage.setItem('chalung_tv_history', JSON.stringify(watchHistory.slice(0, 20))); 
}

function addToHistory(channel) {
    watchHistory = watchHistory.filter(ch => ch.url !== channel.url);
    watchHistory.unshift({ name: channel.name, logo: channel.logo, url: channel.url, number: channel.number });
    if(watchHistory.length > 20) watchHistory.pop();
    saveHistory();
    if(isHistoryMode) renderMobileHistory();
}

function toggleFav(channel, event, rowElem) {
    event.stopPropagation();
    const uid = channel.url + channel.name;
    const t = translations[currentLang];
    if(favoriteSet.has(uid)) {
        favoriteSet.delete(uid);
        showToast(`💔 ${channel.name} ${t.favoriteRemoved}`);
    } else {
        favoriteSet.add(uid);
        showToast(`❤️ ${channel.name} ${t.favoriteAdded}`);
    }
    saveFav();
    if(isFavMode) renderMobileChannelList();
    else if(!isWCMode && !isHistoryMode) renderMobileChannelList();
    updateStarInRow(rowElem, uid);
}

function updateStarInRow(row, uid) {
    const star = row.querySelector('.mobile-fav-star');
    if(star) star.innerHTML = favoriteSet.has(uid) ? '<i class="fas fa-star" style="color:#FFD966;"></i>' : '<i class="far fa-star" style="color:#aaa;"></i>';
}

function createStarButton(channel, rowElem) {
    const uid = channel.url + channel.name;
    const span = document.createElement('span');
    span.className = 'mobile-fav-star';
    span.innerHTML = favoriteSet.has(uid) ? '<i class="fas fa-star" style="color:#FFD966;"></i>' : '<i class="far fa-star" style="color:#aaa;"></i>';
    span.addEventListener('click', (e) => toggleFav(channel, e, rowElem));
    return span;
}

// ==================== M3U Parser ====================
function parseM3U(data) {
    const lines = data.split(/\r?\n/);
    let channels = [], current = null, num = 1;
    for(let line of lines) {
        line = line.trim();
        if(line.startsWith('#EXTINF:')) {
            const namePart = line.split(',');
            let name = namePart.length > 1 ? namePart.slice(1).join(',') : "Unknown";
            let logo = "", group = "General";
            const logoMatch = line.match(/tvg-logo="([^"]*)"/);
            if(logoMatch) logo = logoMatch[1];
            const groupMatch = line.match(/group-title="([^"]*)"/);
            if(groupMatch) group = groupMatch[1];
            current = { name: name.trim(), logo: logo || "https://i.ibb.co/3k5p1t4/live-icon.png", group: group.trim() || "General", url: "", number: num++ };
        } else if((line.startsWith('http://') || line.startsWith('https://')) && current) {
            current.url = line;
            channels.push(current);
            current = null;
        }
    }
    return channels;
}

async function loadPlaylists() {
    let combined = [];
    for(let url of PLAYLISTS) {
        try {
            const resp = await fetch(url);
            if(!resp.ok) continue;
            const text = await resp.text();
            combined.push(...parseM3U(text));
        } catch(e) {}
    }
    const unique = new Map();
    for(const ch of combined) if(ch.url && !unique.has(ch.url)) unique.set(ch.url, ch);
    allChannels = Array.from(unique.values());
    groupedChannels = {};
    for(const ch of allChannels) {
        const grp = ch.group || "General";
        if(!groupedChannels[grp]) groupedChannels[grp] = [];
        groupedChannels[grp].push(ch);
    }
    const sorted = {};
    Object.keys(groupedChannels).sort().forEach(k => { sorted[k] = groupedChannels[k]; });
    groupedChannels = sorted;
    flatChannelList = [];
    for(let cat of Object.keys(groupedChannels)) {
        flatChannelList.push(...groupedChannels[cat]);
    }
    mobileChannelCount.innerHTML = `📡 ${allChannels.length} টি চ্যানেল`;
    document.getElementById('channelCount').innerHTML = `📡 ${allChannels.length} টি চ্যানেল`;
    mobileViewerCount.innerHTML = `👁️ ${Math.floor(Math.random() * 30 + 10)}.${Math.floor(Math.random() * 9)}কে দেখছেন`;
    
    // Update category dropdowns
    const t = translations[currentLang];
    if(mobileCategorySelect) {
        mobileCategorySelect.innerHTML = `<option value="__ALL__">${t.allCategories}</option>`;
        for(let grp of Object.keys(groupedChannels)) {
            const opt = document.createElement('option');
            opt.value = grp;
            opt.innerText = grp;
            mobileCategorySelect.appendChild(opt);
        }
    }
    if(categorySelect) {
        categorySelect.innerHTML = `<option value="__ALL__">${t.allCategories}</option>`;
        for(let grp of Object.keys(groupedChannels)) {
            const opt = document.createElement('option');
            opt.value = grp;
            opt.innerText = grp;
            categorySelect.appendChild(opt);
        }
    }
    
    generateMockEPG();
}

function generateMockEPG() {
    const programs = ["ওয়ার্ল্ড কাপ লাইভ", "ম্যাচ রিপ্লে", "ফুটবল বিশ্লেষণ", "স্পোর্টস নিউজ", "হাইলাইটস"];
    allChannels.forEach((ch, idx) => {
        epgData[ch.url] = { current: programs[idx % programs.length] };
    });
}

// ==================== Playback Functions ====================
function playChannel(channel, rowElem) {
    if(!channel || !channel.url) return;
    currentChannelObj = channel;
    currentChannelIndex = flatChannelList.findIndex(ch => ch.url === channel.url);
    const t = translations[currentLang];
    currentNameSpan.innerText = `📺 ${channel.name}`;
    mobileChannelName.innerText = channel.name;
    mobileChannelNumber.innerText = `CH ${channel.number}`;
    const epg = epgData[channel.url];
    if(epg) epgSpan.innerText = `${t.nowPlaying} ${epg.current}`;
    loader.style.display = 'flex';
    addToHistory(channel);
    if(hls) { hls.destroy(); hls = null; }
    const timeout = setTimeout(() => { if(loader.style.display === 'flex') loader.style.display = 'none'; }, 8000);
    if(Hls.isSupported()) {
        hls = new Hls({ debug: false });
        hls.loadSource(channel.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            clearTimeout(timeout);
            loader.style.display = 'none';
            if(plyr) plyr.play().catch(e => { plyr.muted = true; plyr.play(); });
        });
        hls.on(Hls.Events.ERROR, () => {
            clearTimeout(timeout);
            loader.style.display = 'none';
            showToast(`${t.streamError}: ${channel.name}`);
        });
    } else {
        video.src = channel.url;
        video.addEventListener('loadedmetadata', () => {
            clearTimeout(timeout);
            loader.style.display = 'none';
            video.play();
        });
    }
    // Update active state
    document.querySelectorAll('.mobile-channel-item').forEach(el => el.classList.remove('active'));
    if(rowElem) rowElem.classList.add('active');
    renderMobileChannelList();
}

function playPrevChannel() {
    if(flatChannelList.length === 0) return;
    let newIndex = currentChannelIndex - 1;
    if(newIndex < 0) newIndex = flatChannelList.length - 1;
    playChannel(flatChannelList[newIndex], null);
}

function playNextChannel() {
    if(flatChannelList.length === 0) return;
    let newIndex = currentChannelIndex + 1;
    if(newIndex >= flatChannelList.length) newIndex = 0;
    playChannel(flatChannelList[newIndex], null);
}

// ==================== Mobile Render Functions ====================
function renderMobileChannelList() {
    mobileChannelContainer.innerHTML = '';
    const searchTerm = mobileSearchInput.value.toLowerCase();
    const selectedCat = mobileCategorySelect ? mobileCategorySelect.value : '__ALL__';
    let cats = (selectedCat === '__ALL__') ? Object.keys(groupedChannels) : [selectedCat];
    let hasChannels = false;
    
    for(let cat of cats) {
        if(!groupedChannels[cat]) continue;
        let filtered = groupedChannels[cat].filter(ch => ch.name.toLowerCase().includes(searchTerm));
        if(isFavMode) filtered = filtered.filter(ch => favoriteSet.has(ch.url + ch.name));
        if(filtered.length === 0) continue;
        hasChannels = true;
        
        const catTitle = document.createElement('div');
        catTitle.className = 'category-title-mobile';
        catTitle.innerHTML = `<i class="fas fa-folder"></i> ${cat} (${filtered.length})`;
        mobileChannelContainer.appendChild(catTitle);
        
        filtered.forEach(ch => {
            const row = document.createElement('div');
            row.className = 'mobile-channel-item';
            if(currentChannelObj && currentChannelObj.url === ch.url) row.classList.add('active');
            const img = document.createElement('img');
            img.src = ch.logo;
            img.className = 'mobile-channel-logo';
            img.onerror = () => { img.src = 'https://i.ibb.co/3k5p1t4/live-icon.png'; };
            const nameSpan = document.createElement('span');
            nameSpan.className = 'mobile-channel-name';
            nameSpan.innerText = ch.name;
            const numSpan = document.createElement('span');
            numSpan.className = 'mobile-channel-number';
            numSpan.innerText = ch.number;
            const starBtn = createStarButton(ch, row);
            row.appendChild(img);
            row.appendChild(nameSpan);
            row.appendChild(numSpan);
            row.appendChild(starBtn);
            row.addEventListener('click', (e) => {
                if(e.target.closest('.mobile-fav-star')) return;
                playChannel(ch, row);
            });
            mobileChannelContainer.appendChild(row);
        });
    }
    
    if(!hasChannels) {
        mobileChannelContainer.innerHTML = `<div style="text-align:center; padding:40px; color:#aaa;">${translations[currentLang].noChannels}</div>`;
    }
}

function renderMobileWc() {
    mobileWcContainer.style.display = 'block';
    mobileChannelContainer.style.display = 'none';
    mobileHistoryContainer.style.display = 'none';
    mobileWcContainer.innerHTML = '';
    const t = translations[currentLang];
    
    matchSchedule.forEach(match => {
        const card = document.createElement('div');
        card.className = 'wc-card';
        const team1 = currentLang === 'bn' ? match.team1Bn : match.team1En;
        const team2 = currentLang === 'bn' ? match.team2Bn : match.team2En;
        const time = currentLang === 'bn' ? match.timeBn : match.timeEn;
        card.innerHTML = `
            <div class="wc-card-header">
                <i class="fas fa-futbol"></i>
                <div class="wc-card-name">${team1} VS ${team2}</div>
            </div>
            <div class="wc-card-desc">⏰ ${time} ${match.live ? '🔴 লাইভ' : ''}</div>
        `;
        mobileWcContainer.appendChild(card);
    });
    
    worldCupChannels.forEach(ch => {
        const card = document.createElement('div');
        card.className = 'wc-card';
        const name = currentLang === 'bn' ? ch.nameBn : ch.nameEn;
        const lang = currentLang === 'bn' ? ch.langBn : ch.langEn;
        card.innerHTML = `
            <div class="wc-card-header">
                <i class="fas fa-tv"></i>
                <div class="wc-card-name">${name}</div>
            </div>
            <div class="wc-card-desc">🎤 ${lang} | 🎬 ${ch.quality}</div>
        `;
        mobileWcContainer.appendChild(card);
    });
}

function renderMobileHistory() {
    mobileWcContainer.style.display = 'none';
    mobileChannelContainer.style.display = 'none';
    mobileHistoryContainer.style.display = 'block';
    mobileHistoryContainer.innerHTML = '';
    const t = translations[currentLang];
    if(watchHistory.length === 0) {
        mobileHistoryContainer.innerHTML = `<div style="text-align:center; padding:40px; color:#aaa;">${t.noHistory}</div>`;
        return;
    }
    watchHistory.forEach(ch => {
        const div = document.createElement('div');
        div.className = 'history-item-mobile';
        div.innerHTML = `<img src="${ch.logo}" style="width:35px;height:35px;object-fit:contain;border-radius:8px;"> <span style="flex:1;">${ch.name}</span> <i class="fas fa-play-circle" style="color:#0ff;"></i>`;
        div.addEventListener('click', () => {
            const fullCh = allChannels.find(c => c.url === ch.url);
            if(fullCh) playChannel(fullCh, null);
        });
        mobileHistoryContainer.appendChild(div);
    });
}

// ==================== Desktop Render Functions ====================
function renderDesktopChannelList() {
    if(!desktopChannelList) return;
    desktopChannelList.innerHTML = '';
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedCat = categorySelect ? categorySelect.value : '__ALL__';
    let cats = (selectedCat === '__ALL__') ? Object.keys(groupedChannels) : [selectedCat];
    const t = translations[currentLang];
    
    for(let cat of cats) {
        if(!groupedChannels[cat]) continue;
        let filtered = groupedChannels[cat].filter(ch => ch.name.toLowerCase().includes(searchTerm));
        if(isFavMode) filtered = filtered.filter(ch => favoriteSet.has(ch.url + ch.name));
        if(filtered.length === 0) continue;
        const catDiv = document.createElement('div');
        const title = document.createElement('div'); title.className = 'category-title';
        title.innerHTML = `<i class="fas fa-folder"></i> ${cat} (${filtered.length})`;
        catDiv.appendChild(title);
        filtered.forEach(ch => {
            const row = document.createElement('div'); row.className = 'channel-item';
            const img = document.createElement('img'); img.src = ch.logo; img.className = 'channel-logo';
            img.onerror = () => { img.src = 'https://i.ibb.co/3k5p1t4/live-icon.png'; };
            const nameSpan = document.createElement('span'); nameSpan.className = 'channel-name'; nameSpan.innerText = ch.name;
            const numSpan = document.createElement('span'); numSpan.className = 'channel-number'; numSpan.innerText = ch.number;
            const starSpan = document.createElement('span'); starSpan.className = 'fav-star';
            starSpan.innerHTML = favoriteSet.has(ch.url + ch.name) ? '<i class="fas fa-star" style="color:#FFD966;"></i>' : '<i class="far fa-star" style="color:#aaa;"></i>';
            starSpan.addEventListener('click', (e) => { e.stopPropagation(); toggleFav(ch, e, row); });
            row.appendChild(img); row.appendChild(nameSpan); row.appendChild(numSpan); row.appendChild(starSpan);
            row.addEventListener('click', () => playChannel(ch, row));
            catDiv.appendChild(row);
        });
        desktopChannelList.appendChild(catDiv);
    }
    if(desktopChannelList.innerHTML === '') desktopChannelList.innerHTML = `<div style="text-align:center; padding:40px; color:#aaa;">${t.noChannels}</div>`;
}

function renderDesktopWc() {
    if(!desktopWcList) return;
    desktopWcList.style.display = 'block';
    desktopChannelList.style.display = 'none';
    desktopHistoryPanel.style.display = 'none';
    desktopWcList.innerHTML = '';
    matchSchedule.forEach(match => {
        const card = document.createElement('div');
        card.className = 'wc-channel-card';
        const team1 = currentLang === 'bn' ? match.team1Bn : match.team1En;
        const team2 = currentLang === 'bn' ? match.team2Bn : match.team2En;
        const time = currentLang === 'bn' ? match.timeBn : match.timeEn;
        card.innerHTML = `<div class="wc-channel-header"><i class="fas fa-futbol"></i><div><div class="wc-channel-name">${team1} VS ${team2}</div><div style="font-size:0.6rem;">⏰ ${time}</div></div></div>${match.live ? '<div class="match-badge">🔴 লাইভ</div>' : ''}`;
        desktopWcList.appendChild(card);
    });
    worldCupChannels.forEach(ch => {
        const card = document.createElement('div');
        card.className = 'wc-channel-card';
        const name = currentLang === 'bn' ? ch.nameBn : ch.nameEn;
        const lang = currentLang === 'bn' ? ch.langBn : ch.langEn;
        card.innerHTML = `<div class="wc-channel-header"><i class="fas fa-tv"></i><div><div class="wc-channel-name">${name}</div></div></div><div class="wc-channel-desc">🎤 ${lang} | 🎬 ${ch.quality}</div>`;
        desktopWcList.appendChild(card);
    });
}

function renderDesktopHistory() {
    if(!desktopHistoryPanel) return;
    desktopHistoryPanel.style.display = 'block';
    desktopChannelList.style.display = 'none';
    desktopWcList.style.display = 'none';
    desktopHistoryPanel.innerHTML = '';
    const t = translations[currentLang];
    if(watchHistory.length === 0) {
        desktopHistoryPanel.innerHTML = `<div style="text-align:center; padding:40px; color:#aaa;">${t.noHistory}</div>`;
        return;
    }
    watchHistory.forEach(ch => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<img src="${ch.logo}" style="width:30px;height:30px;object-fit:contain;border-radius:6px;"> <span style="flex:1;">${ch.name}</span> <i class="fas fa-play-circle" style="color:#0ff;"></i>`;
        div.addEventListener('click', () => { const fullCh = allChannels.find(c => c.url === ch.url); if(fullCh) playChannel(fullCh, null); });
        desktopHistoryPanel.appendChild(div);
    });
}

// ==================== Refresh & Mode Functions ====================
async function refreshAll() {
    loader.style.display = 'flex';
    try {
        await loadPlaylists();
        renderMobileChannelList();
        renderDesktopChannelList();
        showToast(translations[currentLang].refreshSuccess);
    } catch(e) { showToast(translations[currentLang].refreshFailed); }
    finally { loader.style.display = 'none'; }
}

function setMode(mode) {
    isWCMode = (mode === 'wc');
    isFavMode = (mode === 'fav');
    isHistoryMode = (mode === 'history');
    
    // Mobile
    if(mode === 'wc') renderMobileWc();
    else if(mode === 'fav') renderMobileChannelList();
    else if(mode === 'history') renderMobileHistory();
    else {
        isWCMode = false; isFavMode = false; isHistoryMode = false;
        mobileWcContainer.style.display = 'none';
        mobileHistoryContainer.style.display = 'none';
        mobileChannelContainer.style.display = 'block';
        renderMobileChannelList();
    }
    
    // Desktop
    if(mode === 'wc') renderDesktopWc();
    else if(mode === 'fav') renderDesktopChannelList();
    else if(mode === 'history') renderDesktopHistory();
    else {
        if(desktopWcList) desktopWcList.style.display = 'none';
        if(desktopHistoryPanel) desktopHistoryPanel.style.display = 'none';
        if(desktopChannelList) desktopChannelList.style.display = 'block';
        renderDesktopChannelList();
    }
    
    // Update bottom nav active state
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if(mode === 'home') document.getElementById('navHome').classList.add('active');
    else if(mode === 'wc') document.getElementById('navWorldcup').classList.add('active');
    else if(mode === 'fav') document.getElementById('navFavorites').classList.add('active');
    else if(mode === 'history') document.getElementById('navHistory').classList.add('active');
}

// ==================== DateTime & Countdown ====================
function updateDateTime() {
    const now = new Date();
    document.getElementById('datetime').innerHTML = now.toLocaleString(currentLang === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function updateCountdown() {
    const targetDate = new Date('June 11, 2026 00:00:00').getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById('countdown').innerHTML = days + ' ' + (currentLang === 'bn' ? 'দিন' : 'd');
}

// ==================== Event Listeners ====================
function initEventListeners() {
    // Language switcher
    document.getElementById('bnLangBtn').addEventListener('click', () => {
        currentLang = 'bn';
        document.getElementById('bnLangBtn').classList.add('active-lang');
        document.getElementById('enLangBtn').classList.remove('active-lang');
        updateUILanguage();
    });

    document.getElementById('enLangBtn').addEventListener('click', () => {
        currentLang = 'en';
        document.getElementById('enLangBtn').classList.add('active-lang');
        document.getElementById('bnLangBtn').classList.remove('active-lang');
        updateUILanguage();
    });

    // Bottom navigation
    document.getElementById('navHome').addEventListener('click', () => setMode('home'));
    document.getElementById('navWorldcup').addEventListener('click', () => setMode('wc'));
    document.getElementById('navFavorites').addEventListener('click', () => setMode('fav'));
    document.getElementById('navHistory').addEventListener('click', () => setMode('history'));
    document.getElementById('navRefresh').addEventListener('click', refreshAll);
    
    // Desktop tabs
    if(document.getElementById('refreshBtn')) document.getElementById('refreshBtn').addEventListener('click', refreshAll);
    if(document.getElementById('allTab')) document.getElementById('allTab').addEventListener('click', () => setMode('home'));
    if(document.getElementById('wcTabBtn')) document.getElementById('wcTabBtn').addEventListener('click', () => setMode('wc'));
    if(document.getElementById('favTab')) document.getElementById('favTab').addEventListener('click', () => setMode('fav'));
    if(document.getElementById('historyTab')) document.getElementById('historyTab').addEventListener('click', () => setMode('history'));
    
    // Hero and promo buttons
    document.getElementById('heroBtn').addEventListener('click', () => setMode('wc'));
    document.getElementById('promoBtn').addEventListener('click', () => showToast(translations[currentLang].promoBtnText));
    
    // Channel navigation
    mobilePrevChannel.addEventListener('click', playPrevChannel);
    mobileNextChannel.addEventListener('click', playNextChannel);
    
    // Quality and PIP
    qualitySelect.addEventListener('change', (e) => { if(currentChannelObj) showToast(`${translations[currentLang].qualityChanged} ${e.target.value}`); });
    pipButton.addEventListener('click', async () => { if(document.pictureInPictureElement) await document.exitPictureInPicture(); else if(video) await video.requestPictureInPicture(); });
    
    // Search and category
    mobileSearchInput.addEventListener('input', () => renderMobileChannelList());
    if(mobileCategorySelect) mobileCategorySelect.addEventListener('change', () => renderMobileChannelList());
    if(categorySelect) categorySelect.addEventListener('change', () => renderDesktopChannelList());
    if(searchInput) searchInput.addEventListener('input', () => renderDesktopChannelList());
    
    // Timers
    setInterval(updateDateTime, 1000);
    setInterval(updateCountdown, 3600000);
}

// ==================== Initialization ====================
async function init() {
    loadFav();
    loadHistory();
    await loadPlaylists();
    renderMobileChannelList();
    renderDesktopChannelList();
    plyr = new Plyr(video, { controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'] });
    updateUILanguage();
    initEventListeners();
    loader.style.display = 'none';
    if(allChannels.length) {
        setTimeout(() => {
            const firstChannel = allChannels[0];
            if(firstChannel) playChannel(firstChannel, null);
        }, 500);
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);