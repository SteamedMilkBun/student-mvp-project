const createPeopleContainer = function () {
    const $peopleContainer = $('<div></div>')
    $peopleContainer.addClass("people-container");
    $("body").append($peopleContainer);

    const $clickable = $('<div>Show All People</div>');
    $clickable.addClass("clickable");
    $clickable.on('click', () => {
        
        fetch("person")
        .then((fetchResult) => {
            return fetchResult.json();
        })
        .then((jsonData) => {
            showPeople(jsonData);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500); 
        })
    });

    $("body").append($clickable);
}

const createBakedGoodsContainer = function () {
    const $bakedGoodsContainer = $('<div></div>')
    $bakedGoodsContainer.addClass("bg-container");
    $("body").append($bakedGoodsContainer);

    const $clickable = $('<div>Show All Baked Goods</div>')
    $clickable.addClass("clickable");
    $clickable.on('click', () => {
        fetch("baked_goods")
        .then((fetchResult) => {
            return fetchResult.json();
        })
        .then((jsonData) => {
            showBakedGoods(jsonData);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500); 
        })
    });

    $("body").append($clickable);
}

const showPeople = function (people) {
    $(".people-container").empty();
    for (let person of people) {
        const $personDiv = $(`<div>${person.person_name}</div>`);
        $personDiv.addClass(`person-container ${person.person_name}`);
        $(".people-container").append($personDiv);
    }
    showPerson();
}

const showPerson = function () {
    console.log('f: showPerson');
    $(".person-container").on('click', (event) => {
        const name = event.target.textContent;
        fetch(`person/${name}`)
        .then((result) => {
            return result.json();
        })
        .then((personData) => {
            $moneyDiv = $(`<div>Copper: ${personData.person_money}</div>`);
            console.log(`${personData.person_name}`);
            $(`.${personData.person_name}`).append($moneyDiv); 
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
    })
}

const showBakedGoods = function (baked_goods) {
    $(".bg-container").empty();
    for (let baked_good of baked_goods) {
        const $bgDiv = $(`<div>${baked_good.baked_goods_name}: ${baked_good.baked_goods_price} copper</div>`);
        $bgDiv.addClass("item-container");
        $(".bg-container").append($bgDiv);
    }
}

createPeopleContainer();
createBakedGoodsContainer();

