import express from "express";
import ExpressRouterAdapter from "../../main/adapters/ExpressRouterAdapter";
import CreateAccountComposer from "../../main/composer/account/CreateAccountComposer";
import ListAccountsComposer from "../../main/composer/account/ListAccountsComposer";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Contas
 */

router.post("/account", ExpressRouterAdapter.adapt(CreateAccountComposer.compose()));

/**
 * @swagger
 * /account:
 *  post:
 *    tags:
 *      - Account
 *    description: Add an Account
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *    responses:
 *      200:
 *        description: Account Added
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

router.get("/account", ExpressRouterAdapter.adapt(ListAccountsComposer.compose()));

/**
 * @swagger
 * /account:
 *  get:
 *    tags:
 *      - Account
 *    description: List all Accounts
 *    responses:
 *      200:
 *        description: Account Added
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
