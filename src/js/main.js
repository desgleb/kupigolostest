document.addEventListener('DOMContentLoaded', () => {
  const headerLinks = document.querySelectorAll('.header__bottom-link');
  const headerDropdowns = document.querySelectorAll('.header__bottom-dropdown');

  document.body.addEventListener('click', e => {
    let target = e.target;
    headerLinks.forEach(link => {
      // let linkParent = link.parentElement;
      headerDropdowns.forEach(dd => {
        if (target !== link && target !== dd) {
          dd.classList.remove('dropdown--visible');
        }
      });
    });
  });

  headerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
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
