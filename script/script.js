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
                <tr class="order" data-number-order="${i}">
                    <td>${i+1}</td>
                    <td>${order.title}</td>
                    <td class="${order.currency}"></td>
                    <td>${order.deadline}</td>
                </tr>`;  
        
        });   
    };

        const openModal = (numberOrder) => {
            const order = orders[numberOrder];
            const modal = order.active ? modalOrderActive : modalOrder;
            
            const firstNameBlock = document.querySelector('.firstName'),
                titleBlock = document.querySelector('.modal-title'),
                emailBlock = document.querySelector('.email'),
                descriptionBlock = document.querySelector('.description'),
                deadlineBlock = document.querySelector('.deadline'),
                currencyBlock =document.querySelector('.currency_img'),
                countBlock = document.querySelector('.count'),
                phoneBlock = document.querySelector('.phone');

                titleBlock.textContent = order.title;
                firstNameBlock.textContent = order.firstName;
                emailBlock.textContent = order.email;
                emailBlock.setAttribute('href', `mailto: ${order.email}`);
                descriptionBlock.textContent = order.description;
                deadlineBlock.textContent = order.deadline;
                currencyBlock.classList = order.currency;
                countBlock.textContent = order.amount;
                phoneBlock.textContent = order.phone;
                phoneBlock.setAttribute('href', `tel: ${order.phone}`);
            
            modal.style.display = 'block'; 
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

 }); //end DOMContentLoaded