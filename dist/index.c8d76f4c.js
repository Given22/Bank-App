"use strict";const account1={owner:"Jonas Schmedtmann",movements:[200,455.23,-306.5,25000.32,-642.21,-133.9,79.97,1300],interestRate:1.2,pin:1111,movementsDates:["2019-11-18T21:31:17.178Z","2019-12-23T07:42:02.383Z","2020-01-28T09:15:04.904Z","2020-04-01T10:17:24.185Z","2020-05-08T14:11:59.604Z","2020-05-27T17:01:17.194Z","2021-04-22T23:36:17.929Z","2022-01-26T10:51:36.790Z"],currency:"EUR",locale:"de-DE"},account2={owner:"Jessica Davis",movements:[5e3,3400,-150,-790,-3210.32,-1e3,8500,-30],interestRate:1.5,pin:2222,movementsDates:["2019-11-01T13:15:33.035Z","2019-11-30T09:48:16.867Z","2019-12-25T06:04:23.907Z","2020-01-25T14:18:46.235Z","2020-02-05T16:33:06.386Z","2020-04-10T14:43:26.374Z","2020-06-25T18:49:59.371Z","2022-01-26T12:01:20.894Z"],currency:"USD",locale:"en-US"},accounts=[account1,account2],labelWelcome=document.querySelector(".welcome"),labelDate=document.querySelector(".date"),labelBalance=document.querySelector(".balance__value"),labelSumIn=document.querySelector(".summary__value--in"),labelSumOut=document.querySelector(".summary__value--out"),labelSumInterest=document.querySelector(".summary__value--interest"),labelTimer=document.querySelector(".timer"),containerApp=document.querySelector(".app"),containerMovements=document.querySelector(".movements"),btnLogin=document.querySelector(".login__btn"),btnTransfer=document.querySelector(".form__btn--transfer"),btnLoan=document.querySelector(".form__btn--loan"),btnClose=document.querySelector(".form__btn--close"),btnSort=document.querySelector(".btn--sort"),inputLoginUsername=document.querySelector(".login__input--user"),inputLoginPin=document.querySelector(".login__input--pin"),inputTransferTo=document.querySelector(".form__input--to"),inputTransferAmount=document.querySelector(".form__input--amount"),inputLoanAmount=document.querySelector(".form__input--loan-amount"),inputCloseUsername=document.querySelector(".form__input--user"),inputClosePin=document.querySelector(".form__input--pin"),login__accounts=document.querySelector(".login__accounts"),currencies=new Map([["USD","$"],["EUR","€"],["GBP","£"]]),transfers=new Map([["USDEUR",.9],["USDGBP",.75],["EURUSD",1.1],["EURGBP",.8],["GBPEUR",1.2],["GBPUSD",1,3]]),update=function(e,t,n){calcDisplayBalance(e,t,n),displayMovements(e,t,n),calcDisplaySum(e,t,user.interestRate)},datePassed=(e,t)=>Math.abs(t-e)/864e5,dateFormatter=function(e,t){return new Intl.DateTimeFormat(user.locale,t).format(e)},numberFormatter=function(e,t){return new Intl.NumberFormat(user.locale,t).format(e)},displayMovements=function(e,t,n,r=!1){containerMovements.innerHTML="";const o=e.slice();e=r?e.slice().sort(((e,t)=>e-t)):e,n=r?function(t){const n=[];return e.forEach((e=>n.push(t[o.indexOf(e)]))),n}(n):n,e.forEach((function(e,r){const o=e>0?"deposit":"withdrawal";let a=new Date(n[r]);const u=new Date(Date()),s=Math.round((c=Date.parse(a.toISOString()),i=Date.parse(u.toISOString()),Math.abs(i-c)/864e5));var c,i;const l=dateFormatter(a,{day:"numeric",month:"numeric",year:"numeric"}),m=0===s?"Today":1===s?"Yesterday":s<=7?`${s} days ago`:`${l}`,p=`\n    <div class="movements__row">\n      <div class="movements__type movements__type--${o}">${r} ${o}</div>\n      <div class="movements__value">\n        <p class="value">${e=numberFormatter(e,{style:"currency",currency:t})}</p>\n        <p class="movements__date">${m}</p>\n      </div>\n    </div>\n    `;containerMovements.insertAdjacentHTML("afterbegin",p)}))},createUserNames=function(e){e.forEach((function(e){return e.username=e.owner.toLowerCase().split(" ").map((e=>e[0])).join(""),e.username}))},calcDisplayBalance=function(e,t){user.balance=e.reduce(((e,t)=>e+t),0);const n={style:"currency",currency:t};let r=user.balance;r=numberFormatter(r,n),labelBalance.textContent=`${r}`;const o=new Date(Date()),a=dateFormatter(o,{hour:"numeric",minute:"numeric",day:"numeric",month:"long",year:"numeric"});labelDate.textContent=a},calcDisplaySum=function(e,t,n){const r={style:"currency",currency:t},o=e.filter((e=>e>0)).reduce(((e,t)=>e+t)),a=numberFormatter(o,r);labelSumIn.textContent=`${a} `;const u=Math.abs(e.filter((e=>e<0)).reduce(((e,t)=>e+t))),s=numberFormatter(u,r);labelSumOut.textContent=`${s} `;const c=e.filter((e=>e>0)).map((e=>e*n/100)).filter((e=>e>=1)).reduce(((e,t)=>e+t),0),i=numberFormatter(c.toFixed(2),r);labelSumInterest.textContent=`${i}`},transfer=function(e,t,n){const r=accounts.find((e=>e.username===t));console.log(r),r&&(console.log(e.balance),n<=e.balance&&(console.log(n),r.movements.push(Math.round(n*transfers.get(`${e.currency}${r.currency}`))),r.movementsDates.push((new Date).toISOString()),e.movements.push(-1*n),e.movementsDates.push((new Date).toISOString()),update(e.movements,e.currency,e.movementsDates)))},takeLoan=function(e,t){e.movements.push(t),e.movementsDates.push((new Date).toISOString()),update(e.movements,e.currency,e.movementsDates)},login=function(e){login__accounts.style.display="none",containerApp.style.display="grid",setTimeout((()=>containerApp.style.opacity=100),30);const t=e.movements,n=e.currency,r=e.interestRate;sorted=!0,timer&&clearInterval(timer),timer=startLogOutTimer(),update(t,n,e.movementsDates),calcDisplaySum(t,n,r)};createUserNames(accounts);let user,timer,userNames=accounts.map((e=>e.username)),sorted=!0;const logOut=function(e){setTimeout((()=>containerApp.style.display="none"),3e3),login__accounts.style.display="inline",containerApp.style.opacity=0},startLogOutTimer=function(){let e=300;const t=function(){const t=String(Math.trunc(e/60)).padStart(2,0),r=String(e%60).padStart(2,0);labelTimer.textContent=`${t}:${r}`,e--,0===e&&(labelWelcome.textContent="Log in to get started",clearInterval(n),setTimeout((()=>containerApp.style.display="none"),3e3),login__accounts.style.display="inline",containerApp.style.opacity=0)};t();const n=setInterval(t,1e3);return n};btnLogin.addEventListener("click",(function(e){e.preventDefault();const t=inputLoginUsername.value,n=inputLoginPin.value;user=accounts.find((e=>e.username===t)),(null==user?void 0:user.pin)===Number(n)&&(labelWelcome.textContent=`Welcome again ${user.owner}`,login(user),inputLoginUsername.value=inputLoginPin.value="",inputLoginPin.blur())})),btnTransfer.addEventListener("click",(function(e){e.preventDefault();const t=inputTransferTo.value,n=Number(inputTransferAmount.value);transfer(user,t,n),inputTransferTo.value=inputTransferAmount.value="",clearInterval(timer),timer=startLogOutTimer()})),btnLoan.addEventListener("click",(function(e){e.preventDefault();const t=Number(inputLoanAmount.value);t>0&&user.movements.some((e=>e>=.1*t))&&takeLoan(user,t),inputLoanAmount.value=""})),btnClose.addEventListener("click",(function(e){e.preventDefault();const t=inputCloseUsername.value,n=Number(inputClosePin.value);if(inputCloseUsername.value=inputClosePin.value="",user.username===t&&user.pin===n){const e=accounts.indexOf(user);accounts.splice(e,1),containerApp.style.opacity=0}})),btnSort.addEventListener("click",(function(){displayMovements(user.movements,user.currency,user.movementsDates,sorted),sorted=!sorted}));
//# sourceMappingURL=index.c8d76f4c.js.map
