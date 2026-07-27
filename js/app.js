/**
 * 原则 · 身份
 * 后端 data.json；生效 / 归档；想法·语言·行动反馈
 */

const KIND_LABEL = {
  thought: "想法",
  speech: "语言",
  action: "行动",
};

/** @typedef {{ id: string, title: string, body: string, status: 'active'|'archived', createdAt: string, updatedAt: string, archivedAt?: string, archiveReason?: string, feedback: Feedback[] }} Principle */
/** @typedef {{ id: string, kind: 'thought'|'speech'|'action', text: string, at: string }} Feedback */

// —— State ——

/** @type {{ principles: Principle[] }} */
let state = { principles: [] };

(async () => {
  state = await load();
  render();
})();

let tab = "active";
/** @type {string|null} */
let editingId = null;
/** @type {string|null} */
let archiveTargetId = null;
/** @type {string|null} */
let feedbackTargetId = null;

// —— DOM ——

const panelActive = document.getElementById("panel-active");
const panelArchived = document.getElementById("panel-archived");
const dialogForm = document.getElementById("dialog-form");
const dialogArchive = document.getElementById("dialog-archive");
const dialogFeedback = document.getElementById("dialog-feedback");
const formPrinciple = document.getElementById("form-principle");
const formArchive = document.getElementById("form-archive");
const formFeedback = document.getElementById("form-feedback");

// —— Storage ——

async function load() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) return { principles: [] };
    const data = await res.json();
    if (!data || !Array.isArray(data.principles)) return { principles: [] };
    return data;
  } catch {
    return { principles: [] };
  }
}

async function save() {
  await fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state)
  });
}

function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function now() {
  return new Date().toISOString();
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// —— Render ——

function render() {
  const active = state.principles
    .filter((p) => p.status === "active")
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  const archived = state.principles
    .filter((p) => p.status === "archived")
    .sort((a, b) => (b.archivedAt || "").localeCompare(a.archivedAt || ""));

  panelActive.innerHTML = active.length
    ? active.map((p) => cardHtml(p, false)).join("")
    : emptyHtml("暂无原则");

  panelArchived.innerHTML = archived.length
    ? archived.map((p) => cardHtml(p, true)).join("")
    : emptyHtml("暂无");

  panelActive.hidden = tab !== "active";
  panelArchived.hidden = tab !== "archived";
  document.querySelectorAll(".tab").forEach((el) => {
    el.classList.toggle("active", el.dataset.tab === tab);
  });
}

function emptyHtml(title) {
  return `<div class="empty"><p>${esc(title)}</p></div>`;
}

function cardHtml(p, isArchived) {
  const fb = (p.feedback || [])
    .slice()
    .sort((a, b) => (b.at || "").localeCompare(a.at || ""))
    .slice(0, 5);

  const fbHtml =
    fb.length > 0
      ? `<ul class="feedback-list">${fb
          .map(
            (f) => `
        <li>
          <span class="fb-kind ${f.kind}">${KIND_LABEL[f.kind] || f.kind}</span>
          <span class="fb-text">${esc(f.text)}</span>
          <span class="fb-date">${fmtDate(f.at)}</span>
        </li>`
          )
          .join("")}</ul>`
      : "";

  const reasonHtml =
    isArchived && p.archiveReason
      ? `<div class="archive-reason"><strong>为何不再选：</strong>${esc(p.archiveReason)}</div>`
      : "";

  const actions = isArchived
    ? `
      <button type="button" class="btn ghost small" data-act="restore" data-id="${p.id}">重新选择</button>
      <button type="button" class="btn ghost small" data-act="delete" data-id="${p.id}">永久删除</button>`
    : `
      <button type="button" class="btn ghost small" data-act="feedback" data-id="${p.id}">记反馈</button>
      <button type="button" class="btn ghost small" data-act="edit" data-id="${p.id}">编辑</button>
      <button type="button" class="btn ghost small" data-act="archive" data-id="${p.id}">不再选择</button>`;

  const meta = isArchived
    ? `归档于 ${fmtDate(p.archivedAt)} · 曾创建于 ${fmtDate(p.createdAt)}`
    : `更新于 ${fmtDate(p.updatedAt)}`;

  return `
    <article class="card ${isArchived ? "archived" : ""}" data-id="${p.id}">
      <div class="card-top">
        <h3>${esc(p.title)}</h3>
      </div>
      ${p.body ? `<p class="card-body">${esc(p.body)}</p>` : ""}
      ${reasonHtml}
      ${fbHtml}
      <div class="card-meta">${meta}</div>
      <div class="card-actions">${actions}</div>
    </article>`;
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// —— Actions ——

function openNew() {
  editingId = null;
  document.getElementById("form-title").textContent = "新原则";
  document.getElementById("field-title").value = "";
  document.getElementById("field-body").value = "";
  dialogForm.showModal();
  document.getElementById("field-title").focus();
}

function openEdit(id) {
  const p = state.principles.find((x) => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById("form-title").textContent = "编辑原则";
  document.getElementById("field-title").value = p.title;
  document.getElementById("field-body").value = p.body || "";
  dialogForm.showModal();
  document.getElementById("field-title").focus();
}

function openArchive(id) {
  archiveTargetId = id;
  document.getElementById("field-archive-reason").value = "";
  dialogArchive.showModal();
}

function openFeedback(id) {
  const p = state.principles.find((x) => x.id === id);
  if (!p) return;
  feedbackTargetId = id;
  document.getElementById("feedback-principle-name").textContent = p.title;
  document.getElementById("field-feedback").value = "";
  const radio = formFeedback.querySelector('input[name="kind"][value="action"]');
  if (radio) radio.checked = true;
  dialogFeedback.showModal();
  document.getElementById("field-feedback").focus();
}

async function savePrinciple(e) {
  e.preventDefault();
  const title = document.getElementById("field-title").value.trim();
  const body = document.getElementById("field-body").value.trim();
  if (!title) return;

  if (editingId) {
    const p = state.principles.find((x) => x.id === editingId);
    if (p) {
      p.title = title;
      p.body = body;
      p.updatedAt = now();
    }
  } else {
    state.principles.push({
      id: uid(),
      title,
      body,
      status: "active",
      createdAt: now(),
      updatedAt: now(),
      feedback: [],
    });
  }
  await save();
  dialogForm.close();
  tab = "active";
  render();
}

async function confirmArchive(e) {
  e.preventDefault();
  const p = state.principles.find((x) => x.id === archiveTargetId);
  if (!p) return;
  p.status = "archived";
  p.archivedAt = now();
  p.archiveReason = document.getElementById("field-archive-reason").value.trim();
  p.updatedAt = now();
  await save();
  dialogArchive.close();
  archiveTargetId = null;
  render();
}

async function restore(id) {
  const p = state.principles.find((x) => x.id === id);
  if (!p) return;
  p.status = "active";
  p.archivedAt = undefined;
  p.archiveReason = undefined;
  p.updatedAt = now();
  await save();
  tab = "active";
  render();
}

async function hardDelete(id) {
  if (!confirm("永久删除这条原则？此操作不可恢复。")) return;
  state.principles = state.principles.filter((x) => x.id !== id);
  await save();
  render();
}

async function saveFeedback(e) {
  e.preventDefault();
  const p = state.principles.find((x) => x.id === feedbackTargetId);
  if (!p) return;
  const text = document.getElementById("field-feedback").value.trim();
  if (!text) return;
  const kind =
    formFeedback.querySelector('input[name="kind"]:checked')?.value || "action";
  if (!p.feedback) p.feedback = [];
  p.feedback.push({ id: uid(), kind, text, at: now() });
  p.updatedAt = now();
  await save();
  dialogFeedback.close();
  feedbackTargetId = null;
  render();
}

function exportJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `principles-${fmtDate(now())}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importJson(file) {
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || !Array.isArray(data.principles)) {
        alert("文件格式不对：需要 { principles: [] }");
        return;
      }
      if (
        state.principles.length &&
        !confirm("导入将覆盖现有数据，确定？")
      ) {
        return;
      }
      state = { principles: data.principles };
      await save();
      render();
    } catch {
      alert("无法解析 JSON");
    }
  };
  reader.readAsText(file);
}

// —— Events ——

document.getElementById("btn-new").addEventListener("click", openNew);
document.getElementById("btn-export").addEventListener("click", exportJson);
document.getElementById("input-import").addEventListener("change", (e) => {
  const f = e.target.files?.[0];
  if (f) importJson(f);
  e.target.value = "";
});

// 迁移localStorage数据
document.getElementById("btn-migrate")?.addEventListener("click", async () => {
  const raw = localStorage.getItem("principles-identity-v1");
  if (!raw) {
    alert("localStorage里没有数据");
    return;
  }
  try {
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.principles) || !data.principles.length) {
      alert("localStorage里没有原则数据");
      return;
    }
    if (!confirm(`找到 ${data.principles.length} 条原则，导入到后端？`)) return;
    state = data;
    await save();
    localStorage.removeItem("principles-identity-v1");
    render();
    alert("迁移完成！");
  } catch {
    alert("解析localStorage数据失败");
  }
});

document.getElementById("form-cancel").addEventListener("click", () => dialogForm.close());
document.getElementById("archive-cancel").addEventListener("click", () => dialogArchive.close());
document.getElementById("feedback-cancel").addEventListener("click", () => dialogFeedback.close());

formPrinciple.addEventListener("submit", savePrinciple);
formArchive.addEventListener("submit", confirmArchive);
formFeedback.addEventListener("submit", saveFeedback);

document.querySelectorAll(".tab").forEach((el) => {
  el.addEventListener("click", () => {
    tab = el.dataset.tab;
    render();
  });
});

document.querySelector("main").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const id = btn.dataset.id;
  const act = btn.dataset.act;
  if (act === "edit") openEdit(id);
  else if (act === "archive") openArchive(id);
  else if (act === "feedback") openFeedback(id);
  else if (act === "restore") restore(id);
  else if (act === "delete") hardDelete(id);
});
