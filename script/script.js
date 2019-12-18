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

   const orders = [];


    const renderOrders = () => {

        ordersTable.textContent = '';

        orders.forEach((order, i) => {
                ordersTable.innerHTML += `
                <tr class="order ${order.active ? 'taken' : ''}" 
                data-number-order="${i}">
                    <td>${i+1}</td>
                    <td>${order.title}</td>
                    <td class="${order.currency}"></td>
                    <td>${order.deadline}</td>
                </tr>`;  
        
        });   
    };

        const handlerModal = (event) => {
          const target = event.target;
          const modal = target.closest('.order-modal');
          const order = orders[modal.id];

          if (target.closest('.close ') || target === modal) {
            modal.style.display = 'none';
          }

          if (target.classList.contains('get-order')) {
            order.active = true;
          }

          if (target.id ==='capitulation') {
            order.active = false;
            modal.style.display = 'none';
            renderOrders();
          }

          if (target.id === 'ready') { 
            order.splice(orders.indexOf(order), 1);
            modal.style.display = 'none';
            renderOrders();
          }
        };
      

        const openModal = (numberOrder) => {
            const order = orders[numberOrder];
            
            //console.log(order);

            const { title, firstName, email, phone, description, amount, currency, deadline, active = false } = order;

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
                deadlineBlock.textContent = deadline;
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
 
     orders.push(obj);

     formCustomer.reset(); // очистка формы
   });
});   //end DOMContentLoaded