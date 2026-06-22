"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mesaController_1 = require("../controllers/mesaController");
const router = (0, express_1.Router)();
router.get('/', mesaController_1.getMesas);
router.post('/', mesaController_1.createMesa);
router.patch('/:id/estado', mesaController_1.updateMesaStatus);
exports.default = router;
