import { Counter } from '../models/Counter.js';

export async function getNextSeq(name){
  const ret = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return ret.seq;
}
