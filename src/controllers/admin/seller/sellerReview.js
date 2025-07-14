// Seller Review Controllers are using by User to review a seller

const SellerReview = require('../../models/sellerReview');
const User = require('../../models/user');
const Seller = require('../../models/seller');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

