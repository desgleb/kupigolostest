document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.querySelector('.burger__btn');
  const burgerClose = document.querySelector('.burger__menu-close');
  const burgerMenu = document.querySelector('.burger__menu');
  const headerLogo = document.querySelector('.header__logo');
  const headerNav = document.querySelector('.header__nav');
  const headerBottomList = document.querySelector('.header__bottom-list');
  const headerLinks = document.querySelectorAll('.header__bottom-link');
  const headerDropdowns = document.querySelectorAll('.header__bottom-dropdown');
  const headerDropdownsLists = document.querySelectorAll('.header__bottom-dropdown-list');
  const dropdownHeadings = document.querySelectorAll('.header__bottom-dropdown-heading');
  const chrono = document.querySelector('.header__chrono');
  const mySpeakers = document.querySelector('.header__my-speakers');

  // проверка ширины экрана
  function widthCheck() {
    let bodyWidth = document.body.clientWidth;

    if (bodyWidth <= 500) {
      burgerMenu.append(headerNav);
      headerBottomList.append(chrono);
      headerBottomList.append(mySpeakers);
    }

    if (bodyWidth > 500) {
      headerLogo.after(headerNav);
      headerBottomList.after(chrono);
      headerBottomList.after(mySpeakers);
      headerDropdownsLists.forEach(item => {
        item.classList.remove('.dropdown-list--visible');
      });
    }

  }

  widthCheck();

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

      let target = e.target;

      headerDropdowns.forEach(dd => {
        dd.classList.remove(visibleClass);
      });

      const visibleClass = 'dropdown--visible';

      let targetDropdown = target.nextSibling.nextSibling;

      console.log(target);
      console.log(targetDropdown);

      headerDropdowns.forEach(dd => {
        if (dd == targetDropdown && !dd.classList.contains(visibleClass)) {
          dd.classList.add(visibleClass);
        } else {
          dd.classList.remove(visibleClass);
        }
      });
    });
  });

  // по наведению указателя мыши показываем и скрываем выпадашку в шапке
  headerLinks.forEach(link => {
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

  // скрываем выпадашку при уводе с нее мышки
  headerDropdowns.forEach(dd => {
    const visibleClass = 'dropdown--visible';
    dd.addEventListener('mouseout', () => {
      dd.classList.remove(visibleClass);
    })
  })

  // открытие и закрытие меню бургера
  burgerBtn.addEventListener('click', () => {
    burgerMenu.classList.add('burger__menu--visible');
  });

  burgerClose.addEventListener('click', () => {
    burgerMenu.classList.remove('burger__menu--visible');
  });


  // простой аккордион в выпадающем меню
  dropdownHeadings.forEach(heading => {
    heading.addEventListener('click', () => {
      dropdownHeadings.forEach(item => {
        item.classList.remove('dropdown-heading-is-opened');
      });
      headerDropdownsLists.forEach(item => {
        if (heading.contains(item)) {
          item.classList.add('dropdown-list--visible');
        } else {
          item.classList.remove('dropdown-list--visible');
        }
      });

      heading.classList.add('dropdown-heading-is-opened');
    });
  });

  window.addEventListener('resize', () => {
    widthCheck();
  });

});
