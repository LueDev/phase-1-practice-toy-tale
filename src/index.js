
/*
  TODO[x]: Challenge 1 (Complete): Render all toys in db.json
  TODO[x]: Challenge 2 (Complete): Like event listener sends PATCH to json-server and updates likes on DOM
  TODO[x]: Challenge 3: Capture the information from the .add-toy-form and render new toy on DOM
*/

let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const createToyForm = document.querySelector('.add-toy-form')
  createToyForm.addEventListener('submit', (event) => {
    console.log(event)
    event.preventDefault()
    createToy(event)
    createToyForm.reset()

  })
  

  //make cards out of all toys in db.json
  renderToys()

});


function renderToys() {

let cardsContainer = document.querySelector('#toy-collection')
cardsContainer.innerHTML = ""

fetch('http://localhost:3000/toys')
.then(res => res.json())
.then(data => {
    data.forEach(toy => {
      globalData = data
      // console.log("DATA :" , data)
      // console.log("DATA HEADER :" , data)
      // console.log("DATA IMGS:" , data.image)
      // console.log("DATA LIKES:" , data.likes)
      const toyCard = document.createElement('div')
      toyCard.classList.add('card')
      toyCard.id = toy.id
      
      //card elements
      const cardHeader = document.createElement('h2')
      const cardImg = document.createElement('img')
      const cardParagraph = document.createElement('p')
      const cardButton = document.createElement('button')

      cardHeader.innerText = toy.name
      cardImg.setAttribute('src', toy.image)
      cardImg.classList.add('toy-avatar')
      cardParagraph.innerText = toy.likes
      cardButton.innerText = "like"
      cardButton.addEventListener('click', (e) => likeFunc(e))
      
      //Adding the card elements to our ToyCard div container
      toyCard.appendChild(cardHeader)
      toyCard.appendChild(cardImg)
      toyCard.appendChild(cardParagraph)
      toyCard.appendChild(cardButton)

      //Adding cards to container with id "toy-collection"
      cardsContainer.append(toyCard)
    })
  })
} 

async function likeFunc(event){

  const toyCard = event.target.parentElement
  let configurationObj = {}
  const response = await fetch(`http://localhost:3000/toys/${toyCard.id}`)
  const toy = await response.json() 
    .then(data => {
        // console.log(data)

        //global obj to hold outside of this block
        configurationObj = {
        method: 'PATCH',
        headers: {
          "Content-type": "application/json",
          Accept: "application/json"
        }, 
        body: JSON.stringify({
          "id": toyCard.id,
          "name": data.name,
          "image": data.image,
          "likes": data.likes = data.likes + 1
          })
        }
  
    })

  fetch(`http://localhost:3000/toys/${toyCard.id}`, configurationObj)
  .then(res => res.json())
  .then(data => {
      // console.log(data)
      let likeCount = document.getElementById(`${toyCard.id}`).children[2].innerHTML = data.likes
  })

}


function createToy(event){

  const toyFormName = event.target[0].value
  const toyFormImg = event.target[1].value
  const newToy = {
    "name": toyFormName,
    "image": toyFormImg,
    "likes": 0
  }

  const configObj = {
    "method": "POST",
    "headers": {
      "Content-type": "application/json",
      Accept: "application/json"
    },
    "body": JSON.stringify(newToy)
  }

  fetch('http://localhost:3000/toys', configObj)
  renderToys()


}

