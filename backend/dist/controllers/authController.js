"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Role_1 = __importDefault(require("../models/Role"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const register = async (req, res) => {
    try {
        const { name, email, password, roleName } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'El usuario ya existe' });
            return;
        }
        let role = await Role_1.default.findOne({ name: roleName || 'Mesero' });
        if (!role) {
            role = await Role_1.default.create({ name: roleName || 'Mesero', permissions: [] });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newUser = new User_1.default({
            name,
            email,
            passwordHash,
            role: role._id,
        });
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email }).populate('role');
        if (!user || !user.active) {
            res.status(400).json({ message: 'Credenciales inválidas o usuario inactivo' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: 'Credenciales inválidas' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role.name }, JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role.name,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};
exports.login = login;
