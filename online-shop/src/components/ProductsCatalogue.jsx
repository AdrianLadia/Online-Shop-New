import React, { useEffect } from 'react';
import { useState } from 'react';
import { BsList, BsX } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const ProductsCatalogue = () => {
  const categories = [
    {
      categoryName: 'Paper Bags',
      imagePath: [
        {
          id: 'PPB#1',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Bags%2FPPB%231.webp?alt=media&token=07f31b65-f5c8-4115-893e-15e73690102d',
        },
        {
          id: 'PPB#2',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Bags%2FPPB%232.webp?alt=media&token=ba81fcad-7f0d-423e-bf1f-a1a5f487e63f',
        },
        {
          id: 'PPB#3',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Bags%2FPPB%233.webp?alt=media&token=7f012342-bc73-44fb-b37e-9a451a6eadc6',
        },
        {
          id: 'PPB#4',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Bags%2FPPB%234.webp?alt=media&token=8e99eee6-6206-4fa4-ba96-ecd790f3ef0d',
        },
        {
          id: 'PPB#5',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Bags%2FPPB%235.webp?alt=media&token=dcd6dd72-b10b-4072-9b7c-3f4051ab4e5a',
        },
        {
          id: 'PPB#6',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Bags%2FPPB%236.webp?alt=media&token=f27cde93-d9ce-4609-aaa7-7cbc03fb37f0',
        },
        {
          id: 'PPB#8',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Bags%2FPPB%238.webp?alt=media&token=823039c5-5683-4711-9f0f-faa3695db5c0',
        },
        {
          id: 'PPB#10',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Bags%2FPPB%2310.webp?alt=media&token=d8dd301c-01f2-4a56-86c8-7a1c6be1b80f',
        },
        {
          id: 'PPB#12',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Bags%2FPPB%2312.webp?alt=media&token=93780e69-6193-45d5-abad-2706f43f3772',
        },
        {
          id: 'PPB#16',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Bags%2FPPB%2316.webp?alt=media&token=2489dee2-9850-4ac1-acd2-856d9de239fb',
        },
        {
          id: 'PPB#20',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Bags%2FPPB%2320.webp?alt=media&token=83f215ca-23fe-4d95-8ed4-cf40720701d0',
        },
        {
          id: 'PPB#25',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Bags%2FPPB%2325.webp?alt=media&token=1754f639-e70b-4127-a363-31cb63493da9',
        },
        {
          id: 'PPB#45',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Bags%2FPPB%2345.webp?alt=media&token=debcb771-a98d-43c0-b248-1dc39d50539e',
        },
      ],
      description:
        'Kraft paper bags, constructed from sturdy and eco-friendly kraft paper, boast a natural, rustic appearance that is both versatile and sustainable. Often favored for their biodegradability, these bags are a preferred choice for environmentally-conscious consumers. The durable material, originating from wood pulp, ensures resilience, making these bags suitable for carrying a variety of items, from groceries to gifts. Their simplistic design offers a canvas for customization, making them popular for branding purposes in retail settings, while their unbleached, earthy hue exudes an organic charm, appreciated in both commercial and personal uses.',
    },
    {
      categoryName: 'Paper Meal Box With Division',
      imagePath: [
        {
          id: '2DIVTG',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Meal%20Box%20With%20Division%2F2DIVTG.webp?alt=media&token=ba387156-8e8c-4408-a218-df79aeb434aa',
        },
        {
          id: '3DIVTG',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Meal%20Box%20With%20Division%2F3DIVTG.webp?alt=media&token=99b78c36-ddd1-4a5d-a6b1-48370e301042',
        },
        {
          id: '4DIVTG',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPaper%20Meal%20Box%20With%20Division%2F4DIVTG.webp?alt=media&token=d45d4c29-f23d-498a-83c1-cd67b255a32a',
        },
      ],
      description:
        "Crafted for convenience and sustainability, our 'Paper Meal Box With Division' is the ideal solution for portioned meals on the go. Made from high-quality, eco-friendly paper, this meal box features distinct compartments, ensuring that your food items remain separate and fresh. Its sturdy design and compact dimensions make it easy to transport, while the minimalist aesthetic suits a variety of settings. Whether you're packing a work lunch or serving at an event, this divided paper box ensures your meal is presented neatly and remains delectable until it's time to dig in.",
    },
    {
      categoryName: 'Clamshell Box',
      imagePath: [
        {
          id: 'CLMB350TG (1)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FClamshell%20Box%2FCLMB350TG%20(1).webp?alt=media&token=ca89f5ff-0a75-43cc-8f7c-2596f919a5ab',
        },
        {
          id: 'CLMB350TG (2)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FClamshell%20Box%2FCLMB350TG%20(2).webp?alt=media&token=482763ce-23ee-457d-be4d-3f178f53b7e5',
        },
        {
          id: 'CLMB500TG (1)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FClamshell%20Box%2FCLMB500TG%20(1).webp?alt=media&token=9033dd31-71cb-4905-8183-c6eb8dc9b5fe',
        },
        {
          id: 'CLMB500TG (2)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FClamshell%20Box%2FCLMB500TG%20(2).webp?alt=media&token=24a09a1c-1bd9-406f-9fff-bec96cd71bf7',
        },
        {
          id: 'CLMB700TG (1)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FClamshell%20Box%2FCLMB700TG%20(1).webp?alt=media&token=1cc84ea7-3c98-4217-9132-baac70178d1d',
        },
        {
          id: 'CLMB700TG (2)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FClamshell%20Box%2FCLMB700TG%20(2).webp?alt=media&token=873c95c8-8c4f-43de-b048-5f4a69fe6430',
        },
        {
          id: 'CLMSHL (1)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FClamshell%20Box%2FCLMSHL%20(1).webp?alt=media&token=e82ad209-d9a0-443d-8084-d2010ffbcf3e',
        },
        {
          id: 'CLMSHL (2)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FClamshell%20Box%2FCLMSHL%20(2).webp?alt=media&token=5b5fcfde-a204-44c5-9a4b-7b2b869773d9',
        },
      ],
      description:
        'Marrying eco-conscious design with functionality, our Clamshell Kraft Paper Meal Boxes are perfect for modern dining needs. Made from biodegradable kraft paper, these boxes provide robust protection for on-the-go meals with their spill-proof and easy-to-use design. Their rustic yet sophisticated appeal makes them ideal for restaurants, food trucks, and events, ensuring meals remain fresh and presented stylishly.',
    },
    {
      categoryName: 'Takeaway Boxes',
      imagePath: [
        {
          id: 'KTAB800TG (1)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FTakeaway%20Boxes%2FKTAB800TG%20(1).webp?alt=media&token=30b8a9b4-141d-4f80-9a5a-06d3e49b56ec',
        },
        {
          id: 'KTAB800TG (2)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FTakeaway%20Boxes%2FKTAB800TG%20(2).webp?alt=media&token=6b1f5b52-0c05-47e3-a584-0b6a6626024a',
        },
        {
          id: 'KTAB1000TG (1)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FTakeaway%20Boxes%2FKTAB1000TG%20(1).webp?alt=media&token=54c33e47-20a5-4c4a-b731-9067693356c5',
        },
        {
          id: 'KTAB1000TG (2)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FTakeaway%20Boxes%2FKTAB1000TG%20(2).webp?alt=media&token=e5efb57c-d991-4c89-83c4-3b008fce82c6',
        },
        {
          id: 'KTAB1400TG (1)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FTakeaway%20Boxes%2FKTAB1400TG%20(1).webp?alt=media&token=0f92de14-f208-46e2-aa5e-1cd671e793df',
        },
        {
          id: 'KTAB1400TG (2)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FTakeaway%20Boxes%2FKTAB1400TG%20(2).webp?alt=media&token=496751ec-2d90-4404-911a-a4373a3677a4',
        },
        {
          id: 'KTAB2000TG (1)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FTakeaway%20Boxes%2FKTAB2000TG%20(1).webp?alt=media&token=db4ac760-d0a1-488a-8041-2c9fcaafe8b6',
        },
        {
          id: 'KTAB2000TG (2)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FTakeaway%20Boxes%2FKTAB2000TG%20(2).webp?alt=media&token=5ec1be29-6d87-4d38-a165-e72f772fc137',
        },
      ],
      description:
        "Experience the fusion of eco-friendliness and modern design with our Kraft Takeaway Meal Boxes. Crafted from premium kraft paper, these boxes are not only biodegradable but also sturdy and reliable, safeguarding your meals on the go. Their chic, neutral aesthetic complements any dish, making them a preferred choice for restaurants, cafes, and events. Whether it's a gourmet meal or a quick snack, our boxes ensure it's carried and presented in sustainable style.",
    },
    {
      categoryName: 'Rice Box',
      imagePath: [
        {
          id: 'RBX16 (2)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FRice%20Box%2FRBX16%20(2).webp?alt=media&token=d4cbc414-9c90-4fd2-8660-91bdaa17d134',
        },
        {
          id: 'RBX16 (3)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FRice%20Box%2FRBX16%20(3).webp?alt=media&token=331c1e80-e7d9-4c49-a4d4-5a3d468c533a',
        },
        {
          id: 'RBX16 (4)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FRice%20Box%2FRBX16%20(4).webp?alt=media&token=8c23b70a-0ed2-4d13-92b2-d349bc47ecd4',
        },
        {
          id: 'RBX16 (1)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FRice%20Box%2FRBX16%20(1).webp?alt=media&token=a53f2dd4-0e15-4162-89f4-9a5d993ad1a3',
        },
        {
          id: 'RBX26 (2)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FRice%20Box%2FRBX26%20(2).webp?alt=media&token=6403df1c-fc7c-4acf-9072-197a1151997f',
        },
        {
          id: 'RBX26 (4)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FRice%20Box%2FRBX26%20(4).webp?alt=media&token=7f901c2d-e236-4525-a982-739b9f1bb8fb',
        },
        {
          id: 'RBX26 (3)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FRice%20Box%2FRBX26%20(3).webp?alt=media&token=cefb0397-7160-496e-a91d-48000e867f84',
        },
        {
          id: 'RBX26 (1)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FRice%20Box%2FRBX26%20(1).webp?alt=media&token=b8d3d33d-52a1-4f0a-8d0d-fb21855af742',
        },
      ],
      description:
        'Kraft rice boxes, crafted from eco-friendly and biodegradable materials, offer a sustainable solution for packaging and presenting rice-based dishes. These durable, brown-hued containers are not only environmentally friendly but also visually appealing, making them a popular choice for restaurants and food stalls keen on a natural aesthetic. With their sturdy structure and secure closures, kraft rice boxes ensure that meals remain fresh, while the versatility of their design caters to a variety of cuisines. Ideal for takeout or delivery, these boxes are a testament to combining practicality with sustainability, making them a top pick for eco-conscious businesses in the food industry.',
    },
    {
      categoryName: 'Cake Box',
      imagePath: [
        {
          id: 'CB663TG',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FCake%20Box%2FCB663TG.webp?alt=media&token=c1e73a38-7ece-48b9-aed4-eb3c48cc1a76',
        },
        {
          id: 'CB885TG',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FCake%20Box%2FCB885TG.webp?alt=media&token=2c1cbbed-25a9-4d42-9aaa-c8b0c0ed2f2e',
        },
        {
          id: 'CB10103TG',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FCake%20Box%2FCB10103TG.webp?alt=media&token=a11de19c-8c9e-478c-8e22-046e8d5d1a1f',
        },
        {
          id: 'CB10104TG',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FCake%20Box%2FCB10104TG.webp?alt=media&token=eeb3551e-6151-4d96-8ab4-51ba424d58be',
        },
        {
          id: 'CB10144TG',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FCake%20Box%2FCB10144TG.webp?alt=media&token=973bd225-f08c-461d-b688-9336e630681b',
        },
        {
          id: 'CB12155TG',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FCake%20Box%2FCB12155TG.webp?alt=media&token=274f2170-1053-4292-b2df-3a74ffa39474',
        },
        {
          id: 'CB12165TG',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FCake%20Box%2FCB12165TG.webp?alt=media&token=5bd99f80-b160-4fa0-bc3b-4b5ec8dccf9b',
        },
        {
          id: 'CB14145TG',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FCake%20Box%2FCB14145TG.webp?alt=media&token=adcb7cd5-1605-46e1-a6aa-371012571e27',
        },
        {
          id: 'CBHRTG',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FCake%20Box%2FCBHRTG.webp?alt=media&token=26eb82fe-8be5-42a7-b281-b9a073bf1104',
        },
      ],
      description:
        'Our eco-friendly Kraft Brown Cake Boxes seamlessly blend elegance with sustainability. Made of high-quality, recyclable kraft paper, these sturdy boxes are perfect for showcasing and transporting baked delights. With an optional clear viewing window, secure locking mechanism, and easy assembly, they cater to both professional bakeries and home bakers aiming for a rustic yet refined presentation.',
    },
    {
      categoryName: 'Aluminum Foil',
      imagePath: [
        {
          id: 'AFOIL (1)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FAluminum%20Foil%2FAFOIL%20(1).webp?alt=media&token=5377663e-22df-47d5-803a-4455dde7dfde',
        },
        {
          id: 'AFOIL (2)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FAluminum%20Foil%2FAFOIL%20(2).webp?alt=media&token=f38aaea6-5f0e-4a2d-b484-0be5d072914e',
        },
        {
          id: 'AFOIL (3)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FAluminum%20Foil%2FAFOIL%20(3).webp?alt=media&token=279733f5-2fb5-4f85-97dc-3939f82ce226',
        },
        {
          id: 'AFOIL (4)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FAluminum%20Foil%2FAFOIL%20(4).webp?alt=media&token=c8031840-b8f0-4fb6-b2e5-862675d8d495',
        },
        {
          id: 'AFOIL (5)',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FAluminum%20Foil%2FAFOIL%20(5).webp?alt=media&token=d9748123-9bb8-4c8a-b6dc-726b5d302e57',
        },
      ],
      description:
        "Our Aluminum Foil Jumbo Roll is a kitchen essential tailored for those demanding larger quantities, be it for home use or professional settings. Crafted from high-quality material, this foil ensures optimal strength, versatility, and heat conductivity, making it perfect for cooking, grilling, wrapping, and storing foods. Its generous size guarantees you won't run out during those crucial culinary moments, combining efficiency with lasting durability.",
    },
    {
      categoryName: 'Aluminum Tray',
      imagePath: [
        {
          id: 'ATRE2300JK',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FAluminum%20Tray%2FATRE2300JK.webp?alt=media&token=3ca983b7-cfec-4753-9802-23e418355f69',
        },
        {
          id: 'ATRE3100J',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FAluminum%20Tray%2FATRE3100J.webp?alt=media&token=24ac47cd-f07e-43a0-b69b-311d86280bc8',
        },
        {
          id: 'ATRE4300J',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FAluminum%20Tray%2FATRE4300J.webp?alt=media&token=3a5ce13f-c4d8-40f0-b218-ecdc59580bd9',
        },
        {
          id: 'ATRE650J',
          url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FAluminum%20Tray%2FATRE650J.webp?alt=media&token=bb11dc74-9c8c-4ab5-a729-c510f7ade7e9',
        },
      ],
      description:
        'Elevate your party serving game with our disposable food aluminum trays. Specifically designed for convenience and style, these trays are the perfect solution for serving a variety of dishes. Made from high-quality aluminum, they ensure even heat distribution, making them ideal for keeping your food warm and delectably delicious. Their lightweight construction allows for easy transport, and their sleek silver finish adds a touch of elegance to any party setting. Celebrate with ease and flair, knowing your culinary delights are presented in the best possible manner.',
    },

    { categoryName: 'Chopsticks', imagePath: [], description: '' },

    { categoryName: 'Food Grade Cling Wrap', imagePath: [], description: '' },
    {
      categoryName: 'Plastic Spoon and Fork',
      imagePath: [
        { id: 'FRKMWSKZ', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPlastic%20Spoon%20And%20Fork%2FFRKMWSKZ.webp?alt=media&token=13cc7689-7ed6-490f-8cbb-4036212e9f4f' },
        { id: 'SPNMWSKZ', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FPlastic%20Spoon%20And%20Fork%2FSPNMWSKZ.webp?alt=media&token=6991c027-da36-4431-8a54-d67860d649cc' },
      ],
      description:
        "Our Plastic Spoon and Fork Set offers a blend of convenience and practicality for all dining occasions. Made with precision, these utensils ensure a comfortable grip and reliable performance, whether you're at a picnic, office luncheon, or catering event. Lightweight yet sturdy, they're designed for single-use without compromising on quality. Perfect for those who prioritize ease without skimping on functionality.",
    },
    {
      categoryName: 'Sauce Cups',
      imagePath: [
        { id: 'HCUP2SKZ', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSauce%20Cups%2FHCUP2SKZ.webp?alt=media&token=be4c7416-084c-4a0d-8a63-ab561d50e752' },
        { id: 'HCUP3SKZ', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSauce%20Cups%2FHCUP3SKZ.webp?alt=media&token=dafce5bf-21ab-4fd6-99b3-28c97b02b5da' },
        { id: 'HCUP4SKZ', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSauce%20Cups%2FHCUP4SKZ.webp?alt=media&token=54a12460-bcf0-4a48-bc09-3bdf6b359ecb' },
      ],
      description:
        "Elevate your dining experience with our Sauce Cups, the ultimate solution for portioning and presenting your favorite condiments and dips. Crafted for clarity and durability, these cups ensure your sauces shine through with visual appeal. Their secure seal guarantees no messy spills, making them ideal for takeout, events, or casual gatherings. Compact and versatile, they're a must-have for any occasion that calls for that extra touch of flavor.",
    },
    { categoryName: 'Paper Plate', imagePath: [], description: '' },

    { categoryName: 'Paper Bowl', imagePath: [], description: '' },
    { categoryName: 'Paper Meal Box', imagePath: [], description: '' },
    { categoryName: 'Plastic Cups', imagePath: [], description: '' },
    { categoryName: 'Paper Cups', imagePath: [], description: '' },
    { categoryName: 'Plastic Gloves', imagePath: [], description: '' },

    { categoryName: 'Roll Bags', imagePath: [], description: '' },
    { categoryName: 'Microwavable Containers', imagePath: [], description: '' },
    {
      categoryName: 'Sushi Tray',
      imagePath: [
        { id: 'ST5DIVR10', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSushi%20Tray%2FST5DIVR10.webp?alt=media&token=d7d1d121-5a88-4a8d-b94c-c46fb7173f7f' },
        { id: 'ST5DIVR14', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSushi%20Tray%2FST5DIVR14.webp?alt=media&token=6932664c-e059-47a7-ad06-43a313b9ce9a' },
        { id: 'STREC1100', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSushi%20Tray%2FSTREC1100.webp?alt=media&token=b6c6e72d-0436-47e9-9d12-e37bb9600765' },
        { id: 'STR14', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSushi%20Tray%2FSTR14.webp?alt=media&token=fff6fd2f-3e9b-4097-b105-31428b4fd5ec' },
        { id: 'STSL8', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSushi%20Tray%2FSTSL8.webp?alt=media&token=a33078b9-32c5-4a31-83c7-976bc872e2ca' },
        { id: 'STREC1101', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSushi%20Tray%2FSTREC1101.webp?alt=media&token=d2241bd9-80ca-43a1-b8d1-b7ceca74c8d7' },
        { id: 'STREC1102', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSushi%20Tray%2FSTREC1102.webp?alt=media&token=350de595-ed4e-42ce-9380-3e69de58f40e' },
        { id: 'STREC1109', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSushi%20Tray%2FSTREC1109.webp?alt=media&token=91441f05-9552-489c-b16f-400fc7191856' },
        { id: 'STREC1111', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSushi%20Tray%2FSTREC1111.webp?alt=media&token=34b96cec-10d1-4da5-9afd-050174cd9a17' },
        { id: 'STR10', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSushi%20Tray%2FSTR10.webp?alt=media&token=83fb3d2b-416f-4e78-8710-dd81b7054baf' },
        { id: 'STR12', url: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Catalogue%2FSushi%20Tray%2FSTR12.webp?alt=media&token=f1158614-203e-4e4e-a05d-963feb94f50e' },
      ],
      description:
        'Our sushi trays are practical and cost-effective solutions designed to showcase and transport sushi selections with ease. Typically transparent or with clear lids, these trays allow for the vibrant colors and designs of sushi rolls and sashimi pieces to shine through, ensuring an appetizing presentation. They provide convenience for takeout and delivery services, minimizing cleanup and ensuring freshness upon arrival. Equipped with dedicated compartments for soy sauce, wasabi, and pickled ginger, these trays encapsulate the full sushi dining experience in a portable format.',
    },
    { categoryName: 'Trash Bag or Garbage Bag', imagePath: [], description: '' },
    { categoryName: 'Wax Paper', imagePath: [], description: '' },
  ];

  const [showMenu, setShowMenu] = useState(false);
  const [refs, setRefs] = useState({});
  const [scrolledUpOrDown, setScrolledUpOrDown] = useState(true);
  const navigateTo = useNavigate();

  function openModal(itemId) {
    window.open(`https://starpack.ph/shop?modal=${itemId}-RET`, '_blank');
  }

  function menuStyle() {
    if (showMenu == false) {
      return 'h-9 w-10 sm:h-14 sm:w-12 bg-transparent text-white hover:text-color60 mt-1 p-1 rounded-sm';
    } else {
      return 'h-12 w-10 sm:h-14 sm:w-12 bg-transparent text-white hover:text-red-300 mt-1 p-1 rounded-sm';
    }
  }

  function scroll(page) {
    refs[page].current.scrollIntoView({ behavior: 'auto' });
    setShowMenu(false);
    setTimeout(() => {
      setScrolledUpOrDown(false);
    }, 50);
  }

  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  function didScrollUpDown() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Check if scrolled up or down
    if (currentScrollTop !== lastScrollTop) {
      lastScrollTop = currentScrollTop;
      setScrolledUpOrDown(true);
    }

    return false;
  }

  useEffect(() => {
    if (scrolledUpOrDown == true) {
      setTimeout(() => {
        setScrolledUpOrDown(false);
      }, 4000);
    }
  }, [scrolledUpOrDown]);

  function onLogoClick() {
    navigateTo('/');
  }

  return (
    <div className="flex flex-col">
       <Helmet>
        <title>Product Catalogue of Star Pack</title>
        <meta
          property="og:description"
          content="View our product catalogue of eco-friendly and biodegradable products."
        />
        <meta
          property="description"
          content="View our product catalogue of eco-friendly and biodegradable products. "
        />
        <meta property="og:url" content="https://www.starpack.ph/" />
      </Helmet>
      <div className=" h-16"></div>
      <div className="flex justify-center items-center mb-16 mt-10">
        <h1 className="text-2xl font-bold lg:text-6xl text-color10b">Starpack's product catalogue</h1>
      </div>
      {scrolledUpOrDown || showMenu ? (
        <nav className=" bg-color10c fixed top-0 left-0 w-screen z-10 ">
          <div className="justify-between  mx-5 py-5 flex flex-row h-20">
            <div className="rounded ">
              <img
                onClick={onLogoClick}
                src="/android-chrome-512x512.png"
                alt="logo"
                className="rounded-full h-12 w-12 hover:cursor-pointer"
              />
            </div>
            <div className="block text-3xl">
              <div className="  flex justify-center items-center w-full h-full">
                {showMenu == false ? (
                  <BsList
                    className={menuStyle()}
                    onClick={() => {
                      setShowMenu(true);
                    }}
                  />
                ) : (
                  <BsX
                    className={menuStyle()}
                    onClick={() => {
                      setShowMenu(false);
                    }}
                  />
                )}
              </div>
              {showMenu === true ? (
                <div className="absolute top-20 sm:top-20 right-4 w-3/5 xs:w-1/2 sm:w-1/3 ease-in-out duration-300">
                  <ul className=" h-96 shadow-inner-bottom  overflow-y-auto py-2 px-0.5 gap-2 divide-y  divide-green3 rounded-xl flex flex-col w-full justify-start items-center bg-green2 border border-green3">
                    {categories.map((category) => {
                      if (category.imagePath.length == 0) {
                        return null;
                      }
                      return (
                        <li>
                          <button
                            onClick={() => {
                              scroll(category.categoryName);
                            }}
                            className={'text-xl  '}
                          >
                            {category.categoryName}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </nav>
      ) : null}
      {categories.map((category) => {
        if (category.imagePath.length == 0) {
          return null;
        }
        if (!refs[category.categoryName]) {
          setRefs((prevRefs) => ({
            ...prevRefs,
            [category.categoryName]: React.createRef(),
          }));
        }
        return (
          <section
            ref={refs[category.categoryName]}
            className="flex flex-col lg:flex-row h-screen lg:justify-center lg:items-center   "
          >
            <div className="flex flex-col justify-center items-center  lg:w-1/2 h-1/2   ">
              <h2 className="text-2xl font-bold text-color10a lg:text-4xl">{category.categoryName}</h2>

              <div className="flex flex-row overflow-x-auto ml-5 mt-10 gap-5    ">
                {category.imagePath.map((image, index) => {
                  if (image.id == undefined) {
                    return null;
                  }
                  const withoutSpaces = image.id.replace(/\s/g, '');
                  const imageItemId = withoutSpaces.replace(/\(\d+\)/g, '');

                  return (
                    <img
                      loading="lazy"
                      onClick={() => openModal(imageItemId)}
                      key={image.id}
                      className="h-80 lg:h-full hover:cursor-pointer"
                      src={image.url}
                      alt={`Photo ${index + 1} of ${category.categoryName}`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex h-1/2 px-5 lg:text-2xl text-black items-center justify-center lg:w-1/2 ">
              <p className="lg:mx-20">{category.description}</p>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProductsCatalogue;
