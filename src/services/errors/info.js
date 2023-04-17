export const generateProductsErrorInfo = (product) =>{
    let result = `One or more properties were incomplete or not valid.
    List of required properties:
    title: need to be a string, received --> ${product.title}
    description: need to be a string, received --> ${product.description}
    code: need to be a string, received --> ${product.code}
    price: need to be a number, received --> ${product.price}
    thumbnail: need to be a array, received --> ${product.thumbnail}
    stock: need to be a number, received --> ${product.stock}
    category: need to be a string, received --> ${product.category}
    status: need to be a boolean, received --> ${product.status} `
    return result
}