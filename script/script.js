document.addEventListener(('DOMContentLoaded'), () => {
   'use strict';
 
   // выбираем элементы HTML страницы
   const customer = document.getElementById('customer'),
        freelancer = document.getElementById('freelancer'),
        blockCustomer = document.getElementById('block-customer'),
        blockFreelance = document.getElementById('block-freelancer'),
        blockChoice = document.getElementById('block-choice'),
        btnExit = document.getElementById('btn-exit'),
        formCustomer = document.getElementById('form-customer'),
        ordersTable = document.getElementById('orders'),
        modalOrder = document.getElementById('order_read'),
        modalOrderActive = document.getElementById('order_active'),
        modalClose = document.querySelector('.close');

      const orders = JSON.parse(localStorage.getItem('freeOrders')) || [];
      console.log('orders: ', orders);

      // описываем функции 
      const toStorage = () => {
        localStorage.setItem('freeOrders', JSON.stringify(orders));
      };


      const calcDeadline = (deadline) => {
        const deadlineArray = deadline.match(/(\d{4})-(\d{2})-(\d{2})/);
        // вычисляем количество миллисекунд до дедлана по временной зоне UTC 
        const deadLineTime = Date.UTC(deadlineArray[1], deadlineArray[2] - 1, deadlineArray[3]);
        // вычисляем количество миллисекунд до текущей даты по временной зоне UTC 
        const dateNow = Date.now();
        // находим разность и переводим её в дни
        var dayNumber = Math.ceil((deadLineTime - dateNow) / (1000 * 60 * 60 * 24));
        // функция склонения падежей
        const num2str = (n, textForms) => {
          n = Math.abs(n) % 100;
          var n1 = n % 10;
    
          if (n > 10 && n < 20) { return textForms[2]; }
          if (n1 > 1 && n1 < 5) { return textForms[1]; }
          if (n1 == 1) { return textForms[0]; }
          return textForms[2];
        };
        const textForms = ['день', 'дня', 'дней'];
        const textForm = num2str(dayNumber, textForms);
        const day = `${dayNumber} ${textForm}`;
        // console.log('До выполнения этого заказа осталось  ', day);
        return day;
      };

      //  ренериг строк таблиц со всми заказами 
      const renderOrders = () => {
          ordersTable.textContent = '';
          orders.forEach((order, i) => {

                ordersTable.innerHTML += `
                <tr class="order ${order.active ? 'taken' : ''}" 
                data-number-order="${i}">
                    <td>${i+1}</td>
                    <td>${order.title}</td>
                    <td class="${order.currency}"></td>
                    <td>${calcDeadline(order.deadline)}</td>
                </tr>`;  
        
        });   
    };

        // обработчик кликов в модальном окне 
        const handlerModal = (event) => {
          const target = event.target; // элемкнт по которому кликнули  
          const modal = target.closest('.order-modal'); // все модальное окно 
          const order = orders[modal.id]; // текущий заказ 

          // создаем функцию, чтобы избежать дублирование кода
          const baseAction = () => {
            modal.style.display = 'none';
            toStorage(); // запись заказов в localStorage
            renderOrders(); // обновление таблицы заказов
          };
          // закрываем модальное окно 
          if (target.closest('.close') || target === modal) {
            modal.style.display = 'none';
          }
          // подтверждаем выбор заказа 
          if (target.classList.contains('get-order')) {
            order.active = true;
            baseAction();
          }
          // отказываемся от выбраного заказа 
          if (target.id ==='capitulation') {
            order.active = false;
            baseAction();
          }
          // удаляем заказ
          if (target.id === 'ready') { 
            orders.splice(orders.indexOf(order), 1);
            baseAction();
          }
        };
      

        const openModal = (numberOrder) => {
            const order = orders[numberOrder];
            
            //console.log(order);

            const { title, firstName, email, phone, description, amount, currency, deadline, active = false } = order;
            console.log('deadline', deadline);

            const modal = active ? modalOrderActive : modalOrder;

            const firstNameBlock = modal.querySelector('.firstName'),
                titleBlock = modal.querySelector('.modal-title'),
                emailBlock = modal.querySelector('.email'),
                descriptionBlock = modal.querySelector('.description'),
                deadlineBlock = modal.querySelector('.deadline'),
                currencyBlock =modal.querySelector('.currency_img'),
                countBlock = modal.querySelector('.count'),
                phoneBlock = modal.querySelector('.phone');

                modal.id = numberOrder;
                titleBlock.textContent = title;
                firstNameBlock.textContent = firstName;
                emailBlock.textContent = email;
                emailBlock.href = 'mailto:' + email;
                descriptionBlock.textContent = description;
                deadlineBlock.textContent = calcDeadline(deadline);
                currencyBlock.className = 'currency_img';
                currencyBlock.classList.add(currency);
                countBlock.textContent = amount;

                phoneBlock && (phoneBlock.href = 'tel:' + phone);
            
            modal.style.display = 'flex'; 

            modal.addEventListener('click', handlerModal);
        };

    ordersTable.addEventListener('click', (event) => {
        const target = event.target;
        console.log('target: ', target);

        const targetOrder = target.closest('.order');
        if(targetOrder) {
            openModal(targetOrder.dataset.numberOrder);
        }

    });

        modalClose.addEventListener('click', (event) => {
            const currentModal = event.target.closest('.modal');
            currentModal.style.display = 'none';
        });

   // назначаем обработчики
   customer.addEventListener('click', () => {
     blockChoice.style.display = 'none';
     blockCustomer.style.display = 'block';
     btnExit.style.display = ' block';
   });

   freelancer.addEventListener('click', () => {
     blockChoice.style.display = 'none';
     renderOrders();
     blockFreelance.style.display = 'block';
     btnExit.style.display = ' block';
   });

   btnExit.addEventListener('click', () => {
     btnExit.style.display = 'none';
     blockFreelance.style.display = 'none';
     blockCustomer.style.display = 'none';
     blockChoice.style.display = 'block';
   });
 
   formCustomer.addEventListener('submit', () => {
     event.preventDefault();
 
     const fieldsFilter = (elem) => {
       const rez = (elem.tagName === 'INPUT' && elem.type !== 'radio')
         | (elem.type === 'radio' && elem.checked)
         | (elem.tagName === 'TEXTAREA');
       return rez;
     };
     const formElements = [...formCustomer.elements].filter(fieldsFilter);
 
     const obj = {};
     formElements.forEach(elem => obj[elem.name] = elem.value
     );
 
     orders.push(obj); // обовляем новый заказ 

     formCustomer.reset(); // очистка формы

     // обавка заказов locaStorage
     toStorage();
   });
});   //end DOMContentLoaded