import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Role from '../models/Role';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, roleName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'El usuario ya existe' });
      return;
    }

    let role = await Role.findOne({ name: roleName || 'Mesero' });
    if (!role) {
      role = await Role.create({ name: roleName || 'Mesero', permissions: [] });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role._id,
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('role');
    if (!user || !user.active) {
      res.status(400).json({ message: 'Credenciales inválidas o usuario inactivo' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Credenciales inválidas' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: (user.role as any).name },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: (user.role as any).name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};
