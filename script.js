const API_ENDPOINT = "/api/mediafire";

const files = [
  {
    id: "0u0w9sa62hqq1oj",
    logo: "https://files.catbox.moe/c1xa3o.ico"
  },
  {
    id: "8v3sjm75zec5kr9",
    logo: "https://files.catbox.moe/c1xa3o.ico"
  },
  {
    id: "hbkgj1ado9rg4oc",
    logo: "https://files.catbox.moe/c1xa3o.ico"
  },
  {
    id: "662nf9lyye36ol2",
    logo: "https://files.catbox.moe/c1xa3o.ico"
  },
  {
    id: "cwyt9dkyz977bla",
    logo: "https://files.catbox.moe/c1xa3o.ico"
  },
  {
    id: "ui4x8bw5wjicovn",
    logo: "https://files.catbox.moe/75ng71.webp"
  },
  {
    id: "7zasep21z5cnw0k",
    logo: "https://files.catbox.moe/u5lqni.png"
  },
  {
    id: "dnqu3er240m6i00",
    logo: "https://files.catbox.moe/u5lqni.png"
  },
  {
    id: "pgvpqnoutkkwap8",
    logo: "https://files.catbox.moe/rok1a4.webp"
  },
  {
    id: "44ffz31chfqd34q",
    logo: "https://files.catbox.moe/unn1vd.webp"
  },
  {
    id: "8jbjgjhtqxo6yvk",
    logo: "https://files.catbox.moe/7aua3l.webp"
  }
];

const container = document.getElementById("cardsContainer");

function buildMediaFireUrl(fileId){
  return `https://www.mediafire.com/file/${fileId}`;
}

async function fetchMediaFireInfo(mediafireUrl) {
  try {
    const res = await fetch(
      `${API_ENDPOINT}?url=${encodeURIComponent(mediafireUrl)}`
    );

    if (!res.ok) return null;

    const data = await res.json();

    if (!data.fileName || !data.downloadUrl) return null;

    return {
      name: data.fileName,
      download: data.downloadUrl
    };
  } catch (e) {
    console.error("Fetch error:", e);
    return null;
  }
}

async function createCard(file) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img class="logo-img" src="${file.logo}" alt="logo">
    <div class="content">
      <div class="filename">Loading...</div>
      <button disabled>Download</button>
      <div class="status">Fetching info...</div>
    </div>
  `;
  container.appendChild(card);

  const nameEl = card.querySelector(".filename");
  const btn = card.querySelector("button");
  const status = card.querySelector(".status");

  const mediafireUrl = buildMediaFireUrl(file.id);
  const info = await fetchMediaFireInfo(mediafireUrl);

  if (!info) {
    nameEl.textContent = "Cannot fetch file";
    status.textContent = "MediaFire blocked or error";
    return;
  }

  nameEl.textContent = info.name;
  card.dataset.filename = info.name.toLowerCase();
  status.textContent = "Ready to download";
  btn.disabled = false;

  btn.onclick = () => handleDownload(btn, status, info.download);
}

function handleDownload(btn, status, link) {
  if (btn.classList.contains("loading")) return;

  btn.classList.add("loading");
  btn.disabled = true;

  window.location.href = link;

  let wait = 5;
  status.textContent = `Please wait ${wait}s`;

  const timer = setInterval(() => {
    wait--;
    status.textContent = `Please wait ${wait}s`;

    if (wait < 0) {
      clearInterval(timer);
      btn.classList.remove("loading");
      btn.disabled = false;
      status.textContent = "Ready to download";
    }
  }, 1000);
}

files.forEach(createCard);

const refreshBtn = document.getElementById("refreshPage");
if (refreshBtn) {
  refreshBtn.onclick = () => {
    refreshBtn.classList.add("spin");
    setTimeout(() => location.reload(), 800);
  };
}

const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
      const name = card.dataset.filename || "";
      card.style.display = name.includes(keyword) ? "" : "none";
    });
  });
}
