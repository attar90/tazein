"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordpressController = void 0;
const common_1 = require("@nestjs/common");
const wordpress_service_1 = require("./wordpress.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let WordpressController = class WordpressController {
    constructor(wordpressService) {
        this.wordpressService = wordpressService;
    }
    async getPosts() {
        return this.wordpressService.getPostsFromWP();
    }
    async syncProducts() {
        return this.wordpressService.syncProducts();
    }
    async getLocalProducts() {
        return this.wordpressService.getLocalProducts();
    }
};
exports.WordpressController = WordpressController;
__decorate([
    (0, common_1.Get)('posts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WordpressController.prototype, "getPosts", null);
__decorate([
    (0, common_1.Post)('sync'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WordpressController.prototype, "syncProducts", null);
__decorate([
    (0, common_1.Get)('local-products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WordpressController.prototype, "getLocalProducts", null);
exports.WordpressController = WordpressController = __decorate([
    (0, common_1.Controller)('wordpress'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [wordpress_service_1.WordpressService])
], WordpressController);
//# sourceMappingURL=wordpress.controller.js.map