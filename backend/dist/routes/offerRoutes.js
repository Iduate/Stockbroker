"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const offerController_1 = require("../controllers/offerController");
const router = express_1.default.Router();
router.get('/', offerController_1.offerController.getOffers);
router.get('/user', offerController_1.offerController.getUserOffers);
router.get('/:id', offerController_1.offerController.getOffer);
router.post('/', offerController_1.offerController.createOffer);
router.put('/:id', offerController_1.offerController.updateOffer);
router.delete('/:id', offerController_1.offerController.deleteOffer);
router.post('/:id/activate', offerController_1.offerController.activateOffer);
router.post('/:id/deactivate', offerController_1.offerController.deactivateOffer);
exports.offerRoutes = router;
//# sourceMappingURL=offerRoutes.js.map