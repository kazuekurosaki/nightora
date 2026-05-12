let videoData = [];
let nsfwMode = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('age_verified') === 'true') {
        showApp();
    }
    loadComponents();
    fetchData();
});

function verifyAge() {
    localStorage.setItem('age_verified', 'true');
    showApp();
}

function showApp() {
    document.getElementById('age-modal').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
}

async function loadComponents() {
    const components = ['header', 'footer', 'genre', 'list'];
    for (const comp of components) {
        const res = await fetch(`includes/${comp}.html`);
        const html = await res.text();
        document.getElementById(`${comp}-placeholder`).innerHTML = html;
    }
    setupEventListeners();
}

async function fetchData() {
    const res = await fetch('content/data.json');
    videoData = await res.json();
    renderGrid(videoData);
}

function setupEventListeners() {
    // Dark Mode
    document.getElementById('theme-btn')?.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
    });

    // NSFW Toggle
    document.getElementById('nsfw-btn')?.addEventListener('click', function() {
        nsfwMode = !nsfwMode;
        this.classList.toggle('bg-rose-600');
        renderGrid(videoData);
    });
}

function renderGrid(data) {
    const container = document.querySelector('.video-grid');
    if (!container) return;

    const filtered = nsfwMode ? data : data.filter(v => !v.nsfw);
    
    container.innerHTML = filtered.map(item => `
        <div class="video-card group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all hover:-translate-y-1" onclick="showDetail('${item.id}')">
            <div class="relative aspect-video bg-slate-800">
                <img src="${item.thumbnail}" class="thumbnail-img w-full h-full object-cover transition-opacity duration-300">
                <video class="video-preview absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300" muted loop onmouseover="this.play()" onmouseout="this.pause();this.currentTime=0;">
                    <source src="${item.preview_video}" type="video/mp4">
                </video>
                <div class="absolute bottom-2 right-2 bg-black/70 text-[10px] font-bold px-2 py-0.5 rounded text-white">${item.quality}</div>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-sm line-clamp-2 group-hover:text-rose-600 transition">${item.title}</h3>
                <div class="flex justify-between mt-3 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    <span>${item.artist}</span>
                    <span>${item.duration}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function showDetail(id) {
    const item = videoData.find(v => v.id === id);
    const content = document.getElementById('dynamic-content');
    
    content.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <button onclick="location.reload()" class="mb-6 flex items-center gap-2 font-bold text-rose-600 hover:text-rose-400 transition">
                <i class="fas fa-arrow-left"></i> KEMBALI
            </button>
            
            <div class="bg-black rounded-3xl overflow-hidden shadow-2xl mb-8">
                <iframe src="${item.embed_url}" allowfullscreen></iframe>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2">
                    <h1 class="text-3xl font-black mb-4">${item.title}</h1>
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${item.genres.map(g => `<span class="bg-rose-600/10 text-rose-600 px-3 py-1 rounded-full text-xs font-bold">${g}</span>`).join('')}
                    </div>
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <h4 class="font-bold mb-3">SINOPSIS</h4>
                        <p class="text-slate-400 text-sm leading-relaxed">${item.synopsis}</p>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <div class="flex justify-between text-sm"><span class="text-slate-500">CODE</span><span class="font-bold text-rose-600">${item.code}</span></div>
                        <div class="flex justify-between text-sm"><span class="text-slate-500">ARTIST</span><span class="font-bold">${item.artist}</span></div>
                        <div class="flex justify-between text-sm"><span class="text-slate-500">STUDIO</span><span class="font-bold">${item.studio}</span></div>
                        <div class="flex justify-between text-sm"><span class="text-slate-500">RELEASE</span><span class="font-bold">${item.release_date}</span></div>
                        <div class="flex justify-between text-sm"><span class="text-slate-500">DURATION</span><span class="font-bold">${item.duration}</span></div>
                        <div class="flex justify-between text-sm"><span class="text-slate-500">COUNTRY</span><span class="font-bold">${item.country}</span></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    window.scrollTo(0,0);
}
