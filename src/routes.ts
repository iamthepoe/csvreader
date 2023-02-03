import { Router, Request, Response } from "express";
import {Readable} from 'stream';
import multer from 'multer';
import readline from 'readline';
import IProduct from "./IProduct";
import { client } from "./database/client";
const multerConfig = multer();

const router = Router();

router.post('/products', multerConfig.single("file"),  async (req: Request, res: Response)=>{
    const {file} = req;
    const buffer = file?.buffer;

    const readableFile = new Readable();
    readableFile.push(buffer);
    readableFile.push(null);
    
    const productsLine = readline.createInterface({
        input: readableFile
    });
    
    const products: Array<IProduct> = [];
    for await(let line of productsLine){
        let productSplited = line.split(',');
        products.push({
            code_bar: productSplited[0],
            description: productSplited[1],
            price: Number(productSplited[2]),
            quantity: Number(productSplited[3])
        });
        let {code_bar, description, price, quantity} = products[0];
        await client.products.create({
            data: {
                code_bar,
                description,
                price,
                quantity
            }
        });
    }

    return res.json(products);
});

export {router};