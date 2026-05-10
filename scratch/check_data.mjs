import db from '../src/lib/db.js';

const checkData = () => {
    const products = db.prepare(`
        SELECT p.title, c.name as categoryName 
        FROM products p 
        JOIN categories c ON p.categoryId = c.id 
        LIMIT 50
    `).all();
    console.table(products);
};

checkData();
