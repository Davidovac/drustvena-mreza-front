'use strict'

let grupa = getGroup()

function getAll(){
    let urlParams = new URLSearchParams(window.location.search)
    let id = urlParams.get('id')

    if (!id) {
        return
    }

    fetch('http://localhost:5121/api/grupe/' + id)
        .then(response => {
            if (!response.ok){
                throw new Error('Request failed. Status: ' + response.status)
            }
            return response.json()
        })
        .then(users => renderData(users))
        .catch(error => {
            console.error('Error: ' + error.message)

            let table = document.querySelector('table')
            if (table){
                table.classList.add('hidden')
            }

            alert('An error occurred while loading data. Please try again')
        });
}

function getGroup(){
    let urlParams = new URLSearchParams(window.location.search)
    let id = urlParams.get('id')
    
    let group
    fetch('http://localhost:5121/api/grupe/' + id)
        .then(response => {
            if (!response.ok){
                throw new Error('Request failed. Status: ' + response.status)
            }
            return response.json()
        })
        .then(data => {
            group = data
        })
        .catch(error => {
            console.error('Error: ' + error.message)
            if (error.response && error.response.status === 404){
                alert('Group does not exist.')
            }
            else{
                alert('An error has occurred while loading the data. Please try again. ')
            }
        })

    return group
}

function renderData(data){
    let table = document.querySelector('table')
    let thead = document.querySelector('table thead')
    let noDataMessage = document.querySelector('#no-data-message')

    let naslov = document.querySelector('h3')
    naslov.textContent = 'Korisnici grupe ${grupa.name}.'

    if (data.length === 0){
        table.classList.add('hidden')

        noDataMessage.classList.remove('hidden')
        return
    }

    noDataMessage.classList.add('hidden')
    table.classList.remove('hidden')

    data.forEach(user => {
        let tr = document.createElement('tr')

        let username = document.createElement('td')
        username.textContent = user.username
        tr.appendChild(username)

        let name = document.createElement('td')
        name.textContent = user.name
        tr.appendChild(name)

        let surname = document.createElement('td')
        surname.textContent = user.surname
        tr.appendChild(surname)

        let dateOfBirth = document.createElement('td')
        let date = new Date(user.dateOfBirth)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const formattedDate = `${year}-${month}-${day}`
        dateOfBirth.textContent = formattedDate
        tr.appendChild(dateOfBirth)

        table.appendChild(tr)
    });
}


document.addEventListener('DOMContentLoaded', getAll)