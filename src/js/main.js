document.addEventListener('DOMContentLoaded', () => {
  const headerLinks = document.querySelectorAll('.header__bottom-link');
  const headerDropdowns = document.querySelectorAll('.header__bottom-dropdown');


  // скрываем все выпадашки в шапке при клике в других местах
  document.body.addEventListener('click', e => {
    let target = e.target;
    headerLinks.forEach(link => {
      headerDropdowns.forEach(dd => {
        if (target !== link && target !== dd) {
          dd.classList.remove('dropdown--visible');
        }
      });
    });
  });


  // по клику показываем и скрываем выпадашку в шапке
  headerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // если сама ссылка в меню будет вести на другую страницу, эту строку удалить

      headerDropdowns.forEach(dd => {
        dd.classList.remove(visibleClass);
      });

      const visibleClass = 'dropdown--visible';

      let target = e.target;
      let targetDropdown = target.nextSibling.nextSibling;

      headerDropdowns.forEach(dd => {
        if (dd == targetDropdown && !dd.classList.contains(visibleClass)) {
          dd.classList.add(visibleClass);
        } else {
          dd.classList.remove(visibleClass);
        }
      });
    });

    // по наведению указателя мыши показываем и скрываем выпадашку в шапке
    link.addEventListener('mouseover', (e) => {
      headerDropdowns.forEach(dd => {
        dd.classList.remove(visibleClass);
      });

      const visibleClass = 'dropdown--visible';

      let target = e.target;
      let targetDropdown = target.nextSibling.nextSibling;

      headerDropdowns.forEach(dd => {
        if (dd == targetDropdown && !dd.classList.contains(visibleClass)) {
          dd.classList.add(visibleClass);
        } else {
          dd.classList.remove(visibleClass);
        }
      });
    });
  });


});
