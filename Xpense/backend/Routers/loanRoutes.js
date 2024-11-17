import express from 'express';
import { addLoan,updateLoan,changeStatus,deleteLoan } from '../controllers/loanController.js';

const router = express.Router();

router.route("/addLoan").post(addLoan);

router.route("/updateLoan").post(updateLoan);

router.route("/changeStatus").post(changeStatus);

router.route("/deleteLoan").post(deleteLoan);

export default router;