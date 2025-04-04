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

/**
 * @swagger
 * /transaction/{id}:
 *   get:
 *     tags:
 *       - Transactions
 *     description: Get Transaction by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique identifier of the transaction
 *     responses:
 *       200:
 *         description: Transaction details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 value:
 *                   type: number
 *                   format: float
 *                 type:
 *                   type: string
 *                   enum: [debit, credit]
 *                 origin:
 *                   type: string
 *                 target:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   enum: [pending, processing, completed, failed]
 */

router.get("/transaction", ExpressRouterAdapter.adapt(GetTransactionByPeriodsComposer.compose()));

/**
 * @swagger
 * /transaction:
 *   get:
 *     tags:
 *       - Transactions
 *     description: Retrieve transactions within a specified period.
 *     parameters:
 *       - in: query
 *         name: startPeriod
 *         schema:
 *           type: string
 *           format: date
 *           example: 2023-04-01
 *         required: true
 *         description: Start period.
 *       - in: query
 *         name: endPeriod
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-04-31
 *         required: false
 *         description: End period.
 *     responses:
 *       200:
 *         description: List of transactions retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   value:
 *                     type: number
 *                     format: float
 *                   type:
 *                     type: string
 *                     enum: [debit, credit]
 *                   origin:
 *                     type: string
 *                   target:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                     enum: [pending, processing, completed, failed]
 */

router.get(
  "/transaction/:id/status",
  ExpressRouterAdapter.adapt(GetTransactionStatusComposer.compose())
);

/**
 * @swagger
 * /transaction/{id}/status:
 *   get:
 *     tags:
 *       - Transactions
 *     description: Get the processing status of a transaction
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique identifier of the transaction whose status is being queried
 *     responses:
 *       200:
 *         description: Transaction status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [pending, processing, completed, failed]
 */

export default router;
