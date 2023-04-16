const router = express.Router();
import express from 'express';
import { buyDisc, deleteDisc, editDisc, getActiveDiscs, getActiveDiscs2, getAllDiscsWithSellers, getDiscBids, getFinishedDiscs, getFinishedDiscs2, postBid, postDisc, reListDisc } from '../controllers/discController.js';

router.post('/', postDisc);
router.delete('/delete/:discId', deleteDisc);
router.post('/edit/:discId', editDisc);
router.post('/relist/:discId', reListDisc);
router.get('/', getAllDiscsWithSellers);
router.post('/bid', postBid);
router.post('/buy', buyDisc);
router.get('/getBids/:discId/bids', getDiscBids);
router.get('/getActiveDiscs/:userId', getActiveDiscs);
router.get('/getActiveDiscs2/:userId/:userCurrency', getActiveDiscs2);
router.get('/getFinishedDiscs/:userId', getFinishedDiscs);
router.get('/getFinishedDiscs2/:userId/:userCurrency', getFinishedDiscs2);

export default router;