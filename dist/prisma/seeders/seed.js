"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../lib/prisma"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const alice = yield prisma_1.default.user.upsert({
        where: { email: "alice@prisma.io" },
        update: {},
        create: {
            email: "alice@prisma.io",
            name: "Alice",
            posts: {
                create: {
                    title: "Check out Prisma with Next.js",
                    content: "https://www.prisma.io/nextjs",
                    published: true,
                },
            },
        },
    });
    const bob = yield prisma_1.default.user.upsert({
        where: { email: "bob@prisma.io" },
        update: {},
        create: {
            email: "bob@prisma.io",
            name: "Bob",
        },
    });
    // console.log({ alice, bob });
});
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma_1.default.$disconnect();
    process.exit(1);
}));
