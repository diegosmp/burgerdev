const menu = document.getElementById("menu")
const cartBtn = document.querySelector("#cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.querySelector("#cart-items")
const cartTotal = document.querySelector("#cart-total")
const checkoutBtn = document.querySelector("#checkout-btn")
const closeModalBtn = document.querySelector("#close-modal-btn")
const cartCounter = document.querySelector("#cart-count")
const addressInput = document.querySelector("#adress")
const addressWarn = document.querySelector("#address-warn")

const cart = []

cartBtn.addEventListener("click", () => {
    updateCartModal()
    cartModal.style.display = "flex"
})

cartModal.addEventListener('click', ev => ev.target === cartModal ? cartModal.style.display = 'none' : null)

closeModalBtn.addEventListener('click', () => cartModal.style.display = 'none')

menu.addEventListener('click', (ev) => {
    const parentButton = ev.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        addToCart(name, price)
    }
})

const addToCart = (name, price) => {
    const existingItem = cart.find(item => item.name === name)
    existingItem ? existingItem.quantity += 1 : cart.push({name, price, quantity: 1})
    updateCartModal()
}

const updateCartModal = () => {
    cartItemsContainer.innerHTML = ''
    let total = 0

    cart.map(item => {
        const cartItemElement = document.createElement('div')
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col','border-b', 'border-black/20', 'pb-2' )
        cartItemElement.innerHTML = `
            <div class=" flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-1">R$ ${item.price.toFixed(2)}</p>
                </div>
                    <button class="remove-cart-btn" data-name="${item.name}">Remover</button>
            </div>
        `
        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString('PT-br', {
        style: "currency",
        currency: 'BRL'
    })

    cartCounter.innerHTML = cart.length
}

cartItemsContainer.addEventListener('click', ev => {
     if(ev.target.classList.contains('remove-cart-btn')){
        const name = ev.target.getAttribute("data-name")
        removeItemCart(name)
     }
})

const removeItemCart = (name) => {
    const index = cart.findIndex(item => item.name === name)
    if(index !== -1){
        const item = cart[index]
        if(item.quantity > 1){
            item.quantity -= 1
            updateCartModal()
            return
        }
    }
    cart.splice(index, 1)
    updateCartModal()
}

addressInput.addEventListener('input', ev => {
    const inputValue = ev.target.value

    if(inputValue){
        addressInput.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }


})

checkoutBtn.addEventListener('click', () => {

    const isOpen = checkRestaurantOpen()
    if(!isOpen) {
        Toastify({
            text: "Restaurante fechado",
            duration: 2500,
            close: true,
            gravity: "top",
            position: "right", 
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast()

        return
    }

    if(!cart.length) return

    if(!addressInput.value){
        addressWarn.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
        return
    }

    const cartItems = cart.map(item => {
        return(
            `*${item.name}* *Quantidade:* (${item.quantity}) *Preço:* R$ ${item.price.toFixed(2)} | \n`
        )
    }).join('')

    const message = encodeURIComponent(cartItems)
    const phone = "85991499686"

    window.open(`https://wa.me/${phone}?text=${message} *Endereço:* ${addressInput.value}`, "_blank")

    cart = []
    updateCartModal()
})

const checkRestaurantOpen = () => {
    const date = new Date()
    const hour = date.getHours()
    return hour >= 18 && hour < 24
}

const spanItem = document.querySelector('#date-span')
const isOpen = checkRestaurantOpen()

if(isOpen) {
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-600')
} else {
    spanItem.classList.remove('bg-green-600')
    spanItem.classList.add('bg-red-500')
}