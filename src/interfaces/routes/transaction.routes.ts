import express from "express";
import ExpressRouterAdapter from "../../main/adapters/ExpressRouterAdapter";
import AddTransactionComposer from "../../main/composer/transaction/AddTransactionComposer";

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

export default router;
