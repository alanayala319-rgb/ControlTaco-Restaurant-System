"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const mesaRoutes_1 = __importDefault(require("./routes/mesaRoutes"));
const productoRoutes_1 = __importDefault(require("./routes/productoRoutes"));
const pedidoRoutes_1 = __importDefault(require("./routes/pedidoRoutes"));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/mesas', mesaRoutes_1.default);
app.use('/api/productos', productoRoutes_1.default);
app.use('/api/pedidos', pedidoRoutes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'ControlTaco API is running' });
});
// Init DB and Start Server
const startServer = async () => {
    await (0, db_1.connectDB)();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
startServer();
