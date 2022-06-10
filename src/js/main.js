document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.querySelector('.burger__btn');
  const burgerClose = document.querySelector('.burger__menu-close');
  const burgerMenu = document.querySelector('.burger__menu');
  const headerLogo = document.querySelector('.header__logo');
  const headerNav = document.querySelector('.header__nav');
  const headerLinks = document.querySelectorAll('.header__bottom-link');
  const headerDropdowns = document.querySelectorAll('.header__bottom-dropdown');

  // проверка ширины экрана
  function widthCheck() {
    let bodyWidth = document.body.clientWidth;
    let windowWidth = window.innerWidth;

    if (bodyWidth <= 320) {
      burgerMenu.append(headerNav);
    }

    if (bodyWidth > 320) {
      headerLogo.after(headerNav);
    }

    console.log(bodyWidth);
    console.log(windowWidth);
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

      headerDropdowns.forEach(dd => {
        dd.classList.remove(visibleClass);
      });

      const visibleClass = 'dropdown--visible';

      let target = e.target;
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

  headerDropdowns.forEach(dd => {
    const visibleClass = 'dropdown--visible';
    dd.addEventListener('mouseout', () => {
      dd.classList.remove(visibleClass);
    })
  })

  burgerBtn.addEventListener('click', ()=> {
    burgerMenu.classList.add('burger__menu--visible');
  });

  burgerClose.addEventListener('click', () => {
    burgerMenu.classList.remove('burger__menu--visible');
  });

  window.addEventListener('resize', () => {
    widthCheck();
  });

});
