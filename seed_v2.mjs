import db from './src/lib/db.js';

const seedLogicalData = () => {
    console.log('Cleaning all tables...');
    db.exec('DELETE FROM products');
    db.exec('DELETE FROM categories');
    db.exec('DELETE FROM cities');

    // Seed Cities
    const cities = [
        { id: 1, name: 'سنندج' },
        { id: 2, name: 'تهران' },
        { id: 3, name: 'مشهد' },
        { id: 4, name: 'اصفهان' },
        { id: 5, name: 'شیراز' },
        { id: 6, name: 'تبریز' },
        { id: 7, name: 'کرج' },
        { id: 8, name: 'قم' },
        { id: 9, name: 'اهواز' },
        { id: 10, name: 'کرمانشاه' }
    ];

    const insertCity = db.prepare('INSERT INTO cities (id, name) VALUES (?, ?)');
    cities.forEach(c => insertCity.run(c.id, c.name));
    console.log(`Seeded ${cities.length} cities.`);

    // Seed Categories
    const categories = [
        { id: 1, name: 'املاک', type: 'real-estate' },
        { id: 2, name: 'وسایل نقلیه', type: 'vehicles' },
        { id: 3, name: 'کالای دیجیتال', type: 'digital' },
        { id: 4, name: 'خانه و آشپزخانه', type: 'home' },
        { id: 5, name: 'خدمات', type: 'services' },
        { id: 6, name: 'وسایل شخصی', type: 'personal' },
        { id: 7, name: 'سرگرمی و فراغت', type: 'entertainment' },
        { id: 8, name: 'اجتماعی', type: 'social' },
        { id: 9, name: 'تجهیزات و صنعتی', type: 'industrial' },
        { id: 10, name: 'استخدام و کاریابی', type: 'jobs' }
    ];

    const insertCategory = db.prepare('INSERT INTO categories (id, name, type) VALUES (?, ?, ?)');
    categories.forEach(cat => insertCategory.run(cat.id, cat.name, cat.type));
    console.log(`Seeded ${categories.length} categories.`);

    const IMG = '/image/product-placeholder.png';

    // Product templates per category
    const templates = {
        1: [ // Real Estate
            { title: 'آپارتمان ۸۵ متری دو خوابه', price: 4500000000, desc: 'واحد نوساز، طبقه سوم با آسانسور و پارکینگ. نورگیر عالی.' },
            { title: 'اجاره مغازه ۲۰ متری مرکز شهر', price: 15000000, desc: 'مناسب برای مزون یا دفتر کار. دارای آب و برق و تلفن.' },
            { title: 'زمین مسکونی ۳۰۰ متری', price: 2100000000, desc: 'دارای سند تک برگ، آماده ساخت. دسترسی عالی به بلوار اصلی.' },
            { title: 'ویلا ۵۰۰ متری در شمال', price: 12000000000, desc: 'دید ابدی دریا، حیاط سازی شده، مبله کامل.' },
            { title: 'واحد اداری ۶۰ متری', price: 3200000000, desc: 'مناسب مطب یا دفتر مهندسی. موقعیت اداری عالی.' }
        ],
        2: [ // Vehicles
            { title: 'پژو ۲۰۶ تیپ ۲ مدل ۹۸', price: 420000000, desc: 'بدون رنگ، کارکرد کم، بیمه ۱۰ ماه. فنی بسیار سالم.' },
            { title: 'پراید ۱۳۱ مدل ۹۵ سفید', price: 280000000, desc: 'دو لکه رنگ، شاسی سالم، لاستیک نو. قیمت مقطوع.' },
            { title: 'موتور سیکلت هوندا ۱۲۵ نو', price: 65000000, desc: 'مدل ۱۴۰۲، صفر خشک. آماده انتقال سند.' },
            { title: 'تویوتا کمری مدل ۲۰۱۴', price: 1850000000, desc: 'فول آپشن، بدون خط و خش، سرویس‌ها انجام شده.' },
            { title: 'هیوندای سانتافه ۲۰۱۷', price: 3400000000, desc: 'فول وارداتی، دو دیفرانسیل، فنی به شرط کارشناسی.' }
        ],
        3: [ // Digital
            { title: 'آیفون ۱۳ پرو ۱۲۸ گیگ', price: 55000000, desc: 'سلامت باتری ۹۲ درصد، ریجستری شده با کارتن.' },
            { title: 'لپ‌تاپ لنوو i7 رم ۱۶', price: 32000000, desc: 'مناسب کارهای گرافیکی و مهندسی. در حد نو.' },
            { title: 'تلویزیون ۵۵ اینچ سامسونگ 4K', price: 28000000, desc: 'هوشمند، دارای گارانتی اصلی. تصویر فوق‌العاده.' },
            { title: 'دوربین عکاسی کانن 80D', price: 24000000, desc: 'همراه با لنز ۱۸-۱۳۵، کارکرد پایین. تمیز.' },
            { title: 'ساعت هوشمند اپل واچ سری ۸', price: 18000000, desc: 'سایز ۴۵، بدون خط و خش، به همراه بند اضافه.' }
        ],
        4: [ // Home
            { title: 'مبل راحتی ۸ نفره ال', price: 18000000, desc: 'پارچه ترک، کلاف چوب گردو. بسیار شیک.' },
            { title: 'یخچال ساید بای ساید ال‌جی', price: 65000000, desc: 'در حد نو، دارای فیلتر تصفیه آب. بدنه بدون خش.' },
            { title: 'جاروبرقی پاناسونیک ۲۲۰۰ وات', price: 8500000, desc: 'قدرت مکش بسیار بالا، نو داخل کارتن.' },
            { title: 'میز ناهارخوری ۶ نفره چوبی', price: 12000000, desc: 'چوب راش، با صندلی‌های پارچه‌ای با کیفیت.' },
            { title: 'ماشین لباسشویی پاکشوما ۹ کیلویی', price: 22000000, desc: 'دارای برنامه شستشوی سریع و ضد چروک.' }
        ],
        5: [ // Services
            { title: 'خدمات نظافت منزل و راه‌پله', price: 0, desc: 'توسط کادر مجرب و مطمئن. اعزام فوری نیرو.' },
            { title: 'تدریس خصوصی ریاضی و فیزیک', price: 0, desc: 'از پایه تا کنکور توسط مدرس با سابقه.' },
            { title: 'تعمیرات تخصصی پکیج و کولر', price: 0, desc: 'سرویس کامل، عیب‌یابی و رفع نشتی.' },
            { title: 'طراحی سایت و اپلیکیشن', price: 0, desc: 'طراحی حرفه‌ای با سئو عالی برای کسب و کار شما.' }
        ],
        6: [ // Personal
            { title: 'کفش ورزشی نایک مدل جردن', price: 3500000, desc: 'سایز ۴۲، رنگ سفید و مشکی. اورجینال.' },
            { title: 'ساعت مچی مردانه سیتیزن اصل', price: 7200000, desc: 'اتوماتیک، ضد آب، با جعبه و گارانتی.' },
            { title: 'کاپشن چرم مشکی سایز XL', price: 2800000, desc: 'چرم طبیعی گاوی، بسیار گرم و با دوام.' },
            { title: 'عینک آفتابی ری‌بن اصل', price: 4500000, desc: 'مدل خلبانی، شیشه نشکن، همراه با کیف و دستمال.' }
        ],
        7: [ // Entertainment
            { title: 'دوچرخه کوهستان سایز ۲۶', price: 9500000, desc: '۲۱ دنده، ترمز دیسکی، کمک فنر جلو فعال.' },
            { title: 'گیتار کلاسیک یاماها C40', price: 4800000, desc: 'مناسب برای شروع یادگیری، صدای بسیار شفاف.' },
            { title: 'کتاب‌های کنکور تجربی ۱۴۰۲', price: 1200000, desc: 'کاملاً نو و بدون علامت گذاری، با پاسخنامه.' }
        ],
        8: [ // Social
            { title: 'گم شده: گربه پرشین سفید', price: 0, desc: 'در محدوده شهرک غرب گم شده. مژدگانی محفوظ است.' },
            { title: 'واگذاری سگ شیتزو تریر', price: 0, desc: 'فقط به خانواده متعهد و دلسوز واگذار می‌شود.' }
        ],
        9: [ // Industrial
            { title: 'دریل شارژی رونیکس اصل', price: 3200000, desc: 'دارای دو باتری و کیف حمل. قدرت بالا.' },
            { title: 'دستگاه جوش اینورتر ۲۰۰ آمپر', price: 5400000, desc: 'مناسب برای مصارف خانگی و صنعتی.' }
        ],
        10: [ // Jobs
            { title: 'استخدام راننده با خودرو', price: 0, desc: 'برای کار در آژانس معتبر. درآمد عالی.' },
            { title: 'نیازمند حسابدار خانم پاره‌وقت', price: 0, desc: 'آشنا به نرم افزار سپیدار و اکسل.' }
        ]
    };

    const productsData = [];
    const catIds = Object.keys(templates);

    for (let i = 0; i < 100; i++) {
        const catId = Number(catIds[Math.floor(Math.random() * catIds.length)]);
        const cityId = cities[Math.floor(Math.random() * cities.length)].id;
        const templateList = templates[catId];
        const template = templateList[Math.floor(Math.random() * templateList.length)];
        
        const suffixes = ['', ' - فوری', ' در حد نو', ' (تخفیف پای معامله)', ' اصلی', ' سالم', ' مناسب مصرف کننده'];
        const title = template.title + suffixes[Math.floor(Math.random() * suffixes.length)] + (i > 30 ? ` #${i}` : '');
        
        productsData.push({
            title: title,
            price: template.price,
            categoryId: catId,
            cityId: cityId,
            description: template.desc,
            image: IMG
        });
    }

    const insertProduct = db.prepare(`
        INSERT INTO products (title, price, time, timeHours, categoryId, cityId, image, description, condition)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    productsData.forEach(p => {
        insertProduct.run(
            p.title,
            p.price,
            'لحظاتی پیش',
            Math.random() * 24,
            p.categoryId,
            p.cityId,
            p.image,
            p.description,
            'نو'
        );
    });

    console.log(`Seeded ${productsData.length} products successfully.`);
};

seedLogicalData();
