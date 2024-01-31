const createPeopleContainer = function () {
    const $peopleContainer = $('<div></div>')
    $peopleContainer.addClass("people-container");

    const $clickable = $('<div>Show All People</div>');
    $clickable.addClass("clickable");
    $clickable.on('click', () => {
        $peopleContainer.remove();
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

    $("body").append($peopleContainer);
    $("body").append($clickable);
}

const createBakedGoodsContainer = function () {
    const $bakedGoodsContainer = $('<div>This is the bakedGoodsContainer</div>')
    $bakedGoodsContainer.addClass("bg-container");

    const $clickable = $('<div>Show All Baked Goods</div>')
    $clickable.addClass("clickable");
    $clickable.on('click', () => {
        $bakedGoodsContainer.remove();
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

    $("body").append($bakedGoodsContainer);
    $("body").append($clickable);
}

//show all people in person table
const showPeople = function (people) {

    for (let person of people) {
        //create personDiv container to append later
        const $personDiv = $(`<div>${person.person_name}</div>`);
        $personDiv.addClass("container");
        //append #personDiv to people container
        $("body").append($personDiv);
    }
}

//show all baked goods in baked_goods table
const showBakedGoods = function (baked_goods) {

    for (let baked_good of baked_goods) {
        const $bgDiv = $(`<div>${baked_good.baked_goods_name}: ${baked_good.baked_goods_price} copper</div>`);
        $bgDiv.addClass("container");
        $("body").append($bgDiv);
    }
}

createPeopleContainer();
createBakedGoodsContainer();

