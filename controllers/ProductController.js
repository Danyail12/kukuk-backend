import product from "../models/Product.js";




export const getProducts = async (req, res) => {

    try {
        const products = await product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}



export const createProduct = async (req, res) => {

    const newProduct = new product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteProduct = async (req, res) => {

    try {
        const deletedProduct = await product.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await product.findByIdAndUpdate(
            req.params.id
        );
            }
        
     catch (error) {
        
    }
}