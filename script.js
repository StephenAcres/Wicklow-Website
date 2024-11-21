document.addEventListener('DOMContentLoaded', () =>{
    const buyNowButtons = document.querySelectorAll('.buy-now'); 
    const cartItems = document.getElementById('cart-items'); 
    const checkoutButton = document.getElementById('checkout'); 
    const clearStorageButton = document.getElementById('clear-storage'); 
    const emptyCartMessage = document.getElementById('empty-cart-message'); 
    const clearMessage = document.getElementById('clearMessage');
    const subtotalElement = document.getElementById('subtotal'); 
    const subtotalValue = document.getElementById('subtotal-value');
    const totalSpent = document.getElementById('totalSpent');

    // Function to check contents of the cart upon loading the page
    function isInCart(itemName) { 
        let cart = JSON.parse(localStorage.getItem('cart')) || []; 
        return cart.some(cartItem => cartItem.name === itemName); 
    }

    // Buy-Now Button Functionality
    buyNowButtons.forEach(button => { 
        const itemName = button.getAttribute('data-item'); 
        if (isInCart(itemName)) { 
            button.disabled = true; 
            button.textContent = 'Added to Cart'; 
        } 
        button.addEventListener('click', () => { 
            const item = { 
                name: button.getAttribute('data-item'), 
                image: button.getAttribute('data-image'), 
                price: parseFloat(button.getAttribute('data-price').replace('€', '')) 
            }; 
            addToCart(item); 
            button.disabled = true; 
            button.textContent = 'Added to Cart'; 
        }); 
    });

    // Function to add items to cart and store data
    function addToCart(item){
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (!cart.some(cartItem => cartItem.name === item.name)) { 
            cart.push(item); 
        }
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    
    // Function to update cart display when items are added
    function updateCartDisplay() { 
        let cart = JSON.parse(localStorage.getItem('cart')) || []; 
        cartItems.innerHTML = '';
        let subtotal = 0;
        if (cart.length === 0) { 
            emptyCartMessage.style.display = 'block';
            subtotalElement.style.display = 'none'; 
            checkoutButton.style.display = 'none'; 
            clearStorageButton.style.display = 'none'; 
        } else { 
            emptyCartMessage.style.display = 'none';
            subtotalElement.style.display = 'block'; 
            checkoutButton.style.display = 'block'; 
            clearStorageButton.style.display = 'block'; 
            cart.forEach(item => { 
                let li = document.createElement('li'); 
                li.className = 'list-group-item d-flex align-items-center'; 
                
                let img = document.createElement('img'); 
                img.src = item.image; 
                img.className = 'img-thumbnail me-3'; 
                img.style.width = '200px'; 
                
                let info = document.createElement('div'); 
                info.innerHTML = `<strong>${item.name}</strong><br>Price: €${item.price}`; 

                li.appendChild(img); 
                li.appendChild(info); 
                cartItems.appendChild(li); 

                subtotal += parseFloat(item.price);
            });
            
            subtotalValue.textContent = `€${subtotal.toFixed(2)}`;
        } 
    } 

    updateCartDisplay();
    
    // Clear Cart button functionality
    clearStorageButton.addEventListener('click', () => { 
        localStorage.removeItem('cart'); 
        cartItems.innerHTML = ''; 
        subtotalValue.textContent = '€0.00';
        updateCartDisplay();
        
        clearMessage.innerText = 'The cart is now empty.'; 
        clearMessage.style.display = 'block'; 
        clearMessage.style.opacity = '1'; 
        
        setTimeout(() => { 
            clearMessage.style.opacity = '0'; 
            setTimeout(() => { 
                clearMessage.style.display = 'none'; 
            }, 300); 
        }, 2000); // 2 seconds before hiding the message 

    });

    const creditCardModal = new bootstrap.Modal(document.getElementById('creditCardModal')); 
    const creditCardForm = document.getElementById('creditCardForm');
    const successModal = new bootstrap.Modal(document.getElementById('successModal'))
    
    checkoutButton.addEventListener('click', () => { 
        creditCardModal.show(); 
    }); 
    
    // Displays modal upon successful transaction
    creditCardForm.addEventListener('submit', (event) => { 
        event.preventDefault();  
        creditCardModal.hide();
        successModal.show();

        totalSpent.textContent =subtotalValue.textContent;

        localStorage.removeItem('cart');
        updateCartDisplay();
    });

});


