'use strict'

window.jQuery = undefined
window.$ = undefined;

function initializeForm(){
    let submitBtn = document.querySelector('button')
    submitBtn.addEventListener('click', submit)

    get()
}

function get(){
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')

    if (!id){
        return
    }

    fetch('http://localhost:5121/api/korisnici/' + id)
        .then(response => {
            if (!response.ok){
                const error = new Error('Request failed. Status: ' + response.status)
                error.response = response
                throw error
            }
            return response.json()
        })
        .then(user => {
            document.querySelector('#username').value = user.username
            document.querySelector('#name').value = user.name
            document.querySelector('#surname').value = user.surname
            let date = new Date(user.dateOfBirth)
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const formattedDate = `${year}-${month}-${day}`
            document.querySelector('#dateOfBirth').value = formattedDate
        })
        .catch(error => {
            console.error('Error: ' + error.message)
            
            if (error.response && error.response.status === 404){
                alert('User does not exist.')
            } else{
                alert('An error has occurred while loading the data. Please try again. ')
            }
        })
}

function submit(){
    const form = document.querySelector('form')
    const formData = new FormData(form)

    let date = new Date(formData.get('dateOfBirth'))
    date = date.toISOString()

    const reqBody = {
        username: formData.get('username'),
        name: formData.get('name'),
        surname: formData.get('surname'),
        dateOfBirth: date
    }

    const usernameErrorMessage = document.querySelector('#usernameError')
    usernameErrorMessage.textContent = ''
    const nameErrorMessage = document.querySelector('#nameError')
    nameErrorMessage.textContent = ''
    const surnameErrorMessage = document.querySelector('#surnameError')
    surnameErrorMessage.textContent = ''
    const dateOfBirthErrorMessage = document.querySelector('#dateOfBirthError')
    dateOfBirthErrorMessage.textContent = ''

    let errorSwitch = false

    if (reqBody.username.trim() === '') {
        usernameErrorMessage.textContent = 'Username is required'
        errorSwitch = true
    }

    if (reqBody.name.trim() === '') {
        nameErrorMessage.textContent = 'Name is required'
        errorSwitch = true
    }

    if (reqBody.surname.trim() === '') {
        surnameErrorMessage.textContent = 'Surname is required'
        errorSwitch = true
    }

    if (reqBody.dateOfBirth.toString() === '') {
        dateOfBirthErrorMessage.textContent = 'Date of Birth is required'
        errorSwitch = true
    }

    if (errorSwitch){
        return
    }

    let method = 'POST'
    let url = 'http://localhost:5121/api/korisnici'

    let urlParams = new URLSearchParams(window.location.search)
    let id = urlParams.get('id')

    if (id) {
        method = 'PUT'
        url = 'http://localhost:5121/api/korisnici/' + id
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    })
        .then((response) => {
            if (!response.ok) {
                const error = new Error('Request failed. Status: ' + response.status)
                error.error.response
                throw error
            }
            setTimeout(() => null, 0)
            let json = response.json()
            return json
        })
        .then((data) => {
            console.log(data)
        })
        .then(data => {
            window.location.href = '../index.html'
        })
        .catch(error => {
            console.error('Error: ' + error.message)
            if (error.response && error.response.status === 404){
                alert('User does not exist.')
            } else if (error.response && error.response === 400){
                alert('Data is invalid')
            }
            else{
                alert('An error has occurred while loading the data. Please try again. ')
            }
        })
}

document.addEventListener('DOMContentLoaded', initializeForm)