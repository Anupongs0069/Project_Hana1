const express = require('express');
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const exceljs = require('exceljs');

dotenv.config();

app.use(fileUpload());
app.post('/create', async (req, res) => {
    try {
        await prisma.product.create({
            data: req.body,
        });
        // res.send({ result: result });
        res.send({ message: 'success' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.get('/list', async (req, res) => {
    try {
        const data = await prisma.product.findMany({
            orderBy: {
                id: 'desc'
            },
            where: {
                status: 'use'
            }
        })

        res.send({ results: data });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.delete('/remove/:id', async (req, res) => {
    try {
        await prisma.product.update({
            data: {
                status: 'delete'
            },
            where: {
                id: parseInt(req.params.id)
            }
        })

        res.send({ message: 'success' })
    } catch (e) {
        console.error('Server error:', error); // เพิ่มบรรทัดนี้
        res.status(500).send({ error: e.message });
    }
})

app.put('/update', async (req, res) => {
    try {
        const fs = require('fs');
        const oldData = await prisma.product.findFirst({
            where: {
                id: parseInt(req.body.id)
            }
        })

        // remove old data
        const imagePath = './uploads/' + oldData.img;

        if (fs.existsSync(imagePath)) {
            await fs.unlinkSync(imagePath);
        }

        await prisma.product.update({
            data: req.body,
            where: {
                id: parseInt(req.body.id)
            }
        })

        res.send({ message: 'success' })
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.post('/upload', async (req, res) => {
    try {
        if (req.files != undefined) {
            if (req.files.img != undefined) {
                const img = req.files.img;
                const fs = require('fs');
                const myDate = new Date();
                const y = myDate.getFullYear();
                const m = myDate.getMonth() + 1;
                const d = myDate.getDate();
                const h = myDate.getHours();
                const mi = myDate.getMinutes();
                const s = myDate.getSeconds();
                const ms = myDate.getMilliseconds();

                const arrFileName = img.name.split('.');
                const ext = arrFileName[arrFileName.length - 1];

                const newName = `${y}${m}${d}${h}${mi}${s}${ms}.${ext}`;

                img.mv('./uploads/' + newName, (err) => {
                    if (err) throw err;

                    res.send({ newName: newName });
                })
            }
        } else {
            res.status(501).send('notimplemented');
        }
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.post('/uploadFromExcel', async (req, res) => {
    try {
        const fileExcel = req.files.fileExcel;

        fileExcel.mv('./uploads/' + fileExcel.name, async (err) => {
            if (err) throw err;

            // Read from file and insert to database
            const workbook = new exceljs.Workbook();
            await workbook.xlsx.readFile('./uploads/' + fileExcel.name);

            const ws = workbook.getWorksheet(1);

            for (let i = 2; i <= ws.rowCount; i++) {
                const fixtureId = ws.getRow(i).getCell(1).value ?? ""; // if null of undefind return ""
                const fixtureName = ws.getRow(i).getCell(2).value ?? ""; // if null of undefind return ""
                const operation = ws.getRow(i).getCell(3).value ?? ""; // if null of undefind return ""
                const side = ws.getRow(i).getCell(4).value ?? ""; // if null of undefind return ""
                const comp = ws.getRow(i).getCell(5).value ?? ""; // if null of undefind return ""
                const document = ws.getRow(i).getCell(6).value ?? ""; // if null of undefind return ""
                const family = ws.getRow(i).getCell(7).value ?? ""; // if null of undefind return ""
                const cusNum = ws.getRow(i).getCell(8).value ?? ""; // if null of undefind return ""
                const hanaNum = ws.getRow(i).getCell(9).value ?? ""; // if null of undefind return ""
                const productDes = ws.getRow(i).getCell(10).value ?? ""; // if null of undefind return ""

                // console.log(fixtureId, fixtureName, operation, side, comp, family, cusNum, hanaNum, productDes);
                if (fixtureId != "" && fixtureName != "" && fixtureName != "" && operation != "" && side != "" && comp != "" && family != "" && cusNum != "" && hanaNum != "" && productDes != "") {
                    await prisma.product.create({
                        data: {
                            fixtureId: fixtureId,
                            fixtureName: fixtureName,
                            operation: operation,
                            side: side,
                            comp: comp,
                            document: document,
                            family: family,
                            cusNum: cusNum,
                            hanaNum: hanaNum,
                            productDes: productDes,
                            img: ''
                        }
                    })
                }


            }

            // remove file form server
            const fs = require('fs');
            await fs.unlinkSync('./uploads/' + fileExcel.name);

            res.send({ message: 'success' });
        })
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

module.exports = app;