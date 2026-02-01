let items = [];
let fuse;
const searchInput = document.getElementById('search');
const grid = document.getElementById('item-grid');
const emptyState = document.getElementById('empty-state');
let debounceTimer;

fetch('/search-index.json')
  .then(res => res.json())
  .then(data => {
    items = data;
    fuse = new Fuse(items, {
      keys: ['name'],
      threshold: 0.4,
    });
  });

function render(filtered) {
  grid.innerHTML = '';
  if (!filtered.length) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');
  for (const item of filtered) {
    const thumbnail = item.thumbs?.[0] || item.images?.[0] || '/images/placeholder.svg';
    const card = document.createElement('a');
    card.href = `/item/${item.id}`;
    card.className = 'group relative block rounded-2xl overflow-hidden bg-gray-900/50 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 ease-out';
    
    let priceHtml = '';
    if (item.salePrice) {
      priceHtml = `<span class="text-gray-400 text-sm line-through">${item.originalPrice} CZK</span><span class="text-blue-400 font-semibold">${item.salePrice} CZK</span>`;
    } else if (item.originalPrice) {
      priceHtml = `<span class="text-blue-400 font-semibold">${item.originalPrice} CZK</span>`;
    } else {
      priceHtml = '<span class="text-blue-400 font-semibold">Make offer</span>';
    }
    
    card.innerHTML = `
      <div class="aspect-[4/3] overflow-hidden">
        <img src="${thumbnail}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" loading="lazy" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-5">
        <h3 class="text-white font-medium text-base leading-snug mb-2 text-shadow">${item.name}</h3>
        <div class="flex items-baseline gap-2">${priceHtml}</div>
      </div>
    `;
    grid.appendChild(card);
  }
}

function doSearch() {
  const query = searchInput.value.trim();
  if (query) {
    if (fuse) {
      const results = fuse.search(query).map(r => r.item);
      render(results);
    }
  } else {
    if (items.length) {
      render(items);
    }
  }
}

searchInput?.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(doSearch, 150);
});
