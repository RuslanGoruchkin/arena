import bodyParser from "body-parser";
import SHA1 from "crypto-js/sha1";
import debug0 from "debug";
import express from "express";
import log4js from "log4js";
import db from "../../models/index";
import { errorHandler } from "../helpers";

const debug = debug0("bot:donatesMiddleware");

const app = express();
const logger = log4js.getLogger("Info");

export default class DonatesMiddleware {
    constructor() {
        this.client = db;
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        log4js.configure({
            appenders: {
                cheese: {
                    type: "file",
                    filename: "result.log"
                }
            },
            categories: {
                default: {
                    appenders: ["cheese"],
                    level: "info"
                }
            }
        });
        this.startDonateHook();
    }

    startDonateHook() {
        let publicThis = this;
        app.use(function(req, res, next) {
            let result = JSON.stringify(req.body);
            let request = JSON.parse(result);
            let resultHeader = JSON.stringify(req.headers);
            let requestHeader = JSON.parse(resultHeader);
            let requiredSignature = "Signature " + SHA1(result + "9w2IRXuHmlpiWCPP");
            if (requiredSignature !== requestHeader.authorization) {
                res.status(420).send({
                    error: {
                        code: "INVALID_SIGNATURE",
                        message: "Invalid signature"
                    }
                });
            }
            if (request.user.id.substring(0, 11) === "test_xsolla") {
                res.status(420).send({
                    error: {
                        code: "INVALID_USER",
                        message: "Invalid user"
                    }
                });
            }
            next();
        });

        app.post("/donate", function(req, res) {
            let invoice = {};

            let result = JSON.stringify(req.body);
            let request = JSON.parse(result);

            //mock for tests
            let balanceCoin = 0;
            let balanceToken = 0;

            invoice.user = request.user.id;
            invoice.pack = request.purchase.virtual_currency.sku;
            invoice.quantity = request.purchase.virtual_currency.quantity;
            invoice.invoiceId = request.transaction.id;
            invoice.invoiceExId = request.transaction.external_id;
            invoice.invoiceDate = request.transaction.payment_date;
            invoice.invoiceMetbhod = request.transaction.payment_method;
            invoice.invoiceAgreement = request.transaction.agreement;
            invoice.invoiceCurrency = request.payment_details.payment.currency;
            invoice.invoiceAmount = request.payment_details.payment.amount;

            if (invoice.pack.substring(0, 8) === "BDCToken") {
                balanceCoin += invoice.quantity;
                console.log("TOKEN: " + balanceCoin);
            } else {
                balanceToken += invoice.quantity;
                console.log("COIN: " + balanceToken);
            }
            publicThis.setDonations(invoice);

            //for tests
            if (request.notification_type === "payment") {
                logger.info(
                    "\nUser: " +
                        invoice.user +
                        "\nPack Type: " +
                        invoice.pack +
                        "\nQuantity: " +
                        invoice.quantity +
                        "\nInvoice ID: " +
                        invoice.invoiceId +
                        "\nInvoice External ID: " +
                        invoice.invoiceExId +
                        "\nInvoice Date: " +
                        invoice.invoiceDate +
                        "\nInvoice Metbhod: " +
                        invoice.invoiceMetbhod +
                        "\nInvoice Agreement: " +
                        invoice.invoiceAgreement +
                        "\nInvoice Currency: " +
                        invoice.invoiceCurrency +
                        "\nInvoice Amount: " +
                        invoice.invoiceAmount
                );
            }
            res.send("Payment complete\n");
        });

        app.listen(8420, function() {
            console.log("Example app listening on port 8420");
        });
    }

    setDonations(invoice) {
        return db.donates
            .bulkCreate([
                {
                    user: invoice.user,
                    pack: invoice.pack,
                    quantity: invoice.quantity,
                    invoiceId: invoice.invoiceId,
                    invoiceExId: invoice.invoiceExId,
                    invoiceDate: invoice.invoiceDate,
                    invoiceMetbhod: invoice.invoiceMetbhod,
                    invoiceAgreement: invoice.invoiceAgreement,
                    invoiceCurrency: invoice.invoiceCurrency,
                    invoiceAmount: invoice.invoiceAmount
                }
            ])
            .catch(errorHandler);
    }

    middleware() {
        return (ctx, next) => next();
    }
}
