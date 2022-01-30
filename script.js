'use strict';

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000.32, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-04-22T23:36:17.929Z',
    '2022-01-26T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE', // 
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210.32, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2022-01-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

//______Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


//______Functions

const currencies = new Map([
  ['USD', '$'],
  ['EUR', '€'],
  ['GBP', '£'],
]);

const transfers = new Map([
  ['USDEUR', 0.9],
  ['USDGBP', 0.75],
  ['EURUSD', 1.1],
  ['EURGBP', 0.8],
  ['GBPEUR', 1.2],
  ['GBPUSD', 1,3]
])

//______Update balance and display movements

const update = function(mov, cur,movD){
  calcDisplayBalance(mov, cur, movD)
  displayMovements(mov, cur, movD);
  calcDisplaySum(mov, cur, user.interestRate)
}

//______Calculate a date passed

const datePassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)

const dateFormatter = function(date, options){
  return new Intl.DateTimeFormat(
    user.locale,
    options
  ).format(date)
}

const numberFormatter = function(number, options){
  return new Intl.NumberFormat(user.locale, options).format(number)
}

//______Display Movements

const displayMovements = function (movements,currency,movD, sort = false) {
  containerMovements.innerHTML = '';

  const mov2 = movements.slice()

  movements = sort ? movements.slice().sort((a,b) => a-b) : movements
  movD = sort ? sortD(movD) : movD

  function sortD (movD){

    const sorted = []

    movements.forEach(mov => sorted.push(movD[mov2.indexOf(mov)]))
    
    return sorted
  }

  movements.forEach(function (mov, i) {

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    let date = new Date(movD[i])
    const now = new Date(Date())

    const passed = Math.round(datePassed(
      Date.parse(date.toISOString()),
      Date.parse(now.toISOString())
      )
    )

    const optionsDate = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }
  
    const a = dateFormatter(date, optionsDate)


    const d = passed === 0 ? `Today`: passed === 1? 'Yesterday': passed <= 7 ? `${passed} days ago` : `${a}`
    

    
    const optionsNumber = {
      style: 'currency',
      currency: currency
    }
    
    mov = numberFormatter(mov, optionsNumber)

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i} ${type}</div>
      <div class="movements__value">
        <p class="value">${mov}</p>
        <p class="movements__date">${d}</p>
      </div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//______Create usernames for all accounts

const createUserNames = function (accs){
  accs.forEach(function (account) {
    account.username = account.owner
    .toLowerCase()
    .split(' ')
    .map(t => t[0])
    .join('')
    return account.username
  })
}


//______Calculate and display balance

const calcDisplayBalance = function (movements,currency) {
  user.balance = movements.reduce((acc, curr) => acc + curr, 0)
  
  const optionsNumber = {
    style: 'currency',
    currency: currency
  }
  let balance = user.balance
  
  console.log(balance)
  
  balance = numberFormatter(balance, optionsNumber)
  labelBalance.textContent = `${balance}`

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }

  const date = new Date(Date())
  const d = dateFormatter(date, options)

  labelDate.textContent = d
}
//______Calculate and display summary

const calcDisplaySum = function (movements, currency, i){
  
  const optionsNumber = {
    style: 'currency',
    currency: currency
  }

  const incomes = movements
    .filter(movement => movement > 0)
    .reduce((acc, curr) => acc + curr)
  const inc = numberFormatter(incomes, optionsNumber)
  labelSumIn.textContent = `${inc} `

  const out = Math.abs(movements
    .filter(movement => movement < 0)
    .reduce((acc, curr) => acc + curr))
  const o = numberFormatter(out, optionsNumber)
  labelSumOut.textContent = `${o} `

  const interest = movements
    .filter(movement => movement > 0)
    .map(dep => (dep * i)/100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0)
  const intRest = numberFormatter(interest.toFixed(2), optionsNumber)
  labelSumInterest.textContent = `${intRest}`
}

//______Transfer cash to other account

const transfer = function(user, username, amount){
  const recipient = accounts.find(acc => acc.username === username)
  console.log(recipient)
  if(recipient){
    console.log(user.balance)
    if(amount <= user.balance){
      console.log(amount)
      recipient.movements.push(Math.round(amount*transfers.get(`${user.currency}${recipient.currency}`)))
      recipient.movementsDates.push(new Date().toISOString())
      user.movements.push(amount*-1)
      user.movementsDates.push(new Date().toISOString())
      update(user.movements, user.currency, user.movementsDates)
    }
  }
  
}

//______Take a loan

const takeLoan = function (user, amount){
  user.movements.push(amount)
  user.movementsDates.push(new Date().toISOString())
  update(user.movements, user.currency, user.movementsDates)
}

//______Log in

const login = function(user) {
  containerApp.style.display = 'grid'
  setTimeout(() => containerApp.style.opacity = 100,30)
  
  const movements = user.movements
  const currency = user.currency
  const interestRate = user.interestRate
  
  sorted = true
  
  if(timer) clearInterval(timer)
  timer = startLogOutTimer()

  update(movements, currency, user.movementsDates)
  calcDisplaySum(movements, currency, interestRate)
}

createUserNames(accounts)
let userNames = accounts.map(acc => acc.username)
let user, timer;
let sorted = true


//______Log Out
const logOut = function(user) {
  setTimeout(() => containerApp.style.display = 'none',3000)
  containerApp.style.opacity = 0
}

const startLogOutTimer = function() {
  let time = 5 * 60
  
  const tick = function() {
    const min = String(Math.trunc(time / 60)).padStart(2,0)
    const sec = String(time % 60).padStart(2,0)
    labelTimer.textContent = `${min}:${sec}`
    time--
    if(time === 0){
      labelWelcome.textContent = 'Log in to get started'
      clearInterval(timer)
      logOut()
    }
  }
  tick()
  const timer = setInterval(tick, 1000)
  
  return timer
}

//______Buttons Listeners

btnLogin.addEventListener('click', function (e){
  e.preventDefault()

  const username = inputLoginUsername.value
  const pin = inputLoginPin.value

  user = accounts.find(user => user.username === username)

  if(user?.pin === Number(pin)){
    labelWelcome.textContent = `Welcome again ${user.owner}`
    login(user)
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur()
  }
})

btnTransfer.addEventListener('click', function(e){
  e.preventDefault()

  const username = inputTransferTo.value
  const amount = Number(inputTransferAmount.value)

  transfer(user, username, amount)

  inputTransferTo.value = inputTransferAmount.value = ''
  
  clearInterval(timer);
  timer = startLogOutTimer()
})

btnLoan.addEventListener('click', function (e){
  e.preventDefault()

  const amount = Number(inputLoanAmount.value)

  if(amount > 0 && user.movements.some(mov => mov >= amount * 0.1)){
    takeLoan(user, amount)
  }
  inputLoanAmount.value = ''
})

btnClose.addEventListener('click', function (e){
  e.preventDefault()

  const username = inputCloseUsername.value
  const pin = Number(inputClosePin.value)

  inputCloseUsername.value = inputClosePin.value = ''

  if(user.username === username && user.pin === pin){

    const i = accounts.indexOf(user)

    accounts.splice(i,1)
    containerApp.style.opacity = 0
  }
})


btnSort.addEventListener('click', function (){
  if(!sorted){
    displayMovements(user.movements,user.currency, user.movementsDates, sorted)
  }else{
    displayMovements(user.movements,user.currency, user.movementsDates, sorted)
  }
  sorted = !sorted
})