// Live AI news: top AI stories from Hacker News (Algolia API, CORS-open, no key).
(() => {
  const list = document.getElementById('news-list');
  const foot = document.getElementById('news-foot');
  const btn = document.getElementById('news-refresh');
  const TERMS = ['AI', 'LLM', 'OpenAI', 'Claude', 'Gemini'];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return 'news.ycombinator.com'; } };
  const ago = t => { const h = Math.round((Date.now() / 1000 - t) / 3600); return h < 1 ? 'just now' : h < 24 ? h + 'h ago' : Math.round(h / 24) + 'd ago'; };

  async function load() {
    btn.disabled = true; list.setAttribute('aria-busy', 'true');
    const since = Math.floor(Date.now() / 1000) - 3 * 86400;
    try {
      const results = await Promise.all(TERMS.map(q =>
        fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=30&numericFilters=created_at_i>${since},points>30`)
          .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })));
      const seen = new Map();
      const isAI = h => /\b(AI|A\.I\.|LLMs?|GPT[-\w.]*|ChatGPT|OpenAI|Claude|Anthropic|Gemini|DeepMind|Mistral|Llama|Copilot|agents?|agentic|neural|machine learning|models?)\b/i.test(h.title)
        || /(openai|anthropic|deepmind|mistral|huggingface)\./i.test(h.url || '');
      results.flatMap(r => r.hits).forEach(h => { if (h.title && isAI(h) && !seen.has(h.objectID)) seen.set(h.objectID, h); });
      const top = [...seen.values()].sort((a, b) => b.points - a.points).slice(0, 6);
      if (!top.length) throw new Error('empty');
      list.innerHTML = top.map((h, i) => {
        const disc = `https://news.ycombinator.com/item?id=${h.objectID}`;
        const url = h.url || disc;
        return `<article class="story">
          <span class="rank">${i + 1}</span>
          <div><h3><a href="${esc(url)}" target="_blank" rel="noopener">${esc(h.title)}</a></h3>
          <div class="src"><span>${esc(host(url))}</span><span class="tab">${h.points} points</span><span>${ago(h.created_at_i)}</span>
          <a href="${disc}" target="_blank" rel="noopener">${h.num_comments} comments</a></div></div>
          <a class="open" href="${esc(url)}" target="_blank" rel="noopener" aria-label="Open article: ${esc(h.title)}"><svg class="i"><use href="#arrow"/></svg></a>
        </article>`;
      }).join('');
      foot.textContent = 'Updated ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + ' · Source: Hacker News';
    } catch (err) {
      list.innerHTML = `<p class="news-msg">The news feed didn't load. Check your connection and press Refresh, or read it on <a href="https://news.ycombinator.com/" target="_blank" rel="noopener">Hacker News</a>.</p>`;
      foot.textContent = 'Couldn\'t reach the news feed.';
    } finally {
      btn.disabled = false; list.setAttribute('aria-busy', 'false');
    }
  }
  btn.addEventListener('click', load);
  load();
  setInterval(load, 10 * 60 * 1000);
})();

if (matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.glass').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}
