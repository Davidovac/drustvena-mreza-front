'use strict'

function initialize(){
    let toFormBtn = document.querySelector('#toForm')
    toFormBtn.textContent = 'Dodaj korisnika'
    toFormBtn.addEventListener("click", function () {
        window.location.href = './userForm/userForm.html'
    })

    getAll()
}

function getAll(){
    fetch('http://localhost:5121/api/korisnici')
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

function renderData(data){
    let table = document.querySelector('table')
    let thead = document.querySelector('table thead')
    let noDataMessage = document.querySelector('#no-data-message')



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

        let editBtnCell = document.createElement('td')
        tr.appendChild(editBtnCell)
        let editBtn = document.createElement('button')
        editBtn.textContent = 'Edit'

        editBtn.addEventListener('click', function(){
            window.location.href = './userForm/userForm.html?id=' + user.id
        })
        editBtnCell.appendChild(editBtn)

        table.appendChild(tr)
    });
}


document.addEventListener('DOMContentLoaded', initialize)