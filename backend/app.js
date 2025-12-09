const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend')));

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'company_portal'
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к MySQL:', err);
        console.log('Работа без базы данных');
    } else {
        console.log('Успешное подключение к MySQL');
    }
});


app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Сервер работает!', 
        timestamp: new Date().toISOString() 
    });
});


app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('Получен запрос логина:', req.body);
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email и пароль обязательны' });
        }


        const testUsers = {
            'admin@example.com': { 
                id: 1, 
                name: 'Администратор', 
                role: 'admin', 
                password: 'admin123' 
            },
            'user@example.com': { 
                id: 2, 
                name: 'Тестовый Сотрудник', 
                role: 'employee', 
                password: 'user123' 
            }
        };

        const user = testUsers[email];
        
        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        if (password !== user.password) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: email,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Успешный вход для:', email);

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html', 'index.html'));
});

app.get('/adminFrame.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html', 'adminFrame.html'));
});

app.get('/userFrame.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html', 'userFrame.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Фронтенд файлы из: ${path.join(__dirname, '../frontend')}`);
});
