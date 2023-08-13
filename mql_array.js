db.sales.findOne({
    customer: { gender: 'F', age: 39, email: 'beecho@wic.be', satisfaction: 3 },
})

db.sales.findOne(
    {"customer.email" : "beecho@wic.be"}
)

db.sales.findOne({
    "customer.age" : {$lt:20}
})

db.inventory.insertMany([
    { item: "journal", qty: 25, tags: ["blank", "red"], dim_cm: [ 14, 21 ] },
    { item: "notebook", qty: 50, tags: ["red", "blank"], dim_cm: [ 14, 21 ] },
    { item: "paper", qty: 100, tags: ["red", "blank", "plain"], dim_cm: [ 14, 21 ] },
    { item: "planner", qty: 75, tags: ["blank", "red"], dim_cm: [ 22.85, 30 ] },
    { item: "postcard", qty: 45, tags: ["blue"], dim_cm: [ 10, 15.25 ] },
    { item: "postcard", qty: 45, tags: ["blue"], dim_cm: [ 13, 14 ] }
 ]);

 db.inventory.find({
    tags: ['red', 'blank']
 })

 db.inventory.find({
    tags: {$all : ['red', 'blank']}
 }) // and 조건

 db.inventory.find({
    tags: {$in : ['red', 'blank']}
 }) // or 조건

 db.inventory.find({
    tags: 'blue'
 })

 db.inventory.find({
    dim_cm: {$gt:15}
 })

 db.inventory.find({
    dim_cm: {$gt:15, $lt: 20}
 }) // -> between이 아님, 범위의 밖에 있는 애들을 조회함
    // 15보다 큰 조건과 20보다 작은 조건 둘다에 만족시키니 이상한 값 나옴

 db.inventory.find({
    dim_cm: {$elemMatch: {$gt: 15, $lt: 20}}
 })

 db.inventory.find({
    "dim_cm.1": {$lt: 20}
 }) // 인덱스요소로

 db.inventory.find({
    tags: {$size: 3}
 })

 db.sales.find({
    "items.name" : 'binder',
    "items.quantity": {$lte: 6}
 }) // elemMatch를 사용해야함

db.sales.find({
    items: {
        $elemMatch: {
            name: "binder",
            quantity: {$lte: 6}
        }
    }
})

db.sales.find(
    {
        items: {
            $elemMatch: {
                name: "binder",
                quantity: {$lte: 6}
            }
        },
        {
            slaeDate: 1,
            "items.$": 1,
            storeLocation: 1,
            customer: 1
        }
    }
)