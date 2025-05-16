function openServicesMenu(url) {
    const searchInput = document.getElementById("serviceSearch");
    if (searchInput) {
      searchInput.value = "";
      filterServices();
    }
    if (document.getElementById('servicesList_section').classList.contains('none')) {
      document.getElementById('servicesList_section').classList.remove('none');
      document.getElementById('servicesList_section').classList.add('block');
      document.body.style.height = '100vh';
      document.body.style.overflowY = 'hidden';
    }
    else {
      document.getElementById('servicesList_section').classList.add('none');
      document.getElementById('servicesList_section').classList.remove('block');
      document.body.style.height = '100%';
      document.body.style.overflowY = 'visible';
    }
  }
  
  function openMobileServices(url) {
    document.getElementById('mobileServiceContainer').style.left = "0%";
    document.body.classList.add('no-scroll');
  }
  
  function closeMobileServices(url) {
    document.getElementById('mobileServiceContainer').style.left = "100%";
    document.body.classList.remove('no-scroll');
    const searchInput = document.getElementById("mobileServiceSearch");
    if (searchInput) {
      searchInput.value = "";
      filterMobileServices();
    }
  }
  
  function openMenu() {
    document.getElementById('mobileNav').style.left = "0%";
    document.body.style.height = '100vh';
      document.body.style.overflowY = 'hidden';
  }
  
  function closeMenu(url) {
    document.getElementById('mobileNav').style.left = "100%";
    document.body.style.height = '100%';
      document.body.style.overflowY = 'visible';
  }
  
  
  function filterServices() {
    const searchQuery = document.getElementById('serviceSearch').value.toLowerCase();
    const categories = document.querySelectorAll('.servicecategory');
  
    categories.forEach((category) => {
        const services = category.querySelectorAll('.serviceList_style');
        let hasVisibleServices = false;
  
        services.forEach((service) => {
            const serviceName = service.querySelector('.serviceList_name').textContent.toLowerCase();
            if (serviceName.includes(searchQuery)) {
                service.style.display = 'block';
                hasVisibleServices = true;
            } else {
                service.style.display = 'none';
            }
        });
        if (hasVisibleServices) {
            category.style.display = 'block';
        } else {
            category.style.display = 'none';
        }
    });
  }
  
  function filterMobileServices() {
    const searchQuery = document.getElementById('mobileServiceSearch').value.toLowerCase();
    const categories = document.querySelectorAll('.servicecategory');
  
    categories.forEach((category) => {
        const services = category.querySelectorAll('.serviceList_style');
        let hasVisibleServices = false;
  
        services.forEach((service) => {
            const serviceName = service.querySelector('.serviceList_name').textContent.toLowerCase();
            if (serviceName.includes(searchQuery)) {
                service.style.display = 'block';
                hasVisibleServices = true;
            } else {
                service.style.display = 'none';
            }
        });
        if (hasVisibleServices) {
            category.style.display = 'block';
        } else {
            category.style.display = 'none';
        }
    });
  }