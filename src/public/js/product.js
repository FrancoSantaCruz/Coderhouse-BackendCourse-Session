const socketClient = io()


const form = document.getElementById("create_product_form")
const products = document.getElementById("show_products_list")

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = e.target.elements.title.value;
    const description = e.target.elements.description.value;
    const code = e.target.elements.code.value;
    const price = e.target.elements.price.value;
    const status = e.target.elements.status.value;
    const stock = e.target.elements.stock.value;
    const category = e.target.elements.category.value;
    const thumbnail = e.target.elements.thumbnail.value;

    const product = {
        title: title,
        description: description,
        code: code,
        price: parseInt(price),
        status: status,
        stock: parseInt(stock),
        category: category,
        thumbnail: thumbnail,
    }

    socketClient.emit("product", product)

})

socketClient.on("allProducts", (productList) => {
    const prods = productList.map((prod) => `
            <div class="prod_info">
                <h2>${prod.title}</h2>
                <h3>${prod.description}</h3>
                <p>${prod.price} | Cantidad disponible: ${prod.stock}</p>
                <hr>
            </div>
            <div class="prod_btns">
                <a href="/product/${prod._id}"><button>DETAILS</button></a>
                <button>ADD TO CART</button>
            </div>
            `).join(" ")
    products.innerHTML = prods
})

