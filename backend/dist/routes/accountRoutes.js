"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountRoutes = void 0;
const express_1 = __importDefault(require("express"));
const accountController_1 = require("../controllers/accountController");
const router = express_1.default.Router();
router.get('/', accountController_1.accountController.getAccounts);
router.get('/:id', accountController_1.accountController.getAccount);
router.post('/', accountController_1.accountController.createAccount);
router.put('/:id', accountController_1.accountController.updateAccount);
router.delete('/:id', accountController_1.accountController.deleteAccount);
router.patch('/:id/balance', accountController_1.accountController.updateBalance);
exports.accountRoutes = router;
//# sourceMappingURL=accountRoutes.js.map