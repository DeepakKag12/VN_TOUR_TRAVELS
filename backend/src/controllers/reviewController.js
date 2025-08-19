import { store } from '../models/store.js';
import { saveStoreDebounced } from '../services/persistence.js';
import { isDbConnected } from '../config/db.js';
import { Review } from '../models/Review.js';
import { ModelItem } from '../models/ModelItem.js';

export const listReviews = async (req,res) => {
  const { modelId } = req.query;
  if(isDbConnected()){
    const filter = {};
    if(modelId) filter.modelId = Number(modelId);
    const reviews = await Review.find(filter).sort({ createdAt:-1 });
    return res.json(reviews);
  }
  let r = store.reviews;
  if (modelId) r = r.filter(x=>x.modelId === Number(modelId));
  res.json(r);
};

export const createReview = async (req,res) => {
  const { modelId, rating, comment } = req.body;
  if (!modelId || !rating) return res.status(400).json({ error:'modelId & rating required'});
  if(isDbConnected()){
    const model = await ModelItem.findOne({ id: Number(modelId) });
    if(!model) return res.status(404).json({ error:'Model not found'});
    const review = await Review.create({ modelId:Number(modelId), userId:req.user.id, rating:Number(rating), comment:comment||'' });
    return res.json({ success:true, review });
  }
  const model = store.models.find(m=>m.id===Number(modelId));
  if(!model) return res.status(404).json({ error:'Model not found'});
  const review = { id: store.reviews.length+1, modelId:Number(modelId), userId:req.user.id, rating:Number(rating), comment:comment||'', createdAt:new Date().toISOString() };
  store.reviews.push(review);
  saveStoreDebounced();
  res.json({ success:true, review });
};
