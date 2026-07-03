'use strict';

const STATUS_META = [
  { name: '已收藏', icon: '☆' },
  { name: '已投递', icon: '↗' },
  { name: '笔试', icon: '✎' },
  { name: '面试', icon: '☕' },
  { name: 'Offer', icon: '✓' },
  { name: '已结束', icon: '·' }
];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeUrl(value) {
  const url = String(value ?? '').trim();
  return /^https?:\/\//i.test(url) ? escapeHtml(url) : '';
}

function formatDate(value) {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

hexo.extend.tag.register('internship_board', function () {
  const data = hexo.locals.get('data') || {};
  const source = data.applications || {};
  const applications = Array.isArray(source) ? source : source.applications;
  const items = Array.isArray(applications) ? applications : [];
  const validStatuses = new Set(STATUS_META.map(item => item.name));
  const normalized = items
    .filter(item => item && validStatuses.has(item.status))
    .map(item => ({
      company: item.company || '未命名公司',
      role: item.role || '未填写岗位',
      status: item.status,
      location: item.location || '',
      date: formatDate(item.date),
      link: item.link || '',
      note: item.note || ''
    }));

  const stats = STATUS_META.map(status => {
    const count = normalized.filter(item => item.status === status.name).length;
    return `
      <div class="internship-stat internship-status-${escapeHtml(status.name)}">
        <span class="internship-stat__icon" aria-hidden="true">${status.icon}</span>
        <strong>${count}</strong>
        <span>${escapeHtml(status.name)}</span>
      </div>`;
  }).join('');

  const groups = STATUS_META.map(status => {
    const groupItems = normalized.filter(item => item.status === status.name);
    if (!groupItems.length) return '';

    const cards = groupItems.map(item => {
      const href = safeUrl(item.link);
      const title = href
        ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.company)}</a>`
        : escapeHtml(item.company);
      const details = [
        item.location && `<span>${escapeHtml(item.location)}</span>`,
        item.date && `<time>${escapeHtml(item.date)}</time>`
      ].filter(Boolean).join('');

      return `
        <article class="internship-card">
          <div class="internship-card__tape" aria-hidden="true"></div>
          <span class="internship-card__status">${escapeHtml(status.name)}</span>
          <h3>${title}</h3>
          <p class="internship-card__role">${escapeHtml(item.role)}</p>
          ${details ? `<div class="internship-card__meta">${details}</div>` : ''}
          ${item.note ? `<p class="internship-card__note">${escapeHtml(item.note)}</p>` : ''}
        </article>`;
    }).join('');

    return `
      <section class="internship-group">
        <h2><span aria-hidden="true">${status.icon}</span> ${escapeHtml(status.name)}</h2>
        <div class="internship-cards">${cards}</div>
      </section>`;
  }).join('');

  const empty = normalized.length
    ? ''
    : `<div class="internship-empty">
        <span aria-hidden="true">✦</span>
        <strong>还没有公开的岗位记录</strong>
        <p>在 applications.yml 中添加第一条记录后，统计和岗位卡片会自动出现。</p>
      </div>`;

  return `
    <div class="internship-board" data-total="${normalized.length}">
      <div class="internship-summary" aria-label="求职进度统计">${stats}</div>
      ${empty}
      ${groups}
    </div>`;
});
