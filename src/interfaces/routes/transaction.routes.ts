import express from "express";
import ExpressRouterAdapter from "../../main/adapters/ExpressRouterAdapter";
import AddTransactionComposer from "../../main/composer/transaction/AddTransactionComposer";
import GetTransactionByIdComposer from "../../main/composer/transaction/GetTransactionByIdComposer";
import GetTransactionByPeriodsComposer from "../../main/composer/transaction/GetTransactionByPeriodsComposer";
import GetTransactionStatusComposer from "../../main/composer/transaction/GetTransactionStatusComposer";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transações
 */

router.post("/transaction", ExpressRouterAdapter.adapt(AddTransactionComposer.compose()));

/**
 * @swagger
 * /transaction:
 *  post:
 *    tags:
 *      - Transactions
 *    description: Add Transaction
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              value:
 *                type: number
 *                format: float
 *              type:
 *                type: string
 *                enum: [
 *                  debit,
 *                  credit,
 *                ]
 *              origin:
 *                type: string
 *              target:
 *                type: string
 *    responses:
 *      200:
 *        description: Transaction Added
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                statusCode:
 *                  type: integer
 *                  example: 200
 */

router.get("/transaction/:id", ExpressRouterAdapter.adapt(GetTransactionByIdComposer.compose()));
router.get("/transaction", ExpressRouterAdapter.adapt(GetTransactionByPeriodsComposer.compose()));
router.get("/transaction/:id/status", ExpressRouterAdapter.adapt(GetTransactionStatusComposer.compose()));


export default router;
