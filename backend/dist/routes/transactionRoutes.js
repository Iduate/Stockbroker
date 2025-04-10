"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../controllers/transactionController");
const router = express_1.default.Router();
router.get('/', transactionController_1.transactionController.getTransactions);
router.get('/summary', transactionController_1.transactionController.getTransactionSummary);
router.get('/:id', transactionController_1.transactionController.getTransaction);
router.post('/', transactionController_1.transactionController.createTransaction);
router.post('/:id/cancel', transactionController_1.transactionController.cancelTransaction);
exports.transactionRoutes = router;
//# sourceMappingURL=transactionRoutes.js.map