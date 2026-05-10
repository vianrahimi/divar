import fs from 'fs';

const categories = [
    { id: 1, name: "املاک", type: "real-estate" },
    { id: 2, name: "وسایل نقلیه", type: "vehicles" },
    { id: 3, name: "کالای دیجیتال", type: "digital" },
    { id: 4, name: "خانه و آشپزخانه", type: "home" },
    { id: 5, name: "خدمات", type: "services" },
    { id: 6, name: "وسایل شخصی", type: "personal" },
    { id: 7, name: "سرگرمی و فراغت", type: "entertainment" },
    { id: 8, name: "اجتماعی", type: "social" },
    { id: 9, name: "تجهیزات و صنعتی", type: "industrial" },
    { id: 10, name: "استخدام و کاریابی", type: "jobs" }
];

const cities = [
    { id: 1, name: "تهران" }, { id: 2, name: "مشهد" }, { id: 3, name: "اصفهان" },
    { id: 4, name: "شیراز" }, { id: 5, name: "سنندج" }, { id: 6, name: "تبریز" },
    { id: 7, name: "کرج" }, { id: 8, name: "اهواز" }
];

const conditions = ["نو", "در حد نو", "کارکرده", "دست دوم", "نیاز به تعمیر ندارد"];
const sampleTitles = [
    "موتور هاتفورد", "لپ‌تاپ گیمینگ ایسوس", "اجاره مغازه ۲۵ متری", "فروش ماشین لباسشویی",
    "مبل راحتی ۷ نفره", "گوشی موبایل آیفون ۱۳", "کتابخانه چوبی", "میز تحریر ام دی اف",
    "دوچرخه کوهستان حرفه ای", "فرش دستباف ۶ متری", "ساعت هوشمند اپل واچ", "دوربین عکاسی کانن",
    "کفش ورزشی نایک رز ۱", "تلویزیون ۵۵ اینچ ال جی", "پژو ۲۰۶ تیپ ۲", "پراید مدل ۹۰",
    "خدمات نظافت منزل", "آموزش زبان انگلیسی", "کابینت آشپزخانه ام دی اف", "جاروبرقی بوش"
];

const timeStampsData = [
    { text: "لحظاتی پیش", hours: 0 },
    { text: "دقایقی پیش", hours: 0.5 },
    { text: "۱ ساعت پیش", hours: 1 },
    { text: "۲ ساعت پیش", hours: 2 },
    { text: "۱۰ ساعت پیش", hours: 10 },
    { text: "۱ روز پیش", hours: 24 },
    { text: "۲ روز پیش", hours: 48 },
    { text: "۳ روز پیش", hours: 72 },
    { text: "۵ روز پیش", hours: 120 },
    { text: "هفته پیش", hours: 168 }
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (arr) => arr[randomInt(0, arr.length - 1)];

const products = [];
for (let i = 1; i <= 200; i++) {
    const tData = randomChoice(timeStampsData);
    products.push({
        id: i,
        title: randomChoice(sampleTitles) + ' ' + randomInt(1, 100),
        price: randomInt(1, 100) * 1000000,
        time: tData.text,
        timeHours: tData.hours,
        categoryId: randomInt(1, 10),
        cityId: randomInt(1, 8),
        image: "/image/agahi.jpg", // Path provided by the user
        description: "توضیحات تستی برای کالای مورد نظر.",
        condition: randomChoice(conditions)
    });
}

const fileContent = `export const categories = ${JSON.stringify(categories, null, 2)};

export const cities = ${JSON.stringify(cities, null, 2)};

export const products = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync('src/data/mockData.js', fileContent);
console.log('Successfully generated mockData.js with 200 items');
