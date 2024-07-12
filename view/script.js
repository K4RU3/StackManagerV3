const networkdata = {
    yourname: "user1",
    date: ["日付", "1/2", "1/3", "1/4", "1/5", "1/8", "1/9"],
    data: [
        ["user1", "0:1000:0", "0:3000:0", "1:1000:0", "1:1000:1000", "1:2000:0", "1:3000:0"],
        ["user2", "0:1000:0", "0:500:0", "0:1000:1000", "0:1500:1000", "0:2000:0", "0:1500:0"]

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
        data.data.length !== 0 &&
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

function setData(id, data, unit){
    document.querySelector("#" + id + ">h2").innerHTML = convertUnit(unit, data)
}

function setNetworkData(data){
    verifData(data)
    const yourdata = data.data.find(v=>v[0] === data.yourname).slice(1).map(v=>convertStack(v))
    const ranking = data.data.map(v=>{
        let stack = convertStack(v[v.length - 1])
        return {name: v[0]+(star.repeat(stack[0])), stack: stack}
    })
    ranking.sort((a, b)=>b.stack[1] - a.stack[1])
    const converted = yourdata[yourdata.length - 1]

    const transition = new Chart(document.querySelector("#transition"), {
        type: "line",
        data: {
            labels: data.date.slice(1),
            datasets: data.data.map(v=>{
                return {
                    label: v[0],
                    data: v.slice(1).map(e=>convertStack(e)[1])
                }
            })
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    })

    const ratio = new Chart(document.querySelector("#ratio"), {
        type: "pie",
        data: {
            labels: ranking.map(v=>v.name),
            datasets: [
                {
                    label: "",
                    data: ranking.map(v=>v.stack[1])
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    })

    setData("stack", converted[1], dollar)
    setData("star", converted[0], star)
    setData("debt", converted[2], "-"+dollar)
    setData("average", ranking.reduce((acc, crr)=>acc + crr.stack[1], 0) / ranking.length, dollar)
    setData("median", ranking.length%2?ranking[Math.floor(ranking.length/2)].stack[1]:(ranking[ranking.length/2].stack[1]+ranking[ranking.length/2-1].stack[1])/2, dollar)
    setData("maximum", ranking[0].stack[1], dollar)
    setData("minimum", ranking[ranking.length-1].stack[1], dollar)
    if(yourdata.length > 1){
        const diff = yourdata[yourdata.length - 1][1] - yourdata[yourdata.length - 2][1]
        const con = diff>=0
        document.querySelector("#stack > h2").innerHTML += `<span> ${con?"+":"-"}${convertUnit(dollar, diff)}</span>`
        document.querySelector("#stack > h2 > span").classList.add(con?"up":"down")
    }
    
    const rankingChart = new Chart(document.querySelector("#rankingChart"), {
        type: "bar",
        data: {
            labels: ranking.map(v=>v.name).slice(0,5),
            datasets: [{
                label: 'ランキングTop5',
                data: ranking.map(v=>v.stack[1]).slice(0,5),
                backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
        }
    })
}

setNetworkData(networkdata)

