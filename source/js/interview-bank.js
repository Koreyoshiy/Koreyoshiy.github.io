(() => {
  const init = () => {
    document.querySelectorAll('.interview-bank').forEach(bank => {
      const category = bank.querySelector('[data-interview-filter="category"]');
      const status = bank.querySelector('[data-interview-filter="status"]');
      const review = bank.querySelector('[data-interview-filter="review"]');
      const reset = bank.querySelector('[data-interview-reset]');
      const result = bank.querySelector('.interview-result');
      const empty = bank.querySelector('.interview-no-result');
      const cards = [...bank.querySelectorAll('.interview-card')];

      const update = () => {
        let visible = 0;
        cards.forEach(card => {
          const matchesCategory = category.value === 'all' || card.dataset.category === category.value;
          const matchesStatus = status.value === 'all' || card.dataset.status === status.value;
          const matchesReview = !review.checked || card.dataset.review === 'true';
          const show = matchesCategory && matchesStatus && matchesReview;
          card.hidden = !show;
          if (show) visible += 1;
        });
        result.textContent = `显示 ${visible} 道题`;
        empty.hidden = visible !== 0;
      };

      [category, status, review].forEach(control => control.addEventListener('change', update));
      reset.addEventListener('click', () => {
        category.value = 'all';
        status.value = 'all';
        review.checked = false;
        update();
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
