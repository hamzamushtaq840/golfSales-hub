import { Disc } from '../models/disc.js';
import { tryCatch } from '../utils/tryCatch.js';
import AppError from '../utils/AppError.js';
import { TempDisc } from '../models/tempDisc.js';
import { User } from '../models/user.js';
import { getUsers, io } from '../index.js';
import { CancelDisc } from '../models/cancelDiscs.js';

export const confirmPurchase = tryCatch(async (req, res) => {
    const { id, buyerId } = req.body;
    console.log(id);
    const listing = await TempDisc.findOne({ _id: id });
    console.log(listing);

    if (listing.purchaseConfirmed === true) {
        throw new AppError('already confirmed purchased', 'already confirmed purchased', 404);
    }

    // Update isSold field to true
    await TempDisc.findByIdAndUpdate(id, { purchaseConfirmed: true });
    const receiver = getUsers(buyerId);
    console.log(receiver);
    if (receiver && receiver.socketId) {
        // Emit 'refetchBuying' event to the specific receiver's socketId
        io.to(receiver.socketId).emit('refetchBuying');
    }
    res.status(201).json({ message: 'Purchase Confirmed' });
});

export const sendAddress = tryCatch(async (req, res) => {
    const { id, sellerId, address } = req.body;
    const listing = await TempDisc.findOne({ _id: id });

    if (listing.addressSent === true) {
        throw new AppError('already confirmed purchased', 'already confirmed purchased', 404);
    }

    // Update isSold field to true
    await TempDisc.findByIdAndUpdate(id, { addressSent: true, address: address });
    const receiver = getUsers(sellerId);
    console.log(receiver);
    if (receiver && receiver.socketId) {
        // Emit 'refetchBuying' event to the specific receiver's socketId
        io.to(receiver.socketId).emit('refetchSelling');
    }
    res.status(201).json({ message: 'Purchase Confirmed' });
});

export const sendPaymentDetails = tryCatch(async (req, res) => {
    const { id, buyerId, paymentMethod, shippingCost, shippingCostPaidBy } = req.body;
    console.log(req.body);
    const listing = await TempDisc.findOne({ _id: id });
    console.log(listing);

    if (listing.paymentAddressConfirmed === true) {
        throw new AppError('already confirmed purchased', 'already confirmed purchased', 404);
    }

    // Update isSold field to true
    await TempDisc.findByIdAndUpdate(id, { paymentAddressConfirmed: true, paymentMethod: paymentMethod, shippingCost: shippingCost, shippingCostPaidBy: shippingCostPaidBy });
    const receiver = getUsers(buyerId);

    if (receiver && receiver.socketId) {
        io.to(receiver.socketId).emit('refetchBuying');
    }
    res.status(201).json({ message: 'Purchase Confirmed' });
});

export const paymentSent = tryCatch(async (req, res) => {
    const { id, sellerId, selectedPaymentMethod } = req.body;
    console.log(req.body);
    const listing = await TempDisc.findOne({ _id: id });

    if (listing.paymentSent === true) {
        throw new AppError('already confirmed purchased', 'already confirmed purchased', 404);
    }

    const abc = listing.paymentMethod.map((payment) => {
        if (String(payment.accountNo) === String(selectedPaymentMethod)) {
            payment.selected = true;
        } else {
            payment.selected = false;
        }
        return payment;
    });

    await TempDisc.findByIdAndUpdate(id, { paymentSent: true, paymentMethod: abc });
    const receiver = getUsers(sellerId);
    if (receiver && receiver.socketId) {
        io.to(receiver.socketId).emit('refetchSelling');
    }
    res.status(201).json({ message: 'Purchase Confirmed' });
});

export const confirmPayment = tryCatch(async (req, res) => {
    const { id, buyerId } = req.body;
    const listing = await TempDisc.findOne({ _id: id });

    if (listing.paymentConfirmed === true) {
        throw new AppError('already confirmed purchased', 'already confirmed purchased', 404);
    }

    await TempDisc.findByIdAndUpdate(id, { paymentConfirmed: true });
    const receiver = getUsers(buyerId);
    if (receiver && receiver.socketId) {
        io.to(receiver.socketId).emit('refetchBuying');
    }
    res.status(201).json({ message: 'Purchase Confirmed' });

});

export const confirmParcelSent = tryCatch(async (req, res) => {
    const { id, buyerId } = req.body;
    const listing = await TempDisc.findOne({ _id: id });

    if (listing.parcelSent === true) {
        throw new AppError('already confirmed purchased', 'already confirmed purchased', 404);
    }

    await TempDisc.findByIdAndUpdate(id, { parcelSent: true });
    const receiver = getUsers(buyerId);
    if (receiver && receiver.socketId) {
        io.to(receiver.socketId).emit('refetchBuying');
    }
    res.status(201).json({ message: 'Purchase Confirmed' });

});

export const confirmParcel = tryCatch(async (req, res) => {
    const { id, sellerId } = req.body;
    const listing = await TempDisc.findOne({ _id: id });

    if (listing.parcelReceived === true) {
        throw new AppError('already confirmed purchased', 'already confirmed purchased', 404);
    }

    // Update isSold field to true
    await TempDisc.findByIdAndUpdate(id, { parcelReceived: true });
    const receiver = getUsers(sellerId);
    console.log(receiver);
    if (receiver && receiver.socketId) {
        // Emit 'refetchBuying' event to the specific receiver's socketId
        io.to(receiver.socketId).emit('refetchSelling');
    }
    res.status(201).json({ message: 'Parcel Confirmed' });
});

export const rating = tryCatch(async (req, res) => {
    const { id, sellerId, buyerId, from, rating } = req.body;
    const listing = await TempDisc.findOne({ _id: id }).populate('disc.discId');
    listing.disc.forEach(async element => {
        console.log(element.discId._id);
        await Disc.findOneAndUpdate(element.discId._id, { isFinished: true })
    });
    if (from === 'buy') {
        const buyer = await User.findOne({ _id: buyerId })
        let ratings = {
            user: buyerId,
            rating: rating
        }
        buyer.rating.push(ratings)
        await buyer.save()
    }
    if (from === 'seller') {
        const seller = await User.findOne({ _id: sellerId })
        let ratings = {
            user: buyerId,
            rating: rating
        }
        seller.rating.push(ratings)
        await seller.save()
    }
    await TempDisc.findOneAndRemove({ _id: id })

    let receiver
    if (from === 'buy')
        receiver = getUsers(sellerId);
    else
        receiver = getUsers(buyerId);
    if (receiver && receiver.socketId) {
        if (from === 'buy')
            io.to(receiver.socketId).emit('refetchSelling');
        else
            io.to(receiver.socketId).emit('refetchBuying');
    }
    res.status(201).json(listing);
});

export const cancel = tryCatch(async (req, res) => {
    const { listingId, discId, sellerId, buyerId, from } = req.body;
    const listing = await TempDisc.findOne({ _id: listingId }).populate('disc.discId'); // Assuming TempDisc is the model for tempSchema
    const discIndex = listing.disc.findIndex(disc => disc.discId._id.toString() === discId); // Replace "id" with the appropriate property name of the disc object
    await Disc.findByIdAndUpdate(discId, { isFinished: true, buyer: null })
    listing.disc.splice(discIndex, 1)[0];

    if (listing.disc.length === 0) {
        await TempDisc.deleteOne({ _id: listingId });
    } else {
        // Save the updated TempDisc document
        await listing.save();
    }
    const cancelDisc = new CancelDisc({
        disc: discId,
        cancelFrom: from,
        sellerId: sellerId,
        buyerId: buyerId
    });

    // Save the CancelDisc document
    await cancelDisc.save();

    let receiver
    if (from === 'buy')
        receiver = getUsers(sellerId);
    else
        receiver = getUsers(buyerId);
    if (receiver && receiver.socketId) {
        io.to(receiver.socketId).emit('refetchSelling');
    }
    res.status(200).json('success');
});

export const getSellingCancel = tryCatch(async (req, res) => {
    const { userId } = req.params;
    const listing = await CancelDisc.find({ sellerId: userId, cancelFrom: 'buy' }).populate('disc').populate({
        path: 'disc',
        populate: {
            path: 'bids.user', // Populate the 'user' field in 'bids' array of 'disc'
            model: 'User'
        }
    }).populate('buyerId')
    res.status(200).json(listing);
});

export const getBuyingCancel = tryCatch(async (req, res) => {
    const { userId } = req.params;
    const listing = await CancelDisc.find({ buyerId: userId, cancelFrom: 'sell' }).populate('disc').populate('sellerId')
    res.status(200).json(listing);
});

export const removeCancel = tryCatch(async (req, res) => {
    const { removeId } = req.body;
    await CancelDisc.deleteOne({ _id: removeId })
    res.status(200).json({ message: 'success' });
});

export const giveRating = tryCatch(async (req, res) => {
    const { userId, rating } = req.body
    console.log('i ran');
    const u = await User.findOne({ _id: userId })
    let ratings = {
        user: userId,
        rating: rating
    }
    u.rating.push(ratings)
    await u.save()
    res.status(200).json({ message: 'success' });
});

export const offerToNextBidder = tryCatch(async (req, res) => {
    const { sellerId, buyerId, discId, cancelId, buyPrice } = req.body
    const disc = await Disc.findById(discId);

    disc.buyer = {
        user: buyerId,
        buyPrice: buyPrice,
        createdAt: new Date(),
    }
    await disc.save();

    const existingTempDisc = await TempDisc.findOne({ buyer: buyerId, seller: sellerId, paymentSent: false }).lean();
    if (existingTempDisc) {
        await TempDisc.updateOne(
            { _id: existingTempDisc._id },
            { $push: { disc: { discId: disc._id } } }
        );
    }
    else {
        await TempDisc.create({
            buyer: buyerId,
            seller: sellerId,
            disc: [{ discId: disc._id }]
        });
    }
    await CancelDisc.findOneAndRemove({ _id: cancelId })
    let receiver = getUsers(sellerId);
    let receiver2 = getUsers(buyerId);
    if (receiver && receiver.socketId) {
        io.to(receiver.socketId).emit('refetchSelling');
    }
    if (receiver2 && receiver2.socketId) {
        io.to(receiver2.socketId).emit('refetchBuying');
    }
    res.status(200).json({ message: 'success' });
});


