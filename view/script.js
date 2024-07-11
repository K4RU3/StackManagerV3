const networkdata = {
    yourname: "user1",
    date: ["日付", "1/2", "1/3", "1/4", "1/5", "1/8", "1/9"],
    data: [
        ["user1", "0:1000:0", "0:3000:0", "1:1000:0", "1:1000:1000", "1:2000:0", "1:3000:0"],
        ["user2", "0:1000:0", "0:500:0", "0:1000:1000", "0:1500:1000", "0:2000:0", "0:3000:0"]
    ]
}

const dollar = "$", star = "★"

function convertUnit(unit, amount){
    return unit + amount.toLocaleString()
}

function convertStack(data){
    return data.match(/^(\d+):(\d+):(\d+)$/).slice(1).map(v=>parseInt(v))
}

function verifData(data){
    if(!(
        typeof data === "object" &&
        typeof data.yourname === "string" &&
        Array.isArray(data.date) &&
        Array.isArray(data.data) &&
        data.data.every(v=>
            v.every(e => typeof e === "string") &&
            v.slice(1).every(e=>e.match(/^\d+:\d+:\d+$/))
        )
    )){
        alert("通信内容に不備がありました。再読込します。")
        location.reload()
    }
}
verifData(networkdata)

function setData(id, data){
    document.querySelector("#" + id).innerHTML = data
}