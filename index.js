let form = document.forms.todo
let inp = form.querySelector('input')
let cont = document.querySelector('.container')
let base_url = "http://localhost:7777"

function getAllData() {
    fetch(`${base_url}/todos`)
        .then(res => res.json())
        .then(data => {
            reload(data, cont)
        })
}
getAllData()

form.onsubmit = (e) => {
    e.preventDefault();

    // stop if inp is empty
    if (!inp.value) return
    // stop if inp is empty

    let todo = {
        id: Math.random(),
        isDone: false,
        time: "19:00",
        task: inp.value
    }

    fetch(base_url + "/todos", {
            method: "post",
            body: JSON.stringify(todo),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            getAllData()
        })

}

function reload(arr, place) {
    place.innerHTML = ""

    for (let item of arr) {
        place.innerHTML += `
            <div class="item" id="${item.id}" >
                <div class="top" >
                    <span>${item.task}</span>
                    <button class="del" >x</button>
                    <button class="edit" >edit</button>
                </div>
                <span class="time">${item.time}</span>
            </div>
        `
    }

    let items = document.querySelectorAll('.item')

    items.forEach(el => {
        let del = el.querySelector('.del')
        let edit = el.querySelector('.edit')

        del.onclick = () => {
            fetch(`${base_url}/todos/${el.id}`, {
                method: "delete"
            })
            .then(res => res.json())
            .then(data => {
                el.classList.add('remove_anim')
                setTimeout(() => {
                    getAllData()
                }, 1000);
            })
        }


        edit.onclick = async () => {
            const res = await fetch(`${base_url}/todos/${el.id}`, {
                method: "put", 
                body: JSON.stringify({task: prompt()}),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }  
            })

            let data = await res.json()

            if(data) {
                getAllData()
            }
        }

    })

}