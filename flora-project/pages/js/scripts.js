function searchFlowers() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let products = document.getElementsByClassName("product");

    for (let i = 0; i < products.length; i++) {
        let name = products[i].innerText.toLowerCase();

        if (name.includes(input)) {
            products[i].style.display = "block";
        } else {
            products[i].style.display = "none";
        }
    }
}

function filterCategory() {
    let category = document.getElementById("categoryFilter").value;
    let products = document.getElementsByClassName("product");

    for (let i = 0; i < products.length; i++) {
        if (category === "all" || products[i].dataset.category === category) {
            products[i].style.display = "block";
        } else {
            products[i].style.display = "none";
        }
    }
}

function sortFlowers() {
    let container = document.getElementById("products");
    let items = Array.from(container.getElementsByClassName("product"));
    let value = document.getElementById("sortPrice").value;

    items.sort((a, b) => {
        let priceA = parseInt(a.dataset.price);
        let priceB = parseInt(b.dataset.price);

        return value === "low" ? priceA - priceB : priceB - priceA;
    });

    container.innerHTML = "";
    items.forEach(item => container.appendChild(item));
}
function changeFlowerImage(flowerId, flowerName, colorName) {
    const colorImages = {
        'Roses': {
            'Red': 'imgs/red Roses(2),PNG',
            'Pink': 'imgs/IMG_100pink.JPG',
            'White': 'imgs/flower3.jpg',
            'Yellow': 'imgs/flower4.jpg'
        },
        'Tulips': {
            'Red': 'imgs/flower3.jpg',
            'Pink': 'imgs/flower2.jpg',
            'White': 'imgs/flower4.jpg',
            'Yellow': 'imgs/IMG_100pink.JPG'
        }
        
    };
    const img = document.getElementById(`flower_img_${flowerId}`);
    img.src = colorImages[flowerName][colorName];
    updateSelectedFlowers();
}