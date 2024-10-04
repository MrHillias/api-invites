const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const sequelize = require("./db_invites");
const UserModel = require("./models");

const app = express();
const port = 3000;

// Middleware для обработки JSON
app.use(bodyParser.json());

// Разрешаем все источники
app.use(cors());

// Проверка соединения с БД
sequelize
  .authenticate()
  .then(() => console.log("Соединение с базой данных установлено"))
  .catch((err) => console.error("Невозможно подключиться к базе данных:", err));

app.post("/invites/:chatId", async (req, res) => {
  const chatId = req.params.chatId;
  const uniqueCode = uuidv4();
  const inviteLink = `https://t.me/drive/app?startapp=ref_${uniqueCode}`;
  try {
    await UserModel.create({ chatId, code: uniqueCode, inviteLink });
    res.status(201).json({ inviteLink });
    await UserModel.save();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
