document.addEventListener("DOMContentLoaded", async () => {
  const filter = document.getElementById('region-filter');
  const grid = document.querySelector('.grid');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  const closeBtn = document.getElementById('close-modal');

  // Fetch data
  const res = await fetch('data.json');
  const data = await res.json();

  function renderCards(region) {
    // Sử dụng DocumentFragment để giảm thao tác DOM
    const fragment = document.createDocumentFragment();
    let count = 0;
    data.forEach((item, idx) => {
      const regions = Array.isArray(item.region) ? item.region : [item.region];
      if (region !== 'all' && !regions.includes(region)) return;

      const card = document.createElement('div');
      card.className = 'card card-flip';
      card.style.animationDelay = `${count * 0.08}s`;
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="card-title">${item.name}</div>
      `;
      card.onclick = () => {
        // Kiểm tra có ảnh chủ tịch không
        const hasChuTich = !!item.image_chu_tich;

        modalContent.innerHTML = `
          <div style="
            font-size: 2em;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            background: linear-gradient(90deg,rgb(161, 26, 26) 30%,rgb(160, 3, 3) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
            margin-bottom: 28px;
            margin-top: 4px;
            text-shadow: 0 2px 12px rgba(30,120,80,0.07);
            border-bottom: 2.5px solid #e53935;
            display: inline-block;
            padding-bottom: 6px;
          ">
            <span style="vertical-align: middle;">${item.name}</span>
            <span style="vertical-align: middle; margin-left: 8px;">
              <img src="Assets/icon.svg" alt="icon tòa nhà" style="width:26px;height:26px;display:inline-block;vertical-align:middle;filter:drop-shadow(0 1px 2pxrgba(160, 3, 3, 0.2));" />
            </span>
          </div>
          <div style="display:flex; gap:18px; justify-content:center; align-items:flex-start; margin-bottom:12px;">
            ${
              hasChuTich
              ? `
              <div style="flex:1; text-align:center;">
                <img src="${item.image_bi_thu || 'Assets/png/default-user.png'}" alt="Đồng chí" style="width:100px;height:100px;object-fit:cover;border-radius:50%;border:2px solid #1a5c2b;margin-bottom:8px;">
                <div style="margin-bottom:2px;">Đồng chí</div>
                <div style="font-size:1.05em; font-weight:600; color:#222;">${item.bi_thu}</div>
                <div style="font-size:0.97em; font-style:italic; color:#444; margin-top:4px;">${item.trich_ngang_bi_thu || ""}</div>
              </div>
              <div style="flex:1; text-align:center;">
                <img src="${item.image_chu_tich || 'Assets/png/default-user.png'}" alt="Đồng chí" style="width:100px;height:100px;object-fit:cover;border-radius:50%;border:2px solid #1a5c2b;margin-bottom:8px;">
                <div style="margin-bottom:2px;">Đồng chí</div>
                <div style="font-size:1.05em; font-weight:600; color:#222;">${item.chu_tich || ""}</div>
                <div style="font-size:0.97em; font-style:italic; color:#444; margin-top:4px;">${item.trich_ngang_chu_tich || ""}</div>
              </div>
              `
              : `
              <div style="flex:1; text-align:center; margin: 0 auto;">
                <img src="${item.image_bi_thu || 'Assets/png/default-user.png'}" alt="Đồng chí" style="width:120px;height:120px;object-fit:cover;border-radius:50%;border:2px solid #1a5c2b;margin-bottom:8px;">
                <div style="font-weight:bold; margin-bottom:2px;">Đồng chí</div>
                <div style="font-size:1.1em; font-weight:600; color:#222;">${item.bi_thu}</div>
                <div style="font-size:1em; font-style:italic; color:#444; margin-top:4px;">${item.trich_ngang_bi_thu || ""}</div>
              </div>
              `
            }
          </div>
          <hr style="border: none; border-top: 1.5px solid #e53935; margin: 18px 0 16px 0;">
          <div style="text-align:left; margin: 0 auto; max-width: 320px; font-size:1.05em; line-height:2;">
            <div style="margin-bottom:6px;"><b style="color:#e53935;">${item.ghi_chu || ""}</b></div>
            <div><b style="color:#e53935;">Diện tích:</b> <span style="color:#222;">${item.dien_tich || "Đang cập nhật"}</span></div>
            <div><b style="color:#e53935;">Dân số:</b> <span style="color:#222;">${item.dan_so || "Đang cập nhật"}</span></div>
            <div><b style="color:#e53935;">GRDP 2024 (triệu VND):</b> <span style="color:#222;">${item.grdp || "Đang cập nhật"}</span></div>
            <div><b style="color:#e53935;">Thu NS 2024 (triệu VND):</b> <span style="color:#222;">${item.thu_ngan_sach || "Đang cập nhật"}</span></div>
          </div>
        `;
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
      };
      fragment.appendChild(card);
      count++;
    });
    grid.innerHTML = '';
    grid.appendChild(fragment);
  }

  // Close modal
  closeBtn.onclick = () => {
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 250);
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      setTimeout(() => { modal.style.display = 'none'; }, 250);
    }
  };

  // Kích hoạt hiệu ứng lật sau khi render xong
  setTimeout(() => {
    document.querySelectorAll('.card-flip').forEach(card => {
      card.classList.add('flip-in');
    });
  }, 100);

  filter.onchange = (e) => {
    renderCards(e.target.value);
  };

  renderCards('all'); // Hiển thị mặc định
});
