"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.post('/register', validation_1.validateRegistration, userController_1.userController.register);
router.post('/login', validation_1.validateLogin, userController_1.userController.login);
router.get('/profile', userController_1.userController.getProfile);
router.put('/profile', validation_1.validateProfileUpdate, userController_1.userController.updateProfile);
router.put('/password', userController_1.userController.updatePassword);
router.put('/notifications', userController_1.userController.updateNotifications);
exports.userRoutes = router;
//# sourceMappingURL=userRoutes.js.map