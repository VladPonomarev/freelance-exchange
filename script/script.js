document.addEventListener('DOMContentLoaded', () => {
   'use strict';
 
   // выбираем элементы HTML страницы
   const customer = document.getElementById('customer');
   const freelancer = document.getElementById('freelancer');
   const blockCustomer = document.getElementById('block-customer');
   const blockFreelance = document.getElementById('block-freelancer');
   const blockChoice = document.getElementById('block-choice');
   const btnExit = document.getElementById('btn-exit');
   const formCustomer = document.getElementById('form-customer');
 
   const orders = [];
 
   // назначаем обработчики
   customer.addEventListener('click', () => {
     blockChoice.style.display = 'none';
     blockCustomer.style.display = 'block';
     btnExit.style.display = ' block';
   });
   freelancer.addEventListener('click', () => {
     blockChoice.style.display = 'none';
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
         || (elem.type === 'radio' && elem.checked)
         || (elem.tagName === 'TEXTAREA');
       return rez;
     };
     const formElements = [...formCustomer.elements].filter(fieldsFilter);
 
     const obj = {};
     formElements.forEach(elem => obj[elem.name] = elem.value
     );
 
     orders.push(obj);
     console.log('orders: ', orders);
 
     formCustomer.reset(); // очистка формы
 
   });
 
   
 
 
 
 }); // end DOMContentLoaded