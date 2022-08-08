"use strict";


// Массив из БД (вероятная структура из полученного Json)
const ingredients_bd = {
    // Булочки
    catBun: {
        name: 'Булочка',
        bigBun: {
            id: "bigBun",
            name: 'Большая булка',
            price: 100,
            calories: 40,
        },
        smallBun: {
            id: "smallBun",
            name: 'Маленькая булка',
            price: 50,
            calories: 20,
        },
    },

    catStaffing: {
        name: 'Начинка',
        cheese: {
            id: 'cheese',
            name: 'Начинка с сыром',
            price: 10,
            calories: 20,
        },
        salad: {
            id: 'salad',
            name: 'Начинка с салатом',
            price: 20,
            calories: 5,
        },
        potato: {
            id: 'potato',
            name: 'Начинка с картофелем',
            price: 15,
            calories: 10,
        },
    },

    catTopping: {
        name: 'Добавка',
        spice: {
            id: 'spice',
            name: 'Посыпка приправой',
            price: 15,
            calories: 0,
        },
        mayonnaise: {
            id: 'mayonnaise',
            name: 'Добавить майонез',
            price: 20,
            calories: 5,
        },
    },
}


// Основной класс-конструктор гамбургера
class Hamburger {
    constructor(size_bun = 'bigBun', stuffing = 'cheese') {
        this.size_bun = ingredients_bd.catBun[size_bun];
        this.stuffing = ingredients_bd.catStaffing[stuffing];
        this.topping = {};

    }
    // метод изменяет булочку
    changeBun(size_bun) {
        this.size_bun = ingredients_bd.catBun[size_bun];
    }
    // метод изменяет начинку
    changeStuffing(stuffing) {
        this.stuffing = ingredients_bd.catStaffing[stuffing];
    }

    addTopping(topping) {
        // если добавка добавлена, то ничего не делаем
        if (!(topping in this.topping)) {
            this.topping[topping] = ingredients_bd.catTopping[topping];
        }
    }

    deleteTopping(topping = 'all_del') {
        // Обработка запроса на удаление всех добавок
        if (topping == 'all_del') {
            this.topping = {};
        }
        else {
            // удалим добавку, которая больше не нужна
            delete this.topping[topping];
        }
    }

    // Получить размер булочки
    getSizeBun() {
        return this.size_bun.name;
    }

    // Добавки хранятся в отдельном массиве, поэтому по ним суммируем отдельно 
    calculateToppPrice() {
        let toppPrice = 0
        for (let item in this.topping) {
            toppPrice += this.topping[item].price;
        }
        return toppPrice;
    }

    calculateToppCalories() {
        let toppCalories = 0
        for (let item in this.topping) {
            toppCalories += this.topping[item].calories;
        }
        return toppCalories;
    }


    // Расчет общей суммы заказа
    calculatePrice() {
        let bunPrice = this.size_bun.price;
        let stuffPrice = this.stuffing.price;
        return bunPrice + stuffPrice + this.calculateToppPrice();
    }

    // Расчет общей суммы калорий в заказе
    calculateCalories() {
        let bunCalories = this.size_bun.calories;
        let stuffCalories = this.stuffing.calories;
        return bunCalories + stuffCalories + this.calculateToppCalories();
    }
}


// Рендер класса в левую область для отследивания состояния класса
const renderDiv = document.querySelector('.render_from_class')

class renderClass {
    constructor(myClass) {
        this.renderClass = myClass;
    }

    getJson(object) {
        return JSON.stringify(object, null, 4);
    }

    render() {
        renderDiv.innerHTML = `
            <b>const myHamburger = new Hamburger()<b>
            <br>
            <code>
            ${this.getJson(this.renderClass)};
            </code>
            <br><br>
            <b>Результат из метода calculatePrice:<b>
            ${this.getJson(this.renderClass.calculatePrice())}
            <br>
            <b>Результат из метода calculateCalories:<b>
            ${this.getJson(this.renderClass.calculateCalories())}
        `;
    }
}

// ------- Выводим данные ----------

// Общие итоги
function viewTotal() {
    const total_cost = document.querySelector('.total_cost');
    total_cost.innerHTML = `${myHamburger.calculatePrice()} `;
    const total_calories = document.querySelector('.total_calories');
    total_calories.innerHTML = `${myHamburger.calculateCalories()} `;
    // сюда добавим ренедринг данных из исходного класса
    myRender.render();
}



// Обрабатываем события выбора булочки
const btnsBunCheck = document.querySelectorAll('.user-check-bun');

function checkBun(id) {
    myHamburger.changeBun(id);
    const bun_cost = document.querySelector('.bun_cost');
    bun_cost.innerHTML = `${myHamburger.size_bun.price} `;
    const bun_calories = document.querySelector('.bun_calories');
    bun_calories.innerHTML = `${myHamburger.size_bun.calories} `;
    viewTotal();
}

btnsBunCheck.forEach(btn => btn.addEventListener('click', (btn) => checkBun(btn.target.id)));


// --- Обрабатываем события выбора начинки
const btnsStuffCheck = document.querySelectorAll('.user-check-staffing');

function checkStuff(id) {
    myHamburger.changeStuffing(id);
    const stuffing_cost = document.querySelector('.stuffing_cost');
    stuffing_cost.innerHTML = `${myHamburger.stuffing.price} `;
    const stuffing_calories = document.querySelector('.stuffing_calories');
    stuffing_calories.innerHTML = `${myHamburger.stuffing.calories} `;
    viewTotal();
}

btnsStuffCheck.forEach(btn => btn.addEventListener('click', (btn) => checkStuff(btn.target.id)));


// --- Обрабатываем события выбора добавки
const btnsToppCheck = document.querySelectorAll('.user-check-topp');

function checkTopp(check_el) {
    console.log(check_el.id);
    // Удаляем все добавки
    if (check_el.id == 'all_del') {
        console.log('Удалить все добавки');
        myHamburger.deleteTopping('all_del');
        btnsToppCheck.forEach(btn => btn.checked = false);
    }

    // Добавляем добавки в класс
    if (check_el.checked) {
        myHamburger.addTopping(check_el.id);
    } else {
        myHamburger.deleteTopping(check_el.id);
    }
    // Отображаем результаты на странице
    const topping_cost = document.querySelector('.topping_cost');
    topping_cost.innerHTML = `${myHamburger.calculateToppPrice()} `;
    const topping_calories = document.querySelector('.topping_calories');
    topping_calories.innerHTML = `${myHamburger.calculateToppCalories()} `;
    viewTotal();
}

btnsToppCheck.forEach(btn => btn.addEventListener('click', (btn) => checkTopp(btn.target)));


// ----  Установим исходные параметры в классе при открытии страницы
const myHamburger = new Hamburger();
const myRender = new renderClass(myHamburger);
checkBun('bigBun');
checkStuff('cheese');
checkTopp('all_del');
viewTotal();
