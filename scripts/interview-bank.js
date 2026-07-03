'use strict';

const CATEGORIES = [
  'Java / Python',
  '前端',
  '数据库',
  '计算机网络',
  '操作系统',
  '算法',
  '项目面试',
  'HR 面试'
];
const STATUSES = ['未开始', '学习中', '已完成'];
const DIFFICULTIES = ['基础', '进阶', '困难'];

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
  return /^(https?:\/\/|\/)/i.test(url) ? escapeHtml(url) : '';
}

hexo.extend.tag.register('interview_bank', function () {
  const data = hexo.locals.get('data') || {};
  const source = data.interviews || {};
  const questions = Array.isArray(source) ? source : source.questions;
  const items = (Array.isArray(questions) ? questions : [])
    .filter(item => item && CATEGORIES.includes(item.category))
    .map(item => ({
      question: item.question || '未填写题目',
      category: item.category,
      status: STATUSES.includes(item.status) ? item.status : '未开始',
      difficulty: DIFFICULTIES.includes(item.difficulty) ? item.difficulty : '基础',
      review: item.review === true,
      note: item.note || '',
      link: item.link || ''
    }));

  const completed = items.filter(item => item.status === '已完成').length;
  const reviewing = items.filter(item => item.review).length;
  const progress = items.length ? Math.round((completed / items.length) * 100) : 0;

  const categoryOptions = CATEGORIES.map(category =>
    `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`
  ).join('');

  const cards = items.map((item, index) => {
    const href = safeUrl(item.link);
    const title = href
      ? `<a href="${href}">${escapeHtml(item.question)}</a>`
      : escapeHtml(item.question);
    return `
      <article class="interview-card"
        data-category="${escapeHtml(item.category)}"
        data-status="${escapeHtml(item.status)}"
        data-review="${item.review ? 'true' : 'false'}">
        <div class="interview-card__number">${String(index + 1).padStart(2, '0')}</div>
        <div class="interview-card__labels">
          <span class="interview-label interview-label--category">${escapeHtml(item.category)}</span>
          <span class="interview-label interview-label--difficulty">${escapeHtml(item.difficulty)}</span>
          <span class="interview-label interview-label--status">${escapeHtml(item.status)}</span>
          ${item.review ? '<span class="interview-label interview-label--review">需要复习</span>' : ''}
        </div>
        <h3>${title}</h3>
        ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ''}
      </article>`;
  }).join('');

  return `
    <div class="interview-bank">
      <section class="interview-overview" aria-label="面试题学习统计">
        <div><strong>${items.length}</strong><span>题目总数</span></div>
        <div><strong>${completed}</strong><span>已经完成</span></div>
        <div><strong>${reviewing}</strong><span>需要复习</span></div>
        <div><strong>${progress}%</strong><span>完成进度</span></div>
      </section>
      <div class="interview-progress" aria-label="完成进度 ${progress}%">
        <span style="width:${progress}%"></span>
      </div>
      <section class="interview-filters" aria-label="筛选面试题">
        <label>类别
          <select data-interview-filter="category">
            <option value="all">全部类别</option>
            ${categoryOptions}
          </select>
        </label>
        <label>状态
          <select data-interview-filter="status">
            <option value="all">全部状态</option>
            ${STATUSES.map(status => `<option value="${status}">${status}</option>`).join('')}
          </select>
        </label>
        <label class="interview-review-filter">
          <input type="checkbox" data-interview-filter="review">
          只看需要复习
        </label>
        <button type="button" data-interview-reset>重置筛选</button>
      </section>
      <p class="interview-result" aria-live="polite">显示 ${items.length} 道题</p>
      <section class="interview-list">${cards}</section>
      <div class="interview-no-result" hidden>没有符合当前筛选条件的题目。</div>
    </div>`;
});
