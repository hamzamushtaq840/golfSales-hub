import { Disc } from '../models/disc.js';
import { tryCatch } from '../utils/tryCatch.js';
import AppError from '../utils/AppError.js';
import { groupBy } from 'lodash-es';
import { io } from '../index.js';
import { FinishedListing } from '../models/finishedListing.js';
import { TempDisc } from '../models/tempDisc.js';

export const postDisc = tryCatch(async (req, res) => {
    const { seller, pictureURL, quantity, discName, brand, range, condition, plastic, grams, named, dyed, blank, glow, collectible, firstRun, priceType, startingPrice, minPrice, endDay, endTime } = req.body;
    const disc = await Disc.create({ seller, pictureURL, quantity, discName, brand, range, condition, plastic, grams, named, dyed, blank, glow, collectible, firstRun, priceType, startingPrice, minPrice, endDay, endTime, });
    io.emit("bid_added");
    res.status(201).json({ message: 'Disc created successfully', disc });
});

export const postBid = tryCatch(async (req, res) => {
    const { listingId, userId, price, time, fromCurrency, toCurrency } = req.body;

    // Convert bid price to the requested currency

    const disc = await Disc.findById(listingId);
    if (!disc) {
        throw new AppError('invalid_id', 'Invalid Listing ID', 404);
    }
    const bid = {
        user: userId,
        bidPrice: Number(price),
        createdAt: time
    };
    disc.bids.push(bid);
    await disc.save();
    io.emit("bid_added");
    res.status(201).json({ message: 'Bid added successfully' });
});

export const getAllDiscsWithSellers = tryCatch(async (req, res) => {
    const requestedCurrency = req.query.userCurrency;
    const discs = await Disc.find({ isActive: true })
        .populate('seller')
        .populate('bids.user')
        .exec();

    if (discs.length === 0) {
        return res.status(200).json([]);
    }

    const discsGroupedBySeller = groupBy(discs, (disc) =>
        disc.seller._id.toString()
    );

    const result = await Promise.all(Object.keys(discsGroupedBySeller).map(async (userId) => {
        const seller = discsGroupedBySeller[userId][0].seller;
        const discs = discsGroupedBySeller[userId];

        // convert prices of each disc to requested currency
        const convertedDiscs = await Promise.all(discs.map(async (disc) => {
            const sellerCurrency = seller.currency;
            const startingPrice = Number(disc.startingPrice);
            if (disc.minPrice === '') {
                return {
                    ...disc.toObject(),
                    startingPrice: startingPrice

                };
            }
            const minPrice = Number(disc.minPrice);

            if (disc.bids.length > 0) {
                const highestBid = disc.bids.sort(
                    (a, b) => b.bidPrice - a.bidPrice
                )[0];

                return {
                    ...disc.toObject(),
                    startingPrice: startingPrice,
                    minPrice: minPrice,
                    highestBid: {
                        user: highestBid.user,
                        bidPrice: highestBid.bidPrice,
                        createdAt: highestBid.createdAt,
                        _id: highestBid._id,
                    },
                };
            }

            return {
                ...disc.toObject(),
                startingPrice: startingPrice,
                minPrice: minPrice,
            };
        }));
        console.log(convertedDiscs);
        return {
            seller,
            discs: convertedDiscs,
        };
    }));

    res.status(200).json(result);
});

export const getDiscBids = tryCatch(async (req, res) => {
    const { discId } = req.params;
    const { userCurrency } = req.query;

    const disc = await Disc.findById(discId).populate('seller').populate('bids.user').exec();

    if (!disc) {
        return res.status(404).json({ message: 'Disc not found' });
    }

    // convert prices of each bid to requested currency
    const convertedBids = await Promise.all(disc.bids.map(async (bid) => {
        const bidderCurrency = disc.seller.currency;
        const bidPrice = Number(bid.bidPrice)

        return {
            ...bid.toObject(),
            bidPrice: bidPrice,
        };
    }));

    res.status(200).json(convertedBids);
});

export const buyDisc = tryCatch(async (req, res) => {
    const { listingId, userId, time } = req.body;

    const disc = await Disc.findById(listingId);

    if (!disc) {
        return res.status(404).json({ error: "Disc not found" });
    }

    if (!disc.isActive) {
        return res.status(400).json({ error: "Disc has already been sold" });
    }

    const buyer = {
        user: userId,
        buyPrice: disc.startingPrice,
        createdAt: new Date(),
    };

    const sellerId = disc.seller

    disc.buyer = buyer;
    disc.isActive = false;

    const currentDate = new Date();

    // Get the year, month, and day from the current date
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    // Get the hours and minutes from the current time
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    disc.endDay = `${year}-${month}-${day}`;
    disc.endTime = `${hours}:${minutes}`;
    await disc.save();
    // check if disc.buyer and dics.seller are found in that collection then add it to there disc array 
    // only if the last added disc has paymentSent = false
    const existingTempDisc = await TempDisc.findOne({ buyer: userId, seller: sellerId, paymentSent: false }).lean();

    if (existingTempDisc) {
        await TempDisc.updateOne(
            { _id: existingTempDisc._id },
            { $push: { disc: { discId: listingId } } }
        );
    }
    else {
        await TempDisc.create({
            buyer: userId,
            seller: sellerId,
            disc: [{ discId: listingId }]
        });
    }

    io.emit("bid_added");
    res.status(200).json({ success: true, data: disc });
});

export const checkDiscTime = async () => {
    try {
        const discs = await Disc.find({});
        const currentDate = new Date();
        discs.forEach(async (disc) => {
            const discEndTime = new Date(`${disc.endDay} ${disc.endTime}`)
            if (discEndTime < currentDate) {
                if (disc.priceType === "auction" && disc.isActive) {
                    if (disc.bids.length > 0) {
                        if (disc.isActive === false) return;
                        const highestBid = disc.bids.sort(
                            (a, b) => b.bidPrice - a.bidPrice
                        )[0];

                        const buyer = {
                            user: highestBid.user,
                            buyPrice: highestBid.bidPrice,
                            createdAt: new Date(),
                        };
                        disc.buyer = buyer;
                        disc.isActive = false;
                        await disc.save();
                        const existingTempDisc = await TempDisc.findOne({ buyer: highestBid.user, seller: disc.seller, paymentSent: false }).lean();
                        if (existingTempDisc) {
                            await TempDisc.updateOne(
                                { _id: existingTempDisc._id },
                                { $push: { disc: { discId: disc._id } } }
                            );
                        }
                        else {
                            await TempDisc.create({
                                buyer: highestBid.user,
                                seller: disc.seller,
                                disc: [{ discId: disc._id }]
                            });
                        }
                        io.emit("bid_added");

                    } else {
                        const finishedDisc = new FinishedListing(disc.toJSON());
                        await finishedDisc.save();
                        await Disc.deleteOne({ _id: disc._id });
                        io.emit("bid_added");
                    }
                } else if (disc.priceType === "fixedPrice") {
                    if (disc.isActive) {
                        const finishedDisc = new FinishedListing(disc.toJSON());
                        await finishedDisc.save();
                        await Disc.deleteOne({ _id: disc._id });
                        io.emit("bid_added");
                    }
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}


export const getActiveDiscs = tryCatch(async (req, res) => {

    const { userId } = req.params;
    console.log(userId);

    // Retrieve all discs belonging to seller where isActive is true
    const discs = await Disc.find({ seller: userId, isActive: true });
    console.log(discs);
    res.send(discs);
})

export const getActiveDiscs2 = tryCatch(async (req, res) => {
    const { userId, userCurrency } = req.params;
    console.log(req.params);
    console.log('---------------');

    const discs = await Disc.find({ seller: userId, isActive: true })
        .populate('seller')
        .populate('bids.user')
        .exec();

    if (discs.length === 0) {
        return res.status(200).json([]);
    }

    const convertedDiscs = await Promise.all(discs.map(async (disc) => {
        const sellerCurrency = disc.seller.currency;
        const startingPrice = Number(disc.startingPrice);

        if (disc.minPrice === '') {

            return {
                ...disc.toObject(),
                startingPrice: startingPrice,
            };
        }

        const minPrice = Number(disc.minPrice);
        if (disc.bids.length > 0) {
            const highestBid = disc.bids.sort((a, b) => b.bidPrice - a.bidPrice)[0];
            return {
                ...disc.toObject(),
                startingPrice: startingPrice,
                minPrice: minPrice,
                highestBid: {
                    user: highestBid.user,
                    bidPrice: highestBid.bidPrice,
                    createdAt: highestBid.createdAt,
                    _id: highestBid._id,
                },
            };
        }

        return {
            ...disc.toObject(),
            startingPrice: startingPrice,
            minPrice: startingPrice,
        };
    }));
    console.log(convertedDiscs);

    res.status(200).json(convertedDiscs);
});
export const getFinishedDiscs = tryCatch(async (req, res) => {

    const { userId } = req.params;
    console.log(userId);

    // Retrieve all discs belonging to seller where isActive is true
    const discs = await FinishedListing.find({ seller: userId });
    console.log(discs);
    res.send(discs);
})

export const getFinishedDiscs2 = tryCatch(async (req, res) => {

    const { userId, userCurrency } = req.params;
    console.log(req.params);

    const discs = await FinishedListing.find({ seller: userId, isActive: true })
        .populate('seller')
        .populate('bids.user')
        .exec();

    if (discs.length === 0) {
        return res.status(200).json([]);
    }
    if (discs.length === 0) {
        return res.status(200).json([]);
    }

    const convertedDiscs = await Promise.all(discs.map(async (disc) => {
        const sellerCurrency = disc.seller.currency;
        const startingPrice = Number(disc.startingPrice);

        if (disc.minPrice === '') {
            return {
                ...disc.toObject(),
                startingPrice: startingPrice,
            };
        }

        const minPrice = Number(disc.minPrice);

        if (disc.bids.length > 0) {
            const highestBid = disc.bids.sort((a, b) => b.bidPrice - a.bidPrice)[0];

            return {
                ...disc.toObject(),
                startingPrice: startingPrice,
                minPrice: minPrice,
                highestBid: {
                    user: highestBid.user,
                    bidPrice: highestBid.bidPrice,
                    createdAt: highestBid.createdAt,
                    _id: highestBid._id,
                },
            };
        }

        return {
            ...disc.toObject(),
            startingPrice: startingPrice,
            minPrice: minPrice,
        };
    }));

    res.status(200).json(convertedDiscs);
})

export const deleteDisc = tryCatch(async (req, res) => {
    const { discId } = req.params;

    // Check if the disc exists
    const disc = await FinishedListing.findById(discId);
    if (!disc) {
        return res.status(404).send('Disc not found');
    }

    // Delete the disc
    await disc.remove();
    io.emit("bid_added");
    res.send('Disc deleted successfully');
});


export const editDisc = tryCatch(async (req, res) => {
    const { discId } = req.params;

    let disc = await Disc.findById(discId);
    if (!disc) {
        return res.status(404).send('Disc not found');
    }

    // Update the disc with the new data
    const { pictureURL, quantity, discName, brand, range, condition, plastic, grams, named, dyed, blank, glow, collectible, firstRun, priceType, startingPrice, minPrice, endDay, endTime } = req.body;
    disc.pictureURL = pictureURL;
    disc.quantity = quantity;
    disc.discName = discName;
    disc.brand = brand;
    disc.range = range;
    disc.condition = condition;
    disc.plastic = plastic;
    disc.grams = grams;
    disc.named = named;
    disc.dyed = dyed;
    disc.blank = blank;
    disc.glow = glow;
    disc.collectible = collectible;
    disc.firstRun = firstRun;
    disc.priceType = priceType;
    disc.startingPrice = startingPrice;
    disc.minPrice = minPrice;
    disc.endDay = endDay;
    disc.endTime = endTime;

    // Save the updated disc
    disc = await disc.save();
    io.emit("bid_added");
    res.send('Disc updated successfully');
});

export const reListDisc = tryCatch(async (req, res) => {
    const { discId } = req.params;

    // Delete the disc in FinishedListing
    await FinishedListing.findByIdAndDelete(discId);

    // Create a new disc in Disc
    const { seller, pictureURL, quantity, discName, brand, range, condition, plastic, grams, named, dyed, blank, glow, collectible, firstRun, priceType, startingPrice, minPrice, endDay, endTime } = req.body;
    console.log(req.body);
    await Disc.create({ seller, pictureURL, quantity, discName, brand, range, condition, plastic, grams, named, dyed, blank, glow, collectible, firstRun, priceType, startingPrice, minPrice, endDay, endTime });
    io.emit("bid_added");
    res.send('Disc relisted successfully');
});


export const buyingDiscs = tryCatch(async (req, res) => {

    const { userId } = req.params;
    const discs = await TempDisc.find({ buyer: userId }).populate('seller').populate('buyer').populate('disc.discId');

    res.status(200).json(discs);

})
export const sellingDiscs = tryCatch(async (req, res) => {

    const { userId } = req.params;

    const discs = await TempDisc.find({ seller: userId }).populate('seller').populate('buyer').populate('disc.discId');

    res.status(200).json(discs);

})

