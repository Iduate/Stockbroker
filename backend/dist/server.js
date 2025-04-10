"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = require("./routes/userRoutes");
const accountRoutes_1 = require("./routes/accountRoutes");
const transactionRoutes_1 = require("./routes/transactionRoutes");
const offerRoutes_1 = require("./routes/offerRoutes");
const authMiddleware_1 = require("./middleware/authMiddleware");
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
app.use('/api/user', authMiddleware_1.authMiddleware, userRoutes_1.userRoutes);
app.use('/api/accounts', authMiddleware_1.authMiddleware, accountRoutes_1.accountRoutes);
app.use('/api/transactions', authMiddleware_1.authMiddleware, transactionRoutes_1.transactionRoutes);
app.use('/api/offers', authMiddleware_1.authMiddleware, offerRoutes_1.offerRoutes);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map