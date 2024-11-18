const Booking = require('../Models/Booking');
const User = require('../Models/User');
const mongoose = require('mongoose');
require('dotenv').config();

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const cityCostMap = {
    "mumbai-bangalore": 8000,
    "mumbai-kolkata": 12000,
    "mumbai-chennai": 9500,
    "mumbai-hyderabad": 7000,
    "mumbai-pune": 1500,
    "mumbai-ahmedabad": 3000,
    "bangalore-chennai": 1100,
    "bangalore-hyderabad": 4000,
    "bangalore-pune": 6500,
    "kolkata-chennai": 7500,
    "kolkata-hyderabad": 8500,
    "chennai-hyderabad": 3500,
    "chennai-bangalore": 2000,  
    "madurai-chennai": 3000,
    "madurai-bangalore": 3500,
    "hyderabad-pune": 5500,
    "pune-ahmedabad": 4500,
};


exports.createBooking = async (req, res) => {
    const { carType, pickUp, dropOff, pickTime, dropTime, userDetails, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId' });
    }

    const route = `${pickUp.toLowerCase()}-${dropOff.toLowerCase()}`;
    const totalCost = cityCostMap[route] || 0;

    if (totalCost === 0) {
        return res.status(400).json({ error: 'No cost available for this route' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `${pickUp} to ${dropOff} booking`,
                        },
                        unit_amount: totalCost * 1000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            success_url: `http://localhost:5173/`,
            cancel_url: `http://localhost:5173/payment-cancel`,
        });

        const newBooking = new Booking({
            carType,
            pickUp,
            dropOff,
            pickTime,
            dropTime,
            userDetails,
            totalCost,
            user: userId,
            paymentSessionId: session.id
        });

        await newBooking.save();

        res.status(200).json({ url: session.url, bookingId: newBooking._id });
    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).json({ error: 'Failed to create booking', details: err.message });
    }
};

exports.confirmPayment = async (req, res) => {
    const { session_id } = req.query;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const booking = await Booking.findOneAndUpdate(
                { paymentSessionId: session_id },
                { status: 'confirmed' },
                { new: true }
            );

            res.status(200).json({ message: 'Payment confirmed', booking });
        } else {
            res.status(400).json({ error: 'Payment not completed' });
        }
    } catch (error) {
        console.error("Error confirming payment:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.getUserById = async (req, res) => {
    const userId = req.params.userId; 

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid userId' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ error: error.message });
    }
};
