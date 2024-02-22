import firebaseConfig from '../firebase_config.js'
import firestorefunctions from '../firestorefunctions.js'
import { initializeApp } from 'firebase/app';
import { Document, Packer, Table, TableRow, TableCell, Paragraph, ImageRun } from 'docx';
import fetch from 'node-fetch';
import fs from 'fs';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const firestore = new firestorefunctions(app, true);

// Function to fetch image from URL and return as a buffer
async function fetchImageAsBuffer(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    return response.buffer();
}

// Function to create a table row with an image from a URL
async function createTableRow(item) {
    const imageBuffer = await fetchImageAsBuffer(item.imageUrl);
    return new TableRow({
        children: [
            new TableCell({
                children: [new Paragraph({
                    children: [new ImageRun({
                        data: imageBuffer,
                        transformation: { width: 100, height: 100 },
                    })],
                })],
            }),
            new TableCell({ children: [new Paragraph(item.itemName)] }),
            new TableCell({ children: [new Paragraph(`${item.priceWithoutVat}`)] }),
            new TableCell({ children: [new Paragraph(`${item.priceWithVat}`)] }),
        ],
    });
}

// Main function to fetch data, process it and create the document
async function fetchDataAndCreateDocument() {
    try {
        const data = await firestore.readAllDataFromCollection('Products');
        const items = data.filter(item => item.unit !== 'Pack').map(item => ({
            itemName: item.itemName,
            imageUrl: item.imageLinks[0], // Assuming first image is the one to use
            priceWithVat: (item.price * 1.05) * 1.12,
            priceWithoutVat: item.price * 1.05,
        }));

        const doc = new Document({
            sections: [{
                children: [
                    new Table({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Photo")] }),
                                    new TableCell({ children: [new Paragraph("Item Name")] }),
                                    new TableCell({ children: [new Paragraph("Price Without VAT")] }),
                                    new TableCell({ children: [new Paragraph("Price With VAT")] }),
                                ],
                            }),
                            // Rows will be added here
                        ],
                    }),
                ],
            }],
        });

        for (const item of items) {
            const row = await createTableRow(item);
            doc.sections[0].children[0].rows.push(row); // Adding each row to the table
        }

        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync("ProductsDocument.docx", buffer);
        console.log('Document created successfully.');
    } catch (error) {
        console.error('Error creating document:', error);
    }
}

fetchDataAndCreateDocument();
