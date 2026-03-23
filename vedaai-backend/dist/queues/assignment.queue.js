"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.assignmentQueue = new bullmq_1.Queue("assignment-queue", {
    connection: redis_1.redisConfig,
});
